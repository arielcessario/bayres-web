import { Injectable } from '@angular/core';

@Injectable()
export class DbHelperService {

  constructor() { }

  format(url: string, obj: string, fnc: string = 'get', params: any = {}): string {
    return url + '?obj=' + obj + '&fnc=' + fnc + '&prm=' + JSON.stringify(params);
  }

}
