<?php

require_once './includes/utils/enums.php';


class Permissions{
public $permissions = array(
        'Usuarios' => array('get' => 1,
            'login' => PermissionTypes::Allowed,
            'loginSocial' => PermissionTypes::Allowed,
            'logout' => PermissionTypes::Allowed,
            'create' => PermissionTypes::Allowed,
            'update' => PermissionTypes::Client
        ),
        'Productos' => array(
            'getProductos' => PermissionTypes::Allowed,
            'getDeseos' => PermissionTypes::Allowed,
            'getCategorias' => PermissionTypes::Allowed,
            'createCarrito' => PermissionTypes::Client,
            'getCarritos' => PermissionTypes::Client,
            'desear' => PermissionTypes::Client,
            'createProducto' => 0,
            'updateProducto' => 0,
            'createCategoria' => 0,
            'removeCategoria' => 0,
            'updateCategoria' => 0
        ),
        'Cajas' => array(
            'getTotalByCuenta' => 1,
            'getSaldoInicial' => 1,
            'getCajaDiaria' => 1,
            'checkEstado' => 1,
            'cerrarCaja' => 1,
            'abrirCaja' => 1,
            'getSaldoFinalAnterior' => 1,
            'getResultado' => 1,
            'createEncomienda' => 1,
            'updateEncomienda' => 1,
            'getEncomiendas' => 1
        ),
        'Stocks' => array(
            'getStocks' => 1,
            'updateStock' => 1,
            'getPedidos' => 1,
            'createStock' => 1,
            'trasladar' => 1,
            'getAReponer' => 1
        ),
        'Reportes' => array(
            'cierreDeCaja' => 1, 'updateStock' => 1
        ),
        'Sucursales' => array(
            'get' => -1, 'updateStock' => PermissionTypes::Admin, 'getValue' => PermissionTypes::Allowed
        ),
        'Movimientos' => array(
            'save' => 1, 'saveDetalle' => 1, 'deleteAsiento' => 1
        ),
        'Avisos' => array(
            'get' => 1, 'create' => 0, 'update' => 0, 'remove' => 0
        )
    );


    public function getPermission($class, $fnc){
        
            if($this->permissions[$class][$fnc]){
                $this->permissions[$class][$fnc];
            }else{
                throw new Exception( 'No existe el permiso: ' . $fnc);
            }

        
    }
}

