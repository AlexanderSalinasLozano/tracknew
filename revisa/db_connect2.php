<?php

$host="35.238.243.177";
$port=3306;
$socket="";
$user="stech";
$password="Stech#306..,";
$dbname="gpsimple";

$con = new mysqli($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server' . mysqli_connect_error());

//$con->close();

?>
