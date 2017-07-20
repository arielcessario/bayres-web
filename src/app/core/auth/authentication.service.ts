import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Rx";
import { CoreService } from "../core.service";
import { AuthService } from "angular2-social-login";
import { DbConnectService } from "../db-connect/db-connect.service";


@Injectable()
export class AuthenticationService {
    public token: string;
    sub: Observable<Object>;
    ret: any;

    constructor(private http: Http, public _auth: AuthService, public dbConnectService: DbConnectService, public coreService: CoreService) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;

    }

    signIn(provider) {
        this.sub = this._auth.login(provider)
            .map(data => {

                console.log(data);
                this.ret = this.dbConnectService.post('usuarios', 'loginSocial', {
                    user: data['email'],
                    token_social: data['token'],
                    provider: data['provider']
                }).map((response: Response) => {
                    let ret = {
                        existe: (response['user'].nombre != null),
                        nombre: data['name'],
                        email: data['email'],
                        provider: data['provider']
                    };
                    return ret;

                }).catch((err: Response, caught: Observable<any>) => {
                    return Observable.throw(err);
                });


                return this.ret;
                // this.ret.subscribe(response=> {
                //     console.log(response);
                //     if (response == undefined) {
                //         Observable.throw({error: 'Usuario no encontrado, por favor registrese'});
                //         this.logout();
                //         return false;
                //     }
                //     this.persistLogin(response);
                // });
            }).share();

        return this.sub;
    }

    loginFromSocial(data) {

    }

    login(username: string, password: string): Observable<boolean> {

        return this.ret = this.dbConnectService.post('usuarios', 'login', {
            mail: username,
            password: password,
            sucursal_id: -2
        }).map((response: Response) => {
            this.persistLogin(response);
        }).catch((err: Response, caught: Observable<any>) => {
            return Observable.throw(err);
        });

    }

    persistLogin(response) {
        // login successful if there's a jwt token in the response
        let token = response.token;
        let user = response.user;
        if (token) {
            // set token property
            this.token = token;

            // store username and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify({ user: user, token: token }));

            // return true to indicate successful login
            return true;
        } else {
            // return false to indicate failed login
            return false;
        }
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');

        if (localStorage.getItem('_login_provider')) {
            this._auth.logout().subscribe(
                (data) => {
                }
            )
        }


    }
}
