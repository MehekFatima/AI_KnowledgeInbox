
import db from "../config/database.js";
import { generateEmbedding } from "./embedding.js";

const cosineSimilarity = (vectorA, vectorB) => {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Embedding dimensions do not match.");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)
  );
};

export const retrieveRelevantChunks = async (
  question,
  limit = 5
) => {
  if (!question || typeof question !== "string" || !question.trim()) {
    throw new Error("A valid question is required.");
  }

  const questionEmbedding = await generateEmbedding(question);

  const storedChunks = db.prepare(`
    SELECT
      c.id AS chunk_id,
      c.item_id,
      c.chunk_index,
      c.content,
      c.embedding,
      i.type AS source_type,
      i.title AS source_title,
      i.source_url
    FROM chunks c
    INNER JOIN items i ON c.item_id = i.id
    WHERE i.status = 'completed'
  `).all();

  if (storedChunks.length === 0) {
    return [];
  }

  const rankedChunks = storedChunks.map((chunk) => {
    const storedEmbedding = JSON.parse(chunk.embedding);

    const similarity = cosineSimilarity(
      questionEmbedding,
      storedEmbedding
    );

    return {
      chunkId: chunk.chunk_id,
      itemId: chunk.item_id,
      chunkIndex: chunk.chunk_index,
      content: chunk.content,
      similarity,
      source: {
        type: chunk.source_type,
        title: chunk.source_title,
        url: chunk.source_url
      }
    };
  });

  return rankedChunks
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
};
