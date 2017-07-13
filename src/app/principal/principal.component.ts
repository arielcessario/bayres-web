import {Component, OnInit} from '@angular/core';
import {CoreService} from "../core/core.service";

@Component({
    selector: 'app-principal',
    templateUrl: './principal.component.html',
    styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
    productos = [];
    en_oferta = [];
    destacado = [];
    nuevo = [];
    deseado = [];
    loged = false;

    constructor(private coreService: CoreService) {
    }

    ngOnInit() {
        this.coreService.getProductos.subscribe(productos => {
            this.setUp(productos);
        });

        this.loged = localStorage.getItem('currentUser') != null;

        this.coreService.getLoginStatus.subscribe(()=> {
            this.loged = localStorage.getItem('currentUser') != null;
        })
    }

    setUp(productos) {
        var leng = productos.length;
        this.en_oferta = [];
        this.destacado = [];
        this.deseado = [];
        while (leng--) {
            if (productos[leng]['en_oferta']) {
                this.en_oferta.push(productos[leng]);
            }

            if (productos[leng]['destacado']) {
                this.destacado.push(productos[leng]);
            }

            if (productos[leng]['deseado']) {
                this.deseado.push(productos[leng]);
            }
        }
    }

}
