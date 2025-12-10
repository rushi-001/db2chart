# db2chart

A lightweight utility that converts raw database records into **chart-ready data** with automatic **timestamp grouping**, **numeric aggregation**, and **multi-dataset formatting**.

Perfect for Chart.js, ECharts, ApexCharts, Recharts, or any visualization library.

---

# Features (v1)

### ✔ Time-series grouping

Group DB records by:

- `day`
- `week`
- `month`

### ✔ Aggregations

- `sum`
- `avg`
- `count`

### ✔ Multi-dataset output

Format any numeric field into a dataset array:

```ts
{ labels: [...], datasets: [...] }
```

### ✔ Automatic numeric handling

- Converts numeric strings like `"6.3"` → `6.3`
- Ignores invalid numbers safely
- Falls back to `count` for non-numeric fields

### ✔ Works with any database

You provide raw JSON rows — db2chart handles the rest.

---

# v2 (Planned Features)

### Automatic type detection

- numeric vs categorical
- boolean ("Yes"/"No") normalization
- null/undefined handling

### Advanced grouping

- `hour`
- `quarter`
- `year`

### Additional aggregations

- `min`
- `max`
- `median`
- `sumBy`
- `percentage`

### Category charts

Turn categorical strings into frequency charts:

```ts
WindDir = ["NW", "SW", "NW"] → { "NW": 2, "SW": 1 }
```

### Output adapters

Return formats matching:

- Chart.js
- ApexCharts
- ECharts

### Built-in schema validator

Detect invalid input early.

---

# Installation (Current V1.1.0)

```sh
npm install db2chart
```

---

# Usage Example (Basic)

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

console.log(result);
```

### Output

```json
{
  "lables": ["01-01-2024", "02-01-2024"],
  "datasets": [
    { "label": "sales", "data": [200, 150] },
    { "label": "profit", "data": [60, 50] }
  ]
}
```

---

# Example With Mixed Data (strings + numbers)

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

### Auto-converted output

```json
{
  "lables": ["09-09-2023"],
  "datasets": [
    { "label": "MinTemp", "data": [8] },
    { "label": "MaxTemp", "data": [24.3] },
    { "label": "Sunshine", "data": [6.3] }
  ]
}
```

---

# Contributing

Pull requests are welcome. For major changes, please open an issue to discuss.

---

# License

MIT © Rushi Panchal
