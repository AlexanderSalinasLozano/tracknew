<?php

include 'db_connect.php';

ini_set("date.timezone", "America/Santiago");

$query = "CALL st_Ej_ObtieneDTC()"; 
$stmt = $conn->query( $query ); 

$file = fopen("Z:/dtc.csv", "w+");


while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
        $imei = $row[imei];
        $horaFecha = $row[horaFecha];
        $latitud = $row[Latitud];
        $longitud = $row[Longitud];
        $Direccion = $row[Direccion];
        $TipoError = $row[TipoError];
        $CodigoDTC = $row[CodigoDTC];
        $descripcion = $row[descripcion];


        $cadena =  date("d-m-Y H:i:s",strtotime(date('d-m-Y H:i:s',(strtotime("-0 hours"))))).';'.$imei.';'.$horaFecha.';'.$latitud.';'.$longitud.';'.$Direccion.';'.$TipoError.';'.$CodigoDTC.';'.$descripcion;
        fwrite($file, $cadena . PHP_EOL);
}
fclose($file);




?>







