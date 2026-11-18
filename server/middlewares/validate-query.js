
import { z } from "zod";

const querySchema = z.object({
  question: z.string().trim().min(1).max(2000)
});

export const validateQuery = (req, res, next) => {
  const result = querySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid question.",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  req.body = result.data;
  next();
};
