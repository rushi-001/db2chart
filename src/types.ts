export type TimeInterval =
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year";

export type AggregationMethod =
    | "sum"
    | "avg"
    | "count"
    | "min"
    | "max"
    | "median";

export interface ChartFormatterOptions {
    timeStampKey: string;
    valueKeys: string[];
    groupBy?: TimeInterval;
    aggregation?: AggregationMethod;
}

export interface ChartOutput {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

export interface DetectOptions {
    sampleSize?: number;
    numericThreshold?: number;
    booleanThreshold?: number;
    treatPercentAsDecimal?: boolean;
}

export type ChartLib = "apex" | "chartjs" | "echarts";

export type ChartStylePreset = "default" | "modern" | "catppuccin";

export interface DbChartsOptions {
    chart?: {
        lib?: ChartLib;
        type?: string;
    };
    style?: ChartStylePreset;
    [key: string]: any;
}
