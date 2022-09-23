import { Injectable } from '@angular/core';
import { Store, createSelector } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { IAppState } from '../../app.store';
import {
  IRange,
} from '../store';
import { IAnnotation } from '../../store/data';

export const ANNOTATION_REDUX= ['ui','explorer','annotation'];

@Injectable()
export class AnnotationSelectors {
  annotations_ = (state:IAppState)=>state.data.annotations
  annotationsUI_ = (state:IAppState)=>state.ui.explorer.annotation

  annotations$ = this.store.select(createSelector(this.annotations_, state=>state.entities));
  enabled$ = this.store.select(createSelector(this.annotationsUI_,state=>state.enabled));
  selectionRange$ =  this.store.select(createSelector(this.annotationsUI_,state=>state.selection_range));
  selectedAnnotationId$ = this.store.select(createSelector(this.annotationsUI_,state=>state.selected_annotation));
  
  public annotationType$: Observable<string>
  public annotatedRange$: Observable<IRange>
  selectedAnnotation$: Observable<IAnnotation>
    
  constructor(
    private store: Store
  ){
    //string for annotation dialog title
    this.annotationType$ = this.selectionRange$
      .pipe(map(range => {
        if(range == null)
          return "unknown";
        if(range.max==null)
          return "Event";
        return "Range";
      }));
    
    // currently selected annotation
    this.selectedAnnotation$ = combineLatest([this.annotations$, this.selectedAnnotationId$]).pipe(
      map(([annotations, id]) => {
        if(id==null)
          return null;
        if (annotations[id]===undefined)
          return null;
        return annotations[id]
      }))
  
    // currently selected annotation range (min=max for event annotations)
    this.annotatedRange$ = this.selectedAnnotation$.pipe(
      map(annotation => {
        if(annotation == null){
          return null;
        }
        let range = {
          min: annotation.start,
          max: annotation.end
        }
        if(annotation.end == null)
          range.max = range.min
        return range;
      }))
  }
}