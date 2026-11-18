
import { z } from "zod";

const ingestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("note"),
    content: z.string().trim().min(1).max(50000)
  }),

  z.object({
    type: z.literal("url"),
    url: z.string().trim().url().max(2048)
  })
]);

export const validateIngestion = (req, res, next) => {
  const result = ingestSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid ingestion request.",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  req.body = result.data;
  next();
};
