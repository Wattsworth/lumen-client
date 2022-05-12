import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IEventStream, IEventStreamFilterGroup, IEventStreamFilterGroups } from '../../../store/data';
import { EventStreamService } from '../../../services';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { filter } from 'lodash';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-filter-plotted-events',
  templateUrl: './filter-plotted-events.component.html',
  styleUrls: ['./filter-plotted-events.component.css']
})
export class FilterPlottedEventsComponent implements OnInit {
  @Input() eventStream: IEventStream;
  @Output() changeEventFilter = new EventEmitter;
  filterGroupsForm: FormArray;

  private filter_template;

  constructor(
    private eventService: EventStreamService,
    private fb: FormBuilder
  ) { 
    this.filter_template = {
      key: 'pf',
      comparison: 'eq',
      value: '0.5'
    }
    //this.eventFilter = [];
  }

  ngOnInit(): void {
    this.filterGroupsForm = this.eventStream.filter_groups
      .reduce((groups, group)=>{
        groups.push(group.reduce((clauses, clause)=>{
          clauses.push(this.fb.group(clause))
          return clauses
        }, this.fb.array([])))
        return groups
      }, this.fb.array([]))
  }

  addClause(group_index: number){
    let filterGroup = <FormArray> this.filterGroupsForm.controls[group_index]
    filterGroup.push(this.fb.group(this.filter_template))
    this.update_state();

  }
  removeClause(group_index: number, filter_index){
    let filterGroup = <FormArray> this.filterGroupsForm.controls[group_index]
    filterGroup.removeAt(filter_index);
    if(filterGroup.length==0){
      this.filterGroupsForm.removeAt(group_index);
    }
    this.update_state();
  }
  addGroup(){
    this.filterGroupsForm.push(this.fb.array([]));
    this.addClause(this.filterGroupsForm.length-1);
  }
  removeGroup(group_index: number){
    this.filterGroupsForm.removeAt(group_index);
    this.update_state();
  }
  private update_state(){
    if(!_.isEqual(this.eventStream.filter_groups, this.filterGroupsForm.value)){
      this.changeEventFilter.emit(this.filterGroupsForm.value);
    }
  }

}
