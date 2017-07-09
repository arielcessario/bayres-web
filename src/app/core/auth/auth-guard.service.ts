import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {CoreService} from "../core.service";

@Injectable()
export class AuthGuard implements CanActivate {
    static to: string = '';

    constructor(private router: Router, private coreService: CoreService) {

    }

    canActivate() {
        // console.log(this.router);
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
        // this.router.navigate(['/login']);

        this.coreService.setLoginStatus({showLogin: true});
        return false;
    }
}

