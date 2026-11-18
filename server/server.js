
import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import db from "./config/database.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    db.close();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
