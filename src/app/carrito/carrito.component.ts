import {Component, OnInit} from '@angular/core';
// import {CarritoService} from "../shared/carrito/carrito.service";
// import {Sucursal} from "../sucursales/sucursal.model";
import {ProvinciaService} from "../core/provincia/provincia.service"
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoreService} from "../core/core.service";
import {DbConnectService} from "../core/db-connect/db-connect.service";
import {Router} from "@angular/router";

@Component({
    selector: 'carrito-component',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.scss']
})

/**
 * TODO:
 */
export class CarritoComponent implements OnInit {

    visible: number = 1;
    id: number;

    total: number;
    items: Array<any>;
    data: any = {
        precios: [{0: 0}]
    };
    sucursales: Array<any> = [];
    sucursal: number = 1;
    tipoEnvios: Array<any> = [
        {'id': 1, 'name': 'Envio a'},
        {'id': 2, 'name': 'Retira por'}
    ];
    tipoEnvio: number = 1;

    lugaresEnvio: Array<any> = [
        {'id': 1, 'name': 'Gran Buenos Aires'},
        {'id': 2, 'name': 'Capital Federal'},
        {'id': 3, 'name': 'Interior del Pais'}
    ];

    lugarEnvio: number = 1;
    provincias: Array<any> = [];

    formEnvio: FormGroup;
    user: any = {};

    // Form Validations
    formErrors = {
        'calle': '',
        'nro': '',
        'provincia': ''
    };
    validationMessages = {
        'calle': {
            'required': 'Por favor ingrese una calle'
        },
        'nro': {
            'required': 'Por favor ingrese un Número de calle'
        },
        'provincia': {
            'required': 'Por favor seleccione una provincia'
        }
    };

    calle: string;
    nro: string;


    constructor(private coreService: CoreService, private router: Router, private dbConnectService: DbConnectService, private fb: FormBuilder) {
    }

    confirmar() {

        if (!this.user.nombre) {
            this.coreService.setLoginStatus({showLogin: true});
            return;
        }

        // if(this.items.length == 0){
        //     return;
        // }

        if (this.tipoEnvio == 1 && this.formEnvio.invalid) {
            return;
        }

        let productos = {};
        for (var i in this.items) {
            productos[this.items[i].producto_id] = this.items[i].cantidad;
        }

        if((this.user.calle == '' || this.user.calle == undefined || this.user.calle == null)){
            let params = {
                calle: this.formEnvio.controls['calle'].value,
                nro: this.formEnvio.controls['nro'].value,
                provincia_id: this.lugarEnvio
            };

            this.dbConnectService.post('usuarios', 'updateAddress', params).subscribe((data)=>{
                this.user.calle = params.calle;
                this.user.nro = params.nro;
                this.user.provincia_id = params.provincia_id;

                let tmp = JSON.parse(localStorage.getItem('currentUser'));
                tmp.user = this.user;
                localStorage.setItem('currentUser', JSON.stringify(tmp));


            });
        }

        this.dbConnectService.post('productos', 'createCarrito',
            {
                productos: productos,
                origen: this.tipoEnvio,
                destino: (this.tipoEnvio == 1) ? this.lugarEnvio : this.sucursal
            })
            .subscribe(response=> {

                this.coreService.setToast({
                    type: 'success',
                    title: 'Pedido Realizado',
                    body: 'Un representante se pondrá en contacto a la brevedad.'
                });


                this.dbConnectService.post('mails', 'sendCarritoComprador', {
                    productos: productos,
                    envio: ((this.tipoEnvio == 1) ? 'Envio a ' : 'Retira por ') + ((this.tipoEnvio == 1) ? this.provincias[this.lugarEnvio - 1]['name'] + ' - ' + this.user.calle + ' ' + this.user.nro : this.sucursales[this.sucursal - 1]['nombre'] + ' - ' + this.sucursales[this.sucursal - 1]['direccion']),
                    carrito_id: response.carrito_id
                })
                    .subscribe(()=> {

                        this.coreService.clearCarrito();
                        setTimeout(()=> {
                            this.items = [];
                        }, 0);

                    });


            });
    }

    ngOnInit() {
        this.dbConnectService.get('sucursales', 'get', {all: false}).subscribe((data)=> {
            this.sucursales = data;
        });

        this.coreService.getProductos.subscribe(productos => {
            this.items = this.coreService.filterProducts('en_carrito', 'true', 'true');
        });

        this.coreService.getCartStatus.subscribe((data)=> {
            this.total = data.total;
        });

        this.coreService.getLoginStatus.subscribe((data)=>{
            this.user = (localStorage.getItem('currentUser')) ? (JSON.parse(localStorage.getItem('currentUser'))).user : {};
            if(this.user != {}){
                this.buildForm();
            }

        });

        this.provincias = ProvinciaService.get();


        this.user = (localStorage.getItem('currentUser')) ? (JSON.parse(localStorage.getItem('currentUser'))).user : {};

        this.buildForm();
    }

    update(item) {
        delete item.en_carrito;
        this.coreService.updateCarrito(item);
    }

    goTo(link): void {
        this.router.navigate([link]);
        setTimeout(()=> {
            this.coreService.refreshAll();
        }, 0);
    }

    desear(item) {
        if (item['deseado']) {
            delete item['deseado'];
        } else {
            item['deseado'] = true;
        }

        let ret = this.dbConnectService.post('productos', 'desear', {producto_id: item.producto_id});

        ret.subscribe(data=> {
            console.log(data);
        });

        this.coreService.showToast.subscribe(data=> {
            if (data.type == 'error' || data.message.indexOf('Por favor ingrese con su usuario y contraseña')) {
                this.coreService.setLoginStatus({showLogin: true});
                delete item['deseado'];
            }
        });
        // this.coreService.setDesear(item['producto_id']);
    }


    buildForm() {
        this.formEnvio = this.fb.group({
            'calle': [this.calle, [Validators.required]],
            'nro': [this.nro, [Validators.required]]
        });

        this.formEnvio.valueChanges
            .subscribe(data => this.coreService.onValueChanged(data, this.formEnvio, this.formErrors, this.validationMessages));

        this.coreService.onValueChanged(); // (re)set validation messages now);


        this.formEnvio.setValue({
            'calle': (this.user.calle) ? this.user.calle : '',
            'nro': (this.user.nro) ? this.user.nro : ''
        });
    }


}
