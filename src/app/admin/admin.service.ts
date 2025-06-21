import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AdminService {
  constructor(private http: HttpClient) {
  }

  public installPackages(packageNames: string[]) {
    // TODO: implement
  }

  public removePackages(packageNames: string[]) {
    // TODO: implement
  }
}
