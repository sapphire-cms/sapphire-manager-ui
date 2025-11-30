import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PublicInfo} from '@sapphire-cms/core';
import {environment} from '../../environments/environment';

@Injectable()
export class AdminService {
  constructor(private readonly http: HttpClient) {
  }

  public publicInfo(): Observable<PublicInfo> {
    return this.http.get<PublicInfo>(environment.baseUrl + `/rest/admin/info`);
  }

  public installPackages(_packageNames: string[]) {
    // TODO: implement
  }

  public removePackages(_packageNames: string[]) {
    // TODO: implement
  }
}
