<?php

class Productos extends Main
{
    public function __construct($fnc, $prm, $req)
    {
        parent::__construct(get_class($this), $prm, $fnc);
        $this->$fnc($prm);
    }


    /**
     * @description Crea un carrito y su detalle
     * @param $carrito
     */
    function createCarrito($params)
    {



        $productos = '';
        foreach ($params->productos as $key => $value) {
            $productos = $productos . ',' . $key;
        }

        if($productos == ''){

            $this->sendError('No hay productos en su carrito');
            exit;
        }

        $productos = substr($productos, 1);

        $tipo_precio = ($this->user->rol_id == 0 || $this->user->rol_id == 2 || $this->user->rol_id == 4) ? 1 : 0;


        $this->db->startTransaction();

        $SQL = 'select p.producto_id, pr.precio, p.en_oferta from productos p inner join precios pr on p.producto_id = pr.producto_id where pr.precio_tipo_id = ' . $tipo_precio . ' and p.producto_id in (' . $productos . ');';

        $precios = $this->db->rawQuery($SQL);
        $detalles = [];

        $total = 0;

        foreach ($precios as $pr) {
            $cant = json_decode(json_encode($params->productos), true)[$pr['producto_id']];
            $total = $total + ($pr['precio'] * $cant);
            array_push($detalles,
                array(
                    "producto_id" => $pr['producto_id'],
                    "precio_unitario" => $pr['precio'],
                    "cantidad" => $cant,
                    "en_oferta" => $pr['en_oferta']
                )
            );

        }


        //echo json_encode($productos);


        $data = array(
            'status' => 1,
            'total' => $total,
            'fecha' => $this->db->now(),
            'usuario_id' => $this->user->id,
            'origen' => $params->origen,
            'destino' => $params->destino
        );

        $result = $this->db->insert('carritos', $data);
        if ($result > -1) {

            foreach ($detalles as $detalle) {
                $det = array(
                    'carrito_id' => $result,
                    'producto_id' => $detalle['producto_id'],
                    'cantidad' => $detalle['cantidad'],
                    'en_oferta' => $detalle['en_oferta'],
                    'precio_unitario' => $detalle['precio_unitario']
                );

                $pre = $this->db->insert('carrito_detalles', $det);
                if ($pre < 0) {
                    $this->db->rollback();
                    $this->sendError($this->db->getLastError());
                    return;
                }
            }

            $this->db->commit();
            //echo json_encode($result);
            $data['carrito_id'] = $result;
            $this->sendResponse($data);
        } else {
            $this->db->rollback();
            $this->sendError($this->db->getLastError());
        }
    }


    /**
     * @description Elimina un detalle de carrito
     * @param $carrito_detalle_id
     */
    function removeCarritoDetalle($carrito_detalle_id)
    {

        $this->db->startTransaction();
        try {
            $carrito_detalle_id_decoded = json_decode($carrito_detalle_id);

            $this->db->where("carrito_detalle_id", $carrito_detalle_id_decoded, 'IN');
            $results = $this->db->delete('carrito_detalles');

            if ($results) {
                $this->db->commit();
                echo json_encode(1);
            } else {
                $this->db->rollback();
                echo json_encode(-1);
            }
        } catch (Exception $e) {
            $this->db->rollback();
            echo json_encode(-1);
        }
    }


    /////// GET ////////

    /**
     * @descr Obtiene los productos
     */
    function getProductos()
    {

        try {


            $tipo_precio = 0;

            if ($this->user != null) {
                $tipo_precio = ($this->user->rol_id == 0 || $this->user->rol_id == 2 || $this->user->rol_id == 4) ? 1 : 0;
            }

            $results = $this->db->rawQuery('SELECT
        p.producto_id,
        p.nombre nombreProducto,
        p.descripcion,
        p.pto_repo,
        p.sku,
        p.status,
        p.vendidos,
        p.destacado,
        p.producto_tipo,
        p.en_slider,
        p.en_oferta,
        c.categoria_id,
        c.nombre nombreCategoria,
        c.parent_id,
        ps.producto_kit_id,
        ps.producto_id productoKit,
        ps.producto_cantidad,
        pr.precio_id,
        pr.precio_tipo_id,
        pr.precio,
        f.producto_foto_id,
        f.main,
        f.nombre nombreFoto,
        u.usuario_id,
        u.nombre nombreUsuario,
        u.apellido
    FROM
        productos p
            LEFT JOIN
        productos_categorias pc ON p.producto_id = pc.producto_id
            LEFT JOIN
        categorias c ON c.categoria_id = pc.categoria_id
            LEFT JOIN
        precios pr ON p.producto_id = pr.producto_id and pr.precio_tipo_id =  ' . $tipo_precio . '
            LEFT JOIN
        productos_fotos f ON p.producto_id = f.producto_id
            LEFT JOIN
        productos_kits ps ON p.producto_id = ps.parent_id
            LEFT JOIN
        productos_proveedores pro ON pro.producto_id = p.producto_id
            LEFT JOIN
        usuarios u ON u.usuario_id = pro.proveedor_id
        WHERE p.status = 1 
    GROUP BY p.producto_id , p.nombre , p.descripcion , p.pto_repo , p.sku , p.status , 
    p.vendidos , p.destacado , p.producto_tipo , p.en_slider , p.en_oferta , c.categoria_id , 
    c.nombre , c.parent_id , ps.producto_kit_id , ps.producto_id , ps.producto_cantidad , pr.precio_id , pr.precio_tipo_id , 
    pr.precio, f.producto_foto_id, f.main, f.nombre, u.usuario_id, u.nombre, u.apellido 
        ORDER BY p.nombre 
    ;');


            $final = array();
            foreach ($results as $row) {

                if (!isset($final[$row["producto_id"]])) {
                    $final[$row["producto_id"]] = array(
                        'producto_id' => $row["producto_id"],
                        'nombre' => $row["nombreProducto"],
                        'descripcion' => $row["descripcion"],
                        'pto_repo' => $row["pto_repo"],
                        'sku' => $row["sku"],
                        'status' => $row["status"],
                        'vendidos' => $row["vendidos"],
                        'destacado' => $row["destacado"],
                        'producto_tipo' => $row["producto_tipo"],
                        'en_slider' => $row["en_slider"],
                        'en_oferta' => $row["en_oferta"],
                        'categoria_id' => $row['categoria_id'],
                        'nombreCategoria' => $row['nombreCategoria'],
                        'categorias' => array(),
                        'precios' => array(),
                        'fotos' => array(),
                        'kits' => array(),
                        'proveedores' => array()
                    );
                }
                $have_cat = false;
                if ($row["categoria_id"] !== null) {

                    if (sizeof($final[$row['producto_id']]['categorias']) > 0) {
                        foreach ($final[$row['producto_id']]['categorias'] as $cat) {
                            if ($cat['categoria_id'] == $row["categoria_id"]) {
                                $have_cat = true;
                            }
                        }
                    } else {
                        $final[$row['producto_id']]['categorias'][] = array(
                            'categoria_id' => $row['categoria_id'],
                            'nombre' => $row['nombreCategoria'],
                            'parent_id' => $row['parent_id']
                        );

                        $have_cat = true;
                    }

                    if (!$have_cat) {
                        array_push($final[$row['producto_id']]['categorias'], array(
                            'categoria_id' => $row['categoria_id'],
                            'nombre' => $row['nombreCategoria'],
                            'parent_id' => $row['parent_id']
                        ));
                    }
                }


                $have_pre = false;
                if ($row["precio_id"] !== null) {

                    if (sizeof($final[$row['producto_id']]['precios']) > 0) {
                        foreach ($final[$row['producto_id']]['precios'] as $cat) {
                            if ($cat['precio_id'] == $row["precio_id"]) {
                                $have_pre = true;
                            }
                        }
                    } else {
                        $final[$row['producto_id']]['precios'][] = array(
                            'precio_id' => $row['precio_id'],
                            'precio_tipo_id' => $row['precio_tipo_id'],
                            'precio' => $row['precio']
                        );

                        $have_pre = true;
                    }

                    if (!$have_pre) {
                        array_push($final[$row['producto_id']]['precios'], array(
                            'precio_id' => $row['precio_id'],
                            'precio_tipo_id' => $row['precio_tipo_id'],
                            'precio' => $row['precio']
                        ));
                    }
                }


                $have_fot = false;
                if ($row["producto_foto_id"] !== null) {

                    if (sizeof($final[$row['producto_id']]['fotos']) > 0) {
                        foreach ($final[$row['producto_id']]['fotos'] as $cat) {
                            if ($cat['producto_foto_id'] == $row["producto_foto_id"]) {
                                $have_fot = true;
                            }
                        }
                    } else {
                        $final[$row['producto_id']]['fotos'][] = array(
                            'producto_foto_id' => $row['producto_foto_id'],
                            'nombre' => $row['nombreFoto'],
                            'main' => $row['main']
                        );

                        $have_fot = true;
                    }

                    if (!$have_fot) {
                        array_push($final[$row['producto_id']]['fotos'], array(
                            'producto_foto_id' => $row['producto_foto_id'],
                            'nombre' => $row['nombreFoto'],
                            'main' => $row['main']
                        ));
                    }
                }

                $have_kit = false;
                if ($row["producto_kit_id"] !== null) {

                    if (sizeof($final[$row['producto_id']]['kits']) > 0) {
                        foreach ($final[$row['producto_id']]['kits'] as $cat) {
                            if ($cat['producto_kit_id'] == $row["producto_kit_id"]) {
                                $have_kit = true;
                            }
                        }
                    } else {
                        $final[$row['producto_id']]['kits'][] = array(
                            'producto_kit_id' => $row['producto_kit_id'],
                            'producto_id' => $row['productoKit'],
                            'producto_cantidad' => $row['producto_cantidad']
                        );

                        $have_kit = true;
                    }

                    if (!$have_kit) {
                        array_push($final[$row['producto_id']]['kits'], array(
                            'producto_kit_id' => $row['producto_kit_id'],
                            'producto_id' => $row['productoKit'],
                            'producto_cantidad' => $row['producto_cantidad']
                        ));
                    }
                }


                $have_pro = false;
                if ($row["usuario_id"] !== null) {

                    if (sizeof($final[$row['producto_id']]['proveedores']) > 0) {
                        foreach ($final[$row['producto_id']]['proveedores'] as $cat) {
                            if ($cat['usuario_id'] == $row["usuario_id"]) {
                                $have_pro = true;
                            }
                        }
                    } else {
                        $final[$row['producto_id']]['proveedores'][] = array(
                            'usuario_id' => $row['usuario_id'],
                            'nombre' => $row['nombreUsuario'],
                            'apellido' => $row['apellido']
                        );

                        $have_pro = true;
                    }

                    if (!$have_pro) {
                        array_push($final[$row['producto_id']]['proveedores'], array(
                            'usuario_id' => $row['usuario_id'],
                            'nombre' => $row['nombreUsuario'],
                            'apellido' => $row['apellido']
                        ));
                    }
                }
            }

            $this->sendResponse(array_values($final));
        } catch (Exception $e) {
            $this->sendError('Caught exception: ' . $e->getMessage() . "\n");
        }

    }


    /**
     * @descr Obtiene las categorias
     */
    function getCategorias()
    {
        $results = $this->db->rawQuery('SELECT c.*, (SELECT 
                COUNT(p.producto_id)
            FROM
                productos_categorias p
                INNER JOIN productos pp ON p.producto_id= pp.producto_id
            WHERE
                p.categoria_id = c.categoria_id and pp.status = 1) total, d.nombre nombrePadre FROM categorias c LEFT JOIN categorias d ON c.parent_id = d.categoria_id;');


        $this->sendResponse($results);
    }


    /**
     * @descr Obtiene los productos. En caso de enviar un usuario_id != -1, se traerán todos los carritos. Solo usar esta opción cuando se aplica en la parte de administración
     */
    function getCarritos($params)
    {

        if(!$this->user){
            $this->sendError('Por favor ingrese con su usuario y contraseña');
            return;
        }

        if ($params->usuario_id != -1) {
            $this->db->where('c.usuario_id', $params->usuario_id);
        }
        $this->db->join("usuarios u", "u.usuario_id=c.usuario_id", "LEFT");
        $results = $this->db->get('carritos c', null, 'c.carrito_id, c.status, c.total, c.fecha, c.usuario_id, u.nombre, u.apellido');

        foreach ($results as $key => $row) {
            $this->db->where('carrito_id', $row['carrito_id']);
            $this->db->join("productos p", "p.producto_id=c.producto_id", "LEFT");
            $productos = $this->db->get('carrito_detalles c', null, 'c.carrito_detalle_id, c.carrito_id, c.producto_id, p.nombre, c.cantidad, c.en_oferta, c.precio_unitario');

//            foreach ($productos as $k => $r){
//                $this->db->where('p.producto_id', $r['producto_id']);
//                $this->db->join("productos p", "p.producto_id=f.producto_id", "LEFT");
//                $fotos = $this->db->get('productos_fotos f', null, 'f.producto_foto_id, f.main, f.nombre');
//                $productos[$k]['fotos'] = $fotos;
//            }

            $results[$key]['productos'] = $productos;

        }
        $this->sendResponse($results);
    }


    function desear($params)
    {


        if(!$this->user){
            $this->sendError('Por favor ingrese con su usuario y contraseña');
            return;
        }

        $this->db->startTransaction();
        try {


            $this->db->where("usuario_id", $this->user->id);
            $this->db->where("producto_id", $params->producto_id);
            $results = $this->db->get('deseos');

            if ($this->db->count > 0) {
                $this->db->where("usuario_id", $this->user->id);
                $this->db->where("producto_id", $params->producto_id);

                $this->db->delete('deseos');
            } else {
                $data = array(
                    'usuario_id' => $this->user->id,
                    'producto_id' => $params->producto_id);

                $this->db->insert('deseos', $data);
            }
            $this->db->commit();
            $this->sendResponse('Ok');
        } catch (Exception $e) {
            $this->db->rollback();
            $this->sendError('Caught exception: ' . $e->getMessage() . "\n");
        }
    }

    function getDeseos($params)
    {

        if(!$this->user){
            $this->sendResponse([]);
            return;
        }

        $this->db->where('usuario_id', $this->user->id);
        $results = $this->db->get('deseos');
        $this->sendResponse($results);
    }

    /**
     * @description Verifica todos los campos de carrito para que existan
     * @param $carrito
     * @return mixed
     */
    function checkCarrito($carrito)
    {
        $now = new DateTime(null, new DateTimeZone('America/Argentina/Buenos_Aires'));

        $carrito->status = (!array_key_exists("status", $carrito)) ? 1 : $carrito->status;
        $carrito->total = (!array_key_exists("total", $carrito)) ? 0.0 : $carrito->total;
        //    $carrito->fecha = (!array_key_exists("fecha", $carrito)) ? $now->format('Y-m-d H:i:s') : $carrito->fecha;
        $carrito->usuario_id = (!array_key_exists("usuario_id", $carrito)) ? -1 : $carrito->usuario_id;
        $carrito->origen = (!array_key_exists("origen", $carrito)) ? -1 : $carrito->origen;
        $carrito->destino = (!array_key_exists("destino", $carrito)) ? -1 : $carrito->destino;
        $carrito->detalles = (!array_key_exists("detalles", $carrito)) ? array() : checkCarritoDetalle($carrito->detalles);

        return $carrito;
    }

    /**
     * @description Verifica todos los campos de detalle del carrito para que existan
     * @param $detalle
     * @return mixed
     */
    function checkCarritoDetalle($detalles)
    {
        foreach ($detalles as $detalle) {
            $detalle->carrito_id = (!array_key_exists("carrito_id", $detalle)) ? 0 : $detalle->carrito_id;
            $detalle->producto_id = (!array_key_exists("producto_id", $detalle)) ? 0 : $detalle->producto_id;
            $detalle->cantidad = (!array_key_exists("cantidad", $detalle)) ? 0 : $detalle->cantidad;
            $detalle->en_oferta = (!array_key_exists("en_oferta", $detalle)) ? 0 : $detalle->en_oferta;
            $detalle->precio_unitario = (!array_key_exists("precio_unitario", $detalle)) ? 0 : $detalle->precio_unitario;
        }

        return $detalles;
    }
}