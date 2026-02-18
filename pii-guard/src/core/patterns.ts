export type FindingType =
  | "EMAIL"
  | "PHONE"
  | "SSN"
  | "CREDIT_CARD"
  | "IPV4"
  | "API_KEY"
  | "TOKEN"
  | "CUSTOM";

export type RedactionMode = "placeholder" | "mask" | "remove" | "token-replace";

export type PatternRule = {
  type: FindingType;
  pattern: RegExp;
  placeholder: string; // e.g. "[EMAIL]"
};

export const defaultRules: PatternRule[] = [
  {
    type: "EMAIL",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    placeholder: "[EMAIL]"
  },
  {
    type: "PHONE",
    pattern: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    placeholder: "[PHONE]"
  },
  {
    type: "SSN",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
    placeholder: "[SSN]"
  },
  {
    type: "CREDIT_CARD",
    pattern: /\b(?:\d[ -]*?){13,19}\b/g,
    placeholder: "[CREDIT_CARD]"
  },
  {
    type: "IPV4",
    pattern: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g,
    placeholder: "[IPV4]"
  },
  // very simple “key=value” style detections — intended as starter rules
  {
    type: "API_KEY",
    pattern: /\b(?:api[_-]?key|x-api-key)\s*[:=]\s*([A-Za-z0-9_\-]{8,})\b/gi,
    placeholder: "[API_KEY]"
  },
  {
    type: "TOKEN",
    pattern: /\b(?:token|access[_-]?token|auth(?:orization)?)\s*[:=]\s*([A-Za-z0-9_\-\.]{8,})\b/gi,
    placeholder: "[TOKEN]"
  }
];