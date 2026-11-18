
import { Router } from "express";

import { queryKnowledgeBase } from "../controllers/query.js";
import { validateQuery } from "../middlewares/validate-query.js";

const router = Router();

router.post("/", validateQuery, queryKnowledgeBase);

export default router;
