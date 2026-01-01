import type { ChartOutput } from "../types";
import { toApexCharts } from "./apex";
import { toChartJS } from "./chartjs";
import { toECharts } from "./echarts";
import type { DbChartsOptions } from "../types";

/**
 * Universal adapter entry point.
 *
 * - If chart.lib === "apex": returns ApexCharts config
 * - If chart.lib === "chartjs": returns Chart.js config
 * - If chart.lib === "echarts": returns ECharts config
 * - Otherwise returns plain formatted data
 */
export function dbCharts(
    output: ChartOutput,
    options: DbChartsOptions = {}
): any {
    const lib = options.chart?.lib;

    if (!lib) {
        // No adapter specified: just return canonical chart data
        return output;
    }

    switch (lib) {
        case "apex":
            return toApexCharts(output, {
                ...options.chart,
                style: options.style,
                ...options,
            });

        case "chartjs":
            return toChartJS(output, {
                type: options.chart?.type,
                style: options.style,
                ...options,
            });

        case "echarts":
            return toECharts(output, {
                type: options.chart?.type,
                style: options.style,
                ...options,
            });

        default:
            // Unknown lib: fallback to base data
            return output;
    }
}
