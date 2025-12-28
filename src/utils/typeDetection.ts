// src/typeDetection.ts
/**
 * Type detection & normalization utilities for db2chart v2
 *
 * Responsibilities:
 * - detectFieldType(values): decide whether a field is numeric/categorical/boolean/null
 * - normalizeValue(value, type): convert raw value to normalized JS primitive (number/boolean/null/string)
 *
 * Notes:
 * - Numeric parsing tolerates commas and trailing '%' (percent -> decimal if `parsePercent` true)
 * - Null-like tokens: null, undefined, "", "na", "n/a", "null", "undefined"
 */

import type { DetectOptions } from "../types.js";

export type DetectedType = "numeric" | "categorical" | "nullish" | "boolean";

const DEFAULTS: Required<DetectOptions> = {
  sampleSize: 200, // - how many items to inspect
  numericThreshold: 0.6, // - fraction required to call numeric
  booleanThreshold: 0.6, // - fraction required to call boolean
  treatPercentAsDecimal: true, // - if numeric and value ends with '%' convert to decimal (0.5)
};

const NULL_LIKE = new Set(["", "nil", "none", "null", "undefined", "n/a"]);

const BOOLEAN_LIKE = new Set(["yes", "no", "true", "false"]);

function isNull(val: any): boolean {
  if (val === null || val === undefined) {
    return true;
  }

  if (typeof val === "string") {
    return NULL_LIKE.has(val.trim().toLowerCase());
  }

  return false;
}

function isBoolean(val: any): boolean {
  if (val === true || val === false) {
    return true;
  }

  if (typeof val === "string") {
    return BOOLEAN_LIKE.has(val.trim().toLowerCase());
  }

  return false;
}

/**
 * “parse a number” means to take some input—usually a string—and read it as a number instead of text.
 * Accepts "1,234.56", "-12.3 ", "45%", "45.0%", "1e3".
 * Returns { ok: boolean, value: number }.
 */
export function tryParseNumber(
  incomingValRaw: any,
  treatPercentAsDecimal = true,
): { ok: boolean; value: number | null } {
  // Reject null/undefined
  if (incomingValRaw === null || incomingValRaw === undefined) {
    return { ok: false, value: null };
  }

  // Reject boolean
  if (typeof incomingValRaw === "boolean") {
    return { ok: false, value: null };
  }

  // If already a number
  if (typeof incomingValRaw === "number") {
    if (!Number.isFinite(incomingValRaw)) {
      return { ok: false, value: null };
    }
    return { ok: true, value: incomingValRaw };
  }

  // Normalize to string safely
  const rawStr = String(incomingValRaw).trim();

  const isPercent = rawStr.endsWith("%");
  const baseStr = isPercent ? rawStr.slice(0, -1).trim() : rawStr;

  // Remove thousands separators
  const cleanedVal = baseStr.replace(/,/g, "");

  // Validate numeric structure using regex:
  // optional sign, digits with optional decimal, optional exponent
  const numericPattern = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;
  if (!numericPattern.test(cleanedVal)) {
    return { ok: false, value: null };
  }

  const numVal = Number(cleanedVal);
  if (!Number.isFinite(numVal)) {
    return { ok: false, value: null };
  }

  const finalValue = isPercent && treatPercentAsDecimal ? numVal / 100 : numVal;

  return { ok: true, value: finalValue };
}

export function normalizeBoolean(raw: any): boolean | null {
  if (raw === null || raw === undefined) {
    return null;
  }

  if (typeof raw === "boolean") {
    return raw;
  }

  const s = String(raw).trim().toLowerCase();
  if (["true", "yes"].includes(s)) return true;
  if (["false", "no"].includes(s)) return false;
  return null;
}

/**
 * Decide detected type for a list of values.
 * Strategy:
 *  - inspect up to sampleSize items
 *  - count numeric-like / boolean-like / null-like / other
 *  - thresholds decide outcome
 */
export function detectFieldType(
  incomingVals: any[],
  incomingOpts?: DetectOptions,
): DetectedType {
  const opts = { ...DEFAULTS, ...(incomingOpts || {}) };

  if (!Array.isArray(incomingVals) || incomingVals.length === 0) {
    return "nullish";
  }

  const sample = incomingVals.slice(0, opts.sampleSize);

  let numericCount = 0;
  let booleanCount = 0;
  let nullishCount = 0;
  let otherCount = 0;

  for (const raw of sample) {
    if (isNull(raw)) {
      nullishCount++;
      continue;
    }
    if (isBoolean(raw)) {
      booleanCount++;
      continue;
    }

    const num = tryParseNumber(raw, opts.treatPercentAsDecimal);
    if (num.ok) {
      numericCount++;
      continue;
    }

    // if we've reached here and boolean was true, keep it as boolean (don't double-count)
    if (isBoolean(raw)) {
      continue;
    }

    // otherwise categorical / other
    otherCount++;
  }

  const effectiveSamples = sample.length - nullishCount || 1; // avoid divide by zero

  // Prefer boolean if it dominates the non-null samples
  if (booleanCount / effectiveSamples >= opts.booleanThreshold)
    return "boolean";

  // Prefer numeric if it dominates non-null samples
  if (numericCount / effectiveSamples >= opts.numericThreshold)
    return "numeric";

  // If everything is nullish
  if (nullishCount === sample.length) return "nullish";

  // If there are few distinct values and small cardinality, could still be categorical.
  // We'll default to categorical if numeric/boolean didn't meet threshold
  return "categorical";
}

/**
 * Normalize an individual value given detected type.
 *
 * Returns:
 * - number for numeric
 * - boolean for boolean
 * - null for nullish or unparsable numeric/boolean
 * - string for categorical (trimmed)
 */
export function normalizeValue(
  incomingRawVal: any,
  valType: DetectedType,
  incomingOpts?: DetectOptions,
): number | boolean | string | null {
  const opts = { ...DEFAULTS, ...(incomingOpts || {}) };

  if (isNull(incomingRawVal)) {
    return null;
  }

  switch (valType) {
    case "numeric": {
      const parsed = tryParseNumber(incomingRawVal, opts.treatPercentAsDecimal);
      return parsed.ok ? parsed.value : null;
    }
    case "boolean": {
      const b = normalizeBoolean(incomingRawVal);
      return b === null ? null : b;
    }
    case "nullish":
      return null;
    case "categorical": {
      // return trimmed string (preserve original case)
      return typeof incomingRawVal === "string"
        ? incomingRawVal.trim()
        : String(incomingRawVal);
    }
    default:
      // unknown: try to coerce safely
      const p = tryParseNumber(incomingRawVal, opts.treatPercentAsDecimal);
      if (p.ok) return p.value;
      const bb = normalizeBoolean(incomingRawVal);
      if (bb !== null) return bb;
      return isNull(incomingRawVal) ? null : String(incomingRawVal);
  }
}
