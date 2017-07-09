import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {CoreService} from "../../core/core.service";
import {DbConnectService} from "../../core/db-connect/db-connect.service";

@Component({
    selector: 'producto-component',
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.scss']
})

/**
 * TODO:
 */
export class ProductoComponent implements OnInit {

    @Input() item;
    // producto: Producto;

    constructor(private router: Router, private coreService: CoreService, private dbConnectService: DbConnectService) {
        // this.producto = new Producto();
    }

    ngOnInit() {
    }

    goTo(id): void {
        // console.log('entra');
        // let link = ['/detail', hero.id];
        this.router.navigate(['/producto', id]);

        setTimeout(()=>{
            this.coreService.refreshAll();
        }, 0);
    }

    desear(item){
        if(item['deseado']){
            delete item['deseado'];
        }else{
            item['deseado'] = true;
        }

        let ret = this.dbConnectService.post('productos', 'desear', {producto_id: item.producto_id});

        ret.subscribe(data=>{
            console.log(data);
        });

        this.coreService.showToast.subscribe(data=>{
            if( data.type == 'error' || data.message.indexOf('Por favor ingrese con su usuario y contraseña')){
                this.coreService.setLoginStatus({showLogin: true});
                delete item['deseado'];
            }
        });

        // this.coreService.setDesear(item['producto_id']);
    }


}
