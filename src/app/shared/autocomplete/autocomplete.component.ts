import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    HostListener, ElementRef, AfterContentInit, ViewChild, AfterViewInit, Renderer, Renderer2
}      from '@angular/core';
import {CoreService} from "../../core/core.service";


@Component({
    selector: '[autocomplete-component]',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss']
})

/**
 * TODO:
 * 1 - Selected Id se puede obtener en forma automática?
 */
export class AutocompleteComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
    // @Input() autocompleteData: DatabaseConnectorProvider;
    @Input() autocompleteToShow: Array<any>;
    @Input() autocompleteToSelect: string;
    @Input() autocompleteKey: string;
    @Input() autocompleteModel: string;
    @Input() autocompleteSearchBy: Array<any>;

    response: Array<any> = [];
    public visible: boolean = true;
    private alreadySelected: boolean = false;
    private focused: boolean = true;

    private selected: any = {};
    private indexSelected: number = 0;

    private prevValue: string = '';

    @Output('selectedId')
    selectedId: EventEmitter<{}> = new EventEmitter<{}>();

    @ViewChild('tpl') tpl;
    @ViewChild('hiddenAutocomplete') hiddenAutocomplete;

    constructor(private _el: ElementRef, public renderer: Renderer2, private coreService: CoreService) {
    }

    ngAfterViewInit() {
        // console.log(this._el.nativeElement.getBoundingClientRect());
        // console.log(this.tpl.nativeElement);
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this._el.nativeElement.parentNode.appendChild(this.tpl.nativeElement);
        this.renderer.setStyle(this.tpl.nativeElement, 'margin-top', (this._el.nativeElement.offsetTop + this._el.nativeElement.getBoundingClientRect().height ) + 'px');
        // this.renderer.setStyle(this.tpl.nativeElement, 'width', (this._el.nativeElement.getBoundingClientRect().width + 'px'));

    }

    @HostListener('keyup', ['$event'])
    filter(event: Event) {

        if (event.target['value'] != this.prevValue) {
            this.prevValue = event.target['value'];
            this.indexSelected = -1;
        }


        this.alreadySelected = false;
        this.show(event);
    }


    @HostListener('focus', ['$event'])
    foco(event: Event) {
        this._el.nativeElement.focus();
        this.show(event);
    }

    @HostListener('click', ['$event'])
    click(event: Event) {
        this.alreadySelected = false;
        this.show(event);
    }

    @HostListener('blur', ['$event'])
    leave(event: Event) {
        setTimeout(() => {
            this.focused = false;
            this.determineVisibility();
        }, 500);
    }

    select(index) {
        this.indexSelected = index;
        this.focused = false;
        this.selected = this.response[this.indexSelected];
        // this._el.nativeElement.value = this.selected[this.autocompleteToSelect];

        // this.control.control.setValue(this.selected[this.autocompleteToSelect]);
        // this._el.nativeElement.value = this.selected[this.autocompleteToSelect];
        this.autocompleteModel = this.selected[this.autocompleteToSelect];
        this.selectedId.emit({id: this.selected[this.autocompleteKey]});
        this.determineVisibility();
    }

    over(index) {
        this.indexSelected = index;
        this.focused = true;
        this.determineVisibility();

    }

    show(event: Event) {
        let results = this.coreService.filterProducts(this.autocompleteSearchBy, event.target['value'], 'false');
        setTimeout(()=>{
            this.coreService.setSearch({key:'nombre', value:event.target['value']});
        }, 0);

        this.focused = results.length > 0;
        this.response = results;

        this.determineVisibility();
    }

    @HostListener('keydown', ['$event'])
    keyboardInput(event: KeyboardEvent) {
        // console.log(event.keyCode);


        // Me muevo para abajo en la lista
        if (event.keyCode == 40) {
            this.indexSelected = this.indexSelected == -1 ? 0 : this.indexSelected;
            this.indexSelected = +((this.indexSelected >= this.response.length ) ? this.response.length : this.indexSelected + 1);

            let height = this.tpl.nativeElement.querySelector('.autocomplete-container').scrollHeight;
            let scrollSection = height / this.response.length;
            this.tpl.nativeElement.querySelector('.autocomplete-container').scrollTop = scrollSection * (this.indexSelected - 1);

        }

        // Me muevo para arriba en la lista
        if (event.keyCode == 38) {
            this.indexSelected = +((this.indexSelected <= 0) ? 0 : this.indexSelected - 1);

            let height = this.tpl.nativeElement.querySelector('.autocomplete-container').scrollHeight;
            let scrollSection = height / this.response.length;
            this.tpl.nativeElement.querySelector('.autocomplete-container').scrollTop = scrollSection * (this.indexSelected - 1);
        }

        // Cuando presiono escape
        if (event.keyCode == 27) {
            this.focused = false;
            this.alreadySelected = true;
            this.hiddenAutocomplete.nativeElement.focus();
        }

        // selecciono
        if (event.keyCode == 13 || event.keyCode == 9) {
            this.focused = false;
            this.alreadySelected = true;
            this.selected = this.response[this.indexSelected - 1];

            if (this.selected == undefined) {
                this.selectedId.emit({id: -1, search: event.target['value']});
            } else {
                // this._el.nativeElement.value = this.selected[this.autocompleteToSelect];
                this.autocompleteModel = this.selected[this.autocompleteToSelect];
                this.selectedId.emit({id: this.selected[this.autocompleteKey]});
            }

            this.hiddenAutocomplete.nativeElement.focus();
        }

        this.determineVisibility();
    }


    ngOnChanges(changes: SimpleChanges) {
    }

    determineVisibility() {

        this.visible = true;

        if (!this.focused || this.alreadySelected) {
            this.visible = false;
            //this.hiddenAutocomplete.nativeElement.focus();
            return;
        }

        this.tpl.nativeElement.style.top = this._el.nativeElement.style.top;


    }
}
