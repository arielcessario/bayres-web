import {
    Component,
    OnInit,
    ElementRef,
    ViewChild, Input, AfterViewInit
}      from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoreService} from "../core/core.service";
import {DbConnectService} from "../core/db-connect/db-connect.service";

@Component({
    selector: 'producto-detalle-component',
    templateUrl: './producto-detalle.component.html',
    styleUrls: ['./producto-detalle.component.scss']
})

/**
 * TODO:
 */
export class ProductoDetalleComponent implements OnInit {

    visible: number = 1;
    id: number;
    data: any = {
        precios: [{0: 10}],
        cantidad: 1,
        fotos: [{nombre: ''}, {nombre: ''}, {nombre: ''}, {nombre: ''}]
    };

    constructor(private route: ActivatedRoute, private coreService: CoreService, private dbConnectService: DbConnectService) {
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.coreService.getProductos.subscribe((data)=> {

                this.data = this.coreService.filterProducts('producto_id', params['id'], 'true')[0];
                if (!this.data.en_carrito && !this.data.cantidad) {
                    this.data.cantidad = 1;
                }

            });
        });
    }


    update() {
        if (this.data.en_carrito) {
            delete this.data.en_carrito;
        } else {
            this.data.en_carrito = true;
        }

        this.coreService.updateCarrito(this.data);
    }

    changeCantidad(){
        if(this.data.en_carrito){
            this.coreService.updateCarrito(this.data);
        }
    }

    desear(){
        if(this.data['deseado']){
            delete this.data['deseado'];
        }else{
            this.data['deseado'] = true;
        }

        let ret = this.dbConnectService.post('productos', 'desear', {producto_id: this.data.producto_id});

        ret.subscribe(data=>{
            console.log(data);
        });
        // this.coreService.setDesear(item['producto_id']);
    }


}
