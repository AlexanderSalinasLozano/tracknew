<?php
error_reporting(E_ALL ^ E_NOTICE);
include 'dbconnect.php';

$user = $_GET['user'];
$password = $_GET['password']; 
$apikey = $_GET['apiKey'];
$email = $_GET['email'];

/*$apikey = '1559C5027D438BC3EC552AE32A14E7EA';
$email = 'cristianortizb@yahoo.com';
*/
$query = "SELECT user, password  from st_user_proveedor
          where user = ".$user;
         
$stmt = $conn->query($query); 
while ( $row = $stmt->fetch( PDO::FETCH_ASSOC ) ){
    $userq = $row['user'];
    $passwordq = $row['password'];
}

IF ($password == $passwordq)
{

    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => "http://10.128.0.11:8080/track/api/api.php?api=server&key=".$apikey."&ver=1.0&cmd=ADD_USER,".$email."",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    //echo $response;


    $curl = curl_init();

    curl_setopt_array($curl, array(
    CURLOPT_URL => "http://10.128.0.11:8080/track/api/api.php?api=server&key=".$apikey."&ver=1.0&cmd=CHECK_USER_EXISTS,".$email."",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    ));

    $response = curl_exec($curl);

    curl_close($curl);
}else{
    $response = 'false';
}
echo $response;

?>