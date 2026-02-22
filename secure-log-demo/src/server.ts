import express from "express";
import { httpLogger } from "./middleware.js";
import { logger } from "./logger.js";

const app = express();
app.use(express.json());

// Content-Security-Policy (local dev only)
app.use((_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; connect-src 'self'; script-src 'self'; style-src 'self'"
  );
  next();
});

app.use(httpLogger);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/submit", (req, res) => {
  // Example payload could include PII — we do not log raw payload directly
  logger.info({ received: req.body }, "received submit payload (redacted by serializer)");
  res.json({ status: "accepted" });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => logger.info({ port }, "server started"));
``