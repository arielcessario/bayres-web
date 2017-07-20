import {Component, OnInit} from '@angular/core';
// import {PedidoService} from "../shared/pedido/pedido.service";
// import {Sucursal} from "../sucursales/sucursal.model";
import {ProvinciaService} from "../core/provincia/provincia.service"
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoreService} from "../core/core.service";
import {DbConnectService} from "../core/db-connect/db-connect.service";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    selector: 'pedido-component',
    templateUrl: './pedido.component.html',
    styleUrls: ['./pedido.component.scss']
})

/**
 * TODO:
 */
export class PedidoComponent implements OnInit {

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


    constructor(private coreService: CoreService, private router: Router, private route: ActivatedRoute, private dbConnectService: DbConnectService, private fb: FormBuilder) {
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

        this.dbConnectService.post('productos', 'createPedido',
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


                this.dbConnectService.post('mails', 'sendPedidoComprador', {
                    productos: productos,
                    envio: ((this.tipoEnvio == 1) ? 'Envio a ' : 'Retira por ') + ((this.tipoEnvio == 1) ? this.provincias[this.lugarEnvio - 1]['name'] + ' - ' + this.user.calle + ' ' + this.user.nro : this.sucursales[this.sucursal - 1]['nombre'] + ' - ' + this.sucursales[this.sucursal - 1]['direccion']),
                    pedido_id: response.pedido_id
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


        this.route.params.subscribe(params => {
            this.id = +params['id'];

            this.coreService.getProductos.subscribe((data)=> {
                this.data = this.coreService.filterCarritos('carrito_id', params['id'], 'true')[0];
                console.log(this.data);
                this.items = [];
                let len = this.data.productos.length;

                while(len--){
                    let prod = this.coreService.filterProducts('producto_id', ''+this.data.productos[len].producto_id, 'true')[0];
                    prod.cantidad = this.data.productos[len].cantidad;
                    prod.precio_unitario = this.data.productos[len].precio_unitario;
                    this.items.push(prod);
                }

            });

            //     this.coreService.getProductos.subscribe((data)=> {
            //
            //         this.data = this.coreService.filterProducts('producto_id', params['id'], 'true')[0];
            //         if (!this.data.en_carrito && !this.data.cantidad) {
            //             this.data.cantidad = 1;
            //         }
            //
            //     });
        });


        // this.dbConnectService.get('sucursales', 'get', {all: false}).subscribe((data)=> {
        //     this.sucursales = data;
        // });
        //
        // this.coreService.getProductos.subscribe(productos => {
        //     this.items = this.coreService.filterProducts('en_pedido', 'true', 'true');
        // });
        //
        // this.coreService.getCartStatus.subscribe((data)=> {
        //     this.total = data.total;
        // });
        //
        // this.provincias = ProvinciaService.get();
        //
        //
        // this.user = (localStorage.getItem('currentUser')) ? (JSON.parse(localStorage.getItem('currentUser'))).user : {};

        this.buildForm();
    }

    getStatusText(status) {
        switch (status) {
            case 1:
                return 'Pedido';
            case 2:
                return 'Entregado';
        }
    }



    update(item) {

        if (!item.en_carrito && !item.cantidad) {
            item.cantidad = 1;
        }

        if (item.en_carrito) {
            delete item.en_carrito;
        } else {
            item.en_carrito = true;
        }

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
