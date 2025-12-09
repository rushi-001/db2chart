const dayjs = require("dayjs");

export function groupByInterval(
    data: any[],
    timeStampKey: string,
    interval: "day" | "week" | "month"
) {
    const groups: Record<string, any[]> = {};

    data.forEach((item) => {
        // - Extracting the timestamp.
        const ts = dayjs(item[timeStampKey]);

        // - Formating the key.
        const key =
            interval === "day"
                ? ts.format("DD-MM-YYYY")
                : interval === "week"
                ? `${ts.year()}-W${ts.week()}`
                : ts.format("YYYY-MM");

        // - Checks key exist if not then create with empty array.
        if (!groups[key]) groups[key] = [];

        // - Push the item in it's key array.
        groups[key].push(item);
    });

    return groups;

    // --- Example o/p ---
    // {
    //   "15-12-2025": [ ...items ],   // - if interval = day
    //   "2025-W51": [ ...items ],     // - if interval = week
    //   "2025-12": [ ...items ]       // - if interval = month
    // }
}
