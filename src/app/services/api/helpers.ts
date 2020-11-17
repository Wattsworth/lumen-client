
import {
  IStatusMessages,
} from '../../store/ui';
import { HttpErrorResponse } from '@angular/common/http';



export function parseDeviseErrors(resp: HttpErrorResponse): string[] {
  if (resp.status == 0) {
    return ['cannot contact server'];
  } 
  try{
    let errors = resp.error.errors;
    if(errors === undefined){
      throw new TypeError("no errors property")
    }
    //check if there are descriptive messages
    if(!(errors.full_messages === undefined)){
      errors = errors.full_messages;
    }
    return errors
  } catch(e) {
    return [`server error: ${resp.status}`]
  } 
}



