<?

	$data = json_decode(file_get_contents("php://input"), true);	
	$loc = $data;
       
        $mysqli = new mysqli('10.118.144.7', 'stech', 'Stech#306..,', 'gpsimple');   
        
        $q1  = "SELECT user,password,empresa FROM st_user_proveedor where user='".$loc['user']."' and password='".$loc['password']."' and empresa='".$loc['empresa']."'";
	$r1 = mysqli_query($mysqli, $q1);

        if($row1 = mysqli_fetch_row($r1)){	
                
                /*
		$q2  = "SELECT imei FROM st_otros_proveedores where grupo='".$loc['empresa']."' and patente='".$loc['patente']."' and proveedor='".$loc['user']."'";
		$r2 = mysqli_query($mysqli, $q2);
               
               
                if($row2 = mysqli_fetch_row($r2)){	
                 */
                        /* $q3 = "SELECT * FROM gs_object_data_".$row2[0]." WHERE dt_tracker BETWEEN '".$loc['inicio']."' and '".$loc['fin']."'"; */
                        $q3 = "
                        SELECT gs_objects.plate_number,
                                SUBSTRING(gs_objects.model,1,locate('/',gs_objects.model)-1) as 'marca',
                                SUBSTRING(gs_objects.model,locate('/',gs_objects.model)+1,LENGTH(gs_objects.model)) as 'modelo',
                                gs_objects.lat,
                                gs_objects.lng,
                                gs_objects.dt_tracker,
                                gs_objects.speed,
                                gs_objects.angle 
                                FROM gs_objects,gs_user_objects
                                WHERE gs_user_objects.user_id = 434 
                                AND gs_user_objects.group_id = 465
                                AND  gs_user_objects.imei = gs_objects.imei";        


                        //echo $q3;
                        $r3 = mysqli_query($mysqli, $q3);
                        $i = 0;
                        while($row3 = mysqli_fetch_assoc($r3)){
                        $result[$i++] = array(  'Pat'           => $row3['plate_number'],
                                                'Mar'           => $row3['marca'],
                                                'Mod'           => $row3['modelo'],
                                                'lat'           => $row3['lat'],
                                                'lng'           => $row3['lng'],
                                                'dt_tracker'    => $row3['dt_tracker'],
                                                'speed'         => $row3['speed'],
                                                'angle'         => $row3['angle']
                                        );  
                        }

                /*
                }
                */	
                
	}else{
		$result = array("status" => "Usuario o password invalida");				
	}
               
        header('Content-type: application/json');
	if($i == 0) {
		$result = array("status" => "Sin Datos");
	}      

	echo json_encode($result);  

?>
