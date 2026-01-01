export type AggregationMethod =
    | "sum"
    | "avg"
    | "count"
    | "min"
    | "max"
    | "median";

export function aggregateValues(
    values: number[],
    method: AggregationMethod
): number {
    if (!values.length) {
        // count = 0, others = 0 (safe default)
        return 0;
    }

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
            const sorted = [...values].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);

            return sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];
        }

        default:
            return 0;
    }
}
