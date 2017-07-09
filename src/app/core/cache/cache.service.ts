import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
  private static _cache: any = {};

  constructor() { }

  static set(id, fnc, data){
    if(!CacheService._cache[id]){
      CacheService._cache[id] = {};
      CacheService._cache[id][fnc] = {};
    }

    if(!CacheService._cache[id][fnc]){
      CacheService._cache[id][fnc] = {};
    }
    CacheService._cache[id][fnc] = data;
  }

  static get(id, fnc){
    return CacheService._cache[id][fnc];
  }
}
