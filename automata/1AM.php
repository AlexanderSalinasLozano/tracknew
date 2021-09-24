<?php
include 'db_connect.php';
ini_set("date.timezone", "America/Santiago");
$query = "CALL st_Ej_ObtieneObjData()"; 
$stmt = $conn->query( $query ); 

$file = fopen("C:/inetpub/wwwroot/track/automata/data.csv", "w+");


while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
        $imei = $row[imei];
        $horaFecha = $row[horaFecha];
        $latitud = $row[latitud];
        $longitud = $row[longitud];
        $altitud = $row[altitud];
        $angulo = $row[angulo];
        $velocidad = $row[velocidad];
        $parametros = $row[parametros];


        $cadena =  date("d-m-Y H:i:s",strtotime(date('d-m-Y H:i:s'))).';'.';'.$imei.';'.$horaFecha.';'.$latitud.';'.$longitud.';'.$altitud.';'.$angulo.';'.$velocidad.';'.$parametros;
        fwrite($file, $cadena . PHP_EOL);
}
fclose($file);




/*
$ftp_server="198.41.33.80"; 
$ftp_user_name="Data_gpwhere@stech.cl"; 
$ftp_user_pass="aShZ74y3"; 
$file = "/integra/gpwhere.csv"; 
$remote_file = "gpwhere.csv"; 
*/
// set up basic connection 
/*
$conn_id = ftp_connect($ftp_server); 
*/
// login with username and password 
/*
$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass); 
*/
//borra archivo del dia anterior
/*
if (ftp_delete($conn_id, $remote_file)) {
 echo "$file se ha eliminado satisfactoriamente\n";
} else {
 echo "No se pudo eliminar $file\n";
}
*/
// upload a file 
/*
if (ftp_put($conn_id, $remote_file, $file, FTP_ASCII)) { 
    echo "successfully uploaded $file\n"; 
    exit; 
 } else { 
    echo "There was a problem while uploading $file\n"; 
    exit; 
    } 
*/
// close the connection 
/*
ftp_close($conn_id); 
*/
?>







