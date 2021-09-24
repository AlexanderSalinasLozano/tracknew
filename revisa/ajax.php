<?php 

include "/var/www/html/valida/db_connect2.php";
global $query;
/*
$query2 = "select gs_objects.dt_server,gs_object_custom_fields.value from gs_objects, gs_object_custom_fields where gs_objects.imei = '864244027621241' and gs_object_custom_fields.imei =  gs_objects.imei and gs_object_custom_fields.name like '%eñal' LIMIT 1";

echo $query2;
echo "<br/>";


$stmt2 = $conn2->query( $query2 );
*/

/*
 while ( $row2 = $stmt2->fetch( PDO::FETCH_ASSOC ) ){
   $dt_tracker = $row2[dt_server];
   $value = $row2[value];


echo  $dt_tracker;

}
    
 print_r($conn2->errorInfo());
*/


$query = "select dt_server,value 
	  from gs_objects, gs_object_custom_fields 
	  where gs_objects.imei = '864244027621241' 
	  and gs_object_custom_fields.imei = gs_objects.imei
	 and gs_object_custom_fields.name like '%e%al'";

//$query = "select 1 as 'dt_server', 2 as 'value' from gs_object_custom_fields limit 1";

if ($stmt = $con->prepare($query)) {
    $stmt->execute();
    $stmt->bind_result($dt_server, $value);
    while ($stmt->fetch()) {
	echo "entra al while";
        printf("%s, %s\n", $dt_server, $value);
    }
    $stmt->close();
}

echo "HOLA";
?>
