<?php

class Mails extends Main
{
    public function __construct($fnc, $prm, $req)
    {
        parent::__construct(get_class($this), $prm, $fnc);
        $this->$fnc($prm);
    }


    /* @name: forgotPassword
     * @param $email = email del usuario
     * @description: Envia al usuario que lo solicita, un password aleatorio. El password se envía desde acá porque no debe
     * pasar por js, el js está en el cliente, lo cual podría dar un punto para conseguir un pass temporal.
     * todo: Agregar tiempo límite para el cambio. Agregar template de mail dinámico.
     */
    function forgotPassword($email)
    {


        $options = ['cost' => 12];
        $new_password = $this->randomPassword();

        $password = password_hash($new_password, PASSWORD_BCRYPT, $options);

        $data = array('password' => $password);

        $this->db->where('mail', $email);

        $message = '<html><body>';
        $message .= '<div style="font-family:Arial,sans-serif;font-size:15px;color:#006837; color:rgb(0,104,55);margin:0 auto; width:635px;">';
        $message .= '<div style="color:#000;background: #cdeb8e; /* Old browsers */;margin: 40px 10px 0 10px; border-radius:5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;">';
        $message .= '<div style="background-image: background-repeat:no-repeat; width:360px; height:80px;margin-top: 15px;"><img src="https://res.cloudinary.com/ac-desarrollos/image/upload/v1486047383/logo_coxqsb.png"></div>';
        $message .= '<div style="font-weight:bold;text-align:center;font-size:1.5em; margin-top:10px;">Estimado cliente</div>';
        $message .= '<div style="margin:20px 0 0 15px; color: black; text-align: center; padding-bottom: 15px">Le enviamos su nueva contrase&ntilde;a</div>';
        $message .= '<div style="color: white; background-color: black; padding: 5px;"><label style="font-weight:bold">Contrase&ntilde;a: </label>' . $new_password . '</div>';
        $message .= '<div style="text-align:center;font-weight: bold;margin: 30px;">Bayres No Problem</div>';
        $message .= '</div></div>';
        $message .= '</body></html>';

        if ($this->db->update('usuarios', $data)) {
            $mail = new PHPMailer;
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
            $mail->Password = 'ventas0_*020ventas';                           // SMTP password
            $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 465;

            $mail->From = 'info@bayresnoproblem.com.ar';
            $mail->FromName = 'Bayres No Problem';
            $mail->addAddress($email);     // Add a recipient
            $mail->isHTML(true);    // Name is optional

            $mail->Subject = 'Recuperar Contraseña Bayres';
            $mail->Body = $message;
            $mail->CharSet = 'UTF-8';

            if (!$mail->send()) {
                echo 'Message could not be sent.';
                echo 'Mailer Error: ' . $mail->ErrorInfo;
            } else {
                echo 'Message has been sent';
            }
        }
    }

    /* @name: randomPassword
     * @description: Genera password aleatorio.
     * @return: array(string) crea un array de 8 letra
     */
    function randomPassword()
    {
        $alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        $pass = array(); //remember to declare $pass as an array
        $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
        for ($i = 0; $i < 8; $i++) {
            $n = rand(0, $alphaLength);
            $pass[] = $alphabet[$n];
        }
        return implode($pass); //turn the array into a string
    }


    /* @name: forgotPassword
     * @param $email = email del usuario
     * @description: Envia al usuario que lo solicita, un password aleatorio. El password se envía desde acá porque no debe
     * pasar por js, el js está en el cliente, lo cual podría dar un punto para conseguir un pass temporal.
     * todo: Agregar tiempo límite para el cambio. Agregar template de mail dinámico.
     */
    function welcome($email)
    {


        $message = '<html><body>';
        $message .= '<div style="font-family:Arial,sans-serif;font-size:15px;color:#006837; color:rgb(0,104,55);margin:0 auto; width:635px;">';
        $message .= '<div style="color:#000; margin: 40px 10px 0 10px; border-radius:5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cdeb8e+0,a5c956+100;Green+3D+%232 */
background: #cdeb8e; /* Old browsers */">';
        $message .= '<div style="background-image: background-repeat:no-repeat; width:360px; height:80px;margin-top: 15px;"><img src="https://res.cloudinary.com/ac-desarrollos/image/upload/v1486047383/logo_coxqsb.png"></div>';
        $message .= '<div style="font-weight:bold;text-align:center;font-size:1.5em; margin-top:10px;">Estimado cliente</div>';
        $message .= '<div style="text-align: center; color: black; padding: 5px; background-color: black">Le damos la bienvenida a Bayres No Problem!</div>';
        $message .= '<div style="text-align:center;font-weight: bold;margin: 30px;">Bayres No Problem</div>';
        $message .= '</div></div>';
        $message .= '</body></html>';

        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
        $mail->Password = 'ventas0_*020ventas';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;

        $mail->From = 'info@bayresnoproblem.com.ar';
        $mail->FromName = 'Bayres No Problem';
        $mail->addAddress($email);     // Add a recipient
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = 'Nuevo Cliente';
        $mail->Body = $message;
        $mail->CharSet = 'UTF-8';

        if (!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }


    function contacto($params)
    {


        $message = '<html><body>';
        $message .= '<div style="font-family:Arial,sans-serif;font-size:15px;color:#006837; color:rgb(0,104,55);margin:0 auto; width:635px;">';
        $message .= '<div style="color:#000; margin: 40px 10px 0 10px; border-radius:5px; -moz-border-radius: 5px; -webkit-border-radius: 5px; /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cdeb8e+0,a5c956+100;Green+3D+%232 */
background: #cdeb8e; /* Old browsers */">';
        $message .= '<div style="background-image: background-repeat:no-repeat; width:360px; height:80px;margin-top: 15px;"><img src="https://res.cloudinary.com/ac-desarrollos/image/upload/v1486047383/logo_coxqsb.png"></div>';
        $message .= '<div style="font-weight:bold;text-align:center;font-size:1.5em; margin-top:10px;">Mensaje de ' . $params->nombre . ', Contacto: ' . $params->mail . '</div>';
        $message .= '<div style="text-align: center; color: white; padding: 5px; background-color: black">' . $params->mensaje . '</div>';
        $message .= '<div style="text-align:center;font-weight: bold;margin: 30px;">Bayres No Problem</div>';
        $message .= '</div></div>';
        $message .= '</body></html>';

        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
        $mail->Password = 'ventas0_*020ventas';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;

        $mail->From = 'info@bayresnoproblem.com.ar';
        $mail->FromName = 'Bayres No Problem';
//        $mail->addAddress($params->mail);     // Add a recipient
        $mail->addAddress('arielcessario@gmail.com');     // Add a recipient
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = 'Contacto de ' . $params->nombre;
        $mail->Body = $message;
        $mail->CharSet = 'UTF-8';

        if (!$mail->send()) {

            $this->sendError('Mailer Error: ' . $mail->ErrorInfo);
        } else {
//            echo 'rompe';
            $this->sendResponse('Mensaje Enviado');
        }
    }


    /**
     * @param $usuario
     * @param $carrito
     */
    function sendCancelarCarritoComprador($params)
    {

        $productos = '';
        foreach ($params->productos as $key => $value) {
            $productos = $productos . ',' . $key;
        }

        if ($productos == '') {

            $this->sendError('No hay productos en su carrito');
            exit;
        }

        $productos = substr($productos, 1);

        $tipo_precio = ($this->user->rol_id == 0 || $this->user->rol_id == 2 || $this->user->rol_id == 4) ? 1 : 0;


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


        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
        $mail->Password = 'ventas0_*020ventas';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;

        //$mail->From = 'info@bayresnoproblem.com.ar'; //ESTE CORREO SOLO SE HABILITA EN PRODUCCION
        $mail->From = 'bayresnoproblem@hotmail.com';
        $mail->FromName = 'Bayres No Problem';
        $mail->addAddress($this->user->mail);     // Add a recipient
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = "Cancelar Pedido " . $params->carrito_id;
        $mail->Body = "<table>
                    <tr>
                        <td>Su pedido " . $params->carrito_id . " fue cancelado</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Fecha del Pedido: " . $this->db->now() . "</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Total del Pedido: " . $total . "</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Saludos Bayres No Problem</td>
                    </tr>
                </table>";
        //$mail->AltBody = "Nuevo Mail:" . $new_password;

        if (!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }

    /**
     * @param $destinatario
     * @param $mensaje
     */
    function sendCancelarCarritoVendedor($usuario, $email, $carrito)
    {
        $carritoInfo = json_decode($carrito);

        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventasweb@bayresnoproblem.com.ar';                 // SMTP username
        $mail->Password = 'v3nt4s!Web';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;

        $mail->From = $email;
        $mail->FromName = $usuario;
        $mail->addAddress($email);     // Add a recipient
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = "Cancelar Pedido " . $carritoInfo->carrito_id;
        $mail->Body = "<table>
                    <tr>
                        <td>El cliente " . $usuario . "</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Solicito cancelar el pedido: " . $carritoInfo->carrito_id . "</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Fecha del Pedido: " . $carritoInfo->fecha . "</td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Total del Pedido: " . $carritoInfo->total . "</td>
                    </tr>
                </table>";
        //$mail->AltBody = "Nuevo Mail:" . $new_password;

        if (!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }

    /**
     * @param $email
     * @param $nombre
     * @param $carrito
     * @param $sucursal
     * @param $direccion
     */
    function sendCarritoComprador($params)
    {

        $productos = '';

        $today = getdate()['mday'] . '/' . getdate()['mon'] . '/' . getdate()['year'];
        foreach ($params->productos as $key => $value) {
            $productos = $productos . ',' . $key;
        }

        if ($productos == '') {

            $this->sendError('No hay productos en su carrito');
            exit;
        }

        $productos = substr($productos, 1);

        $tipo_precio = ($this->user->rol_id == 0 || $this->user->rol_id == 2 || $this->user->rol_id == 4) ? 1 : 0;


        $SQL = 'select p.producto_id, p.nombre, pr.precio, p.en_oferta from productos p inner join precios pr on p.producto_id = pr.producto_id where pr.precio_tipo_id = ' . $tipo_precio . ' and p.producto_id in (' . $productos . ');';

        $precios = $this->db->rawQuery($SQL);
        $items = [];

        $total = 0;

        foreach ($precios as $pr) {
            $cant = json_decode(json_encode($params->productos), true)[$pr['producto_id']];
            $total = $total + ($pr['precio'] * $cant);
            array_push($items,
                array(
                    "producto_id" => $pr['producto_id'],
                    "nombre" => $pr['nombre'],
                    "precio_unitario" => $pr['precio'],
                    "cantidad" => $cant,
                    "en_oferta" => $pr['en_oferta']
                )
            );

        }

        $detalles = '';
        $subtotal = 0;
        foreach ($items as $item) {
            $number = $item['cantidad'] * $item['precio_unitario'];
            $subtotal = number_format((float)$number, 2, '.', '');
            $detalles = $detalles . '<tr><td style="text-align:left">' . $item['nombre'] . '</td><td style="text-align:right">' . $item['precio_unitario'] . '</td><td style="text-align:right">' . $item['cantidad'] . '</td><td style="text-align:right">' . $subtotal . '</td></tr>';
        }

        $message = '<html><body><div style="font-family:Arial,sans-serif;font-size:15px;color:#006837; color:rgb(0,104,55);margin:0 auto; width:635px;">';
        $message .= '<div style="left:-14px; top:-7px; width:635px;/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cdeb8e+0,a5c956+100;Green+3D+%232 */
background: #cdeb8e; /* Old browsers */">';
//    $message .= '<div style="background-image: background-repeat:no-repeat; width:606px; height:176px;"><img src="http://arielcessario.com.ar/~arielces/animations/img/logo.png" alt="BayresNoProblem" title="BayresNoProblem" style="display:block" width="606" height="176"></div>';
        $message .= '<div style="text-align:center; padding30px; background-image: background-repeat:no-repeat; width:606px; height:176px;"><img style="width: 500px" src="https://res.cloudinary.com/ac-desarrollos/image/upload/v1486047383/logo_coxqsb.png" alt="BayresNoProblem" title="BayresNoProblem"></div>';
        $message .= '<div style="text-align:center;color:#fff;padding-bottom: 10px;">';
        $message .= '<div style="font-weight:bolder; color: black; padding-left: 30px; padding-right: 30px; font-size: 21px">Suc. Once (15-3049-8691) - Suc. Flores (15-6676-2685) - Suc. Almagro (15-3041-2252) - Suc. Liniers (15-6676-2716)</div>';
        $message .= '<div style="color:#000;background:#FFFFFF; background:rgba(255,255,255,1); margin: 40px 10px 0 10px; border-radius:12px; -moz-border-radius: 12px; -webkit-border-radius: 12px;padding-bottom: 35px;">';
        $message .= '<div style="font-weight:bold;text-align:center;font-size:1.5em; margin-top:10px;">Estimado ' . $this->user->nombre . '</div>';
        $message .= '<div style="margin-top:20px;text-align:center;">Gracias por comprar con nosotros.</div>';
        $message .= '<div style="text-align:center;">Abajo encontrara los detalles de la orden de compra.</div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Numero de Pedido: </label>' . $params->carrito_id . '</div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Datos del Pedido: </label><a href="http://arielcessario.com.ar/~arielces/bayres-new/#/agreement/' . $params->carrito_id . '">Ver Pedido</a></div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Fecha del Pedido: </label>' . $today . '</div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Contenido del Pedido:</label></div>';
        $message .= '<div style="color:black; margin:0 auto; padding:20px; border-radius:5px; -moz-border-radius:5px; -webkit-border-radius:5px; min-height: 200px; margin-top:5%;color:#fff;margin-left: 5px;margin-right: 5px; /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cdeb8e+0,a5c956+100;Green+3D+%232 */
background: gray; /* Old browsers */">';
        $message .= '<table style="font-size:13px;color:#fff;width:100%"><tr><th style="color:white; font-size:25px;text-align:left">Producto</th><th style="font-size:25px;text-align:right;color:white; ">Precio</th><th style="color:white; font-size:25px;text-align:right">Cantidad</th><th style="color:white; font-size:25px;text-align:right">Total</th></tr>';
        $message .= '' . $detalles . '';
        $message .= '</table></div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold; font-size:22px;">Subtotal: </label><span style="font-size:20px; color:#006837;">$' . number_format((float)$total, 2, '.', '') . '</span></div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold; font-size:22px;">Total: </label><span style="font-size:20px; color:#006837;">$' . number_format((float)$total, 2, '.', '') . '</span></div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold; font-size:14px;">Metodos de pago: tarjetas de crédito, transferencia bancaria, deposito bancario, pago fácil, rapi pago, mercado pago.</label></div>';
        $message .= '<div style="border-radius:5px; -moz-border-radius:5px; -webkit-border-radius:5px; margin-top:5%;color:#fff;margin-left: 5px;margin-right: 5px; color: black; /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cdeb8e+0,a5c956+100;Green+3D+%232 */
background: gray; /* Old browsers */">';
        $message .= '<div style="background-color:black; color:white; font-size:18px; padding: 5px; font-weight:bold;">Envio/Retiro</div>';
        $message .= '<div style="font-size:16px; color:white; font-weight:bolder; margin-left:10px; margin-top: 20px">' . $this->user->nombre . '</div>';
//        $message .= '<div style="font-size:16px; color:white; margin-left:10px;">' . $this->user->calle . ' ' . $this->user->nro . '</div>';
        $message .= '<div style="font-size:16px; color:white; margin:0 0 10px 10px;">' . $params->envio . '</div>';
//        $message .= '<div style="font-weight: bolder; color:white; font-size:16px; margin:0 0 10px 10px;">Tipo Envio: ' . $params->origen . '</div>';
//        $message .= '<div style="font-weight: bolder; color:white; padding-bottom:20px; font-size:16px; margin:0 0 10px 10px;">Lugar de Envio: ' . $params->destino . '</div>';
        $message .= '</div><div style="font-size: 20px; text-align:center;font-weight: bold;">Gracias por su compra</div></div></div>';
        $message .= '</table>';
        $message .= '</div></body></html>';

        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
        $mail->Password = 'ventas0_*020ventas';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        $mail->From = 'bayresnoproblem@hotmail.com';
        //$mail->From = 'info@bayresnoproblem.com.ar'; //ESTE CORREO SOLO SE HABILITA EN PRODUCCION
        $mail->FromName = 'Bayres No Problem';
        $mail->addAddress($this->user->mail);     // Add a recipient
//        $mail->addAddress('arielcessario@gmail.com');     // Add a recipient
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = 'Detalle de Compra Nro ' . $params->carrito_id;
        $mail->Body = $message;
        //$mail->AltBody = "Nuevo Mail:" . $new_password;


             if (!$mail->send()) {
                $this->sendError($mail->ErrorInfo);
            } else {
                 $mailVendedor = $this->sendCarritoVendedor($items, $today, $this->user->mail, $this->user->nombre, $this->user->apellido, $params->envio, $params->carrito_id, $total);
                 if($mailVendedor == true){
                     $this->sendResponse('Mensaje Enviado');
                 }else{
                     $this->sendError($mailVendedor);
                 }
            }

    }

    /**
     * @param $email
     * @param $nombre
     * @param $carrito
     * @param $sucursal
     * @param $direccion
     */
    function sendCarritoVendedor($items, $today, $mail, $nombre, $apellido, $envio, $carrito_id, $total)
    {

        $detalles = '';
        $subtotal = 0;
        foreach ($items as $item) {
            $number = $item['cantidad'] * $item['precio_unitario'];
            $subtotal = number_format((float)$number, 2, '.', '');
            $detalles = $detalles . '<tr><td style="text-align:left">' . $item['nombre'] . '</td><td style="text-align:right">' . $item['precio_unitario'] . '</td><td style="text-align:right">' . $item['cantidad'] . '</td><td style="text-align:right">' . $subtotal . '</td></tr>';
        }

        $message = '<html><body><div style="font-family:Arial,sans-serif;font-size:15px;color:#006837; color:rgb(0,104,55);margin:0 auto; width:635px;">';
        $message .= '<div style="background:#006837; background:rgba(0,104,55,1); border-style:Solid; border-color:#000000; border-color:rgba(0, 0, 0, 1); border-width:1px; left:-14px; top:-7px; width:635px; ">';
        $message .= '<div style="background-image: background-repeat:no-repeat; width:606px; height:176px;"><img src="http://192.185.67.199/~arielces/animations/img/logo.png"></div>';
        $message .= '<div style="color:#000;background:#FFFFFF; background:rgba(255,255,255,1); border-style:Solid; border-color:#000000; border-color:rgba(0,0,0,1); border-width:1px; margin: 40px 10px 30px 10px; border-radius:12px; -moz-border-radius: 12px; -webkit-border-radius: 12px;padding-bottom: 35px;">';
        $message .= '<div style="font-weight:bold;text-align:center;font-size:1.5em; margin-top:10px;"> Cliente ' . $nombre . '</div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Numero de Pedido: </label>' . $carrito_id . '</div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Fecha del Pedido: </label>' . $today . '</div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold">Contenido del Pedido:</label></div>';
        $message .= '<div style="background:#006837; background:rgba(0,104,55,1); margin:0 auto; padding:10px; border-radius:12px; -moz-border-radius:12px; -webkit-border-radius:12px; min-height: 200px; margin-top:5%;color:#fff;margin-left: 5px;margin-right: 5px;">';
        $message .= '<table style="font-size:12px;color:#fff;width:100%"><tr><th style="font-size:14px;text-align:left">Producto</th><th style="font-size:14px;text-align:right">Precio</th><th style="font-size:14px;text-align:right">Cantidad</th><th style="font-size:14px;text-align:right">Total</th></tr>';
        $message .= '' . $detalles . '';
        $message .= '</table></div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold; font-size:22px;">Subtotal: $</label><span style="font-size:20px; color:#006837;">' . number_format((float)$total, 2, '.', '') . '</span></div>';
        $message .= '<div style="margin:20px 0 0 15px;"><label style="font-weight:bold; font-size:22px;">Total: $</label><span style="font-size:20px; color:#006837;">' . number_format((float)$total, 2, '.', '') . '</span></div>';
        $message .= '<div style="background:#006837; background:rgba(0,104,55,1); padding:10px; border-radius:12px; -moz-border-radius:12px; -webkit-border-radius:12px; margin-top:5%;color:#fff;margin-left: 5px;margin-right: 5px;">';
        $message .= '<div style="font-size:18px; font-weight:bold; margin:10px 0 0 10px;">Direccion de Envio:</div>';
        $message .= '<div style="font-size:16px; margin-left:10px;">' . $nombre . ' ' . $apellido . '</div>';
        $message .= '<div style="font-size:16px; margin-left:10px;">' . $mail . '</div>';
        $message .= '<div style="font-size:16px; margin-left:10px;">' . $envio . '</div>';
//        $message .= '<div style="font-size:16px; margin:0 0 10px 10px;">' . $sucursal . '</div>';
//        $message .= '<div style="font-size:16px; margin:0 0 10px 10px;">Tipo Envio: ' . $tipoEnvio . '</div>';
//        $message .= '<div style="font-size:16px; margin:0 0 10px 10px;">Lugar de Envio: ' . $lugarDeEnvio . '</div>';
        $message .= '</div></div></div>';
        $message .= '</table>';
        $message .= '</div></body></html>';

        $mail = new PHPMailer;
        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'gator4184.hostgator.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = 'ventas@ac-desarrollos.com';                 // SMTP username
        $mail->Password = 'ventas0_*020ventas';                           // SMTP password
        $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        $mail->From = 'bayresnoproblem@hotmail.com';
        //$mail->From = 'info@bayresnoproblem.com.ar'; //ESTE CORREO SOLO SE HABILITA EN PRODUCCION
        $mail->FromName = 'Bayres No Problem';
        $mail->addAddress('arielcessario@gmail.com');     // Add a recipient
//        $mail->addAddress('arielcessario@gmail.com');     // Add a recipient
        $mail->isHTML(true);    // Name is optional

        $mail->Subject = 'Detalle de Compra Nro ' . $carrito_id . ' - Cliente ' . $nombre;
        $mail->Body = $message;

        if (!$mail->send()) {
            return $mail->ErrorInfo;
        } else {
            return true;
        }
    }


}