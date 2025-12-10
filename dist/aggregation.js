export function aggregateValues(values, method) {
    if (method === "count")
        return values.length;
    if (method === "sum")
        return values.reduce((a, b) => a + b, 0);
    if (method === "avg")
        return values.reduce((a, b) => a + b, 0) / values.length || 0;
}
