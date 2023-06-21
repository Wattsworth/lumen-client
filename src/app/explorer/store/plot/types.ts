import { IDataSet, IEventsSet } from '../../../store/data';
import { IRange, IAxisSettings } from '../helpers';

export interface IState {
  left_elements?: number[];
  right_elements?: number[];
  event_streams?: string[];
  left_units?: string;
  right_units?: string;
  show_plot?: boolean;
  show_date_selector?: boolean;
  nav_y1?: IRange;
  nav_y2?: IRange;
  nav_time?: IRange;
  nav_data?: IDataSet;
  nav_event_data?: IEventsSet;
  adding_nav_data?: boolean,
  nav_zoom_lock?: boolean;
  plot_y1?: IRange;
  plot_y2?: IRange;
  plot_time?: IRange;
  plot_data?: IDataSet;
  plot_event_data?: IEventsSet;
  adding_plot_data?: boolean;
  data_cursor?: boolean;
  live_update?: boolean;
  live_update_interval?: number,
  data_view_filter_text?: string;
  show_public_data_views?: boolean;
  show_data_envelope?: boolean;
  show_annotations?: boolean;
  left_axis_settings?: IAxisSettings;
  show_left_axis_settings?: boolean;
  right_axis_settings?: IAxisSettings;
  show_right_axis_settings?: boolean;
  time_axis_settings?: IAxisSettings;
  show_time_axis_settings?: boolean;
  visualizer_tabs?: IVisualizerTab[];
  expanded_nodes?: string[];
  //flags to indicate whether data has been retrieved
  nilms_loaded?: boolean;
  data_views_loaded?: boolean;
  
}

export interface IVisualizerTab {
  id: number,
  url: string
}

