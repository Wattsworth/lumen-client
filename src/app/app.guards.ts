import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'

@Injectable()
export class AuthGuard  {
  constructor(private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot){
      if(localStorage.getItem('auth.uid')){
        return true; //logged in
      }
      //not logged in
      this.router.navigate(['session/sign_in'], 
        {queryParams: { returnUrl: state.url}});
      return false;
  }
}