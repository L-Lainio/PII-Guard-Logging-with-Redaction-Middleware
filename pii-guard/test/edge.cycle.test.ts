import { describe, it, expect } from "vitest";
import { redactValue } from "../src/core/redact.js";

describe("edge cases", () => {
  it("handles circular references safely", () => {
    const a: any = { email: "a@b.com" };
    a.self = a;
    const r = redactValue(a);
    expect(r.redacted).toBeTruthy();
    expect((r.redacted as any).self).toBe("[Circular]");
  });
});