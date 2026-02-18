import { describe, it, expect } from "vitest";
import { redactValue } from "../src/core/redact.js";

describe("redactValue", () => {
  it("deep-redacts nested structures", () => {
    const input = { user: { email: "a@b.com", profile: { ssn: "123-45-6789" } } };
    const r = redactValue(input);
    expect((r.redacted as any).user.email).toContain("[EMAIL]");
    expect((r.redacted as any).user.profile.ssn).toBeDefined();
    expect(r.findings.some((f) => f.path?.includes("user.email"))).toBe(true);
  });

  it("redacts known sensitive keys", () => {
    const input = { password: "supersecret", token: "abcd1234EFGH" };
    const r = redactValue(input, { mode: "remove" });
    expect((r.redacted as any).password).toBe("[REDACTED]");
    expect((r.redacted as any).token).toBe("[REDACTED]");
  });
});
