import {Component, OnInit, NgZone} from '@angular/core';
import {style, animate, state, transition, trigger} from "@angular/animations";
import {Router} from '@angular/router';
import {CoreService} from '../../core/core.service';
import {AuthenticationService} from '../../core/auth/authentication.service';


@Component({
    selector: 'nav-component',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    animations: [
        trigger('visibility', [
            state('true', style({
                opacity: 1,
                visibility: 'visible'
            })),
            state('false', style({
                opacity: 0,
                visibility: 'collapse'
            })),
            transition('* => *', animate('.3s'))
        ]),
        trigger('visibilitySucursales', [
            state('true', style({
                opacity: 1,
                visibility: 'visible'
            })),
            state('false', style({
                opacity: 0,
                visibility: 'collapse'
            })),
            transition('* => *', animate('.1s'))
        ]),
        trigger('visibilityCategorias', [
            state('true', style({
                opacity: 1,
                visibility: 'visible'
            })),
            state('false', style({
                opacity: 0,
                visibility: 'collapse'
            })),
            transition('* => *', animate('.3s'))
        ])
    ]
})
export class NavComponent implements OnInit {

    routes: string[];
    titulo: string = '';
    visibility: boolean = false;
    visibilitySucursales: boolean = false;
    visibilityCategorias: boolean = false;
    overUserHeader: boolean = false;
    overUserMenu: boolean = false;
    loged: boolean = false;
    total: number = 0;
    cantidad: number = 0;
    categorias: Array<any> = [];
    categoria: any;

    productos: Array<any> = [];
    filterSearch: string = '';
    event = {};
    nombre: string = '';
    categoria_caption: string = 'Categorías';


    constructor(private _ngZone: NgZone, private router: Router, private coreService: CoreService, private authenticationService: AuthenticationService) {
    }

    changeCategoria(value) {
        this.categoria_caption = value.nombre;
        this.goTo('productos');
        setTimeout(()=> {
            this.coreService.setSearch({key: 'categoria_id', value: value.id});
        }, 0);

        // NavService.setCategoria(value);
        // this.router.navigate(['productos']);

    }

    login() {
        this.coreService.setLoginStatus({showLogin: true});
    }

    isSelected(path) {
        // if(path === this.location.path()){
        //     return true;
        // }
        // else if(path.length > 0){
        //     return this.location.path().indexOf(path) > -1;
        // }
    }

    goTo(link): void {
        // console.log('entra');
        // let link = ['/detail', hero.id];

        // LoginMessageService.to = link;
        this.router.navigate([link]);
        setTimeout(()=> {
            this.coreService.refreshAll();
        }, 0);

        // this.filterSearch = '';
    }

    ngOnInit() {
        this.routes = ['monedas', 'propiedades', 'comodidades', 'servicios', 'principal'];

        if (localStorage.getItem('currentUser')) {
            this.loged = true;
            this.nombre = JSON.parse(localStorage.getItem('currentUser')).user.nombre;
        }

        this.coreService.getLoginStatus.subscribe(data=> {
            this._ngZone.run(() => {
                if (localStorage.getItem('currentUser')) {
                    this.nombre = JSON.parse(localStorage.getItem('currentUser')).user.nombre;
                    this.loged = true;
                    this.visibility = false;
                } else {
                    this.loged = false;
                }
            });

        });

        this.coreService.getCategorias.subscribe(data=> {
            if (data.length == 0) {
                return;
            }


            for (var i in data) {
                if (data[i].parent_id == -1) {
                    this.categorias.push({
                        id: data[i].categoria_id,
                        nombre: data[i].nombre,
                        total: data[i].total,
                        elems: []
                    });
                }
            }


            for (var i in data) {
                for (var x in this.categorias) {

                    if (data[i].parent_id == this.categorias[x].id) {
                        this.categorias[x].elems.push({
                            id: data[i].categoria_id, nombre: data[i].nombre, total: data[i].total
                        });
                    }
                }
            }
        });

        this.coreService.getLogOut.subscribe(()=> {
            this.logOut();
        });


        this.coreService.getCartStatus.subscribe((data)=> {
            this.total = data.total;
            this.cantidad = data.cantidad;
        });


    }

    changeModel(){
        this.categoria_caption = 'Categorías'
    }

    overUser() {
        this.visibility = true;
    }

    getId(event) {


        if (event.search != undefined) {

            this.event = event;

            this.goTo('productos');
            // this.router.navigate(['productos']);

        } else {
            this.goTo('producto/' + event.id);
            // this.router.navigate(['producto/' + event.id]);
        }
    }

    logOut() {
        this.authenticationService.logout();
        this.coreService.setLoginStatus({showLogin: false});
        this.goTo('/principal');
        // this.router.navigate(['/principal']);
        this.loged = false;
    }

}
