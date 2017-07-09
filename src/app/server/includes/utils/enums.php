<?php

abstract class PermissionTypes
{
    const Allowed = -1;
    const Admin = 0;
    const User = 1;
    const Provider = 2;
    const Client = 3;
    const Wholesaler = 4;
}

abstract class HttpStatusTypes
{
    const Ok = "HTTP/1.0 200 Ok";
    const Unauthorized = "HTTP/1.0 401 Unauthorized";
    const InternalServerError = "HTTP/1.0 500 Internal Server Error";
}