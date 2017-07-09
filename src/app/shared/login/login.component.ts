import {Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit, ReflectiveInjector} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";


import {AuthenticationService} from "../../core/auth/authentication.service";
import {Http} from "@angular/http";
import {AuthService} from "angular2-social-login";
import {Observable} from "rxjs/Observable";
import {CoreService} from "../../core/core.service";
import {DbConnectService} from "../../core/db-connect/db-connect.service";


@Component({
    selector: 'login-component',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

/**
 * TODO:
 */
export class LoginComponent implements OnInit, AfterViewInit {
    formLogin: FormGroup;
    formCreateUsuario: FormGroup;
    private fb: FormBuilder;
    current: number = 1;


    // Login Form
    public mail: string;
    public nombre: string;
    public password: string;
    public social_login: number;


    @ViewChild('pwSignIn') el: ElementRef;

    constructor(private coreService: CoreService, private http: Http, public _auth: AuthService,
                private dbConnectService: DbConnectService, private authService: AuthenticationService) {
        this.coreService.getLoginStatus.subscribe(data => {
            // console.log(data);
        });
    }


    ngOnInit() {
        this.formCreateUsuario = this.buildFormCreate(this.formCreateUsuario);
        this.formLogin = this.buildFormLogin(this.formLogin);

        this.formCreateUsuario.controls['social_login'].setValue(0);
    }

    ngAfterViewInit() {

    }

    create() {
        this.dbConnectService.post('usuarios', 'create', {
            mail: this.formCreateUsuario.get('mail').value,
            nombre: this.formCreateUsuario.get('nombre').value,
            password: this.formCreateUsuario.get('password').value,
            social_login: this.formCreateUsuario.get('social_login').value,
        }).subscribe(response => {
            this.authService.login(this.formCreateUsuario.get('mail').value, this.formCreateUsuario.get('password').value)
                .subscribe(data => {
                        this.coreService.setLoginStatus({
                            showLogin: false
                        });
                });

        })
    }


    fnLogin() {
        if (!this.formLogin.valid) {
            return;
        }

        this.authService.login(this.formLogin.get('mail').value, this.formLogin.get('password').value)
            .subscribe(data => {
                this.coreService.setLoginStatus({showLogin: false});
            });
    }

    signIn(provider) {
        this.authService.signIn(provider).subscribe((data: Observable<Object>) => {
            data.subscribe(response => {
                if (!response['existe']) {
                    this.current = 0;
                    this.formCreateUsuario.controls['nombre'].setValue(response['nombre']);
                    this.formCreateUsuario.controls['mail'].setValue(response['email']);
                    this.formCreateUsuario.controls['social_login'].setValue(1);
                    // this.formCreateUsuario.controls['password'].setValidators(null);
                    // this.formCreateUsuario.controls['password'].updateValueAndValidity();
                    this.create();
                } else {
                    this.authService.login(response['email'], '')
                        .subscribe(data => {
                            this.coreService.setLoginStatus({
                                showLogin: false
                            });
                        });
                }
            });
        });
    }

    show() {

        this.el.nativeElement.type = this.el.nativeElement.type == 'text' ? 'password' : 'text';
    }

    close() {
        this.coreService.setLoginStatus({
            showLogin: false
        });
    }

    getDeseos() {

    }

    logout() {
        this.authService.logout();
    }


    buildFormCreate(form: FormGroup): FormGroup {

        this.fb = new FormBuilder();
        form = this.fb.group({
            'mail': [this.mail, [Validators.required, Validators.email]],
            'nombre': [this.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
            'password': [this.password, [Validators.required, Validators.minLength(3)]],
            'social_login': this.social_login
        });

        form.valueChanges
            .subscribe(data => this.dbConnectService.onValueChanged(data, form, this.formErrorsCreate, this.validationMessagesCreate));

        this.dbConnectService.onValueChanged(); // (re)set validation messages now);

        return form;
    }

    buildFormLogin(form: FormGroup): FormGroup {

        this.fb = new FormBuilder();
        form = this.fb.group({
            'mail': [this.mail, [Validators.required, Validators.email]],
            'password': [this.password, [Validators.required, Validators.minLength(1)]]
        });

        form.valueChanges
            .subscribe(data => this.dbConnectService.onValueChanged(data, form, this.formErrorsLogin, this.validationMessagesLogin));

        this.dbConnectService.onValueChanged(); // (re)set validation messages now);

        return form;
    }


    formErrorsCreate = {
        'mail': '',
        'nombre': '',
        'password': ''
    };
    validationMessagesCreate = {
        'nombre': {
            'required': 'Requerido',
            'minlength': 'Mínimo 3 letras',
            'maxlength': 'El nombre no puede tener mas de 24 letras'
        },
        'mail': {
            'required': 'Power is required.',
            'maxlength': 'Sismbolo tiene que tener un máximo de 3 letras'
        },
        'password': {
            'required': 'Debe ingresar un password',
            'minlength': 'El password debe tener al menos tres letras y/o números',
        }
    };
    public formErrorsLogin = {
        'mail': '',
        'password': '',
    };
    validationMessagesLogin = {
        'mail': {
            'required': 'Power is required.',
            'maxlength': 'Sismbolo tiene que tener un máximo de 3 letras'
        },
        'password': {
            'required': 'Debe ingresar un password',
            'minlength': 'El password debe tener al menos tres letras y/o números',
        }
    };


}
