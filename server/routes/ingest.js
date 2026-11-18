
import { Router } from "express";

import { ingestItem } from "../controllers/ingest.js";
import { validateIngestion } from "../middlewares/validate.js";

const router = Router();

router.post("/", validateIngestion, ingestItem);

export default router;
