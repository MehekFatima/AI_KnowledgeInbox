
import { pipeline } from "@huggingface/transformers";

const MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2";

let extractorPromise = null;

// Load the model only once
const getExtractor = async () => {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      MODEL_NAME
    );
  }

  return extractorPromise;
};

// Generate normalized embedding
export const generateEmbedding = async (text) => {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Text must be a non-empty string.");
  }

  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
};
