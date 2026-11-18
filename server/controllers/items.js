import { findAllItems } from "../repositories/item.js";

export const getItems = async (req, res, next) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    if(!Number.isSafeInteger(page)|| !Number.isSafeInteger(limit)|| page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit values."
      });
    }

    const result = findAllItems({
      limit,
      offset: (page - 1) * limit
    });

    return res.status(200).json({
      success: true,
      data: {
        ...result,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
