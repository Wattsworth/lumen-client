import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as _ from 'lodash-es';

import { PlotSelectors } from '../../selectors/plot.selectors';
import { PlotService, AnnotationUIService } from '../../services';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { distinctUntilChanged, map, filter } from 'rxjs/operators';
import { AnnotationService } from 'app/services';
import { AnnotationSelectors, MeasurementSelectors } from 'app/explorer/selectors';
import { IDbStream, IAnnotation } from 'app/store/data';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-plot-tab',
  templateUrl: './plot-tab.component.html',
  styleUrls: ['./plot-tab.component.css'],
  animations: [
    // animation triggers go here
    trigger('slideUpDown', [
      state('in', style({ transform: 'translateY(0)' })),
      transition(':enter', [
        style({'opacity': 0}),
        animate(300, style({ 'opacity': 1.0}))
      ]),
      transition(':leave', [
        style({'overflow': 'hidden'}),
        animate(300, style({ 'height': 0}))
      ])
    ]),
  ]
})
export class PlotTabComponent implements OnInit, OnDestroy {

  
  private subs: Subscription[];
  public annotationMap$: Observable<IAnnotatedStream[]>
  public editForm: FormGroup;
  public selectedAnnotation: IAnnotation;
  public filterText: string;
  @ViewChild('annotationEditModal', {static: false}) public annotationModal: ModalDirective;

  constructor(
    public plotSelectors: PlotSelectors,
    public plotService: PlotService,
    public annotationService: AnnotationService,
    public annotationUIService: AnnotationUIService,
    public annotationSelectors: AnnotationSelectors,
    public measurementSelectors: MeasurementSelectors,
    private fb: FormBuilder
  ) {
    this.subs = [];
    this.filterText = "";
    this.selectedAnnotation = {'title': 'none', 'content': 'none', 
    'id': null, 'joule_id': null, 'start':0, 'end':0, 'db_stream_id': null};
   }

  ngOnInit() {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      db_stream_id: [null, Validators.required]
    })
    this.subs.push(this.plotSelectors.plottedStreams$.pipe(
      map(streams => streams.map(stream=>stream.id)),
      distinctUntilChanged((x,y)=>_.isEqual(x,y)))
      .subscribe( stream_ids => {
        stream_ids.map(id => {
          this.annotationService.loadAnnotations(id)
        })
      })
    )

    this.annotationMap$ = combineLatest([
        this.annotationSelectors.annotations$,
        this.plotSelectors.nilms$,
        this.plotSelectors.plottedStreams$]).pipe(
        map(([annotations, nilms, streams]) => {
          return streams.map(stream => {
            let editable = false;
            if (nilms[stream.nilm_id] !== undefined){
              if(nilms[stream.nilm_id].role=='admin' ||
                 nilms[stream.nilm_id].role=='owner')
                editable = true;
            }
            return{
              stream: stream,
              editable: editable,
              annotations: _.filter(annotations, 
                annotation => annotation.db_stream_id == stream.id)
            }
          })
        })
      )
  }
  ngOnDestroy() {
    while (this.subs.length > 0)
      this.subs.pop().unsubscribe()
  }
  public editAnnotation($event, annotation:IAnnotation){
    $event.stopPropagation();
    this.selectedAnnotation = {...annotation};
    this.annotationModal.show();
    //this.annotationService.deleteAnnotation(annotation)
  }
  public saveAnnotation(){
    this.annotationService.saveAnnotation(this.selectedAnnotation);
    this.annotationModal.hide();
  }
  public deleteAnnotation(){
    this.annotationService.deleteAnnotation(this.selectedAnnotation);
    this.annotationModal.hide();
  }
}

export interface IAnnotatedStream{
  stream: IDbStream,
  editable: boolean,
  annotations: IAnnotation[]
}

