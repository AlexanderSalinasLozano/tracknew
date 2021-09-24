<?php
	set_time_limit(0);
	echo 'inicio';
	$mysqli = new mysqli('10.118.144.7', 'stech', 'Stech#306..,', 'gpsimple');
	$q  = "select imei from gs_objects where overpass = 1 and imei in 
	('4562417873')";
	$r = mysqli_query($mysqli, $q);

	while($row = mysqli_fetch_row($r)){
		$imei = $row[0];

		$q2  = "select dt_tracker,lat,lng from gs_object_data_".$imei." where date(dt_tracker) between '2020-11-01' and '2020-11-19' and speed > 59";
		$r2 = mysqli_query($mysqli, $q2);
 
		while($row2 = mysqli_fetch_row($r2)){
				$dt_tracker = $row2[0];
				$lat 		= $row2[1];
				$lng 		= $row2[2];

				echo date($dt_tracker);

				$url = 'http://10.128.0.16/api/interpreter?data=[out:json];way(around:100.0,'.$lat.','.$lng.');out;';
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
		}
		
	}
echo 'fin';
?>
