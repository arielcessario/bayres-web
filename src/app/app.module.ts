import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {DbConnectService} from './core/db-connect/db-connect.service';
import {Routing} from './app.routes';
import {SharedModule} from './shared/shared.module';
import {CoreService} from './core/core.service';
import {SettingService} from './core/setting.service';
import {AuthGuard} from './core/auth/auth-guard.service';
import {ToasterModule} from 'angular2-toaster';
import {Angular2SocialLoginModule} from "angular2-social-login";
import {AuthenticationService} from "./core/auth/authentication.service";

import {AppComponent} from './app.component';
import {PrincipalComponent} from "./principal/principal.component";
import {ProductosComponent} from "./productos/productos.component";
import {ProductoDetalleComponent} from "./producto-detalle/producto-detalle.component";
import {CarritoComponent} from "./carrito/carrito.component";
import {ProvinciaService} from "./core/provincia/provincia.service";
import {UsuarioComponent} from "./usuario/usuario.component";
import {PedidoComponent} from "./pedidos/pedidos.component";

let providers = {
    "google": {
        "clientId": "639646112390-c3jcsiq36j19hp3kbdr13dsmv03jqd7r.apps.googleusercontent.com"
    },
    "facebook": {
        "clientId": "459775457703269",
        "apiVersion": "v2.9"
    }
};

@NgModule({
    declarations: [
        AppComponent,
        PrincipalComponent,
        ProductosComponent,
        ProductoDetalleComponent,
        CarritoComponent,
        UsuarioComponent,
        PedidoComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        SharedModule,
        Routing,
        Angular2SocialLoginModule,
        BrowserAnimationsModule,
        ToasterModule
    ],
    providers: [CoreService,
        DbConnectService,
        AuthGuard,
        AuthenticationService,
        SettingService,
        ProvinciaService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

Angular2SocialLoginModule.loadProvidersScripts(providers);
