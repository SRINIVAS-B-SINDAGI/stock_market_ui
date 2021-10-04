export interface ChartData {
  date: Array<string>;
  open: Array<Number>;
  close: Array<Number>;
  volume: Array<Number>;
}

export interface StandardDeviationData {
  date: string;
  open: string;
  close: string;
  volume: string;
}

export interface StandardDeviationResponse {
  filename: string;
  data: StandardDeviationData;
}
