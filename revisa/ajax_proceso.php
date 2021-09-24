
<?php 
include "/var/www/html/valida/db_connect.php";

//$resultado = $_POST['valorCaja1'] + $_POST['valorCaja2']; 


if($_POST['valorCaja1']<>'')
{    
//echo "entra1";    
$query = "select imei from gs_objects where plate_number ='".$_POST['valorCaja1']."' LIMIT 1"; 
    $stmt = $conn->query( $query ); 

    while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
        $imei = $row[imei];
    }
}

//if($_POST['valorCaja2']<>'')
//{    
//echo "entra 2";
//    $query = "select imei from gs_object_custom_fields where name = 'ID' and value = '".$_POST['valorCaja2']."' LIMIT 1"; 
//    $stmt = $conn->query( $query ); 

//    while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
//        $imei = $row[imei];
//	echo $imei;
//    }
//}

/* $query = "select dt_tracker from gs_objects where imei = '".$imei."'"; */
$query = "select gs_objects.dt_server,gs_object_custom_fields.value,gs_objects.lat, gs_objects.lng 
	   from gs_objects, gs_object_custom_fields where gs_objects.imei = '".$imei."' 
           and gs_object_custom_fields.imei =  gs_objects.imei and gs_object_custom_fields.name like '%e%al'";

/*
$query2 = mysqli_query($con,$query);
while ($row2 = mysqli_fetch_array($query2)) {
	echo row2[dt_server]; 
}
*/
/*if ($stmt = $con->prepare($query)) {
    $stmt->execute();
    $stmt->bind_result($dt_server, $value);
    while ($stmt->fetch()) {
       // printf("%s, %s\n", $dt_server, $value);
	echo  $dt_server;
    }
    $stmt->close();
}
*/




$stmt = $conn->query( $query );
 while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
   $dt_tracker = $row[dt_server];
  $value = $row[value];
  $lat =  $row[lat];
  $lng =  $row[lng];
}
    
$hoy = date("Y-m-d");

if (substr($dt_tracker,0,10) == $hoy)
{
	
	$d = new DateTime( $dt_tracker );
	$d->modify( '-3 hours' ); //restas 4 horas
	//echo $d->format( 'Y-m-d H:i:s' ); //mostras
	
    $resultado = 'Instalacion OK <br/> Fecha reporte '.$d->format( 'Y-m-d H:i:s' );
$link = 'https://api.mapbox.com/v4/mapbox.streets/pin-m-circle+285A98('.$lng.','.$lat.')/'.$lng.','.$lat.',15/300x300@2x.png?access_token=pk.eyJ1Ijoic3RlY2giLCJhIjoiY2oybHQxbDByMDBpYTMycXdrejU5cjRoaiJ9.09Xc9XQp9PB2qR4ML3-m4g';

//echo "<img src =".$link.">"; 

}
else
{
    $resultado = 'Instalacion Erronea';
}


echo $resultado;
echo "<br/><br/><center><img src =".$link."></center>";

?>
