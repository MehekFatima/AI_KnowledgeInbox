
import { retrieveRelevantChunks } from "./retrieval.js";
import { generateAnswer } from "./llm.js";

const TOP_K = 5;

export const answerQuestion = async (question) => {
  if (!question || typeof question !== "string" || !question.trim()) {
    throw new Error("A valid question is required.");
  }

  // Step 1: Retrieve relevant chunks
  const retrievedChunks = await retrieveRelevantChunks(
    question.trim(),
    TOP_K
  );

  // Step 2: Handle empty knowledge base
  if (retrievedChunks.length === 0) {
    return {
      answer: "I couldn't find any relevant information in your knowledge base. Please save some notes or URLs first.",
      sources: []
    };
  }

  // Step 3: Assign source identifiers
  const sources = retrievedChunks.map((chunk, index) => ({
    sourceId: `S${index + 1}`,
    itemId: chunk.itemId,
    chunkId: chunk.chunkId,
    title: chunk.source.title,
    type: chunk.source.type,
    url: chunk.source.url,
    snippet: chunk.content,
    similarity: Number(chunk.similarity.toFixed(4))
  }));

  // Step 4: Construct context
  const context = sources.map((source) => `
[SOURCE ${source.sourceId}]
Title: ${source.title || "Untitled"}
Type: ${source.type}
Content: ${source.snippet}
  `).join("\n");

  // Step 5: Generate grounded answer
  const answer = await generateAnswer(
    question.trim(),
    context
  );

  // Step 6: Return answer and source metadata
  return {
    answer,
    sources
  };
};
