import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthenticationService) {
  }

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authorizationHeader = this.authenticationService.authorizationHeader;

    if (!authorizationHeader) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: authorizationHeader
      }
    });

    return next.handle(cloned);
  }
}
