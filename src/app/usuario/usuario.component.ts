import {
    Component,
    OnInit,
    ElementRef,
    ViewChild, Input, AfterViewInit
}      from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CoreService} from "../core/core.service";
import {DbConnectService} from "../core/db-connect/db-connect.service";
import {ProvinciaService} from "../core/provincia/provincia.service";
import {Router} from "@angular/router";

@Component({
    selector: 'usuario-component',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss']
})

/**
 * TODO:
 */
export class UsuarioComponent implements OnInit {
    formUsuario: FormGroup;
    user: any = {};


    public usuario_id: number;
    public mail: string;
    public nombre: string;
    public apellido: string;
    public password: string;
    public calle: string;
    public nro: number;
    public provincia_id: number;
    public telefono: string;
    public fecha_nacimiento: string;
    public news_letter: string;
    public social_login: number;
    public provincias = [];

    formErrors = {
        'mail': '',
        'nombre': '',
        'password': '',
        'calle': '',
        'nro': ''
    };
    validationMessages = {
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
        },
        'calle': {
            'required': 'Debe ingresar un password',
            'minlength': 'El password debe tener al menos tres letras y/o números',
        },
        'nro': {
            'required': 'Debe ingresar un password',
            'minlength': 'El password debe tener al menos tres letras y/o números',
        }
    };

    constructor(private coreService: CoreService, private fb: FormBuilder, private db: DbConnectService, private router: Router) {

    }


    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('currentUser')).user;

        this.provincias = ProvinciaService.get();

        this.buildForm();
    }

    goTo(link): void {
        this.router.navigate([link]);
        setTimeout(()=> {
            this.coreService.refreshAll();
        }, 0);
    }

    buildForm() {
        this.formUsuario = this.fb.group({
            'usuario_id': [this.usuario_id],
            'mail': [this.mail, [Validators.required, Validators.email]],
            'nombre': [this.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
            'apellido': [this.apellido],
            'password': [this.password, [Validators.required, Validators.minLength(3)]],
            'calle': [this.calle],
            'nro': [this.nro],
            'provincia_id': this.provincia_id,
            'telefono': this.telefono,
            'fecha_nacimiento': this.fecha_nacimiento,
            'news_letter': this.news_letter,
            'social_login': this.social_login
        });

        this.formUsuario.valueChanges
            .subscribe(data => this.coreService.onValueChanged(data, this.formUsuario, this.formErrors, this.validationMessages));

        this.coreService.onValueChanged(); // (re)set validation messages now);


        this.formUsuario.setValue({
            'usuario_id': this.user.usuario_id,
            'mail': this.user.mail,
            'nombre': this.user.nombre,
            'apellido': this.user.apellido,
            'password': this.user.password,
            'calle': this.user.calle,
            'nro': this.user.nro,
            'provincia_id': this.user.provincia_id,
            'telefono': this.user.telefono,
            'fecha_nacimiento': this.user.fecha_nacimiento,
            'news_letter': this.user.news_letter,
            'social_login': this.user.social_login,
        });
    }

    confirmar() {
        let usr = {
            'usuario_id': this.formUsuario.controls['usuario_id'].value,
            'mail': this.formUsuario.controls['mail'].value,
            'nombre': this.formUsuario.controls['nombre'].value,
            'apellido': this.formUsuario.controls['apellido'].value,
            'password': this.formUsuario.controls['password'].value,
            'calle': this.formUsuario.controls['calle'].value,
            'nro': this.formUsuario.controls['nro'].value,
            'provincia_id': this.formUsuario.controls['provincia_id'].value
        };

        this.db.post('usuarios', 'update', {user: usr}).subscribe((data)=>{
            console.log(data);
        });
    }


}
