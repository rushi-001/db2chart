export interface ChartFormatterOptions {
  timeStampKey: string;
  valueKeys: string[];
  groupBy?: "day" | "week" | "month";
  aggregation?: "sum" | "avg" | "count";
}

export interface ChartOutput {
  lables: string[];
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
