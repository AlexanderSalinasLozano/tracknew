<?php
include 'db_connect.php';

$query = "CALL borraVelocidades(190)"; 
$stmt = $conn->query( $query ); 
?>







