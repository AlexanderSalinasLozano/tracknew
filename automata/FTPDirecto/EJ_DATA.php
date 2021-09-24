<?php
include 'db_connect.php';

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


        $cadena =  date("d-m-Y H:i:s",strtotime(date('d-m-Y H:i:s',(strtotime("-1 hours"))))).';'.$imei.';'.$horaFecha.';'.$latitud.';'.$longitud.';'.$altitud.';'.$angulo.';'.$velocidad.';'.$parametros;
        fwrite($file, $cadena . PHP_EOL);
}
fclose($file);



$ftp_server="198.41.33.80"; 
$ftp_user_name="Data_gpwhere@stech.cl"; 
$ftp_user_pass="aShZ74y3"; 
$file = "C:/inetpub/wwwroot/track/automata/data.csv"; 
$remote_file = "data.csv"; 

// set up basic connection 

$conn_id = ftp_connect($ftp_server); 
//echo $conn_id
// login with username and password 

$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass); 

//echo $login_result;

//borra archivo del dia anterior

if (ftp_delete($conn_id, $remote_file)) {
 echo "$remote_file se ha eliminado satisfactoriamente\n";
} else {
 echo "No se pudo eliminar $remote_file\n";
}

// upload a file 

echo "conn_id = ".$conn_id;
echo "remote_file = ".$remote_file;
echo "file = ".$file;

if (ftp_put($conn_id, $remote_file, $file, FTP_ASCII)) { 
    echo "successfully uploaded $remote_file\n"; 
    exit; 
 } else { 
    echo "There was a problem while uploading $remote_file\n"; 
    exit; 
    } 

// close the connection 

ftp_close($conn_id); 

?>







