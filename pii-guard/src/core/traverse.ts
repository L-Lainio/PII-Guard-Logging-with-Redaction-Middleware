
export type Path = (string | number)[];

export function pathToString(path: Path): string {
  return path
    .map((p) => (typeof p === "number" ? `[${p}]` : p.includes(".") ? `["${p}"]` : `.${p}`))
    .join("")
    .replace(/^\./, "");
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
}
