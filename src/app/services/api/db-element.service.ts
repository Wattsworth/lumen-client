import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import{ ColorService } from './color.service';

import {
  IDbElement,
} from '../../store/data';
import * as actions from '../../store/data/actions';

@Injectable()
export class DbElementService {

  constructor(
    private store: Store,
    private colorService: ColorService
  ) { }

  public setDisplayName(element: IDbElement, name: string){
    this.store.dispatch(actions.setDbElementName({name, id: element.id}));
  }
  public setColor(element: IDbElement, color: string){
    if(element.color == color)
      return; //nothing to do
    if(element.color!=null){
      this.colorService.returnColor(element.color);
    }
    this.store.dispatch(actions.setDbElementColor({color, id: element.id})); 
  }
  
  public assignColor(element: IDbElement){
    if(element.color!=null)
      return; //already has a color so nothing to do
    this.store.dispatch(actions.setDbElementColor({
      color: this.colorService.requestColor(), id: element.id})); 
  }

  public removeColor(element: IDbElement){
    if(element.color==null)
      return; //no color associated with this element
    this.colorService.returnColor(element.color);
    this.store.dispatch(actions.setDbElementColor({color: null, id: element.id})); 
  }

  public restoreElements(elements: IDbElement[]){
    this.store.dispatch(actions.restoreDbElement({elements})); 
  }
  public resetElements(){
    this.store.dispatch(actions.resetDbElement()); 
  }
}

