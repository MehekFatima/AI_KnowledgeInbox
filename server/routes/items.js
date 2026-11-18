import { Router } from "express";

import { getItems } from "../controllers/items.js";

const router = Router();

router.get("/", getItems);

export default router;