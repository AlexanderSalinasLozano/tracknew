<?
	// $loc - location data array
	// $ed - event data array
	// $ud - user data array
	// $od - object data array
	
	function check_events($loc, $loc_events, $params_events, $service_events,$loc_events2)
	{

				// check_events($loc, true, true, false);
				

				// check_events($loc, false, false, false);
        // //var_dump($loc['event']);
		global $ms;
		
		$q = "SELECT gs_objects.*, gs_user_objects.*
				FROM gs_objects
				INNER JOIN gs_user_objects ON gs_objects.imei = gs_user_objects.imei
				WHERE gs_user_objects.imei='".$loc['imei']."'";
			
		$r = mysqli_query($ms, $q);
		
		while($od = mysqli_fetch_array($r))
		{
			// get user data
			$q2 = "SELECT * FROM `gs_users` WHERE `id`='".$od['user_id']."'";
            
			$r2 = mysqli_query($ms, $q2);
			$ud = mysqli_fetch_array($r2);
			
			// events loop
			$q2 = "SELECT * FROM `gs_user_events` WHERE `user_id`='".$od['user_id']."' AND UPPER(`imei`) LIKE '%".$loc['imei']."%'";
           	
			$r2 = mysqli_query($ms, $q2);
			
			while($ed = mysqli_fetch_array($r2))
			{			
				if ($ed['active'] == 'true')
				{	

							
					//SE CIERRA EL IF DE LOC_EVENT EN LINEA 74
					if ($loc_events == true)
					
					   {
							if ($ed['type'] == 'overspeed')
							{                           
								event_overspeed($ed,$ud,$od,$loc);                           
							}
							if ($ed['type'] == 'underspeed')
							{
								event_underspeed($ed,$ud,$od,$loc);
							}
							if ($ed['type'] == 'route_in')
							{
								event_route_in($ed,$ud,$od,$loc);
							}
							if ($ed['type'] == 'route_out')
							{    
								//var_dump('SALIDA DE RUTA');
								event_route_out($ed,$ud,$od,$loc);
							}
							if ($ed['type'] == 'zone_in')
							{
								//var_dump('TIPO ENTRADA');
								//var_dump($ed['type']);
								event_zone_in($ed,$ud,$od,$loc);
								
							}
							if ($ed['type'] == 'zone_out')
							{	
								//var_dump('TIPO SALIDA');
								//var_dump($ed['type']);
								event_zone_out($ed,$ud,$od,$loc);
							}
							if ($ed['type'] == 'overspeedD')
							{	
								// var_dump('-------------------------');
								// var_dump("Dinamico");
								// var_dump($ed['type']);
								overspeedDinamico($ed,$ud,$od,$loc);
								
							}
							if ($ed['type'] == 'overspeedT')
							{	
								// var_dump('-------------------------');
								// var_dump("Tiempo");
								// var_dump($ed['type']);
								event_overspeedT($ed,$ud,$od,$loc);
								
							}
					  	}					
					// check for params events
					if ($params_events == true)
				      {
						if ($ed['type'] == 'param')
						{
							event_param($ed,$ud,$od,$loc);
						}
						
						if ($ed['type'] == 'sensor')
						{
							event_sensor($ed,$ud,$od,$loc);
						}	
				       }
					
					// check for service events
				    if ($service_events == true)
					 {
						if (($ed['type'] == 'connyes') || ($ed['type'] == 'connno'))
						{
							event_connection($ed,$ud,$od,$loc);
						}
						
						if (($ed['type'] == 'gpsyes') || ($ed['type'] == 'gpsno'))
						{
							event_gps($ed,$ud,$od,$loc);
						}
						
						if (($ed['type'] == 'stopped') || ($ed['type'] == 'moving') || ($ed['type'] == 'engidle'))
						{
							// var_dump("entro aqui 1");
							event_stopped_moving_engidle($ed,$ud,$od,$loc);
						}
					}
                    //REPORTE PRUEBAS NUEVAS.
					if ($loc_events2 == true)
					
					  {
						 if ($ed['type'] == 'overspeed')
						 {                           
							 event_overspeed($ed,$ud,$od,$loc);                           
						 }
					  }	
			
					// check for GPS tracker events
					if (!isset($loc['event']))
					{
						continue;
					}

					
					if (($ed['type'] == 'desconex') && ($loc['event'] == 'desconexion'))
					{
						event_tracker($ed,$ud,$od,$loc);
						print_r($ed);
					
					}
					
					if (($ed['type'] == 'conex') && ($loc['event'] == 'conexion'))
					{
						event_tracker($ed,$ud,$od,$loc);
						print_r($ed);
					}

					
					if (($ed['type'] == 'sos') && ($loc['event'] == 'sos'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'bracon') && ($loc['event'] == 'bracon'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'bracoff') && ($loc['event'] == 'bracoff'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'mandown') && ($loc['event'] == 'mandown'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'shock') && ($loc['event'] == 'shock'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'tow') && ($loc['event'] == 'tow'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'haccel') && ($loc['event'] == 'haccel'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'hbrake') && ($loc['event'] == 'hbrake'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'hcorn') && ($loc['event'] == 'hcorn'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'pwrcut') && ($loc['event'] == 'pwrcut'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'gpsantcut') && ($loc['event'] == 'gpscut'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					if (($ed['type'] == 'lowdc') && ($loc['event'] == 'lowdc'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
										
					/*if (($ed['type'] == 'lowbat') && ($loc['event'] == 'lowbat'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}*/
					
					if (($ed['type'] == 'jamming') && ($loc['event'] == 'jamming'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
					
					/*if (($ed['type'] == 'dtc') && (substr($loc['event'], 0, 3) == 'dtc'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}*/
					
					if (($ed['type'] == 'DTC') && ($loc['event'] == 'DTC'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}

					if (($ed['type'] == 'low battery') && ($loc['event'] == 'low battery'))
					{
						event_tracker($ed,$ud,$od,$loc);
					}
				}
			}
		
	 }
	
	
    }
