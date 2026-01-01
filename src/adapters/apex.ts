import { themePalettes } from "./themes";
import type { ChartOutput, ChartStylePreset } from "../types";

export function toApexCharts(
    output: ChartOutput,
    {
        chart = {},
        title = {},
        style = "default",
        ...rest
    }: {
        chart?: Record<string, any>;
        title?: Record<string, any>;
        style?: ChartStylePreset;
        [k: string]: any;
    } = {}
) {
    const palette = themePalettes[style] || themePalettes.default;

    const base = {
        chart: {
            height: 350,
            ...chart,
        },
        title: { ...title },
        colors: palette,
        xaxis: { categories: output.labels },
        series: output.datasets.map((ds) => ({
            name: ds.label,
            data: ds.data,
        })),
        legend: { position: "top" },
        ...rest,
    };

    return base;
}
