<?php


$host="10.118.144.7";
$port=3306;
$socket="";
$user="stech";
$password="Stech#306..,";
$dbname="gpsimple";

$conn = mysqli_connect($host, $user, $password, $dbname, $port, $socket)
    or die ('Could not connect to the database server '. mysqli_connect_error());
    

?> 
