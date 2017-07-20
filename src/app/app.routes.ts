import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrincipalComponent} from "./principal/principal.component";
import {ProductosComponent} from "./productos/productos.component";
import {ProductoDetalleComponent} from "./producto-detalle/producto-detalle.component";
import {CarritoComponent} from "./carrito/carrito.component";
import {UsuarioComponent} from "./usuario/usuario.component";
import {AuthGuard} from "./core/auth/auth-guard.service";
import {PedidosComponent} from "./pedidos/pedidos.component";
import {PedidoComponent} from "./pedido/pedido.component";
import {ContactoComponent} from "./contacto/contacto.component";
import {DeseosComponent} from "./deseos/deseos.component";


const routes: Routes = [
    {path: '', redirectTo: 'principal', pathMatch: 'full'},
    {path: 'principal', component: PrincipalComponent},
    {path: 'productos', component: ProductosComponent},
    {path: 'producto/:id', component: ProductoDetalleComponent},
    {path: 'carrito', component: CarritoComponent},
    {path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
    {path: 'pedidos', component: PedidosComponent, canActivate: [AuthGuard]},
    {path: 'pedido/:id', component: PedidoComponent, canActivate: [AuthGuard]},
    {path: 'deseos', component: DeseosComponent, canActivate: [AuthGuard]},
    {path: 'contacto', component: ContactoComponent},
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);
