export interface IRange {
  min: number;
  max: number;
  leftToRight?: boolean //optional direction specification
}
export interface IAxisSettings {
  scale: number;
  ticks: number;
  precision: number;
  axis_font_size: number;
  legend_font_size: number;
}