import {
    Component,
    OnInit,
    ElementRef,
    ViewChild, Input, AfterViewInit, ReflectiveInjector
}      from '@angular/core';
import {Router} from '@angular/router';

import {CoreService} from "../core/core.service";

@Component({
    selector: 'productos-component',
    templateUrl: './productos.component.html',
    styleUrls: ['./productos.component.scss']
})

/**
 * TODO:
 */
export class ProductosComponent implements OnInit {

    data: Array<any> = [];
    dataFinal: Array<any> = [];
    orderBy: string = 'nombre';
    categoria: any = {};
    viewPortItems: Array<any> = [];

    constructor(private coreService: CoreService) {

    }


    ngOnInit() {

        this.coreService.getProductos.subscribe((productos)=> {
            this.dataFinal = productos;

        });

        this.coreService.getSearch.subscribe((search)=> {
            this.dataFinal = this.coreService.filterProducts(search.key, '' + search.value, 'false');

        });

        // NavService.categoria.subscribe(data=> {
        //     this.categoria = data;
        //     this.filterCategory();
        // });
        //
        // Producto.results().subscribe(data=> {
        //
        //     if (data.data instanceof Array) {
        //         this.data = data.data;
        //         this.filterCategory();
        //         DatabaseConnectorProvider.idle();
        //     }
        // });
    }

    filterCategory() {
        if (this.categoria.nombre == null) {
            this.dataFinal = this.data;
            return;
        }

        this.dataFinal = this.data.filter(e => {
            return e.categoria_id == this.categoria.id;
        });
    }

    ordenar() {
        let temp = [];
        for (var i in this.dataFinal) {
            temp.push(this.dataFinal[i]);
        }
        setTimeout(()=> {
            this.dataFinal = [];
            setTimeout(()=> {
                this.dataFinal = temp;
                this.dataFinal.sort((a, b) => {
                    if (this.orderBy == 'nombre') {
                        if (a[this.orderBy] > b[this.orderBy]) {
                            return 1;
                        }

                        if (a[this.orderBy] < b[this.orderBy]) {
                            return -1;
                        }
                        return 0;
                    }

                    if (this.orderBy == 'deseado' || this.orderBy == 'en_slider' || this.orderBy == 'en_carrito') {
                        if (a[this.orderBy] == 1) {
                            return -1;
                        }

                        if (a[this.orderBy] == 0 || a[this.orderBy] == null) {
                            return 1;
                        }

                        if (b[this.orderBy] == 0 || b[this.orderBy] == null) {
                            return 1;
                        }
                        return 0;
                    }

                    if (this.orderBy == 'precioDesc') {
                        return b['precios'][0]['precio'] - a['precios'][0]['precio'];
                    }

                    if (this.orderBy == 'precioAsc') {
                        return a['precios'][0]['precio'] - b['precios'][0]['precio'];
                    }

                });

                //NavService.refreshList();
            }, 0);
        }, 0);


    }


}
