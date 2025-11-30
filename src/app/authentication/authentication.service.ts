import {Injectable} from '@angular/core';
import {AdminService} from '../admin/admin.service';
import {BehaviorSubject, catchError, map, Observable, of} from 'rxjs';
import {UsernamePassword} from './username-password';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

const authenticationKey = 'authentication';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(!!localStorage.getItem(authenticationKey));
  public readonly isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor(private readonly adminService: AdminService,
              private readonly router: Router,
              private readonly http: HttpClient) {
  }

  public get authorizationHeader(): string | null {
    return localStorage.getItem(authenticationKey);
  }

  public testUsernamePassword(usernamePassword: UsernamePassword): Observable<boolean> {
    const authorization = 'Basic ' + btoa(`${usernamePassword.username}:${usernamePassword.password}`);

    return this.http.get<unknown>(environment.baseUrl + '/rest/management/stores', {
      headers: {
        Authorization: authorization,
      }
    }).pipe(
      map(() => {
        localStorage.setItem(authenticationKey, authorization);
        this._isAuthenticated$.next(true);
        this.router.navigate([ '/' ]);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  public logout() {
    localStorage.removeItem(authenticationKey);
    this._isAuthenticated$.next(false);
    this.router.navigate([ '/login' ]);
  }
}
