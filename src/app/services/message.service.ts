import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import * as actions from '../store/ui/actions';
import {IUI, IAPIMessages} from '../store/ui/types'
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class MessageService {

  constructor(
    private store: Store,
    private router: Router
  ) { }

  public setMessages(messages: IAPIMessages){
    if(messages.errors.length>0){this.setErrors(messages.errors);}
    if(messages.warnings.length>0){this.setWarnings(messages.warnings);}
    if(messages.notices.length>0){this.setNotices(messages.notices);}
  }
  public setError(error: string): void {
    this.setErrors([error]);
  }
  public setErrors(messages: string[]): void {
    this.store.dispatch(actions.setErrorMessages({messages}));
  }
  public setErrorsFromAPICall(error): void {
    let errors = this.parseAPIErrors(error)
    if(errors.length > 0)
      this.setErrors(errors)
  }
  public setWarning(warning: string): void {
    this.setWarnings([warning]);
  }
  public setWarnings(messages: string[]): void {
    this.store.dispatch(actions.setWarningMessages({messages}));

  }
  public setNotice(notice: string): void {
    this.setNotices([notice]);
  }
  public setNotices(messages: string[]): void {
    this.store.dispatch(actions.setNoticeMessages({messages}));

  }
  public clearMessages(): void {
    this.store.dispatch(actions.clearMessages());

  }

  private parseAPIErrors(response: HttpErrorResponse): string[] {
    if (response.status == 0) {
      return ['cannot contact server'];
    }
    if (response.status == 401) {
      //user is not authorized, sign them out and return to login page
      localStorage.clear();
      this.router.navigate(['/session/sign_in']);
      this.setNotice('Log in before continuing');
      return [];
    }
    try {
      let msgs = response.error["messages"];
      if (msgs === undefined) {
        throw new TypeError("no message property")
      }
      return msgs.errors
    } catch (e) {
      
      return [`server error: ${response.status}`]

    }
  }
}