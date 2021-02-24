import { IRange } from '../helpers';
export interface IAnnotationState {
  enabled: boolean;
  selection_range?: IRange;
  selected_annotation?: string;
  annotated_streams: number[];
}
