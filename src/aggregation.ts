export function aggregateValues(
  values: number[],
  method: "sum" | "avg" | "count",
) {
  if (method === "count") return values.length;
  if (method === "sum") return values.reduce((a, b) => a + b, 0);
  if (method === "avg")
    return values.reduce((a, b) => a + b, 0) / values.length || 0;
  return 0;
}
