export function categoricalFrequency(values: string[]): {
    labels: string[];
    data: number[];
} {
    const map: Record<string, number> = {};

    for (const val of values) {
        map[val] = (map[val] || 0) + 1;
    }

    return {
        labels: Object.keys(map),
        data: Object.values(map),
    };
}
