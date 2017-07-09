import {Component, OnInit} from '@angular/core';
// import {PedidoService} from "../shared/pedido/pedido.service";
// import {Sucursal} from "../sucursales/sucursal.model";
import {ProvinciaService} from "../core/provincia/provincia.service"
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoreService} from "../core/core.service";
import {DbConnectService} from "../core/db-connect/db-connect.service";

@Component({
    selector: 'pedidos-component',
    templateUrl: './pedidos.component.html',
    styleUrls: ['./pedidos.component.scss']
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

    user: any = {};


    calle: string;
    nro: string;


    constructor(private coreService: CoreService, private dbConnectService: DbConnectService) {
    }


    ngOnInit() {

        this.user = (localStorage.getItem('currentUser')) ? (JSON.parse(localStorage.getItem('currentUser'))).user : {};

        this.dbConnectService.get('productos', 'getCarritos', {usuario_id: this.user.usuario_id}).subscribe((data)=> {
            console.log(data);
            this.items = data;
        });

    }


    goTo(path) {
        // NavService.send(path);
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

    getStatusText(status) {
        switch (status) {
            case 1:
                return 'Pedido';
            case 2:
                return 'Entregado';
        }


    }


}
