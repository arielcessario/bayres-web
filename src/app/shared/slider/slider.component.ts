import {
    Component,
    OnInit,
    ElementRef,
    ViewChild
}      from '@angular/core';
import {style, state, animate, transition, trigger} from "@angular/animations";
import {CoreService} from "../../core/core.service";

@Component({
    selector: 'slider-component',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({opacity: 0}),
                    animate('500ms', style({opacity: 1}))
                ]),
                transition(':leave', [
                    style({opacity: 1}),
                    animate('500ms', style({opacity: 0}))
                ])
            ]
        )
    ]
})

/**
 * TODO:
 */
export class SliderComponent implements OnInit {


    visible: number = 1;
    @ViewChild('tpl') tpl;
    timer: any;

    items: Array<any> = [
        {
            producto_id: 0,
            nombre: '',
            descripcion: '',
            foto: '',
            precios: [{precio: 0}],
            fotos: [{nombre: 'logo_top.png'}]
        },
        {
            producto_id: 0,
            nombre: '',
            descripcion: '',
            foto: '',
            precios: [{precio: 0}],
            fotos: [{nombre: 'logo_top.png'}]
        },
        {
            producto_id: 0,
            nombre: '',
            descripcion: '',
            foto: '',
            precios: [{precio: 0}],
            fotos: [{nombre: 'logo_top.png'}]
        },
        {
            producto_id: 0,
            nombre: '',
            descripcion: '',
            foto: '',
            precios: [{precio: 0}],
            fotos: [{nombre: 'logo_top.png'}]
        },
        {
            producto_id: 0,
            nombre: '',
            descripcion: '',
            foto: '',
            precios: [{precio: 0}],
            fotos: [{nombre: 'logo_top.png'}]
        }
    ];

    frases: Array<string> = [
        'Solo por hoy',
        'Ahora',
        'Última Oportunidad',
        'Apurate!',
        'Pocas unidades',
        'Últimos días',
        '25% de descuento!',
        'Imperdible'
    ];

    constructor(private coreService: CoreService) {

    }


    ngOnInit() {
        this.coreService.getProductos.subscribe((productos)=>{
            var leng = productos.length;
            this.items = [];
            while(leng --){
                if(productos[leng]['en_slider']){
                    this.items.push(productos[leng]);
                }
            }

        });



        this.timer = setInterval(() => {
            this.visible = this.visible == 6 ? 1 : this.visible + 1;
        }, 5000);


    }

    interval() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.visible = this.visible == 6 ? 1 : this.visible + 1;
        }, 5000);
    }


}
