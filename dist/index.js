import { aggregateValues } from "./aggregation.js";
import { groupByInterval } from "./grouping.js";
import { isNumberSafe } from "./utils/isNumberSafe";
export function formatChartData(data, options) {
    const { timeStampKey, // - createdAt, updatedAt, ...
    valueKeys, // - sales, profit, ...
    groupBy = "day", // - day or week or month
    aggregation = "sum", // - sum or avg or count
     } = options;
    const grouped = groupByInterval(data, timeStampKey, groupBy);
    // - Extract the keys from the grouped data.
    const lables = Object.keys(grouped).sort();
    const datasets = valueKeys.map((key) => {
        const values = lables.map((label) => {
            const rows = grouped[label] || [];
            return aggregateValues(rows.map((r) => isNumberSafe(r[key])), aggregation);
        });
        return { label: key, data: values };
    });
    return { lables, datasets };
}
