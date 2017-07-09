import {
    Component,
    OnInit,
    ElementRef,
    ViewChild, Input, AfterViewInit, HostBinding
}      from '@angular/core';

@Component({
    selector: 'carrousel-component',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss']
})

/**
 * TODO:
 */
export class CarrouselComponent implements OnInit, AfterViewInit {
    @Input() data: Array<any>;
    @ViewChild('tpl') tpl;
    @ViewChild('list') list;

    constructor(private _el: ElementRef,) {
    }


    ngOnInit() {

    }

    ngAfterViewInit() {
    }

    left() {
        this.list.nativeElement.scrollLeft = this.list.nativeElement.scrollLeft - 150;
    }

    right() {
        this.list.nativeElement.scrollLeft = this.list.nativeElement.scrollLeft + 150;

    }


}
