
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

import ingestRoutes from "./routes/ingest.js";
import { errorHandler } from "./middlewares/error.js";
import itemsRoutes from "./routes/items.js";
import queryRoutes from "./routes/query.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json({ limit: "100kb" }));

app.use(pinoHttp());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Knowledge Inbox API is running."
  });
});

app.use("/api/ingest", ingestRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/query", queryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

app.use(errorHandler);

export default app;
