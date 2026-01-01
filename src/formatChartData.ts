import type { ChartFormatterOptions, ChartOutput } from "./types";
import { groupByInterval } from "./grouping";
import { aggregateValues } from "./aggregation";
import { detectFieldType, normalizeValue } from "./utils/typeDetection";
import { categoricalFrequency } from "./utils/categorical";

export function formatChartData(
    data: any[],
    options: ChartFormatterOptions
): ChartOutput {
    const grouped = groupByInterval(
        data,
        options.timeStampKey,
        options.groupBy ?? "day"
    );

    const timeLabels = Object.keys(grouped).sort();

    // detect once per key
    for (const key of options.valueKeys) {
        const detectedType = detectFieldType(data.map((r) => r[key]));

        // CATEGORICAL → whole chart is frequency-based
        if (detectedType === "categorical") {
            const allValues = data
                .map((r) => normalizeValue(r[key], detectedType))
                .filter((v): v is string => typeof v === "string");

            const freq = categoricalFrequency(allValues);

            return {
                labels: freq.labels,
                datasets: [
                    {
                        label: key,
                        data: freq.data,
                    },
                ],
            };
        }
    }

    // NUMERIC / BOOLEAN → time series
    const datasets = options.valueKeys.map((key) => {
        const detectedType = detectFieldType(data.map((r) => r[key]));

        const values = timeLabels.map((label) => {
            const nums = grouped[label]
                .map((r: any) => normalizeValue(r[key], detectedType))
                .filter((v): v is number => typeof v === "number");

            return aggregateValues(nums, options.aggregation ?? "sum");
        });

        return { label: key, data: values };
    });

    return { labels: timeLabels, datasets };
}
