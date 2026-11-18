
import { answerQuestion } from "../services/rag.js";

export const queryKnowledgeBase = async (req, res, next) => {
  try {
    const { question } = req.body;

    const result = await answerQuestion(question);

    return res.status(200).json({
      success: true,
      data: {
        question,
        answer: result.answer,
        sources: result.sources,
        sourceCount: result.sources.length
      }
    });
  } catch (error) {
    next(error);
  }
};
