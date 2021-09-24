<?php
include 'db_connect.php';
ini_set("date.timezone", "America/Santiago");
$query = "CALL st_Ej_ObtieneObjetosInactivos()"; 
$stmt = $conn->query( $query ); 

$file = fopen("Z:/objects_inac.csv", "w+");


while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
        $imei = $row[imei];
        $name = $row[placa];
		$value = $row[customfield];
        $equipo = $row[equipo];
		$grupo = $row[nombreGrupo];
        

        $cadena =  date("d-m-Y H:i:s",strtotime(date('d-m-Y H:i:s',(strtotime("-0 hours"))))).';'.$imei.';'.$name.';'.$value.';'.$equipo.';'.$grupo;
        fwrite($file, $cadena . PHP_EOL);
}
fclose($file);


?>







