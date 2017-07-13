import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {CommonModule} from '@angular/common';
import {ProductoComponent} from "./producto/producto.component";
import {DescLengthPipe} from "./pipes/desc-length.pipe";
import {SliderComponent} from "./slider/slider.component";
import {CarrouselComponent} from "./carrousel/carrousel.component";
import {VirtualScrollComponent} from "./infinite-scroll/infinite-scroll";
import {AutocompleteComponent} from "./autocomplete/autocomplete.component";
import {NavComponent} from "./nav/nav.component";
import {FooterComponent} from "./footer/footer.component";
import {LoaderComponent} from "./loader/loader.component";


@NgModule({
    declarations: [
        LoginComponent,
        ProductoComponent,
        DescLengthPipe,
        SliderComponent,
        CarrouselComponent,
        VirtualScrollComponent,
        AutocompleteComponent,
        NavComponent,
        FooterComponent,
        LoaderComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [],
    exports: [
        LoginComponent,
        ProductoComponent,
        DescLengthPipe,
        SliderComponent,
        CarrouselComponent,
        VirtualScrollComponent,
        AutocompleteComponent,
        NavComponent,
        FooterComponent,
        LoaderComponent
    ]
})
export class SharedModule {
}
