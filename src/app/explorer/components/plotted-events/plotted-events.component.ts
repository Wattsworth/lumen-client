
import { map } from 'rxjs/operators';
import {
  Component,
  Input,
  ViewChild,
  OnInit,
  OnChanges,
  ElementRef,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EventStreamService } from '../../../services';
import { IEventStream, IEventStreamPlotSettings } from '../../../store/data';
import { PlotService } from '../../services/plot.service';
import { PlotSelectors } from '../../selectors/plot.selectors';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { defaultEventStreamPlotSettings } from 'app/store/data/initial-state';

declare var $: any;

@Component({
  selector: 'app-plotted-events',
  templateUrl: './plotted-events.component.html',
  styleUrls: ['./plotted-events.component.css']
})
export class PlottedEventsComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() eventStream: IEventStream;

  @ViewChild('eventStreamModal', {static: false}) public eventStreamModal: ModalDirective;
  @ViewChild('colorPicker', {static: false}) colorPicker: ElementRef

  plotSettingsForm: FormGroup;

  public toolTipText$: Observable<string>;
  public displayName: string;

  //--state for customization modal--
  public newColor: string;
  public newAxis: string;
  public newName: string;
  public axisMessage: string;
  public axisOptions = [
    { value: 'left', label: 'left side' },
    { value: 'right', label: 'right side' }];
  //----------------------------------

  constructor(
    private plotService: PlotService,
    private eventService: EventStreamService,
    private plotSelectors: PlotSelectors,
    private fb: FormBuilder
  ) {
    this.newColor = "";
  }

  colorType(){
    return this.plotSettingsForm.get('color.type').value;
  }
  markerType(){
    return this.plotSettingsForm.get('marker.type').value;
  }
  labelType(){
    return this.plotSettingsForm.get('label.type').value;
  }
  positionType(){
    return this.plotSettingsForm.get('position.type').value;
  }
  heightType(){
    return this.plotSettingsForm.get('height.type').value;
  }
  ngOnInit() {
    let s = this.eventStream.plot_settings;
    this.plotSettingsForm = this.fb.group({
      display_name: [s.display_name],
      color: this.fb.group({
        type: [s.color.type],
        value: this.fb.group({
          fixed: [this.convertColor(s.color.value.fixed)],
          attribute: [s.color.value.attribute],
          numeric: this.fb.group({
            attribute: [s.color.value.numeric.attribute],
            min: [s.color.value.numeric.min],
            max: [s.color.value.numeric.max]
          })
        })
      }),
      marker: this.fb.group({
        type: [s.marker.type],
        size: [s.marker.size],
        value: this.fb.group({
          fixed: [s.marker.value.fixed],
          attribute: [s.marker.value.attribute]
        })
      }),
      label: this.fb.group({
        type: [s.label.type],
        size: [s.label.size],
        value: this.fb.group({
          fixed: [s.label.value.fixed],
          attribute: [s.label.value.attribute]
        })
      }),
      position: this.fb.group({
        type: [s.position.type],
        axis: [s.position.axis],
        value: this.fb.group({
          fixed: [s.position.value.fixed],
          attribute: [s.position.value.attribute]
        })
      }),
      height: this.fb.group({
        type: [s.height.type],
        value: this.fb.group({
          fixed: [s.height.value.fixed],
          attribute: [s.height.value.attribute]
        })
      })
    })
    //create tooltip text as [stream_name] @ [installation_name]
    //
    this.toolTipText$ = this.plotSelectors.nilms$.pipe(
      map((nilms) => {
        if (this.eventStream.nilm_id === undefined)
          return '<unknown>'
        if (nilms[this.eventStream.nilm_id] === undefined)
          return null;
        let myNilm = nilms[this.eventStream.nilm_id]
        return `${this.eventStream.path} @ ${myNilm.name}`
      }))

  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.eventStream.plot_settings.display_name != "") {
      this.displayName = this.eventStream.plot_settings.display_name;
    } else {
      this.displayName = this.eventStream.name;
    }
  }

  // X button on the element display
  hideEventStream() {
    this.plotService.hideEvents(this.eventStream);
  }

  // ---- code to handle element customization modal ----
  //
  ngAfterViewInit() {
    //configure jQuery minicolor
    $(this.colorPicker.nativeElement).minicolors({
      theme: 'bootstrap',
      letterCase: 'uppercase',
      opacity: true,
      format: "rgba",
      /*changeDelay: 100,
      change: (value, opacity) => { this.newColor = value }*/
    });
  }
  convertColor(color: string){
    //if the fixed color is in hex convert it to rgba
    if(color.length==0)
      return color; //nothing to do
    if(color[0]!="#")
      return color; //not in hex format
    let alpha = 1;
    if(color.length==9){ //transparency information included
      alpha = parseInt(color.slice(7,9),16)/255.0
    } 
    let r = parseInt(color.slice(1,3),16);
    let g = parseInt(color.slice(3,5),16);
    let b = parseInt(color.slice(5,7),16);
    let val =  `rgba(${r},${g},${b},${alpha})`
    return val;
    //convert hex transparency to decimal value
    /*if(this.eventStream.plot_settings.color_value==null)
      return 0;
    return parseInt(this.eventStream.plot_settings.color_value.slice(7,9),16)/255.0;*/
  }
  showModal() {
    //reset modal properties
    //TODO
    this.eventStreamModal.show();
  }
  // modify the element if the user clicks 'save'
  onSave() {
    //TODO
    //changes succesfully processed, close the modal
    let newSettings: IEventStreamPlotSettings = {...defaultEventStreamPlotSettings, ...this.plotSettingsForm.value}
    //update the color values from the color picker
    newSettings.color.value.fixed = $(this.colorPicker.nativeElement).minicolors('rgbaString');
    this.eventService.setPlotSettings(this.eventStream.id, newSettings);
    this.eventStreamModal.hide();
  }
}

export interface IElementInfo {
  stream_name: string,
  installation_name: string,
  path: string,
  installation_url: string
}
