import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import type { TimeInterval } from "./types";

dayjs.extend(weekOfYear);

export function groupByInterval(
    data: any[],
    timeStampKey: string,
    interval: TimeInterval
) {
    const groups: Record<string, any[]> = {};

    data.forEach((item) => {
        const ts = dayjs(item[timeStampKey]);
        if (!ts.isValid()) return;

        let key: string;

        switch (interval) {
            case "hour":
                // bucket per hour
                key = ts.format("YYYY-MM-DD HH:00");
                break;

            case "day":
                key = ts.format("DD-MM-YYYY");
                break;

            case "week":
                key = `${ts.year()}-W${ts.week()}`;
                break;

            case "month":
                key = ts.format("YYYY-MM");
                break;

            case "quarter": {
                const quarter = Math.floor(ts.month() / 3) + 1;
                key = `${ts.year()}-Q${quarter}`;
                break;
            }

            case "year":
                key = ts.format("YYYY");
                break;

            default:
                key = ts.format("DD-MM-YYYY");
        }

        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });

    return groups;
}
