import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from '../src/app/app.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class isAdmin implements CanActivate {

  constructor(private appService: AppService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.appService.isAdmin().pipe(
      map(isAdmin => {
        if (isAdmin) {
          return true; 
        } else {
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }
}

export class isDoctor implements CanActivate {

    constructor(private appService: AppService, private router: Router) {}
  
    canActivate(): Observable<boolean> {
      return this.appService.isDoctor().pipe(
        map(isDoctor => {
          if (isDoctor) {
            return true;
          } else {
            this.router.navigateByUrl('/');
            return false;
          }
        })
      );
    }
  }

  export class isUser implements CanActivate {

    constructor(private appService: AppService, private router: Router) {}
  
    canActivate(): Observable<boolean> {
      return this.appService.isUser().pipe(
        map(isUser => {
          if (isUser) {
            return true;
          } else {
            this.router.navigateByUrl('/');
            return false;
          }
        })
      );
    }
  }
