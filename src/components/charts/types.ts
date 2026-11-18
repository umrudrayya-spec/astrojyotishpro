export interface ChartItem {
  key: string;
  label: string;
  title: string;
  degree: string;
  isLagna?: boolean;
  retro?: boolean;
  combust?: boolean;
}
export interface ChartProps {
  /** Items grouped by sign index 0–11. */
  bySign: ChartItem[][];
  lagnaSign: number;
  signLabels: string[];
  centerTitle?: string;
  centerSubtitle?: string;
  retroMark: string;
  combustMark: string;
  showDegrees?: boolean;
  onSelectSign?: (sign: number) => void;
  selectedSign?: number | null;
}
