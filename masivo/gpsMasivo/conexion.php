<?php



$host = "10.118.144.7";
$usuario= "root";
$contraseña = "Stech@306..,";
$puerto = "3306";
$database = "gpsimple";

try {
   $conexion = new PDO("mysql:host=$host;port=$puerto;dbname=$database", $usuario, $contraseña);
   $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//    $conexion->exec("set names utf8");
    // echo "BD conectada";

    return$conexion;
    }
catch(PDOException $error)
    {
    echo "No se pudo conectar a la BD: " . $error->getMessage();
    }

?>