<?php
	set_time_limit(0);
	echo 'inicio';
	echo '<br>';
	$mysqli = new mysqli('10.118.144.7', 'stech', 'Stech#306..,', 'gpsimple');
	$q  = "select gs_objects.imei from gs_objects, gs_user_objects where gs_objects.imei = gs_user_objects.imei and gs_user_objects.user_id = 211";
	
	$r = mysqli_query($mysqli, $q);
$ct = 1;
	while($row = mysqli_fetch_row($r)){

		
		$imei = $row[0];
        echo('comenzando...');
		echo $imei;

		$q2  = "select dt_tracker,lat,lng from gs_object_data_".$imei." where date(dt_tracker) between '2021-06-30 00:00:00' and '2021-07-05 23:59:59' and speed > 11";
		$r2 = mysqli_query($mysqli, $q2);
		
		echo $ct; 
		echo '</br>';
		while($row2 = mysqli_fetch_row($r2)){

			echo('comenzando api maxspeed...');
			echo $imei;

				$dt_tracker = $row2[0];
				$lat 		= $row2[1];
				$lng 		= $row2[2];

				
				

				// $url = 'http://10.128.0.16/api/interpreter?data=[out:json];way(around:10.0,'.$lat.','.$lng.');out;';
				$url = 'http://10.128.15.197/api/interpreter?data=[out:json];way(around:05.0,'.$lat.','.$lng.');out;';
				$data = @file_get_contents($url);
				$jsondata = json_decode($data,true);
				$result4 = 0;
				for($i = 0; $i < 16; $i++){
    					if (isset($jsondata['elements'][$i]['tags']['maxspeed']))
    					{
        					$result4 = $jsondata['elements'][$i]['tags']['maxspeed'];
        					break;
    					}
				}
				$result2 = json_encode($result4);
				$result2 = str_replace('"','',$result2);

				$upd =	"update gs_object_data_".$imei.
					" set overpass = ".$result2.
					" where dt_tracker='".$dt_tracker.
					"' and lat=".$lat.
					" and lng=".$lng;

				$rowUpd = mysqli_query($mysqli, $upd);
				//echo date($dt_tracker).' '.$imei.'';
				echo('terminando api para: '.$imei);
		}
		echo("pasando al siguiente...");
	$ct = $ct + 1;
	}
echo 'fin';
?>
