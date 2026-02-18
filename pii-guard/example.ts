import { redactText } from "pii-guard";

const r = redactText("Email a@b.com SSN 123-45-6789");
console.log(r.redacted);
