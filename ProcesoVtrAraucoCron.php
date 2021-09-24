<?php
	$hoy=date("Y-m-d");
	echo $hoy;
	echo "===================Reproceso VTR============================\n";
	set_time_limit(0);
	$ayer = date("Y-m-d",strtotime($hoy."- 1 days"));
	$finicio=$ayer.' 00:00:00';
	$ffinal=$ayer.' 23:59:59';
	echo 'iniciando reproceso vtr en fecha desde : '.$finicio.' hasta '.$ffinal.".\n";
	
	$mysqli = new mysqli('10.118.144.7', 'stech', 'Stech#306..,', 'gpsimple');
	$q  = "select gs_objects.imei from gs_objects, gs_user_objects where gs_objects.imei = gs_user_objects.imei and gs_user_objects.user_id = 691";
	
	$r = mysqli_query($mysqli, $q);
	$ct = 1;
	while($row = mysqli_fetch_row($r)){

		echo ('proceso #'.$ct.'-'); 

		$imei = $row[0];
        echo('Imei: '.$imei."-\n");
		// echo $imei;
        $q2="CALL gpsimple.vtr('".$imei."','".$finicio."','".$ffinal."')";
		// $q2  = "select dt_tracker,lat,lng from gs_object_data_".$imei." where date(dt_tracker) between '".$finicio."' and '".$ffinal."' and speed > 11";
		$r2 = mysqli_query($mysqli, $q2);
		
        if ($r2==true) {
            echo ('proceso #'.$ct."- Terminado\n"); 
        }
		
		
		echo("pasando al siguiente...\n");
	$ct = $ct + 1;
	}
echo 'Proceso Completado';
?>
