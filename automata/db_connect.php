<?php
$uid = "root";
$pwd = "Stech3162..,";
$host = "localhost";
$base = "gpsimple";
try {

      $conn = new PDO( "mysql:host=$host;dbname=$base", $uid, $pwd); 
      $conn->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION ); 
   }
   catch( PDOException $e ) {
      die( "Error al conectar con la base de datos" ); 
   }
?>
