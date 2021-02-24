import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { IDataView } from '../../../store/data/'
import { DataViewService } from '../../../services';

@Component({
  selector: 'app-data-view-form',
  templateUrl: './data-view-form.component.html',
  styleUrls: ['./data-view-form.component.css']
})
export class DataViewFormComponent implements OnInit, OnChanges {

  @Input() view: IDataView;
  @Output() save: EventEmitter<IDataView>;
  @Output() cancel: EventEmitter<any>;

  public myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataViewService: DataViewService
  ) {
    this.save = new EventEmitter();
    this.cancel = new EventEmitter();
  }

  ngOnInit() {
    this.buildForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
  }
  buildForm() {
    this.myForm = this.fb.group({
      name: [this.view.name, [Validators.required]],
      description: [this.view.description],
      private: [this.view.private],
      home: [this.view.home]
    });
  }
  reset(){
    this.myForm.reset();
  }
  onCancel() {
    this.cancel.emit();
  }
  onSave(formValues: any) {
    this.save.emit( Object.assign({}, this.view, {
      name: formValues.name,
      description: formValues.description,
      private: formValues.private,
      home: formValues.home
    }));
  }
}
