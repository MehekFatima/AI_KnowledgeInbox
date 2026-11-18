const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;
const MIN_CHUNK_SIZE = 50;

export const splitIntoChunks = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Valid text is required for chunking.");
  }

  const normalizedText = text
    .replace(/\s+/g, " ")
    .trim();

  if (!normalizedText) {
    throw new Error("Cannot create chunks from empty content.");
  }

  const chunks = [];

  let start = 0;

  while (start < normalizedText.length) {
    let end = Math.min(
      start + CHUNK_SIZE,
      normalizedText.length
    );

    // Prefer splitting at a word boundary
    if (end < normalizedText.length) {
      const boundary = normalizedText.lastIndexOf(" ", end);

      if (boundary > start) {
        end = boundary;
      }
    }

    const content = normalizedText
      .slice(start, end)
      .trim();

    if (content.length >= MIN_CHUNK_SIZE ||
        (content.length > 0 && end === normalizedText.length)) {
      chunks.push({
        chunkIndex: chunks.length,
        content
      });
    }

    if (end >= normalizedText.length) {
      break;
    }

    start = end - CHUNK_OVERLAP;
  }

  return chunks;
};
