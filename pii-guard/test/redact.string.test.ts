import { describe, it, expect } from "vitest";
import { redactText } from "../src/core/redact.js";

describe("redactText", () => {
	it("redacts common PII in plain strings", () => {
		const input = "Email a@b.com SSN 123-45-6789";
		const r = redactText(input);

		expect(r.redacted).toContain("[EMAIL]");
		expect(r.redacted).toContain("[SSN]");
		expect(r.findings.length).toBeGreaterThanOrEqual(2);
	});
});
