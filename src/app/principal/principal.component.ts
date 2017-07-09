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

    constructor(private coreService: CoreService) {
    }

    ngOnInit() {
        this.coreService.getProductos.subscribe(productos => {
            this.setUp(productos);
        });
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
