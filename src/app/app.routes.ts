import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrincipalComponent} from "./principal/principal.component";
import {ProductosComponent} from "./productos/productos.component";
import {ProductoDetalleComponent} from "./producto-detalle/producto-detalle.component";
import {CarritoComponent} from "./carrito/carrito.component";
import {UsuarioComponent} from "./usuario/usuario.component";
import {AuthGuard} from "./core/auth/auth-guard.service";
import {PedidoComponent} from "./pedidos/pedidos.component";



const routes: Routes = [
    { path: '', redirectTo: 'principal', pathMatch: 'full' },
    { path: 'principal', component: PrincipalComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'producto/:id', component: ProductoDetalleComponent },
    { path: 'carrito', component: CarritoComponent },
    { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
    { path: 'pedidos', component: PedidoComponent, canActivate: [AuthGuard] },
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
