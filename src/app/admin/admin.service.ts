import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AdminService {
  constructor(private readonly _http: HttpClient) {
  }

  public installPackages(_packageNames: string[]) {
    // TODO: implement
  }

  public removePackages(_packageNames: string[]) {
    // TODO: implement
  }
}
