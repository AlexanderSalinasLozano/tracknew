<?php
include 'db_connect.php';
ini_set("date.timezone", "America/Santiago");
set_time_limit(0); 
$query = "CALL st_Ej_ObtieneObjData()"; 
$stmt = $conn->query( $query ); 

$file = fopen("Z:/data.csv", "w+");

echo $file;

while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
        
		$imei = $row[imei];
        $horaFecha = $row[horaFecha];
        $latitud = $row[latitud];
        $longitud = $row[longitud];
        $altitud = $row[altitud];
        $angulo = $row[angulo];
        $velocidad = $row[velocidad];
        $parametros = $row[parametros];


        $cadena =  date("d-m-Y H:i:s",strtotime(date('d-m-Y H:i:s',(strtotime("-0 hours"))))).';'.$imei.';'.$horaFecha.';'.$latitud.';'.$longitud.';'.$altitud.';'.$angulo.';'.$velocidad.';'.$parametros;
		//echo $cadena;
        fwrite($file, $cadena . PHP_EOL);
}
fclose($file);

//$fichero = 'C:/paso/data.csv';
//$nuevo_fichero = 'Z:/data.csv';

//copy($fichero, $nuevo_fichero);

?>







