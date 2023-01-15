/*
Title: auth.guard.ts
Author: Professor Krasso
Date: 01/03/2023
Modified By: April Yang
Description: Use cookie service to guard user login
*/


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})


  // use guard to authorize the valid employee id to log in
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    //store session_user cookie if available
    const sessionUser = this.cookieService.get('session_user');

    // if the employee ID is authorized return true
    if (sessionUser) {
      return true;
    } else {
       // navigate user to login page if the employee ID is not authorized
      this.router.navigate(['/session/login']);
      return false;
    }
  }

}



