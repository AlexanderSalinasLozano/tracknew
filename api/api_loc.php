<?	
	include ('/var/www/html/track/server/s_insert.php');
    include ('/var/www/html/track/server/eventos.php');
	$data = json_decode(file_get_contents("php://input"), true);	
	$loc = $data;

	$mysqli = new mysqli('10.118.144.7', 'stech', 'Stech#306..,', 'gpsimple');
	$q1  = "SELECT user,password,empresa FROM st_user_proveedor where user='".$loc['user']."' and password='".$loc['password']."' and empresa='".$loc['empresa']."'";
	$r1 = mysqli_query($mysqli, $q1);	

	if($row1 = mysqli_fetch_row($r1)){	
		
		$q2  = "SELECT imei FROM st_otros_proveedores where grupo='".$loc['empresa']."' and imei='".$loc['imei']."' and proveedor='".$loc['user']."'";
		$r2 = mysqli_query($mysqli, $q2);

		if($row2 = mysqli_fetch_row($r2)){	

			$loc['protocol'] = $loc['user'];
			$loc['net_protocol'] = '';
			$loc['ip'] = '';
			$loc['port'] = '';
			$loc['loc_valid'] = '1';
			$loc['dt_server'] = gmdate("Y-m-d H:i:s");

		insert_db_loc($loc);
		$mensaje = array("status" => "Ok");	

		}else{
			$mensaje = array("status" => "IMEI invalido");	
		}	
	}else{
		$mensaje = array("status" => "Usuario o password invalido");				
	}
	echo json_encode($mensaje);
	mysqli_close($ms);
	die;
?>
