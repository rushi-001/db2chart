import { themePalettes } from "./themes";
import type { ChartOutput, ChartStylePreset } from "../types";

export function toChartJS(
    output: ChartOutput,
    {
        type = "line",
        style = "default",
        options = {},
        ...rest
    }: {
        type?: string;
        style?: ChartStylePreset;
        options?: Record<string, any>;
        [k: string]: any;
    } = {}
) {
    const palette = themePalettes[style] || themePalettes.default;

    return {
        type,
        data: {
            labels: output.labels,
            datasets: output.datasets.map((ds, i) => ({
                label: ds.label,
                data: ds.data,
                backgroundColor: palette[i % palette.length],
                borderColor: palette[i % palette.length],
            })),
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" },
            },
            ...options,
        },
        ...rest,
    };
}
