import type { AggregationMethod } from "./types";

export function aggregateValues(
    values: number[],
    method: AggregationMethod
): number {
    if (!values.length) return 0;

    switch (method) {
        case "count":
            return values.length;
        case "sum":
            return values.reduce((a, b) => a + b, 0);
        case "avg":
            return values.reduce((a, b) => a + b, 0) / values.length;
        case "min":
            return Math.min(...values);
        case "max":
            return Math.max(...values);
        case "median": {
            const s = [...values].sort((a, b) => a - b);
            const m = Math.floor(s.length / 2);
            return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
        }
        default:
            return 0;
    }
}
