<?php

require_once './includes/utils/enums.php';
require_once './secret/permissions.php';

require_once './secret/keys.php';
require_once "./includes/jwt_helper.php";
require_once "./includes/BeforeValidException.php";
require_once "./includes/ExpiredException.php";
require_once "./includes/SignatureInvalidException.php";
require_once './includes/MyDBi.php';

\Firebase\JWT\JWT::$leeway = 600;


// Carpeta de imágenes
$image_path = "../../../../bayresnoproblem.com.ar/images/";
// Nivel de compresión de las imágenes
$compression_level = 20;


/* @name: checkSecurity
 * @param
 * @description: Verifica las credenciales enviadas. En caso de no ser correctas, retorna el error correspondiente.
 */
function checkSecurity()
{
    $requestHeaders = apache_request_headers();
    $authorizationHeader = null;
    if (isset($requestHeaders['authorization'])) {
        $requestHeaders['Authorization'] = $requestHeaders['authorization'];
    }
    if (isset($requestHeaders['Authorization'])) {
        $authorizationHeader = $requestHeaders['Authorization'];
    }


    if ($authorizationHeader == null) {
        header('HTTP/1.0 401 Unauthorized');
        echo "No authorization header sent";
        exit();
    }

    // // validate the token
    $pre_token = str_replace('Bearer ', '', $authorizationHeader);
    $token = str_replace('"', '', $pre_token);
    global $secret;
    global $decoded_token;
    try {

        $decoded_token = \Firebase\JWT\JWT::decode($token, $secret, array('HS256'));
    } catch (UnexpectedValueException $ex) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }


    global $serverName;

    // // validate that this token was made for us
    if ($decoded_token->aud != $serverName) {
        header('HTTP/1.0 401 Unauthorized');
        echo "Invalid token";
        exit();
    }

}

/**
 * @description Valida que el rol del usuario sea el correcto
 * @param $requerido
 */
function validateRol($requerido)
{

    global $jwt_enabled;
    if ($jwt_enabled == false) {
        return;
    }

    $requestHeaders = apache_request_headers();

    $authorizationHeader = null;
    if (isset($requestHeaders['authorization'])) {
        $requestHeaders['Authorization'] = $requestHeaders['authorization'];
    }
    if (isset($requestHeaders['Authorization'])) {
        $authorizationHeader = $requestHeaders['Authorization'];
    }


    if ($authorizationHeader == null) {
        header(HttpStatusTypes::Unauthorized);
        echo "No authorization header sent";
        throw new Exception('No authorization header sent');
        exit();
    }

    // // validate the token
    $pre_token = str_replace('Bearer ', '', $authorizationHeader);
    $token = str_replace('"', '', $pre_token);
    global $secret;
    global $decoded_token;
    $decoded_token = \Firebase\JWT\JWT::decode($token, $secret, array('HS256'));

    $rol = $decoded_token->data->rol;
    if ($rol > $requerido) {
        header(HttpStatusTypes::Unauthorized);
        echo "Unauthorized";
        throw new Exception('Unauthorized');
        exit();
    }


}

/**
 * @description Valida que el rol del usuario sea el correcto
 * @param $requerido
 */
function getUserInfo()
{
    try{
        $requestHeaders = apache_request_headers();
//    $authorizationHeader = isset($requestHeaders['Authorization']) ? $requestHeaders['Authorization'] : null;
        $authorizationHeader = null;
        if (isset($requestHeaders['authorization'])) {
            $requestHeaders['Authorization'] = $requestHeaders['authorization'];
        }
        if (isset($requestHeaders['Authorization'])) {
            $authorizationHeader = $requestHeaders['Authorization'];
        }

        if ($authorizationHeader == null) {
            return null;
        }

        $pre_token = str_replace('Bearer ', '', $authorizationHeader);
        $token = str_replace('"', '', $pre_token);
        global $secret;
        global $decoded_token;
        $decoded_token = \Firebase\JWT\JWT::decode($token, $secret, array('HS256'));

        return [$decoded_token->data, null];
    } catch (Exception $e) {
        return [null, $e];
    }

}


function sendResponse($respuesta, $err = '')
{
//    header('X-Token-Expired', false);
    header(HttpStatusTypes::Ok . $err);
    echo json_encode($respuesta);
}

function sendError($err)
{
    header(HttpStatusTypes::InternalServerError);
    echo json_encode($err);
    writeLog($err);
}

function writeLog($e)
{
    $file = '../../../error.log';
    $current = file_get_contents($file);
    $current .= date('Y-m-d H:i:s') . ": " . $e . "\n";
    file_put_contents($file, $current);
}


class Main
{
    public $db;
    public $valor;
    public $params;

    public $loginStatus;
    public $user;
    public $err;

    protected function __construct($class, $prm, $fnc)
    {

        try {

            $this->params = $prm;

            $permissions = new Permissions();

            if ($permissions->getPermission($class, $fnc) > PermissionTypes::Allowed) {
                checkSecurity();
                validateRol($permissions->getPermission($class, $fnc));
            }
            $this->checkUserStatus();


            $dbConnect = new DBConnect();
            $this->db = new MysqliDb ($dbConnect->getServer(), $dbConnect->getUser(), $dbConnect->getPass(), $dbConnect->getSchema());

            $this->valor = $this->db;
        } catch (Exception $e) {
            $this->sendError($e->getMessage());
        }

    }


    public function sendResponse($respuesta)
    {
        sendResponse($respuesta, $this->err);
    }

    public function sendError($err)
    {
        $trace = debug_backtrace();
        $str = $trace[1]['class'] . "->" . $trace[1]['function'] . " - " . $err;
        sendError($str);
    }

    public function writeErrorFront($err)
    {

    }

    public function decode($jwt, $key, $alg = array('HS256'))
    {
        return \Firebase\JWT\JWT::decode($jwt, $key, $alg);

    }

    public function encode($data, $secret)
    {
        return \Firebase\JWT\JWT::encode($data, $secret);

    }

    public function checkUserStatus(){

        $resp = getUserInfo();
        $this->user = $resp[0];
        $err = $resp[1];

        if($err){
            $tmp = $err->getMessage();
            $this->err = ' - ' . $tmp;
            //$this->err = $err->message;
        }
    }

}