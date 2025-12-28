import type { ChartFormatterOptions, ChartOutput } from "./types";
import { aggregateValues } from "./aggregation.js";
import { groupByInterval } from "./grouping.js";
import { detectFieldType, normalizeValue } from "./utils/typeDetection";

export function formatChartData(data: [], options: ChartFormatterOptions) {
  const {
    timeStampKey, // - createdAt, updatedAt, ...
    valueKeys, // - sales, profit, ...
    groupBy = "day", // - day or week or month
    aggregation = "sum", // - sum or avg or count
  } = options;

  const grouped = groupByInterval(data, timeStampKey, groupBy);

  // - Extract the keys from the grouped data.
  const labels = Object.keys(grouped).sort();

  const datasets = valueKeys.map((key) => {
    // - Detect type ONCE per key (important)
    const rawValues = data.map((r: any) => r[key]);
    const detectedType = detectFieldType(rawValues);

    const values = labels.map((label) => {
      const rows = grouped[label] || [];

      const normalized = rows
        .map((r: any) => normalizeValue(r[key], detectedType))
        .filter((v): v is number => typeof v === "number");

      return aggregateValues(normalized, aggregation);
    });

    return { label: key, data: values };
  });

  return { labels, datasets };
}
