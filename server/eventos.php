
<?php
//Overspeed dinamico
function overspeedDinamico($ed,$ud,$od,$loc)
{
	
	global $ms;

	// var_dump("aqui evento");

	$fechaGpies = $loc['dt_tracker'];
	$id_evento = $ed['event_id'];
	$imei_evento = $loc['imei'];
	$speedstreet = $loc['overpass'];

	$speed = $loc['speed'];
	// get user speed unit and convert if needed
	$units = explode(",", $ud['units']);
	$speed = convSpeedUnits($speed, 'km', $units[0]);

    $speedstreet = $speedstreet + 10;

	// var_dump($speed);


	if ($speed > $speedstreet)
	{
	//SI LA VELOCIDAD ES MAYOR SE INSERTAR LA FECHA DEL GPS CUANDO EXCEDIO VELOCIDAD.
		if (get_event_status($ed['event_id'], $loc['imei']) == -1)
		{
			set_event_status($ed['event_id'], $loc['imei'], '1');
			// add event desc to event data array
			$ed['event_desc'] = $ed['name'];

		    event_notify($ed,$ud,$od,$loc);
		}
	}
	else
	{

		if (get_event_status($ed['event_id'], $loc['imei']) != -1)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');
		}

		if(get_notificacion_enviada($ed['event_id'], $loc['imei']) == 1){

		  set_notificacion_enviada($ed['event_id'], $loc['imei'], '0');
		}
	}
}

function event_overspeedT($ed,$ud,$od,$loc)
{
	//VARIABLES PARA INSERTAR DT_SERVER EN GS_USER_EVENT_STATUS
	global $ms;

	$fechaGpies = $loc['dt_tracker'];
	$id_evento = $ed['event_id'];
	$imei_evento = $loc['imei'];

	$speed = $loc['speed'];
	// get user speed unit and convert if needed
	$units = explode(",", $ud['units']);
	$speed = convSpeedUnits($speed, 'km', $units[0]);


	if ($speed > $ed['checked_value'])
	{

	//SI LA VELOCIDAD ES MAYOR SE INSERTAR LA FECHA DEL GPS CUANDO EXCEDIO VELOCIDAD.
		if (get_event_status($ed['event_id'], $loc['imei']) == -1)
		{
			set_event_status($ed['event_id'], $loc['imei'], '1');
			// add event desc to event data array
			$ed['event_desc'] = $ed['name'];

			if($ed['duration_from_last_event'] == 'true')	
			{
				//GUARDA LA FECHA EN LA CUAL EXCEDIO LA VELOCIDAD
				$q = "UPDATE `gs_user_events_status` SET `dt_server`='".$fechaGpies."' WHERE `event_id`='".$id_evento."' AND `imei`='".$imei_evento."'";
				$r = mysqli_query($ms, $q);

			
			}
			else
			{
				event_notify($ed,$ud,$od,$loc);
				return;
			}
		}

				//CODIGO PARA QUE CUENTE CUANTOS MINUTOS LLEVA EL VEHICULO CON EXCESO DE VELOCIDAD
				$qery = "SELECT * FROM `gs_user_events_status` WHERE `event_id` ='".$id_evento."' AND `imei`='".$imei_evento."'";
				$result = mysqli_query($ms, $qery);
				$row = mysqli_fetch_array($result);
				// var_dump($row);
				if($row['dt_server'])
				{
					$diferencia = (strtotime($loc['dt_tracker'])) - (strtotime($row['dt_server']));
					$diferencia = ($diferencia / 60);
					$diferencia = round($diferencia);
					var_dump("lleva ".$diferencia. " minutos en exceso de velocidad");
					// var_dump($loc['dt_server']);
					// var_dump($loc['dt_tracker']);
				
					if($diferencia >= $ed['duration_from_last_event_minutes'])
					{
						if(get_notificacion_enviada($ed['event_id'], $loc['imei']) == 0){ 
						$ed['event_desc'] = $ed['name'];
						event_notify($ed,$ud,$od,$loc);
						set_notificacion_enviada($ed['event_id'], $loc['imei'], '1');
						}
					}

				}

	}
	else
	{
		
		if (get_event_status($ed['event_id'], $loc['imei']) != -1)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');
		}
		
		if(get_notificacion_enviada($ed['event_id'], $loc['imei']) == 1){

		  set_notificacion_enviada($ed['event_id'], $loc['imei'], '0');
		}
	}
}

function event_overspeed($ed,$ud,$od,$loc)
{
	//VARIABLES PARA INSERTAR DT_SERVER EN GS_USER_EVENT_STATUS
	global $ms;

	$fechaGpies = $loc['dt_tracker'];
	$id_evento = $ed['event_id'];
	$imei_evento = $loc['imei'];

	$speed = $loc['speed'];
	// get user speed unit and convert if needed
	$units = explode(",", $ud['units']);
	$speed = convSpeedUnits($speed, 'km', $units[0]);


	if ($speed > $ed['checked_value'])
	{

	//SI LA VELOCIDAD ES MAYOR SE INSERTAR LA FECHA DEL GPS CUANDO EXCEDIO VELOCIDAD.
		if (get_event_status($ed['event_id'], $loc['imei']) == -1)
		{
			set_event_status($ed['event_id'], $loc['imei'], '1');
			// add event desc to event data array
			$ed['event_desc'] = $ed['name'];

			if($ed['duration_from_last_event'] == 'true')	
			{
				//GUARDA LA FECHA EN LA CUAL EXCEDIO LA VELOCIDAD
				$q = "UPDATE `gs_user_events_status` SET `dt_server`='".$fechaGpies."' WHERE `event_id`='".$id_evento."' AND `imei`='".$imei_evento."'";
				$r = mysqli_query($ms, $q);

			
			}
			else
			{
				event_notify($ed,$ud,$od,$loc);
				return;
			}
		}

				//CODIGO PARA QUE CUENTE CUANTOS MINUTOS LLEVA EL VEHICULO CON EXCESO DE VELOCIDAD
				$qery = "SELECT * FROM `gs_user_events_status` WHERE `event_id` ='".$id_evento."' AND `imei`='".$imei_evento."'";
				$result = mysqli_query($ms, $qery);
				$row = mysqli_fetch_array($result);
				// var_dump($row);
				if($row['dt_server'])
				{
					$diferencia = (strtotime($loc['dt_tracker'])) - (strtotime($row['dt_server']));
					$diferencia = ($diferencia / 60);
					$diferencia = round($diferencia);
					var_dump("lleva ".$diferencia. " minutos en exceso de velocidad");
					// var_dump($loc['dt_server']);
					// var_dump($loc['dt_tracker']);
				
					if($diferencia >= $ed['duration_from_last_event_minutes'])
					{
						if(get_notificacion_enviada($ed['event_id'], $loc['imei']) == 0){ 
						$ed['event_desc'] = $ed['name'];
						event_notify($ed,$ud,$od,$loc);
						set_notificacion_enviada($ed['event_id'], $loc['imei'], '1');
						}
					}

				}

	}
	else
	{
		
		if (get_event_status($ed['event_id'], $loc['imei']) != -1)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');
		}
		
		if(get_notificacion_enviada($ed['event_id'], $loc['imei']) == 1){

		  set_notificacion_enviada($ed['event_id'], $loc['imei'], '0');
		}
	}
}
/* function event_overspeed($ed,$ud,$od,$loc)
	{
		$speed = $loc['speed'];

		// get user speed unit and convert if needed
		$units = explode(",", $ud['units']);
		$speed = convSpeedUnits($speed, 'km', $units[0]);

		if ($speed > $ed['checked_value'])
		{
			if (get_event_status($ed['event_id'], $loc['imei']) == -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '1');

				// add event desc to event data array
				$ed['event_desc'] = $ed['name'];
				event_notify($ed,$ud,$od,$loc);
			}
		}
		else
		{
			if (get_event_status($ed['event_id'], $loc['imei']) != -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '-1');
			}
		}
	}
	*/



function event_tracker($ed,$ud,$od,$loc)
	{
		$event_status = get_event_status($ed['event_id'], $loc['imei']);

		$ed['event_desc'] = $ed['name'];

		if ($ed['type'] == 'dtc')
		{
			$codes = str_replace("dtc:", "", $loc['event']);
			$codes = str_replace(",", ", ", $codes);
			$ed['event_desc'] .= ' ('.$codes.')';
		}

		event_notify($ed,$ud,$od,$loc);
	}

	function event_connection($ed,$ud,$od,$loc)
	{
		global $gsValues;

		if ($ed['type'] == 'connyes')
		{
			if(strtotime($loc['dt_server']) >= strtotime(gmdate("Y-m-d H:i:s")." - ".$gsValues['CONNECTION_TIMEOUT']." minutes"))
			{

				if (get_event_status($ed['event_id'], $loc['imei']) == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '1');
					// set dt_tracker to dt_server to show exact time
					$loc['dt_tracker'] = $loc['dt_server'];
					// add event desc to event data array
					$ed['event_desc'] = $ed['name'];
					event_notify($ed,$ud,$od,$loc);
				}
			}
			else
			{
				if (get_event_status($ed['event_id'], $loc['imei']) != -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '-1');
				}
			}
		}

		if ($ed['type'] == 'connno')
		{
			if(strtotime($loc['dt_server']) < strtotime(gmdate("Y-m-d H:i:s")." - ".$ed['checked_value']." minutes"))
			{
				if (get_event_status($ed['event_id'], $loc['imei']) == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '1');
					// set dt_tracker to dt_server to show exact time
					$loc['dt_tracker'] = $loc['dt_server'];
					// add event desc to event data array
					$ed['event_desc'] = $ed['name'];
					event_notify($ed,$ud,$od,$loc);
				}
			}
			else
			{
				if (get_event_status($ed['event_id'], $loc['imei']) != -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '-1');
				}
			}
		}
	}

	function event_gps($ed,$ud,$od,$loc)
	{
		if ($ed['type'] == 'gpsyes')
		{
			if ($loc['loc_valid'] == '1')
			{
				if (get_event_status($ed['event_id'], $loc['imei']) == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '1');
					// set dt_tracker to dt_server to show exact time
					$loc['dt_tracker'] = $loc['dt_server'];
					// add event desc to event data array
					$ed['event_desc'] = $ed['name'];
					event_notify($ed,$ud,$od,$loc);
				}
			}
			else
			{
				if (get_event_status($ed['event_id'], $loc['imei']) != -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '-1');
				}
			}
		}

		if ($ed['type'] == 'gpsno')
		{
			if (($loc['loc_valid'] == '0') && (strtotime($loc['dt_tracker']) < strtotime(gmdate("Y-m-d H:i:s")." - ".$ed['checked_value']." minutes")))
			{
				if (get_event_status($ed['event_id'], $loc['imei']) == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '1');
					// set dt_tracker to dt_server to show exact time
					$loc['dt_tracker'] = $loc['dt_server'];
					// add event desc to event data array
					$ed['event_desc'] = $ed['name'];
					event_notify($ed,$ud,$od,$loc);
				}
			}
			else
			{
				if (get_event_status($ed['event_id'], $loc['imei']) != -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], '-1');
				}
			}
		}
	}

	function event_stopped_moving_engidle($ed,$ud,$od,$loc)
	{ 

		// var_dump("----------------------TIPO EVENTO---------------------");
	    // var_dump($ed['type']); 
          
		$imei = $loc['imei'];
		// $loc1 = [];
       
        if ($ed['type'] == 'moving') {

			$conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

            $sql  = "select * from gs_objects where imei = '".$imei."'";

			$result2 = $conn->query($sql);
			$loc = $result2->fetch_assoc();

			// var_dump("------------------------LOC1------------------------");
			// var_dump($loc1);

				// while($row = $result2->fetch_assoc()) {
					
				// 	$loc['dt_last_stop'] = $row['dt_last_stop'];
				// 	$loc['dt_last_idle'] = $row['dt_last_idle'];
				// 	$loc['dt_last_move'] = $row['dt_last_move'];

				// }
		}

		     

		//    var_dump("----------------------DATOS GPS---------------------");
	    //    var_dump($loc); 

		if(!isset($loc['dt_last_stop']) || !isset($loc['dt_last_idle']) || !isset($loc['dt_last_move'])){
			var_dump("die");
			die;
			
		}

		$dt_last_stop = strtotime($loc['dt_last_stop']);
		$dt_last_idle = strtotime($loc['dt_last_idle']);
		$dt_last_move = strtotime($loc['dt_last_move']);

		if (($dt_last_stop > 0) || ($dt_last_move > 0))
		{
			if ($ed['type'] == 'stopped')
			{
				if (($dt_last_stop >= $dt_last_move) && (strtotime($loc['dt_last_stop']) < strtotime(gmdate("Y-m-d H:i:s")." - ".$ed['checked_value']." minutes")))
				{
					if (get_event_status($ed['event_id'], $loc['imei']) == -1)
					{
						set_event_status($ed['event_id'], $loc['imei'], '1');
						// set dt_tracker to dt_server to show exact time
						$loc['dt_tracker'] = $loc['dt_server'];
						// add event desc to event data array
						$ed['event_desc'] = $ed['name'];
						event_notify($ed,$ud,$od,$loc);
					}
				}
				else
				{
					if (get_event_status($ed['event_id'], $loc['imei']) != -1)
					{
						set_event_status($ed['event_id'], $loc['imei'], '-1');
					}
				}
			}

			if ($ed['type'] == 'moving')
			{


				// if ((strtotime(gmdate("Y-m-d H:i:s")) - strtotime($loc['dt_last_move'])) > $ed['checked_value']) {
				//   var_dump("entro aqui 3");
                  

				// }else{
				// 	var_dump((strtotime(gmdate("Y-m-d H:i:s")) - strtotime($loc['dt_last_move'])));
				// 	var_dump($ed['checked_value']);

				// }
               

			
				// if (($dt_last_stop < $dt_last_move) && (strtotime($loc['dt_last_move']) < strtotime(gmdate("Y-m-d H:i:s")." - ".$ed['checked_value']." minutes")))
				if (($dt_last_stop < $dt_last_move) && (strtotime(gmdate("Y-m-d H:i:s")) - strtotime($loc['dt_last_move'])) > $ed['checked_value']) 
			
				{
					if (get_event_status($ed['event_id'], $loc['imei']) == -1)
					{
						set_event_status($ed['event_id'], $loc['imei'], '1');
						// set dt_tracker to dt_server to show exact time
						$loc['dt_tracker'] = $loc['dt_server'];
						// add event desc to event data array
						$ed['event_desc'] = $ed['name'];
						// var_dump("notificando....");
						event_notify($ed,$ud,$od,$loc);

					}
				}
				else
				{
					// var_dump("no notificando...");
					if (get_event_status($ed['event_id'], $loc['imei']) != -1)
					{
						set_event_status($ed['event_id'], $loc['imei'], '-1');
					}
				}
			}


			// if ($ed['type'] == 'moving')
			// {

			// 	var_dump("entro aqui");

			// 	if (($dt_last_stop < $dt_last_move) && ((strtotime(gmdate("Y-m-d H:i:s")) - strtotime($loc['dt_last_move'])) > $ed['checked_value']))
			// 	{
			// 		if (get_event_status($ed['event_id'], $loc['imei']) == -1)
			// 		{
			// 			set_event_status($ed['event_id'], $loc['imei'], '1');
			// 			// set dt_tracker to dt_server to show exact time
			// 			$loc['dt_tracker'] = $loc['dt_server'];
			// 			// add event desc to event data array
			// 			$ed['event_desc'] = $ed['name'];
			// 			event_notify($ed,$ud,$od,$loc);
			// 		}
			// 	}
			// 	else
			// 	{
			// 		if (get_event_status($ed['event_id'], $loc['imei']) != -1)
			// 		{
			// 			set_event_status($ed['event_id'], $loc['imei'], '-1');
			// 		}
			// 	}
			// }
			

			if ($ed['type'] == 'engidle')
			{
				if (($dt_last_stop <= $dt_last_idle) && ($dt_last_move <= $dt_last_idle) && (strtotime($loc['dt_last_idle']) < strtotime(gmdate("Y-m-d H:i:s")." - ".$ed['checked_value']." minutes")))
				{
					if (get_event_status($ed['event_id'], $loc['imei']) == -1)
					{
						set_event_status($ed['event_id'], $loc['imei'], '1');
						// set dt_tracker to dt_server to show exact time
						$loc['dt_tracker'] = $loc['dt_server'];
						// add event desc to event data array
						$ed['event_desc'] = $ed['name'];
						event_notify($ed,$ud,$od,$loc);
					}
				}
				else
				{
					if (get_event_status($ed['event_id'], $loc['imei']) != -1)
					{
						set_event_status($ed['event_id'], $loc['imei'], '-1');
					}
				}
			}
		}
	}

	function event_route_in($ed,$ud,$od,$loc)
	{
		global $ms;

		$event_status = get_event_status($ed['event_id'], $loc['imei']);

		// check if route still exists, to fix bug if user deletes zone
		$q = "SELECT * FROM `gs_user_routes` WHERE `route_id`='".$event_status."'";
		$r = mysqli_query($ms, $q);

		if (mysqli_num_rows($r) == 0)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');

			$event_status = '-1';
		}

		// check event
		$q = "SELECT * FROM `gs_user_routes` WHERE `user_id`='".$ed['user_id']."' AND `route_id` IN (".$ed['routes'].")";
		$r = mysqli_query($ms, $q);

		while($route = mysqli_fetch_array($r))
		{
			$dist = isPointOnLine($route['route_points'], $loc['lat'], $loc['lng']);

			// get user units and convert if needed
			$units = explode(",", $ud['units']);
			$dist = convDistanceUnits($dist, 'km', $units[0]);

			if ($dist <= $route['route_deviation'])
			{
				if ($event_status == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], $route['route_id']);
					// add event desc to event data array
					$ed['event_desc'] = $ed['name']. ' ('.$route['route_name'].')';
					event_notify($ed,$ud,$od,$loc);
				}
			}
			else
			{
				if ($event_status == $route['route_id'])
				{
					set_event_status($ed['event_id'], $loc['imei'], '-1');
				}
			}
		}
	}

	function event_route_out($ed,$ud,$od,$loc)
	{
		global $ms;

		$event_status = get_event_status($ed['event_id'], $loc['imei']);

		// check if route still exists, to fix bug if user deletes zone
		$q = "SELECT * FROM `gs_user_routes` WHERE `route_id`='".$event_status."'";
		$r = mysqli_query($ms, $q);

		if (mysqli_num_rows($r) == 0)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');

			$event_status = '-1';
		}

		// check event
		$q = "SELECT * FROM `gs_user_routes` WHERE `user_id`='".$ed['user_id']."' AND `route_id` IN (".$ed['routes'].")";
		$r = mysqli_query($ms, $q);

		while($route = mysqli_fetch_array($r))
		{
			$dist = isPointOnLine($route['route_points'], $loc['lat'], $loc['lng']);

			// get user units and convert if needed
			$units = explode(",", $ud['units']);
			$dist = convDistanceUnits($dist, 'km', $units[0]);

			if ($dist < $route['route_deviation'])
			{
				if ($event_status == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], $route['route_id']);
				}
			}
			else
			{
				if ($event_status == $route['route_id'])
				{
					set_event_status($ed['event_id'], $loc['imei'], '-1');
					// add event desc to event data array
					$ed['event_desc'] = $ed['name']. ' ('.$route['route_name'].')';
					event_notify($ed,$ud,$od,$loc);
				}
			}
		}
	}
	function event_zone_in($ed,$ud,$od,$loc)
	{
		global $ms;
		var_dump('****ZONE IN****');
		$event_status = get_event_status($ed['event_id'], $loc['imei']);
		
		// check if zone still exists, to fix bug if user deletes zone
		$q = "SELECT * FROM `gs_user_zones` WHERE `zone_id`='".$event_status."'";
		$r = mysqli_query($ms, $q);
		
		if (mysqli_num_rows($r) == 0)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');
			
			$event_status = '-1';
		}
		
		// check event
		$q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$ed['user_id']."' AND `zone_id` IN (".$ed['zones'].")";
		$r = mysqli_query($ms, $q);
		
		if (!$r) { return;}
		
		while($zone = mysqli_fetch_array($r))
		{	
		
			$in_zone = isPointInPolygon($zone['zone_vertices'], $loc['lat'], $loc['lng']);
			var_dump('IN ZONE ENTRADA');
			var_dump($in_zone);
			if ($in_zone==1)
			{
				var_dump('ESTOY DENTRO DE LA ZONA');
				if ($event_status == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], $zone['zone_id']);
					// add event desc to event data array
					$ed['event_desc'] = $ed['name']. ' ('.$zone['zone_name'].')';
					event_notify($ed,$ud,$od,$loc);
					var_dump('ENVIANDO NOTIFICACION...');
				}	
				else{

					var_dump('NOTIFICACION YA ENVIADA.');
				}		
			}
			else
			{
				 if($event_status == $zone['zone_id'])
				 {

					set_event_status($ed['event_id'], $loc['imei'], '-1');
				 }
					
				
				
			}
		}
	}

	function event_zone_out($ed,$ud,$od,$loc)
	{
		global $ms;
		

		var_dump('****ZONE OUT****');
		$event_status = get_event_status($ed['event_id'], $loc['imei']);
		
		// check if zone still exists, to fix bug if user deletes zone
		$q = "SELECT * FROM `gs_user_zones` WHERE `zone_id`='".$event_status."'";
		$r = mysqli_query($ms, $q);
		
		if (mysqli_num_rows($r) == 0)
		{
			set_event_status($ed['event_id'], $loc['imei'], '-1');
			
			$event_status = '-1';
		}
		
		// check event
		$q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$ed['user_id']."' AND `zone_id` IN (".$ed['zones'].")";
		$r = mysqli_query($ms, $q);
		
		if (!$r) { return;}
		
		while($zone = mysqli_fetch_array($r))
		{			
			$in_zone = isPointInPolygon($zone['zone_vertices'], $loc['lat'], $loc['lng']);
			var_dump('IN ZONE SALIDA');
			var_dump($in_zone);
			if ($in_zone==0)
			{  
				 var_dump('ESTOY FUERA DE LA ZONA');
				//  var_dump('EVENT STATUS ');
				//  var_dump($event_status);
				//  var_dump('ZONEID ');
				//  var_dump($zone['zone_id']);

				 if ($event_status == $zone['zone_id'])
				 {
					 set_event_status($ed['event_id'], $loc['imei'], '-1');
					 // add event desc to event data array
					 $ed['event_desc'] = $ed['name']. ' ('.$zone['zone_name'].')';
					 event_notify($ed,$ud,$od,$loc);
					 var_dump('ENVIANDO NOTIFICACION...');
				 }
			   else 
				{
					// set_event_status($ed['event_id'], $loc['imei'], $zone['zone_id']);
					var_dump('NOTIFICACION YA ENVIADA.');
				}	

			}
			else
			{

				if($event_status == -1)
				{
					set_event_status($ed['event_id'], $loc['imei'], $zone['zone_id']);
				}
			
			}
		}		
	}




	function get_notificacion_enviada($event_id, $imei)
	{
		global $ms;

		$result = '';

		$q = "SELECT * FROM `gs_user_events_status` WHERE `event_id`='".$event_id."' AND `imei`='".$imei."'";
		$r = mysqli_query($ms, $q);
		$row = mysqli_fetch_array($r);

		if ($row)
		{
			$result = $row['notificado'];
		}
		else
		{
			$q = "INSERT INTO `gs_user_events_status` (`event_id`,`imei`,`event_status`,`notificado`) VALUES ('".$event_id."','".$imei."','-1','0')";
			$r = mysqli_query($ms, $q);
		}

		return $result;
	}

	function set_notificacion_enviada($event_id, $imei, $value)
	{
		global $ms;

		$q = "UPDATE `gs_user_events_status` SET `notificado`='".$value."' WHERE `event_id`='".$event_id."' AND `imei`='".$imei."'";
		$r = mysqli_query($ms, $q);

	}


	function event_param($ed,$ud,$od,$loc)
	{
		$condition = false;
		$params = $loc['params'];
		$units = explode(",", $ud['units']);

		$pc = json_decode($ed['checked_value'], true);
		if ($pc == null)
		{
			return;
		}

		// check conditions
		for ($i=0; $i<count($pc); $i++)
		{
			$cn = false;

			if ($pc[$i]['src'] == 'speed')
			{
				$value = convSpeedUnits($loc['speed'], 'km', $units[0]);
			}
			else
			{
				// check if param exits
				if (!isset($params[$pc[$i]['src']]))
				{
					$condition = false;
					break;
				}

				$value = $params[$pc[$i]['src']];
			}

			if ($pc[$i]['cn'] == 'eq')
			{
				if ($value == $pc[$i]['val']) $cn = true;
			}

			if ($pc[$i]['cn'] == 'gr')
			{
				if ($value > $pc[$i]['val']) $cn = true;
			}

			if ($pc[$i]['cn'] == 'lw')
			{
				if ($value < $pc[$i]['val']) $cn = true;
			}

			if ($cn == true)
			{
				$condition = true;
			}
			else
			{
				$condition = false;
				break;
			}
		}

		if ($condition)
		{
			if (get_event_status($ed['event_id'], $loc['imei']) == -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '1');
				// add event desc to event data array
				$ed['event_desc'] = $ed['name'];
				event_notify($ed,$ud,$od,$loc);
			}
		}
		else
		{
			if (get_event_status($ed['event_id'], $loc['imei']) != -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '-1');
			}
		}
	}

	function event_sensor($ed,$ud,$od,$loc)
	{
		$condition = false;
		$params = $loc['params'];
		$units = explode(",", $ud['units']);

		$sc = json_decode($ed['checked_value'], true);
		if ($sc == null)
		{
			return;
		}

		$sensors = getSensors($loc['imei']);

		// check conditions
		for ($i=0; $i<count($sc); $i++)
		{
			$cn = false;

			if ($sc[$i]['src'] == 'speed')
			{
				$value = convSpeedUnits($loc['speed'], 'km', $units[0]);
			}
			else
			{
				$sensor = false;

				for ($j=0; $j<count($sensors); ++$j)
				{
					if ($sc[$i]['src'] == $sensors[$j]['name'])
					{
						$sensor = $sensors[$j];
					}
				}

				// check if sensor exits
				if (!$sensor)
				{
					$condition = false;
					break;
				}

				// check if param exits
				if (!isset($params[$sensor['param']]))
				{
					$condition = false;
					break;
				}

				$sensor_value = getSensorValue($params, $sensor);

				$value = $sensor_value['value'];
			}

			if ($sc[$i]['cn'] == 'eq')
			{
				if ($value == $sc[$i]['val']) $cn = true;
			}

			if ($sc[$i]['cn'] == 'gr')
			{
				if ($value > $sc[$i]['val']) $cn = true;
			}

			if ($sc[$i]['cn'] == 'lw')
			{
				if ($value < $sc[$i]['val']) $cn = true;
			}

			if ($cn == true)
			{
				$condition = true;
			}
			else
			{
				$condition = false;
				break;
			}
		}

		if ($condition)
		{
			if (get_event_status($ed['event_id'], $loc['imei']) == -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '1');
				// add event desc to event data array
				$ed['event_desc'] = $ed['name'];
				event_notify($ed,$ud,$od,$loc);
			}
		}
		else
		{
			if (get_event_status($ed['event_id'], $loc['imei']) != -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '-1');
			}
		}
	}





	function event_underspeed($ed,$ud,$od,$loc)
	{
		$speed = $loc['speed'];

		// get user speed unit and convert if needed
		$units = explode(",", $ud['units']);
		$speed = convSpeedUnits($speed, 'km', $units[0]);

		if ($speed < $ed['checked_value'])
		{
			if (get_event_status($ed['event_id'], $loc['imei']) == -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '1');
				// add event desc to event data array
				$ed['event_desc'] = $ed['name'];;
				event_notify($ed,$ud,$od,$loc);
			}
		}
		else
		{
			if (get_event_status($ed['event_id'], $loc['imei']) != -1)
			{
				set_event_status($ed['event_id'], $loc['imei'], '-1');
			}
		}
	}

	function event_notifyolder($ed,$ud,$od,$loc)
	{
		global $ms, $gsValues;

		$imei = $loc['imei'];
		$contador='';
        // var_dump("saluddos");

		// echo "<script>alert('ALERTA EVENTO')</script>";

		if (!checkObjectActive($imei))
		{
			 ////var_dump('no existe');
			return;

		}

		// get current date and time for week days and day time check
		$dt_check = convUserIDTimezone($ud['id'], date("Y-m-d H:i:s", strtotime($loc['dt_tracker'])));

		 ////var_dump("<br>W ".$ed['week_days']);
		 ////var_dump("<br>DT ".$ed['day_time']." ".$dt_check);

        //  if($ed['week_days']){



		if (check_event_week_days($dt_check, $ed['week_days']))
		{
			// var_dump("ENTRO AQUI ME CAIGO");
			$contador=$contador.'a';

		//return ;
		}
		// else {
		// 	return;
		// }
     //   }

	    // if (check_event_day_time($dt_check, $ed['day_time']) == false)
		// {
		//     // var_dump("check_event_day_time");
		// 	$contador=$contador.'b';
		// 	return;

		// }

		if (check_event_day_time($dt_check, $ed['day_time']))
		{
		    // var_dump("check_event_day_time");
			$contador=$contador.'b';
			// return;

		}
		// else {
		// 	return;
		// }
		

		// if(check_event_route_trigger($ed, $ud, $loc))
		// {

		// 	$contador=$contador.'c';
		// }

		if(check_event_zone_trigger($ed, $ud, $loc))
		{
			$contador=$contador.'d';
		}
		else{
			return;
		}

		// // duration from last event
		// if(!check_event_duration_from_last($ed, $imei))
		// {

		// }

		// else
		// {	$contador=$contador.'e';
		// 	////var_dump('AQUI ESTOY');
		// 	$q = "UPDATE `gs_user_events_status` SET `dt_server`='".gmdate("Y-m-d H:i:s")."' WHERE `event_id`='".$ed['event_id']."' AND `imei`='".$imei."'";
		// 	$r = mysqli_query($ms, $q);
		// }

		if($contador==''){

           return;
		}
		////var_dump('contador string after: '.$contador);
		?>

		<?php


		// insert event into list
		$q = "INSERT INTO `gs_user_events_data` (	user_id,
								type,
								event_desc,
								notify_system,
								notify_arrow,
								notify_arrow_color,
								notify_ohc,
								notify_ohc_color,
								imei,
								name,
								dt_server,
								dt_tracker,
								lat,
								lng,
								altitude,
								angle,
								speed,
								params
								) VALUES (
								'".$ed['user_id']."',
								'".$ed['type']."',
								'".$ed['event_desc']."',
								'".$ed['notify_system']."',
								'".$ed['notify_arrow']."',
								'".$ed['notify_arrow_color']."',
								'".$ed['notify_ohc']."',
								'".$ed['notify_ohc_color']."',
								'".$od['imei']."',
								'".$od['name']."',
								'".$loc['dt_server']."',
								'".$loc['dt_tracker']."',
								'".$loc['lat']."',
								'".$loc['lng']."',
								'".$loc['altitude']."',
								'".$loc['angle']."',
								'".$loc['speed']."',
								'".json_encode($loc['params'])."')";
		$r = mysqli_query($ms, $q);

	 /*	if($ed['type'] = 'shock' || $ed['type'] = 'conex' || $ed['type'] = 'desconex'){
            
           		 $queryApp = "INSERT INTO `app_notificaciones`( id_usuario,
                                                       			fecha_generada,
                                                        		fecha_actualizada,
                                                        		detalle,
                                                        		leida,
                                                        		oculta,
                                                        		tipo,
                                                        		imei_vehiculo,
                                                        		identificador_tipo,
                                                        		contador_reenvios
                                                     			)
                                                    			VALUES(
                                                        		'".$ed['user_id']."',
                                                        		'".$loc['dt_tracker']."',
                                                        		'".$loc['dt_tracker']."',
                                                        		'".$ed['event_desc']."',
                                                             		0,
                                                             		0 ,
                                                            		'plataforma',
                                                        		'".$od['imei']."',
                                                             		0,
                                                             		0
                                                          		)";
        
             		$respuestaBd = mysqli_query($ms, $queryApp);

      */


		// send cmd
		if ($ed['cmd_send'] == 'true')
		{
			if ($ed['cmd_gateway'] == 'gprs')
			{
				sendObjectGPRSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_type'], $ed['cmd_string']);
			}
			else if ($ed['cmd_gateway'] == 'sms')
			{
				sendObjectSMSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_string']);
			}
		}

		// send email notification
		if (checkUserUsage($ed['user_id'], 'email'))
		{

			if (($ed['notify_email'] == 'true') && ($ed['notify_email_address'] != ''))
			{

				$fecha_actual = date('Y-m-d H:i:s');
                $fecha_evento = $loc['dt_tracker'];
                $diferencia_fecha = strtotime($fecha_actual) - strtotime($loc['dt_tracker']);
                // var_dump("Fecha actual: ".$fecha_actual);
                // var_dump("Fecha de evento: ".$fecha_evento);
                // var_dump("Diferencia: ".$diferencia_fecha);

              if($diferencia_fecha < 172800){
                $email = $ed['notify_email_address'];
                $template = event_notify_template('email',$ed,$ud,$od,$loc);
                $result = sendEmail($email, $template['subject'], $template['message'], true);
              }


				if ($result)
				{
					//update user usage
					updateUserUsage($ed['user_id'], false, $result, false, false);
				}
			}
		}

		// send SMS notification
		if (checkUserUsage($ed['user_id'], 'sms'))
		{
			if (($ed['notify_sms'] == 'true') && ($ed['notify_sms_number'] != ''))
			{
				$result = false;

				$number = $ed['notify_sms_number'];

				$template = event_notify_template('sms',$ed,$ud,$od,$loc);

				if ($ud['sms_gateway'] == 'true')
				{
					if ($ud['sms_gateway_type'] == 'http')
					{
						$result = sendSMSHTTP($ud['sms_gateway_url'], '', $number, $template['message']);
					}
					else if ($ud['sms_gateway_type'] == 'app')
					{
						$result = sendSMSAPP($ud['sms_gateway_identifier'], '', $number, $template['message']);
					}
				}
				else
				{
					if (($ud['sms_gateway_server'] == 'true') && ($gsValues['SMS_GATEWAY'] == 'true'))
					{
						if ($gsValues['SMS_GATEWAY_TYPE'] == 'http')
						{
							$result = sendSMSHTTP($gsValues['SMS_GATEWAY_URL'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
						}
						else if ($gsValues['SMS_GATEWAY_TYPE'] == 'app')
						{
							$result = sendSMSAPP($gsValues['SMS_GATEWAY_IDENTIFIER'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
						}
					}
				}

				if ($result)
				{
					//update user usage
					updateUserUsage($ed['user_id'], false, false, $result, false);
				}
			}
		}
	}

	function event_notify($ed,$ud,$od,$loc)
	{
		global $ms, $gsValues;

		$imei = $loc['imei'];
		$contador='';
		$zone_trigger = $ed['zone_trigger'];
        // var_dump($ed);

		// echo "<script>alert('ALERTA EVENTO')</script>";

		if (!checkObjectActive($imei))
		{
			 ////var_dump('no existe');
			return;

		}

		// get current date and time for week days and day time check
		$dt_check = convUserIDTimezone($ud['id'], date("Y-m-d H:i:s", strtotime($loc['dt_tracker'])));

		//  var_dump("<br>W ".$ed['week_days']);
		//  var_dump("<br>DT ".$ed['day_time']." ".$dt_check);

        //  if($ed['week_days']){



		if (check_event_week_days($dt_check, $ed['week_days']))
		{
			// var_dump("ENTRO AQUI ME CAIGO");

			if (($zone_trigger == '') || ($zone_trigger == 'off'))
			{
							
						

						$contador=$contador.'a';
										
									// insert event into list
									$q = "INSERT INTO `gs_user_events_data` (	user_id,
									type,
									event_desc,
									notify_system,
									notify_arrow,
									notify_arrow_color,
									notify_ohc,
									notify_ohc_color,
									imei,
									name,
									dt_server,
									dt_tracker,
									lat,
									lng,
									altitude,
									angle,
									speed,
									params
									) VALUES (
									'".$ed['user_id']."',
									'".$ed['type']."',
									'".$ed['event_desc']."',
									'".$ed['notify_system']."',
									'".$ed['notify_arrow']."',
									'".$ed['notify_arrow_color']."',
									'".$ed['notify_ohc']."',
									'".$ed['notify_ohc_color']."',
									'".$od['imei']."',
									'".$od['name']."',
									'".$loc['dt_server']."',
									'".$loc['dt_tracker']."',
									'".$loc['lat']."',
									'".$loc['lng']."',
									'".$loc['altitude']."',
									'".$loc['angle']."',
									'".$loc['speed']."',
									'".json_encode($loc['params'])."')";
							$r = mysqli_query($ms, $q);

							/*	if($ed['type'] = 'shock' || $ed['type'] = 'conex' || $ed['type'] = 'desconex'){

								$queryApp = "INSERT INTO `app_notificaciones`( id_usuario,
																				fecha_generada,
																				fecha_actualizada,
																				detalle,
																				leida,
																				oculta,
																				tipo,
																				imei_vehiculo,
																				identificador_tipo,
																				contador_reenvios
																				)
																				VALUES(
																				'".$ed['user_id']."',
																				'".$loc['dt_tracker']."',
																				'".$loc['dt_tracker']."',
																				'".$ed['event_desc']."',
																					0,
																					0 ,
																					'plataforma',
																				'".$od['imei']."',
																					0,
																					0
																				)";

									$respuestaBd = mysqli_query($ms, $queryApp);

							*/


							// send cmd
							if ($ed['cmd_send'] == 'true')
							{
							if ($ed['cmd_gateway'] == 'gprs')
							{
							sendObjectGPRSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_type'], $ed['cmd_string']);
							}
							else if ($ed['cmd_gateway'] == 'sms')
							{
							sendObjectSMSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_string']);
							}
							}

							// send email notification
							if (checkUserUsage($ed['user_id'], 'email'))
							{

							if (($ed['notify_email'] == 'true') && ($ed['notify_email_address'] != ''))
							{

							$fecha_actual = date('Y-m-d H:i:s');
							$fecha_evento = $loc['dt_tracker'];
							$diferencia_fecha = strtotime($fecha_actual) - strtotime($loc['dt_tracker']);
							// var_dump("Fecha actual: ".$fecha_actual);
							// var_dump("Fecha de evento: ".$fecha_evento);
							// var_dump("Diferencia: ".$diferencia_fecha);

							if($diferencia_fecha < 172800){
							$email = $ed['notify_email_address'];
							$template = event_notify_template('email',$ed,$ud,$od,$loc);
							$result = sendEmail($email, $template['subject'], $template['message'], true);
							}


							if ($result)
							{
							//update user usage
							updateUserUsage($ed['user_id'], false, $result, false, false);
							}
							}
							}

							// send SMS notification
							if (checkUserUsage($ed['user_id'], 'sms'))
							{
							if (($ed['notify_sms'] == 'true') && ($ed['notify_sms_number'] != ''))
							{
							$result = false;

							$number = $ed['notify_sms_number'];

							$template = event_notify_template('sms',$ed,$ud,$od,$loc);

							if ($ud['sms_gateway'] == 'true')
							{
							if ($ud['sms_gateway_type'] == 'http')
							{
							$result = sendSMSHTTP($ud['sms_gateway_url'], '', $number, $template['message']);
							}
							else if ($ud['sms_gateway_type'] == 'app')
							{
							$result = sendSMSAPP($ud['sms_gateway_identifier'], '', $number, $template['message']);
							}
							}
							else
							{
							if (($ud['sms_gateway_server'] == 'true') && ($gsValues['SMS_GATEWAY'] == 'true'))
							{
							if ($gsValues['SMS_GATEWAY_TYPE'] == 'http')
							{
								$result = sendSMSHTTP($gsValues['SMS_GATEWAY_URL'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
							}
							else if ($gsValues['SMS_GATEWAY_TYPE'] == 'app')
							{
								$result = sendSMSAPP($gsValues['SMS_GATEWAY_IDENTIFIER'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
							}
							}
							}

							if ($result)
							{
							//update user usage
							updateUserUsage($ed['user_id'], false, false, $result, false);
							}
							}
							}

							var_dump("notifique por dia de semana");

							return;


			}else{

					if(check_event_zone_trigger($ed, $ud, $loc))
					{
						$contador=$contador.'d';

						
								// insert event into list
								$q = "INSERT INTO `gs_user_events_data` (	user_id,
								type,
								event_desc,
								notify_system,
								notify_arrow,
								notify_arrow_color,
								notify_ohc,
								notify_ohc_color,
								imei,
								name,
								dt_server,
								dt_tracker,
								lat,
								lng,
								altitude,
								angle,
								speed,
								params
								) VALUES (
								'".$ed['user_id']."',
								'".$ed['type']."',
								'".$ed['event_desc']."',
								'".$ed['notify_system']."',
								'".$ed['notify_arrow']."',
								'".$ed['notify_arrow_color']."',
								'".$ed['notify_ohc']."',
								'".$ed['notify_ohc_color']."',
								'".$od['imei']."',
								'".$od['name']."',
								'".$loc['dt_server']."',
								'".$loc['dt_tracker']."',
								'".$loc['lat']."',
								'".$loc['lng']."',
								'".$loc['altitude']."',
								'".$loc['angle']."',
								'".$loc['speed']."',
								'".json_encode($loc['params'])."')";
						$r = mysqli_query($ms, $q);

						/*	if($ed['type'] = 'shock' || $ed['type'] = 'conex' || $ed['type'] = 'desconex'){

							$queryApp = "INSERT INTO `app_notificaciones`( id_usuario,
																			fecha_generada,
																			fecha_actualizada,
																			detalle,
																			leida,
																			oculta,
																			tipo,
																			imei_vehiculo,
																			identificador_tipo,
																			contador_reenvios
																			)
																			VALUES(
																			'".$ed['user_id']."',
																			'".$loc['dt_tracker']."',
																			'".$loc['dt_tracker']."',
																			'".$ed['event_desc']."',
																				0,
																				0 ,
																				'plataforma',
																			'".$od['imei']."',
																				0,
																				0
																			)";

								$respuestaBd = mysqli_query($ms, $queryApp);

						*/


						// send cmd
						if ($ed['cmd_send'] == 'true')
						{
						if ($ed['cmd_gateway'] == 'gprs')
						{
						sendObjectGPRSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_type'], $ed['cmd_string']);
						}
						else if ($ed['cmd_gateway'] == 'sms')
						{
						sendObjectSMSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_string']);
						}
						}

						// send email notification
						if (checkUserUsage($ed['user_id'], 'email'))
						{

						if (($ed['notify_email'] == 'true') && ($ed['notify_email_address'] != ''))
						{

						$fecha_actual = date('Y-m-d H:i:s');
						$fecha_evento = $loc['dt_tracker'];
						$diferencia_fecha = strtotime($fecha_actual) - strtotime($loc['dt_tracker']);
						// var_dump("Fecha actual: ".$fecha_actual);
						// var_dump("Fecha de evento: ".$fecha_evento);
						// var_dump("Diferencia: ".$diferencia_fecha);
						$result = false;
						
						if($diferencia_fecha < 172800){
						$email = $ed['notify_email_address'];
						$template = event_notify_template('email',$ed,$ud,$od,$loc);
						$result = sendEmail($email, $template['subject'], $template['message'], true);
						}


						if ($result)
						{
						//update user usage
						updateUserUsage($ed['user_id'], false, $result, false, false);
						}
						}
						}

						// send SMS notification
						if (checkUserUsage($ed['user_id'], 'sms'))
						{
						if (($ed['notify_sms'] == 'true') && ($ed['notify_sms_number'] != ''))
						{
						$result = false;

						$number = $ed['notify_sms_number'];

						$template = event_notify_template('sms',$ed,$ud,$od,$loc);

						if ($ud['sms_gateway'] == 'true')
						{
						if ($ud['sms_gateway_type'] == 'http')
						{
						$result = sendSMSHTTP($ud['sms_gateway_url'], '', $number, $template['message']);
						}
						else if ($ud['sms_gateway_type'] == 'app')
						{
						$result = sendSMSAPP($ud['sms_gateway_identifier'], '', $number, $template['message']);
						}
						}
						else
						{
						if (($ud['sms_gateway_server'] == 'true') && ($gsValues['SMS_GATEWAY'] == 'true'))
						{
						if ($gsValues['SMS_GATEWAY_TYPE'] == 'http')
						{
							$result = sendSMSHTTP($gsValues['SMS_GATEWAY_URL'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
						}
						else if ($gsValues['SMS_GATEWAY_TYPE'] == 'app')
						{
							$result = sendSMSAPP($gsValues['SMS_GATEWAY_IDENTIFIER'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
						}
						}
						}

						if ($result)
						{
						//update user usage
						updateUserUsage($ed['user_id'], false, false, $result, false);
						}
						}
						}


						var_dump("notifique por geocerca");
						return;
			
					}
							
			}
		}


		if (check_event_day_time($dt_check, $ed['day_time']))
		{
			if (($zone_trigger == '') || ($zone_trigger == 'off'))
			{
					$contador=$contador.'b';
					
							// insert event into list
							$q = "INSERT INTO `gs_user_events_data` (	user_id,
							type,
							event_desc,
							notify_system,
							notify_arrow,
							notify_arrow_color,
							notify_ohc,
							notify_ohc_color,
							imei,
							name,
							dt_server,
							dt_tracker,
							lat,
							lng,
							altitude,
							angle,
							speed,
							params
							) VALUES (
							'".$ed['user_id']."',
							'".$ed['type']."',
							'".$ed['event_desc']."',
							'".$ed['notify_system']."',
							'".$ed['notify_arrow']."',
							'".$ed['notify_arrow_color']."',
							'".$ed['notify_ohc']."',
							'".$ed['notify_ohc_color']."',
							'".$od['imei']."',
							'".$od['name']."',
							'".$loc['dt_server']."',
							'".$loc['dt_tracker']."',
							'".$loc['lat']."',
							'".$loc['lng']."',
							'".$loc['altitude']."',
							'".$loc['angle']."',
							'".$loc['speed']."',
							'".json_encode($loc['params'])."')";
					$r = mysqli_query($ms, $q);

					/*	if($ed['type'] = 'shock' || $ed['type'] = 'conex' || $ed['type'] = 'desconex'){

						$queryApp = "INSERT INTO `app_notificaciones`( id_usuario,
																		fecha_generada,
																		fecha_actualizada,
																		detalle,
																		leida,
																		oculta,
																		tipo,
																		imei_vehiculo,
																		identificador_tipo,
																		contador_reenvios
																		)
																		VALUES(
																		'".$ed['user_id']."',
																		'".$loc['dt_tracker']."',
																		'".$loc['dt_tracker']."',
																		'".$ed['event_desc']."',
																			0,
																			0 ,
																			'plataforma',
																		'".$od['imei']."',
																			0,
																			0
																		)";

							$respuestaBd = mysqli_query($ms, $queryApp);

					*/


					// send cmd
					if ($ed['cmd_send'] == 'true')
					{
					if ($ed['cmd_gateway'] == 'gprs')
					{
					sendObjectGPRSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_type'], $ed['cmd_string']);
					}
					else if ($ed['cmd_gateway'] == 'sms')
					{
					sendObjectSMSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_string']);
					}
					}

					// send email notification
					if (checkUserUsage($ed['user_id'], 'email'))
					{

					if (($ed['notify_email'] == 'true') && ($ed['notify_email_address'] != ''))
					{

					$fecha_actual = date('Y-m-d H:i:s');
					$fecha_evento = $loc['dt_tracker'];
					$diferencia_fecha = strtotime($fecha_actual) - strtotime($loc['dt_tracker']);
					// var_dump("Fecha actual: ".$fecha_actual);
					// var_dump("Fecha de evento: ".$fecha_evento);
					// var_dump("Diferencia: ".$diferencia_fecha);

					if($diferencia_fecha < 172800){
					$email = $ed['notify_email_address'];
					$template = event_notify_template('email',$ed,$ud,$od,$loc);
					$result = sendEmail($email, $template['subject'], $template['message'], true);
					}


					if ($result)
					{
					//update user usage
					updateUserUsage($ed['user_id'], false, $result, false, false);
					}
					}
					}

					// send SMS notification
					if (checkUserUsage($ed['user_id'], 'sms'))
					{
					if (($ed['notify_sms'] == 'true') && ($ed['notify_sms_number'] != ''))
					{
					$result = false;

					$number = $ed['notify_sms_number'];

					$template = event_notify_template('sms',$ed,$ud,$od,$loc);

					if ($ud['sms_gateway'] == 'true')
					{
					if ($ud['sms_gateway_type'] == 'http')
					{
					$result = sendSMSHTTP($ud['sms_gateway_url'], '', $number, $template['message']);
					}
					else if ($ud['sms_gateway_type'] == 'app')
					{
					$result = sendSMSAPP($ud['sms_gateway_identifier'], '', $number, $template['message']);
					}
					}
					else
					{
					if (($ud['sms_gateway_server'] == 'true') && ($gsValues['SMS_GATEWAY'] == 'true'))
					{
					if ($gsValues['SMS_GATEWAY_TYPE'] == 'http')
					{
						$result = sendSMSHTTP($gsValues['SMS_GATEWAY_URL'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
					}
					else if ($gsValues['SMS_GATEWAY_TYPE'] == 'app')
					{
						$result = sendSMSAPP($gsValues['SMS_GATEWAY_IDENTIFIER'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
					}
					}
					}

					if ($result)
					{
					//update user usage
					updateUserUsage($ed['user_id'], false, false, $result, false);
					}
					}
					}


					var_dump("notifique por dia y hora");

					return;

			}else {

				if(check_event_zone_trigger($ed, $ud, $loc))
				{
					$contador=$contador.'d';
		
					
							// insert event into list
							$q = "INSERT INTO `gs_user_events_data` (	user_id,
							type,
							event_desc,
							notify_system,
							notify_arrow,
							notify_arrow_color,
							notify_ohc,
							notify_ohc_color,
							imei,
							name,
							dt_server,
							dt_tracker,
							lat,
							lng,
							altitude,
							angle,
							speed,
							params
							) VALUES (
							'".$ed['user_id']."',
							'".$ed['type']."',
							'".$ed['event_desc']."',
							'".$ed['notify_system']."',
							'".$ed['notify_arrow']."',
							'".$ed['notify_arrow_color']."',
							'".$ed['notify_ohc']."',
							'".$ed['notify_ohc_color']."',
							'".$od['imei']."',
							'".$od['name']."',
							'".$loc['dt_server']."',
							'".$loc['dt_tracker']."',
							'".$loc['lat']."',
							'".$loc['lng']."',
							'".$loc['altitude']."',
							'".$loc['angle']."',
							'".$loc['speed']."',
							'".json_encode($loc['params'])."')";
					$r = mysqli_query($ms, $q);
		
					/*	if($ed['type'] = 'shock' || $ed['type'] = 'conex' || $ed['type'] = 'desconex'){
		
						$queryApp = "INSERT INTO `app_notificaciones`( id_usuario,
																		fecha_generada,
																		fecha_actualizada,
																		detalle,
																		leida,
																		oculta,
																		tipo,
																		imei_vehiculo,
																		identificador_tipo,
																		contador_reenvios
																		)
																		VALUES(
																		'".$ed['user_id']."',
																		'".$loc['dt_tracker']."',
																		'".$loc['dt_tracker']."',
																		'".$ed['event_desc']."',
																			0,
																			0 ,
																			'plataforma',
																		'".$od['imei']."',
																			0,
																			0
																		)";
		
							$respuestaBd = mysqli_query($ms, $queryApp);
		
					*/
		
		
					// send cmd
					if ($ed['cmd_send'] == 'true')
					{
					if ($ed['cmd_gateway'] == 'gprs')
					{
					sendObjectGPRSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_type'], $ed['cmd_string']);
					}
					else if ($ed['cmd_gateway'] == 'sms')
					{
					sendObjectSMSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_string']);
					}
					}
		
					// send email notification
					if (checkUserUsage($ed['user_id'], 'email'))
					{
		
					if (($ed['notify_email'] == 'true') && ($ed['notify_email_address'] != ''))
					{
		
					$fecha_actual = date('Y-m-d H:i:s');
					$fecha_evento = $loc['dt_tracker'];
					$diferencia_fecha = strtotime($fecha_actual) - strtotime($loc['dt_tracker']);
					// var_dump("Fecha actual: ".$fecha_actual);
					// var_dump("Fecha de evento: ".$fecha_evento);
					// var_dump("Diferencia: ".$diferencia_fecha);
		
					if($diferencia_fecha < 172800){
					$email = $ed['notify_email_address'];
					$template = event_notify_template('email',$ed,$ud,$od,$loc);
					$result = sendEmail($email, $template['subject'], $template['message'], true);
					}
		
		
					if ($result)
					{
					//update user usage
					updateUserUsage($ed['user_id'], false, $result, false, false);
					}
					}
					}
		
					// send SMS notification
					if (checkUserUsage($ed['user_id'], 'sms'))
					{
					if (($ed['notify_sms'] == 'true') && ($ed['notify_sms_number'] != ''))
					{
					$result = false;
		
					$number = $ed['notify_sms_number'];
		
					$template = event_notify_template('sms',$ed,$ud,$od,$loc);
		
					if ($ud['sms_gateway'] == 'true')
					{
					if ($ud['sms_gateway_type'] == 'http')
					{
					$result = sendSMSHTTP($ud['sms_gateway_url'], '', $number, $template['message']);
					}
					else if ($ud['sms_gateway_type'] == 'app')
					{
					$result = sendSMSAPP($ud['sms_gateway_identifier'], '', $number, $template['message']);
					}
					}
					else
					{
					if (($ud['sms_gateway_server'] == 'true') && ($gsValues['SMS_GATEWAY'] == 'true'))
					{
					if ($gsValues['SMS_GATEWAY_TYPE'] == 'http')
					{
						$result = sendSMSHTTP($gsValues['SMS_GATEWAY_URL'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
					}
					else if ($gsValues['SMS_GATEWAY_TYPE'] == 'app')
					{
						$result = sendSMSAPP($gsValues['SMS_GATEWAY_IDENTIFIER'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
					}
					}
					}
		
					if ($result)
					{
					//update user usage
					updateUserUsage($ed['user_id'], false, false, $result, false);
					}
					}
					}
		
		
					var_dump("notifique por geocerca");
					return;
		
				}
			}
		}
		// if(check_event_route_trigger($ed, $ud, $loc))
		// {

		// 	$contador=$contador.'c';
		// }
		// if(check_event_zone_trigger($ed, $ud, $loc))
		// {
		// 	$contador=$contador.'d';

			
		// 			// insert event into list
		// 			$q = "INSERT INTO `gs_user_events_data` (	user_id,
		// 			type,
		// 			event_desc,
		// 			notify_system,
		// 			notify_arrow,
		// 			notify_arrow_color,
		// 			notify_ohc,
		// 			notify_ohc_color,
		// 			imei,
		// 			name,
		// 			dt_server,
		// 			dt_tracker,
		// 			lat,
		// 			lng,
		// 			altitude,
		// 			angle,
		// 			speed,
		// 			params
		// 			) VALUES (
		// 			'".$ed['user_id']."',
		// 			'".$ed['type']."',
		// 			'".$ed['event_desc']."',
		// 			'".$ed['notify_system']."',
		// 			'".$ed['notify_arrow']."',
		// 			'".$ed['notify_arrow_color']."',
		// 			'".$ed['notify_ohc']."',
		// 			'".$ed['notify_ohc_color']."',
		// 			'".$od['imei']."',
		// 			'".$od['name']."',
		// 			'".$loc['dt_server']."',
		// 			'".$loc['dt_tracker']."',
		// 			'".$loc['lat']."',
		// 			'".$loc['lng']."',
		// 			'".$loc['altitude']."',
		// 			'".$loc['angle']."',
		// 			'".$loc['speed']."',
		// 			'".json_encode($loc['params'])."')";
		// 	$r = mysqli_query($ms, $q);

		// 	/*	if($ed['type'] = 'shock' || $ed['type'] = 'conex' || $ed['type'] = 'desconex'){

		// 		$queryApp = "INSERT INTO `app_notificaciones`( id_usuario,
		// 														fecha_generada,
		// 														fecha_actualizada,
		// 														detalle,
		// 														leida,
		// 														oculta,
		// 														tipo,
		// 														imei_vehiculo,
		// 														identificador_tipo,
		// 														contador_reenvios
		// 														)
		// 														VALUES(
		// 														'".$ed['user_id']."',
		// 														'".$loc['dt_tracker']."',
		// 														'".$loc['dt_tracker']."',
		// 														'".$ed['event_desc']."',
		// 															0,
		// 															0 ,
		// 															'plataforma',
		// 														'".$od['imei']."',
		// 															0,
		// 															0
		// 														)";

		// 			$respuestaBd = mysqli_query($ms, $queryApp);

		// 	*/


		// 	// send cmd
		// 	if ($ed['cmd_send'] == 'true')
		// 	{
		// 	if ($ed['cmd_gateway'] == 'gprs')
		// 	{
		// 	sendObjectGPRSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_type'], $ed['cmd_string']);
		// 	}
		// 	else if ($ed['cmd_gateway'] == 'sms')
		// 	{
		// 	sendObjectSMSCommand($ed['user_id'], $imei, $ed['event_desc'], $ed['cmd_string']);
		// 	}
		// 	}

		// 	// send email notification
		// 	if (checkUserUsage($ed['user_id'], 'email'))
		// 	{

		// 	if (($ed['notify_email'] == 'true') && ($ed['notify_email_address'] != ''))
		// 	{

		// 	$fecha_actual = date('Y-m-d H:i:s');
		// 	$fecha_evento = $loc['dt_tracker'];
		// 	$diferencia_fecha = strtotime($fecha_actual) - strtotime($loc['dt_tracker']);
		// 	// var_dump("Fecha actual: ".$fecha_actual);
		// 	// var_dump("Fecha de evento: ".$fecha_evento);
		// 	// var_dump("Diferencia: ".$diferencia_fecha);

		// 	if($diferencia_fecha < 172800){
		// 	$email = $ed['notify_email_address'];
		// 	$template = event_notify_template('email',$ed,$ud,$od,$loc);
		// 	$result = sendEmail($email, $template['subject'], $template['message'], true);
		// 	}


		// 	if ($result)
		// 	{
		// 	//update user usage
		// 	updateUserUsage($ed['user_id'], false, $result, false, false);
		// 	}
		// 	}
		// 	}

		// 	// send SMS notification
		// 	if (checkUserUsage($ed['user_id'], 'sms'))
		// 	{
		// 	if (($ed['notify_sms'] == 'true') && ($ed['notify_sms_number'] != ''))
		// 	{
		// 	$result = false;

		// 	$number = $ed['notify_sms_number'];

		// 	$template = event_notify_template('sms',$ed,$ud,$od,$loc);

		// 	if ($ud['sms_gateway'] == 'true')
		// 	{
		// 	if ($ud['sms_gateway_type'] == 'http')
		// 	{
		// 	$result = sendSMSHTTP($ud['sms_gateway_url'], '', $number, $template['message']);
		// 	}
		// 	else if ($ud['sms_gateway_type'] == 'app')
		// 	{
		// 	$result = sendSMSAPP($ud['sms_gateway_identifier'], '', $number, $template['message']);
		// 	}
		// 	}
		// 	else
		// 	{
		// 	if (($ud['sms_gateway_server'] == 'true') && ($gsValues['SMS_GATEWAY'] == 'true'))
		// 	{
		// 	if ($gsValues['SMS_GATEWAY_TYPE'] == 'http')
		// 	{
		// 		$result = sendSMSHTTP($gsValues['SMS_GATEWAY_URL'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
		// 	}
		// 	else if ($gsValues['SMS_GATEWAY_TYPE'] == 'app')
		// 	{
		// 		$result = sendSMSAPP($gsValues['SMS_GATEWAY_IDENTIFIER'], $gsValues['SMS_GATEWAY_NUMBER_FILTER'], $number, $template['message']);
		// 	}
		// 	}
		// 	}

		// 	if ($result)
		// 	{
		// 	//update user usage
		// 	updateUserUsage($ed['user_id'], false, false, $result, false);
		// 	}
		// 	}
		// 	}


		// 	var_dump("notifique por geocerca");
		// 	return;

		// }

	}


	function insertar_notificacion(){
	// insert event into list

			$q = "INSERT INTO `gs_user_events_data` (	user_id,
			type,
			event_desc,
			notify_system,
			notify_arrow,
			notify_arrow_color,
			notify_ohc,
			notify_ohc_color,
			imei,
			name,
			dt_server,
			dt_tracker,
			lat,
			lng,
			altitude,
			angle,
			speed,
			params
			) VALUES (
			'".$ed['user_id']."',
			'".$ed['type']."',
			'".$ed['event_desc']."',
			'".$ed['notify_system']."',
			'".$ed['notify_arrow']."',
			'".$ed['notify_arrow_color']."',
			'".$ed['notify_ohc']."',
			'".$ed['notify_ohc_color']."',
			'".$od['imei']."',
			'".$od['name']."',
			'".$loc['dt_server']."',
			'".$loc['dt_tracker']."',
			'".$loc['lat']."',
			'".$loc['lng']."',
			'".$loc['altitude']."',
			'".$loc['angle']."',
			'".$loc['speed']."',
			'".json_encode($loc['params'])."')";
		$r = mysqli_query($ms, $q);





	}

	function event_notify_template($type,$ed,$ud,$od,$loc)
	{
		global $ms, $la;

		// load language
		loadLanguage($ud["language"], $ud["units"]);

		// get template
		$template = array();
		$template['subject'] = '';
		$template['message'] = '';

		if ($type == 'email')
		{
			$template = getDefaultTemplate('event_email', $ud["language"]);
		}
		else if ($type == 'sms')
		{
			$template = getDefaultTemplate('event_sms', $ud["language"]);
		}

		if ($ed[$type.'_template_id'] != 0)
		{
			$q = "SELECT * FROM `gs_user_templates` WHERE `template_id`='".$ed[$type.'_template_id']."'";
			$r = mysqli_query($ms, $q);
			$row = mysqli_fetch_array($r);

			if ($row)
			{
				if ($row['subject'] != '')
				{
					$template['subject'] = $row['subject'];
				}

				if ($row['message'] != '')
				{
					$template['message'] = $row['message'];
				}
			}
		}

		// modify template variables
		$g_map = 'http://maps.google.com/maps?q='.$loc['lat'].','.$loc['lng'].'&t=m';

		// add timezone to dt_tracker and dt_server
		$dt_server = convUserIDTimezone($ud['id'], $loc['dt_server']);
		$dt_tracker = convUserIDTimezone($ud['id'], $loc['dt_tracker']);

		$speed = $loc['speed'];
		$units = explode(",", $ud['units']);
		$speed = convSpeedUnits($speed, 'km', $units[0]);
		$speed = $speed.' '.$la["UNIT_SPEED"];

		$driver = getObjectDriver($ud['id'], $od['imei'], $loc['params']);

		$trailer = getObjectTrailer($ud['id'], $od['imei'], $loc['params']);

		// check if there is address variable
		if ((strpos($template['subject'], "%ADDRESS%") !== "") || (strpos($template['message'], "%ADDRESS%") !== ""))
		{
			$address = geocoderGetAddress($loc["lat"], $loc["lng"]);
		}

		foreach ($template as $key => $value)
		{
			$value = str_replace("%NAME%", $od["name"], $value);
			$value = str_replace("%IMEI%", $od["imei"], $value);
			$value = str_replace("%EVENT%", $ed['event_desc'], $value);
			$value = str_replace("%LAT%", $loc["lat"], $value);
			$value = str_replace("%LNG%", $loc["lng"], $value);
			$value = str_replace("%SPEED%", $speed, $value);
			$value = str_replace("%ALT%", $loc["altitude"], $value);
			$value = str_replace("%ANGLE%", $loc["angle"], $value);
			$value = str_replace("%DT_POS%", $dt_tracker, $value);
			$value = str_replace("%DT_SER%", $dt_server, $value);
			$value = str_replace("%G_MAP%", $g_map, $value);
			$value = str_replace("%TR_MODEL%", $od["model"], $value);
			$value = str_replace("%PL_NUM%", $od["plate_number"], $value);
			$value = str_replace("%DRIVER%", $driver['driver_name'], $value);
			$value = str_replace("%TRAILER%", $trailer['trailer_name'], $value);
			$value = str_replace("%ADDRESS%", $address, $value);

			$template[$key] = $value;
		}

		return $template;
	}

	function get_event_status($event_id, $imei)
	{
		global $ms;

		$result = '-1';

		$q = "SELECT * FROM `gs_user_events_status` WHERE `event_id`='".$event_id."' AND `imei`='".$imei."'";
		$r = mysqli_query($ms, $q);
		$row = mysqli_fetch_array($r);

		if ($row)
		{
			$result = $row['event_status'];
		}
		else
		{
			$q = "INSERT INTO `gs_user_events_status` (`event_id`,`imei`,`event_status`,`notificado`) VALUES ('".$event_id."','".$imei."','-1','0')";
			$r = mysqli_query($ms, $q);
			
		}

		return $result;
	}

	function set_event_status($event_id, $imei, $value)
	{
		global $ms;

		$q = "UPDATE `gs_user_events_status` SET `event_status`='".$value."' WHERE `event_id`='".$event_id."' AND `imei`='".$imei."'";
		$r = mysqli_query($ms, $q);

	}

	function check_event_duration_from_last($ed, $imei)
	{
		global $ms;

		$q = "SELECT * FROM `gs_user_events_status` WHERE `event_id`='".$ed['event_id']."' AND `imei`='".$imei."'";
		$r = mysqli_query($ms, $q);
		$row = mysqli_fetch_array($r);

		if ($row)
		{
			if($ed['duration_from_last_event'] == 'true')
			{
				if(strtotime($row['dt_server']) >= strtotime(gmdate("Y-m-d H:i:s")." - ".$ed['duration_from_last_event_minutes']." minutes"))
				{
					return false;
				}
			}
		}

		return true;
	}

	function check_event_week_days($dt_check, $week_days)
	{
		$day_of_week = gmdate('w', strtotime($dt_check));
		$week_days = explode(',', $week_days);
		$variablex = false;

        var_dump('variable event week: '.$week_days[$day_of_week]);

		if ($week_days[$day_of_week] == 'true')
		{
			////var_dump('TRUE');
		 $variablex = true;
		}
		else
		{   ////var_dump('FALSE');
			$variablex = false;
		}
		////var_dump($variablex);
		return $variablex;

}

function check_event_day_time($dt_check, $day_time)
{
		$day_of_week = gmdate('w', strtotime($dt_check));

		// var_dump($day_of_week);
		$day_time = json_decode($day_time, true);
		$from='';
		$to='';

		////var_dump('DAY TIME: '.$day_time);
		////var_dump('DAY OF WEEK: '.$day_of_week);


		if ($day_time != null)
		{
			if ($day_time['dt'] == true)
			{

				////var_dump('DAY OF WEEK DENTRO: '.$day_of_week);

				if (($day_time['sun'] == true) && ($day_of_week == 0))
				{
					$from = $day_time['sun_from'];
					$to = $day_time['sun_to'];
				}
				else if (($day_time['mon'] == true) && ($day_of_week == 1))
				{
					////var_dump("ESTOY EN LUNES");
					$from = $day_time['mon_from'];
					$to = $day_time['mon_to'];

				}
				else if (($day_time['tue'] == true) && ($day_of_week == 2))
				{      ////var_dump("HOY ES MARTES");
					$from = $day_time['tue_from'];
					$to = $day_time['tue_to'];
				}
				else if (($day_time['wed'] == true) && ($day_of_week == 3))
				{

					// var_dump("ESTOY EN MIERCOLES");
					$from = $day_time['wed_from'];
					$to = $day_time['wed_to'];
				}
				else if (($day_time['thu'] == true) && ($day_of_week == 4))
				{     ////var_dump("HOY ES JUEVES");
					$from = $day_time['thu_from'];
					$to = $day_time['thu_to'];
				}
				else if (($day_time['fri'] == true) && ($day_of_week == 5))
				{
					////var_dump("ESTOY EN VIERNES");
					$from = $day_time['fri_from'];
					$to = $day_time['fri_to'];
				}
				else if (($day_time['sat'] == true) && ($day_of_week == 6))
				{
					////var_dump("HOY ES SABADO");
					$from = $day_time['sat_from'];
					$to = $day_time['sat_to'];
				}
				else
				{
					////var_dump('no dias');
					return false;
				}
				////var_dump('DT_CHECK: '.$dt_check);
				////var_dump('desde '.$from);
				////var_dump('hasta '.$to);
			    // valida_hora($from,$to,$dt_check);

			    $validaHora=valida_hora($from,$to,$dt_check);

				////var_dump('TERMINANDO FUNCION...' .$validaHora);

				return $validaHora;

			}
			else
			{

				////var_dump('paso aqui 7');
				return FALSE;
			}
		}
		else
		{
			////var_dump('paso aqui 8');
			return FALSE;
		}
}

function valida_hora($from,$to,$dt_check){

		////var_dump('SOY LA NUEVA FUNCION ANTES DEL IF');


		    // var_dump('from validador: '.$from);
			// var_dump('to validador: '.$to);
			// var_dump('DT_CHECK VALIDADOR ANTES '.$dt_check);

		if (isset($from) && isset($to))
		{

			////var_dump('SOY LA NUEVA FUNCION');
			// $dt_check = strtotime($dt_check);
			// ////var_dump($dt_check);
			// $from = strtotime($from);
			// $to = strtotime($to);


			// $variableh = convUserIDTimezone($ud['id'], date("H:i",strtotime($to)));
			// $variablex = convUserIDTimezone($ud['id'], date("H:i",strtotime($from)));
			// $variabley = convUserIDTimezone($ud['id'], date("H:i",strtotime($dt_check)));

			$dt_check = strtotime($dt_check);
			$from = strtotime($from);
			$to = strtotime($to);


			// var_dump('-------------------------------------------------------------------');
			// var_dump('to validador: '.$to);
			// var_dump('from validador: '.$from);
			// var_dump('DT_CHECK VALIDADOR '.$dt_check);
			// add one day offset
			if ($from >= $to)
			{
				// var_dump('Paso aqui 1');

				$to = $to + 86400;

				////var_dump(convUserIDTimezone($ud['id'], date("y-m-d H:i",$to)));

			}

			// if ($from < $dt_check) {
				
			//     var_dump("paso aqui 1.1");
			// 	// return true;
			   
			// }
			// else if($to > $dt_check){

			// 	var_dump("paso aqui 1.2");
			// 	// return true;
			// }

			if (($from < $dt_check) && ($to > $dt_check))
			{
				// var_dump('Paso aqui 2');
				return true;
			}
			else
			{
				////var_dump('****************************');
				////var_dump('from validador: '.$variablex);
				////var_dump('to validador: '.$variableh);
				////var_dump('DT_CHECK VALIDADOR '.$variabley);
				////var_dump('Paso aqui 3');
				return false;
			}
		}
		else
		{
			////var_dump('Paso aqui 4');
			return FALSE;
		}


}

function check_event_route_trigger($ed, $ud, $loc)
{
	global $ms;

	$user_id = $ed['user_id'];
	$route_trigger = $ed['route_trigger'];
	$routes = $ed['routes'];
	$lat = $loc['lat'];
	$lng = $loc['lng'];

	if (($route_trigger == '') || ($route_trigger == 'off'))
	{
		return true;
	}

	if ($route_trigger == 'in')
	{
		$q = "SELECT * FROM `gs_user_routes` WHERE `user_id`='".$user_id."' AND `route_id` IN (".$routes.")";
		$r = mysqli_query($ms, $q);

		if (!$r) {return false;}

		while($route = mysqli_fetch_array($r))
		{
			$dist = isPointOnLine($route['route_points'], $loc['lat'], $loc['lng']);

			// get user units and convert if needed
			$units = explode(",", $ud['units']);
			$dist = convDistanceUnits($dist, 'km', $units[0]);

			if ($dist <= $route['route_deviation'])
			{
				////var_dump('ruta: '.$route['route_deviation']);
				return true;
			}
		}
	}

	if ($route_trigger == 'out')
	{
		$q = "SELECT * FROM `gs_user_routes` WHERE `user_id`='".$user_id."' AND `route_id` IN (".$routes.")";
		$r = mysqli_query($ms, $q);

		if (!$r) {return false;}

		$in_routes = false;

		while($route = mysqli_fetch_array($r))
		{
			$dist = isPointOnLine($route['route_points'], $loc['lat'], $loc['lng']);

			// get user units and convert if needed
			$units = explode(",", $ud['units']);
			$dist = convDistanceUnits($dist, 'km', $units[0]);

			if ($dist <= $route['route_deviation'])
			{
				$in_routes = true;
				break;
			}
		}

		if ($in_routes == false)
		{
			return true;
		}
	}

	return false;
}

function check_event_zone_trigger($ed, $ud, $loc)
{
	global $ms;

	$user_id = $ed['user_id'];
	$zone_trigger = $ed['zone_trigger'];
	$zones = $ed['zones'];
	$lat = $loc['lat'];
	$lng = $loc['lng'];

	if (($zone_trigger == '') || ($zone_trigger == 'off'))
	{
		return false;
	}

	if ($zone_trigger == 'in')
	{
		$q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."' AND `zone_id` IN (".$zones.")";
		$r = mysqli_query($ms, $q);

		if (!$r) {return false;}

		while($zone = mysqli_fetch_array($r))
		{
			$in_zone = isPointInPolygon($zone['zone_vertices'], $lat, $lng);

			if ($in_zone)
			{
				return true;
			}
		}
	}

	if ($zone_trigger == 'out')
	{
		$q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."' AND `zone_id` IN (".$zones.")";
		$r = mysqli_query($ms, $q);

		if (!$r) {return false;}

		$in_zones = false;

		while($zone = mysqli_fetch_array($r))
		{
			$in_zone = isPointInPolygon($zone['zone_vertices'], $lat, $lng);

			if ($in_zone)
			{
				$in_zones = true;
				break;
			}
		}

		if ($in_zones == false)
		{
			return true;
		}
	}

	return false;
}

?>
