import { ingestContent } from "../services/ingestion.js";

export const ingestItem = async (req, res, next) => {
  try {
    const result = await ingestContent(req.body);

    return res.status(201).json({
      success: true,
      message: "Content ingested successfully.",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
