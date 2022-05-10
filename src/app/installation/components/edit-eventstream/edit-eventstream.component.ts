import { Component, Input, OnInit } from '@angular/core';
import { IEventStream } from 'app/store/data';

@Component({
  selector: 'app-edit-eventstream',
  templateUrl: './edit-eventstream.component.html',
  styleUrls: ['./edit-eventstream.component.css']
})
export class EditEventstreamComponent implements OnInit {

  @Input() eventStream: IEventStream;
  
  constructor() { }

  ngOnInit(): void {
  }

}
