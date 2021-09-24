<?php
	$hoy=date("Y-m-d");
	
	echo '=====================Iniciando Proceso de mails en fecha: '.$hoy."===================\n";
	

	
	$curl = curl_init();

	curl_setopt_array($curl, array(
	CURLOPT_URL => 'https://www.gpsimple.cl/track/server/s_service.php?op=service_1h',
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => '',
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 0,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => 'GET',
	CURLOPT_POSTFIELDS =>'{
		"op":"service_1h"
	}',
	CURLOPT_HTTPHEADER => array(
		'Content-Type: application/json'
	),
	));

	$response = curl_exec($curl);

	curl_close($curl);
	echo $response;
	echo("\n===================Terminado=========================");
		
?>
