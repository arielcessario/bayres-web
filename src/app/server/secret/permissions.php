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
        'Sucursales' => array(
            'get' => -1, 'updateStock' => PermissionTypes::Admin, 'getValue' => PermissionTypes::Allowed
        ),
        'Mails' => array(
            'contacto' => PermissionTypes::Allowed, 'sendCarritoComprador' => PermissionTypes::Client, 'deleteAsiento' => 1
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

