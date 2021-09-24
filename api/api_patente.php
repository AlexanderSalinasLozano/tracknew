<?

	$data = json_decode(file_get_contents("php://input"), true);	
	$loc = $data;
       
        $mysqli = new mysqli('10.118.144.7', 'stech', 'Stech#306..,', 'gpsimple');   
        
        $q1  = "SELECT user,password,empresa FROM st_user_proveedor where user='".$loc['user']."' and password='".$loc['password']."' and empresa='".$loc['empresa']."'";
	$r1 = mysqli_query($mysqli, $q1);

        if($row1 = mysqli_fetch_row($r1)){	
		
		$q2  = "SELECT imei FROM st_otros_proveedores where grupo='".$loc['empresa']."' and patente='".$loc['patente']."' and proveedor='".$loc['user']."'";
		$r2 = mysqli_query($mysqli, $q2);
 
		if($row2 = mysqli_fetch_row($r2)){	

                        $q3 = "SELECT * FROM gs_object_data_".$row2[0]." WHERE dt_tracker BETWEEN '".$loc['inicio']."' and '".$loc['fin']."'";
                        //echo $q3;
                        $r3 = mysqli_query($mysqli, $q3);
                        $i = 0;
                        while($row3 = mysqli_fetch_assoc($r3)){
                        $result[$i++] = array('dt_tracker' => $row3['dt_tracker'],
                                                'lat' => $row3['lat'],
                                                'lng' => $row3['lng'],
                                                'altitude' => $row3['altitude'],
                                                'angle' => $row3['angle'],
                                                'speed' => $row3['speed']);  
                        }

		}else{
			$result = array("status" => "Patente invalida");	
		}	
	}else{
		$result = array("status" => "Usuario o password invalida");				
	}
               
        header('Content-type: application/json');
	if($i == 0) {
		$result = array("status" => "Sin Datos");
	}      

	echo json_encode($result);  

?>
