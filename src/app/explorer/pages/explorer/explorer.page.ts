
import {combineLatest, distinctUntilChanged} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {
  trigger, animate, style, transition
} from '@angular/animations';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as _ from 'lodash';
import {environment } from '../../../../environments/environment'

import { 
  PlotSelectors,
  MeasurementSelectors,
  InterfacesSelectors, 
  AnnotationSelectors
} from '../../selectors';

import { 
  PlotService,
  MeasurementService,
  InterfacesService,
  AnnotationUIService,
} from '../../services';
import { 
  DataViewService, 
  DbStreamService, 
  SessionService,
  AnnotationService
} from '../../../services';
import {
  IDataView, IAnnotation,
} from '../../../store/data';

import { MainPlotComponent } from '../../components/main-plot/main-plot.component';

@Component({
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])]),
    trigger('fadeOut', [
      transition(':leave', [   // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 }))
      ])])
  ],
  selector: 'app-explorer-page',
  templateUrl: './explorer.page.html',
  styleUrls: ['./explorer.page.css']
})
export class ExplorerPageComponent implements OnInit, AfterViewInit, OnDestroy {

  public plotZValue$: Observable<number>;
  public imageData: string;
  @ViewChild('imageModal', {static: false}) public imageModal: ModalDirective;
  @ViewChild('saveDataViewModal', {static: false}) public saveDataViewModal: ModalDirective;
  @ViewChild('loadDataViewModal', {static: false}) public loadDataViewModal: ModalDirective;
  @ViewChild('measurementModal', {static: false}) public measurementModal: ModalDirective;
  @ViewChild('annotationModal', {static: false}) public annotationModal: ModalDirective;

  @ViewChild('plot', {static: false}) public plot: MainPlotComponent;
  @ViewChild('interfaceTabs', {static: false}) interfaceTabs: TabsetComponent;
  public helpUrl: string;
  public newDataView: IDataView;
  private subs: Subscription[];

  constructor(
    public plotSelectors: PlotSelectors,
    public measurementSelectors: MeasurementSelectors,
    public annotationSelectors: AnnotationSelectors,
    public plotService: PlotService,
    public measurementService: MeasurementService,
    public annotationService: AnnotationService,
    public annotationUIService: AnnotationUIService,
    public dataViewService: DataViewService,
    public dbStreamService: DbStreamService,
    public interfacesSelectors: InterfacesSelectors,
    public interfacesService: InterfacesService,
    public sessionService: SessionService
  ) {
    this.helpUrl = environment.helpUrl;
    
    this.plotZValue$ = this.plotSelectors.showDateSelector$
      .pipe(map(show => {
        if (show)
          return -1;
        else
          return 0;
      }));
    this.subs = [];
    this.sessionService.validateToken();
  }

  showSaveDataView() {
    this.plot.getCanvas().then(canvas => {
      this.imageData = canvas.toDataURL("image/png");
      this.saveDataViewModal.show();
    });
  }

  createDataView(view: IDataView) {
    this.dataViewService.create(
      view.name,
      view.description,
      view.private,
      view.home,
      view.image);
    this.saveDataViewModal.hide();
  }

  createAnnotation(annotation: IAnnotation){
    this.annotationService.createAnnotation(annotation)
    this.annotationModal.hide();
  }
  showSavePlotImage() {
    this.plot.getCanvas().then(canvas => {
      this.imageData = canvas.toDataURL("image/png");
      this.imageModal.show();
    });
  }
  showLoadDataView() {
    this.dataViewService
      .loadDataViews()
      .subscribe(
      () => { },
      () => { },
      () => this.plotService.setDataViewsLoaded())

    this.loadDataViewModal.show();
  }
  ngAfterViewInit(){
    /* show the measurement results modal when the measurement range changes */
    this.subs.push(this.measurementSelectors.measurementRange$.pipe(
      distinctUntilChanged(),
      filter(range => range!=null))
      .subscribe(_ => {
        this.measurementModal.show();
      }))
    
    /* show the annotation modal when the annotation range changes */
    this.subs.push(this.annotationSelectors.selectionRange$.pipe(
      distinctUntilChanged(),
      filter(range => range!=null))
      .subscribe(_ => {
        this.annotationModal.show();
      }))

    
    /* sync the tab selection to the redux state */
    this.subs.push(this.interfacesSelectors.displayedIds$.pipe(
      combineLatest(this.interfacesSelectors.selectedId$),
      map(([ids,id])=> ids.indexOf(id)+1))
      .subscribe(tabIndex => {
        setTimeout( _ => {this.interfaceTabs.tabs[tabIndex].active=true;}, 100); 
      }));
  }
  ngOnInit() {
    this.dataViewService.restoreHomeDataView();

  }

  ngOnDestroy(){
    while (this.subs.length > 0)
      this.subs.pop().unsubscribe()
  }



}
