import pinoHttp from "pino-http";
import type { Request } from "express";
import { redactValue, redactText } from "pii-guard";
import { logger } from "./logger.js";

// Redact request/response objects before they ever get logged
export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req(req: Request) {
      const base = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: (req as any).body
      };
      return redactValue(base, { mode: "placeholder" }).redacted;
    }
  },
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage(req, res) {
    const msg = `request completed ${req.method} ${req.url} ${res.statusCode}`;
    return redactText(msg).redacted;
  }
});