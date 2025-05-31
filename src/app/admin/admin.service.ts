import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AdminService {
  private static readonly server = 'http://0.0.0.0:8083';

  constructor(private http: HttpClient) {
  }

  public installPackages(packageNames: string[]) {
    // TODO: implement
  }

  public removePackages(packageNames: string[]) {
    // TODO: implement
  }
}
