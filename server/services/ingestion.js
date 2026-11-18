
import { randomUUID } from "node:crypto";

import db from "../config/database.js";

import { splitIntoChunks } from "./chunking.js";
import { generateEmbedding } from "./embedding.js";
import { extractUrlContent } from "./extraction.js";

export const ingestContent = async ({ type, content, url }) => {
  if (!["note", "url"].includes(type)) {
    throw new Error("Source type must be note or url.");
  }

  let rawContent;
  let title = null;
  let sourceUrl = null;

  // Step 1: Obtain original content
  if (type === "note") {
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("Note content is required.");
    }

    rawContent = content.trim();
    title = rawContent.slice(0, 80);
  } else {
    if (typeof url !== "string" || !url.trim()) {
      throw new Error("A valid URL is required.");
    }

    const extracted = await extractUrlContent(url.trim());

    rawContent = extracted.content;
    title = extracted.title;
    sourceUrl = extracted.sourceUrl;
  }

  // Step 2: Split content into chunks
  const chunks = splitIntoChunks(rawContent);

  if (chunks.length === 0) {
    throw new Error("No usable content was found.");
  }

  // Step 3: Generate embeddings
  const preparedChunks = await Promise.all(
    chunks.map(async (chunk) => ({
      id: randomUUID(),
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
      embedding: await generateEmbedding(chunk.content)
    }))
  );

  // Step 4: Prepare item
  const itemId = randomUUID();

  // Step 5: Save item and chunks atomically
  const saveIngestion = db.transaction(() => {
    db.prepare(`
      INSERT INTO items (
        id,
        type,
        title,
        source_url,
        raw_content,
        status
      )
      VALUES (?, ?, ?, ?, ?, 'completed')
    `).run(
      itemId,
      type,
      title,
      sourceUrl,
      rawContent
    );

    const insertChunk = db.prepare(`
      INSERT INTO chunks (
        id,
        item_id,
        chunk_index,
        content,
        embedding
      )
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const chunk of preparedChunks) {
      insertChunk.run(
        chunk.id,
        itemId,
        chunk.chunkIndex,
        chunk.content,
        JSON.stringify(chunk.embedding)
      );
    }
  });

  saveIngestion();

  // Step 6: Return saved item metadata
  return {
    id: itemId,
    type,
    title,
    sourceUrl,
    status: "completed",
    chunkCount: preparedChunks.length,
    createdAt: db.prepare(`
      SELECT created_at
      FROM items
      WHERE id = ?
    `).get(itemId).created_at
  };
};
