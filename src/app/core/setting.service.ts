import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {DbConnectService} from './db-connect/db-connect.service';
import {CoreService} from './core.service';
import {CacheService} from './cache/cache.service';


@Injectable()
export class SettingService {

    public getProductos: Subject<any> = new Subject<any>();
    private user: any = {};

    constructor(private dbConnectService: DbConnectService, private coreService: CoreService) {

        dbConnectService.get('productos', 'getCategorias', {}).subscribe((data)=> {
            coreService.setCategorias(data);
        });

        if (localStorage.getItem('currentUser')) {
            this.user = JSON.parse(localStorage.getItem('currentUser')).user;
            this.setUpUser();
        } else {
            this.setUpGuest();
        }

        coreService.getLoginStatus.subscribe(data=> {
            if (localStorage.getItem('currentUser')) {
                this.user = JSON.parse(localStorage.getItem('currentUser')).user;
                this.setUpUser();
            } else {
                this.setUpGuest();
            }
        });


    }

    setUpUser() {

        this.dbConnectService.get('productos', 'getCarritos', {usuario_id: this.user.usuario_id}).subscribe((data)=>{
        });

        let prod = this.dbConnectService.get('productos', 'getProductos', {}).subscribe(productos => {
            let wish = this.dbConnectService.get('productos', 'getDeseos', {'usuario_id': this.user.usuario_id}).subscribe(deseos => {

                let carrito = (localStorage.getItem('carrito')) ? JSON.parse(localStorage.getItem('carrito')) : {};
                let len = productos.length - 1;
                let lenW = deseos.length - 1;


                while (len--) {

                    if (deseos.length > 0) {
                        while (lenW--) {
                            if (productos[len].producto_id == deseos[lenW].producto_id) {
                                productos[len]['deseado'] = true;
                            }
                        }
                        lenW = deseos.length - 1;
                    }


                    if (carrito[productos[len].producto_id]) {
                        productos[len].cantidad = carrito[productos[len].producto_id];
                        productos[len].en_carrito = true;
                    }
                }

                CacheService.set('productos', 'getProductos', productos);
                this.coreService.setProductos(productos);
                this.coreService.calcularTotal();

            });
        });
    }

    setUpGuest() {

        let prod = this.dbConnectService.get('productos', 'getProductos', {}).subscribe(productos => {

            let carrito = (localStorage.getItem('carrito')) ? JSON.parse(localStorage.getItem('carrito')) : {};
            let len = productos.length - 1;

            while (len--) {
                if (carrito[productos[len].producto_id]) {
                    productos[len].cantidad = carrito[productos[len].producto_id];
                    productos[len].en_carrito = true;
                }
            }

            CacheService.set('productos', 'getProductos', productos);
            this.coreService.setProductos(productos);
            this.coreService.calcularTotal();
        });
    }

}
