import { themePalettes } from "./themes";
import type { ChartOutput, ChartStylePreset } from "../types";

export function toECharts(
    output: ChartOutput,
    {
        type = "line",
        style = "default",
        ...rest
    }: {
        type?: string;
        style?: ChartStylePreset;
        [k: string]: any;
    } = {}
) {
    const palette = themePalettes[style] || themePalettes.default;

    return {
        color: palette,
        tooltip: {},
        legend: {
            data: output.datasets.map((d) => d.label),
        },
        xAxis: {
            type: "category",
            data: output.labels,
        },
        yAxis: {
            type: "value",
        },
        series: output.datasets.map((ds) => ({
            name: ds.label,
            type: type,
            data: ds.data,
        })),
        ...rest,
    };
}
