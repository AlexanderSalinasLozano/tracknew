<?php

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

$contents = ftp_nlist($conn_id, ".");
var_dump($contents);


ftp_close($conn_id); 

?>