import {CanActivate, Router, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {map, Observable, take} from 'rxjs';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly router: Router) {
  }

  public canActivate(): Observable<true | UrlTree> {
    return this.authenticationService.isAuthenticated$.pipe(
      take(1),
      map(isAuth => {
        return isAuth ? true : this.router.createUrlTree(['/login'])
      })
    );
  }
}
