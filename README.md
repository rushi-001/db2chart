# db2chart

A lightweight TypeScript utility that converts raw database records into **chart-ready data** with **automatic type detection**, **time grouping**, **aggregation**, and **adapter-based output** for popular charting libraries.

Works out of the box with **Chart.js**, **ApexCharts**, **ECharts**, or plain data.

---

## What db2chart Does

-   Accepts raw DB rows (any shape)
-   Detects field types automatically (numeric, categorical, boolean, null)
-   Groups data by time intervals
-   Aggregates numeric values
-   Converts categorical fields into frequency charts
-   Outputs a **canonical chart format**
-   Optionally adapts output for specific chart libraries

---

## Features (v2)

### ✔ Automatic Type Detection (Schema Inference)

db2chart automatically detects field types using sampling:

-   **numeric** → `number`, `"6.3"`, `"1,200"`, `"45%"`
-   **boolean** → `true/false`, `"Yes"/"No"`
-   **categorical** → strings like `"NW"`, `"Admin"`
-   **nullish** → `null`, `undefined`, `"n/a"`

No schema required.

---

### ✔ Time-Series Grouping

Group records by timestamp:

```ts
"hour" | "day" | "week" | "month" | "quarter" | "year";
```

---

### ✔ Aggregations

Supported aggregation methods:

```ts
"sum" | "avg" | "count" | "min" | "max" | "median";
```

---

### ✔ Categorical Frequency Charts

Categorical fields are automatically converted into frequency datasets:

```ts
["NW", "SW", "NW"] → { labels: ["NW", "SW"], data: [2, 1] }
```

---

### ✔ Canonical Output Format

All charts normalize to:

```ts
{
  labels: string[],
  datasets: {
    label: string
    data: number[]
  }[]
}
```

This format works with any charting library.

---

### ✔ Chart Library Adapters (Optional)

Convert canonical output into library-specific configs:

-   **Chart.js**
-   **ApexCharts**
-   **ECharts**

```ts
dbCharts(output, { chart: { lib: "apex" } });
```

---

### ✔ Theme Presets

Built-in color palettes:

```ts
"default" | "modern" | "catppuccin";
```

---

## Installation

```sh
npm install db2chart
```

---

## Basic Usage (Time-Series)

```ts
import { formatChartData } from "db2chart";

const data = [
    { createdAt: "2024-01-01", sales: 120, profit: 40 },
    { createdAt: "2024-01-01", sales: 80, profit: 20 },
    { createdAt: "2024-01-02", sales: 150, profit: 50 },
];

const result = formatChartData(data, {
    timeStampKey: "createdAt",
    valueKeys: ["sales", "profit"],
    groupBy: "day",
    aggregation: "sum",
});
```

### Output

```json
{
    "labels": ["2024-01-01", "2024-01-02"],
    "datasets": [
        { "label": "sales", "data": [200, 150] },
        { "label": "profit", "data": [60, 50] }
    ]
}
```

---

## Mixed Data Example (Auto Detection)

```ts
const weather = [
    {
        createdAt: "2023-09-09",
        MinTemp: 8,
        MaxTemp: 24.3,
        Sunshine: "6.3",
        WindGustDir: "NW",
        RainToday: "No",
    },
];

const result = formatChartData(weather, {
    timeStampKey: "createdAt",
    valueKeys: ["MinTemp", "MaxTemp", "Sunshine"],
    groupBy: "day",
    aggregation: "avg",
});
```

### Output

```json
{
    "labels": ["2023-09-09"],
    "datasets": [
        { "label": "MinTemp", "data": [8] },
        { "label": "MaxTemp", "data": [24.3] },
        { "label": "Sunshine", "data": [6.3] }
    ]
}
```

---

## Categorical Chart Example

```ts
const data = [
    { createdAt: "2024-01-01", direction: "NW" },
    { createdAt: "2024-01-01", direction: "SW" },
    { createdAt: "2024-01-02", direction: "NW" },
];

const result = formatChartData(data, {
    timeStampKey: "createdAt",
    valueKeys: ["direction"],
});
```

### Output

```json
{
    "labels": ["NW", "SW"],
    "datasets": [{ "label": "direction", "data": [2, 1] }]
}
```

---

## Adapter Example (ApexCharts)

```ts
import { dbCharts } from "db2chart";

const apexConfig = dbCharts(result, {
    chart: { lib: "apex" },
    style: "modern",
});
```

---

## API Exports

```ts
formatChartData();
dbCharts();

// Types
ChartOutput;
ChartFormatterOptions;
AggregationMethod;
TimeInterval;
ChartStylePreset;
```

---

## Design Philosophy

-   **Soft schema inference** (not rigid validation)
-   **Safe normalization** (no silent corruption)
-   **Library-agnostic core**
-   **Adapters at the edge**

---

## Contributing

PRs are welcome.
For breaking changes or ideas, open an issue first.

---

## License

MIT © Rushi Panchal
