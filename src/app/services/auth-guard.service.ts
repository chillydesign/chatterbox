import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // route required for state.url to work properly
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.authService.isLoggedIn()) {
      return true;
    } else {

      // console.log(route.url);
      // if user cant access page, redirect them to login page
      // and add a ?return param to redirect them when they succesfully login
      this.router.navigate(['/login'], {
        queryParams: {
          return: state.url
        }
      });



      return false;
    }
  }

}
