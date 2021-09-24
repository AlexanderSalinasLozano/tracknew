<?php
$uid = "stech";
$pwd = "Stech#306..,";
$host = "10.118.144.7";

$base = "gpsimple";
try {

      $conn = new PDO( "mysql:host=$host;dbname=$base", $uid, $pwd); 
      $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
   }
   catch( PDOException $e ) {
      die( "Error al conectar con la base de datos" ); 
   }
?>
