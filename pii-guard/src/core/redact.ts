import { defaultRules, type FindingType, type PatternRule, type RedactionMode } from "./patterns.js";
import { stableToken } from "./tokenize.js";
import { isPlainObject, pathToString, type Path } from "./traverse.js";

export interface Finding {
  type: FindingType;
  path?: string;
  match: string;
  replacement: string;
}

export interface CustomRule {
  type?: "CUSTOM";
  name: string;
  pattern: RegExp;
  placeholder?: string;
}

export interface RedactOptions {
  mode?: RedactionMode;
  enabled?: Partial<Record<FindingType, boolean>>;
  customRules?: CustomRule[];
  keysToAlwaysRedact?: string[]; // exact key matches (case-insensitive)
  tokenSalt?: string; // for token-replace mode
  maxDepth?: number;
}

export interface RedactResult<T> {
  redacted: T;
  findings: Finding[];
}

const DEFAULT_KEYS = ["password", "passwd", "secret", "ssn", "token", "apiKey", "api_key", "authorization"];

function maskValue(raw: string): string {
  if (raw.length <= 4) return "*".repeat(raw.length);
  return raw.slice(0, 1) + "*".repeat(raw.length - 2) + raw.slice(-1);
}

function replacementFor(match: string, placeholder: string, mode: RedactionMode, tokenSalt?: string): string {
  switch (mode) {
    case "remove":
      return "[REDACTED]";
    case "mask":
      return maskValue(match);
    case "token-replace":
      return `${placeholder}_${stableToken(match, tokenSalt)}`;
    case "placeholder":
    default:
      return placeholder;
  }
}

function buildRules(options?: RedactOptions): PatternRule[] {
  const custom: PatternRule[] =
    options?.customRules?.map((r) => ({
      type: "CUSTOM",
      pattern: r.pattern,
      placeholder: r.placeholder ?? `[${r.name.toUpperCase()}]`
    })) ?? [];

  return [...defaultRules, ...custom];
}

function isEnabled(type: FindingType, options?: RedactOptions): boolean {
  const map = options?.enabled;
  return map?.[type] ?? true;
}

export function redactText(text: string, options?: RedactOptions): RedactResult<string> {
  const mode = options?.mode ?? "placeholder";
  const rules = buildRules(options);
  const findings: Finding[] = [];

  let out = text;

  for (const rule of rules) {
    if (!isEnabled(rule.type, options)) continue;

    out = out.replace(rule.pattern, (m: string, group1?: string) => {
      // if a rule uses capturing group for value, prefer that; else whole match
      const matchedValue = typeof group1 === "string" ? group1 : m;
      const repl = replacementFor(matchedValue, rule.placeholder, mode, options?.tokenSalt);

      findings.push({ type: rule.type, match: matchedValue, replacement: repl });
      // Replace the full match (m) with the computed replacement
      return typeof group1 === "string" ? m.replace(group1, repl) : repl;
    });
  }

  return { redacted: out, findings };
}

export function redactValue<T>(value: T, options?: RedactOptions): RedactResult<T> {
  const findings: Finding[] = [];
  const maxDepth = options?.maxDepth ?? 12;
  const keys = new Set([...(options?.keysToAlwaysRedact ?? []), ...DEFAULT_KEYS].map((k) => k.toLowerCase()));
  const mode = options?.mode ?? "placeholder";

  const seen = new WeakSet<object>();

  const walk = (v: unknown, path: Path, depth: number): unknown => {
    if (depth > maxDepth) return v;

    if (typeof v === "string") {
      const r = redactText(v, options);
      findings.push(
        ...r.findings.map((f) => ({
          ...f,
          path: pathToString(path)
        }))
      );
      return r.redacted;
    }

    if (!v || typeof v !== "object") return v;

    if (seen.has(v as object)) return "[Circular]";
    seen.add(v as object);

    if (Array.isArray(v)) {
      return v.map((item, i) => walk(item, [...path, i], depth + 1));
    }

    if (isPlainObject(v)) {
      const out: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(v)) {
        const p = [...path, k];

        if (keys.has(k.toLowerCase())) {
          const repl = replacementFor(String(val), "[REDACTED_KEY]", mode, options?.tokenSalt);
          findings.push({ type: "TOKEN", path: pathToString(p), match: String(val), replacement: repl });
          out[k] = repl;
        } else {
          out[k] = walk(val, p, depth + 1);
        }
      }
      return out;
    }

    // for non-plain objects (Date, Map, etc.) keep as-is
    return v;
  };

  const redacted = walk(value, [], 0) as T;
  return { redacted, findings };
}