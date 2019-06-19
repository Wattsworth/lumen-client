
import {
  IState,
  IStateRecord,
} from './types';

import { makeTypedFactory } from 'typed-immutable-record';


// ---- Plot ----
export const PlotFactory =
  makeTypedFactory<IState, IStateRecord>({
    left_elements: [],
    right_elements: [],
    left_units: 'none',
    right_units: 'none',
    show_plot: false,
    show_date_selector: false,
    nav_y1: {min: null, max: null},
    nav_y2: {min: null, max: null},
    nav_time: {min: null, max: null},
    nav_data: {},
    adding_nav_data: false,
    nav_zoom_lock: false,
    plot_y1: {min: null, max: null},
    plot_y2: {min: null, max: null},
    plot_time: {min: null, max: null},
    plot_data: {},
    adding_plot_data: false,
    data_cursor: false,
    live_update: false,
    show_public_data_views: true,
    data_view_filter_text: '',
    show_data_envelope: true,
    left_axis_settings: {legend_font_size: 12, axis_font_size: 12, precision: null, ticks: null, scale: 0},
    right_axis_settings: {legend_font_size: 12, axis_font_size: 12, precision: null, ticks: null, scale: 0},
    time_axis_settings: {legend_font_size: 12, axis_font_size: 12, precision: null, ticks: null, scale: 0},
    visualizer_tabs: [],
    show_left_axis_settings: false,
    show_right_axis_settings: false,
    show_time_axis_settings: false,
    //
    nilms_loaded: false,
    data_views_loaded: false,
  });


export const INITIAL_STATE = PlotFactory();
