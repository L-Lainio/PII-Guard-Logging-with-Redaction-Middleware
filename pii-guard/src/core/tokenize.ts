import { createHash } from "node:crypto";

export function stableToken(value: string, salt = "pii-guard"): string {
  // deterministic token replacement so the same input maps to the same token
  const h = createHash("sha256").update(salt).update("\0").update(value).digest("hex");
  return h.slice(0, 10); // short token for logs
}