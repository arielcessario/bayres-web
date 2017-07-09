<?php

class Sucursales extends Main{
    public function __construct($fnc, $prm, $req){
        parent::__construct(get_class($this), $prm, $fnc);
        $this->$fnc();
    }


    /////// GET ////////
    /**
     * @description Obtiene las sucursales
     */
    function get()
    {
        if(!$this->params->all){
            $this->db->where('nombre <> "Deposito"');
        }
        $results = $this->db->get('sucursales');
        $this->sendResponse($results);
    }
}