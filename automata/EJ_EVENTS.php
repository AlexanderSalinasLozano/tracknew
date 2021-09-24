<?php
include 'db_connect.php';
ini_set("date.timezone", "America/Santiago");
$query = "CALL st_Ej_ObtieneDatosEventos()"; 
$stmt = $conn->query( $query ); 

$file = fopen("Z:/events.csv", "w+");


while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
        $imei = $row[imei];
        $type = $row[type];
        $event_desc = $row[event_desc];
        $horaFecha = $row[horaFecha];
        $Latitud = $row[Latitud];
        $Longitud = $row[Longitud];
        $Altitud = $row[Altitud];
        $Velocidad = $row[Velocidad];
		$Parametros = $row[Parametros];


        $cadena =  date("d-m-Y H:i:s",strtotime(date('d-m-Y H:i:s',(strtotime("-0 hours"))))).';'.$imei.';'.$type.';'.$event_desc.';'.$horaFecha.';'.$Latitud.';'.$Longitud.';'.$Altitud.';'.$Velocidad.';'.$Parametros;
        fwrite($file, $cadena . PHP_EOL);
}
fclose($file);





?>







