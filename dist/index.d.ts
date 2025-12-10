import { ChartFormatterOptions } from "./types";
export declare function formatChartData(data: [], options: ChartFormatterOptions): {
    lables: string[];
    datasets: {
        label: string;
        data: (number | undefined)[];
    }[];
};
