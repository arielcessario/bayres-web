<?php

// JWT Secret Key
// false local / true production
$jwt_enabled = true;
//$secret = base64_encode('asdfwearsadfasdareasdfaeasdfaefawasadf');
$secret = ';-j}gaM#%mufc4Fp-49aG*2WSGCwQ:#MNSgFeY{f[.CwUbeg@p';
// JWT Secret Key Social
$secret_social = 'LUc_cGQHgmKZyFd5ozKJHnujpam1JKb06FWnjjtnWH9htNKDEQFGNMHYUvX_6PgR';
// JWT AUD
$serverName = 'bayresnoproblem.com.ar';
// DB

class DBConnect{

private $db_server = 'localhost';
private $db_pass = 'concentrador';
private $db_schema = 'arielces_bayres';
private $db_user = 'root';

    public function getServer(){
        return $this->db_server;
    }
    public function getPass(){
        return $this->db_pass;
    }
    public function getSchema(){
        return $this->db_schema;
    }
    public function getUser(){
        return $this->db_user;
    }
}