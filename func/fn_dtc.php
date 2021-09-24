<?
	session_start();
	include ('/var/www/html/track/init.php');
	include ('fn_common.php');
	checkUserSession();
	
	loadLanguage($_SESSION["language"], $_SESSION["units"]);
	
	// check privileges
	if ($_SESSION["privileges"] == 'subuser')
	{
		$user_id = $_SESSION["manager_id"];
	}
	else
	{
		$user_id = $_SESSION["user_id"];
	}
	
	if(@$_GET['cmd'] == 'load_dtc_list')
	{
		$imei = @$_GET['imei'];
		
		$page = $_GET['page']; // get the requested page
		$limit = $_GET['rows']; // get how many rows we want to have into the grid
		$sidx = $_GET['sidx']; // get index row - i.e. user click to sort
		$sord = $_GET['sord']; // get the direction
		
		if(!$sidx) $sidx =1;
		
		 // get records number		
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".$_SESSION["privileges_imei"].")";
		}
		else
		{
			$q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".getUserObjectIMEIs($user_id).")";
		}
		
		if (isset($imei))
		{
			$q .= ' AND `imei`="'.$imei.'"';
		}
		
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			$q .= " AND dt_server BETWEEN '".convUserUTCTimezone($_GET['dtf'])."' AND '".convUserUTCTimezone($_GET['dtt'])."'";
		}
		
		$r = mysqli_query($ms, $q);
		
		if (!$r){die;}
		
		$count = mysqli_num_rows($r);
		
		if ($count > 0)
		{
			$total_pages = ceil($count/$limit);
		}
		else
		{
			$total_pages = 1;
		}
		
		if ($page > $total_pages) $page=$total_pages;
		$start = $limit*$page - $limit; // do not put $limit*($page - 1)
				
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".$_SESSION["privileges_imei"].")";
		}
		else
		{
			$q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".getUserObjectIMEIs($user_id).")";
		}
		
		if (isset($imei))
		{
			$q .= ' AND `imei`="'.$imei.'"';
		}
		
		if (isset($_GET['dtf']) && isset($_GET['dtt']))
		{
			$q .= " AND dt_server BETWEEN '".convUserUTCTimezone($_GET['dtf'])."' AND '".convUserUTCTimezone($_GET['dtt'])."'";
		}
		
		$q .=  " ORDER BY $sidx $sord LIMIT $start, $limit";
		$r = mysqli_query($ms, $q);
		
		$response = new stdClass();
		$response->page = $page;
		$response->total = $total_pages;
		$response->records = $count;

		if ($r)
		{		
			$i=0;
			while($row = mysqli_fetch_array($r))
			{
				$dtc_id = $row['dtc_id'];
				$dt_tracker = convUserTimezone($row['dt_tracker']);
				$imei = $row['imei'];
				//$code = strtoupper($row["code"]);
                
                $codeclean = ltrim(rtrim(strtoupper($row["code"])));
				$imei2 = ltrim(rtrim($imei));
				$lat = $row["lat"];
				$lng = $row["lng"];
                
                $q2 = "select descripcion from st_codigos_dtc, gs_objects 
						where codigo = '".$codeclean."' 
						and st_codigos_dtc.tipo in ('Generico',substr(model,0,Locate('/',model)-1 )) 
						and gs_objects.imei = '".$imei2."' limit 1;";
						
					
				$r2 = mysqli_query($ms, $q2);
                
                while($row2 = mysqli_fetch_array($r2))
				{
					$model = $row2['descripcion'];
				}
				$marca = $model;
				
				
				$code = '<a href="#" title="'.$marca.'">'.$codeclean.'</a>';
				
				$object_name = getObjectName($imei);
				
				$lat = sprintf('%0.6f', $lat);
				$lng = sprintf('%0.6f', $lng);
				
				$position = '<a href="http://maps.google.com/maps?q='.$lat.','.$lng.'&t=m" target="_blank">'.$lat.' &deg;, '.$lng.' &deg;</a>';
				
				if ($row["address"] != '')
				{
					$position .= ' - '.$row["address"];	
				}
				
				// set modify buttons
				$modify = '</a><a href="#" onclick="dtcDelete(\''.$dtc_id.'\');" title="'.$la['DELETE'].'"><img src="theme/images/remove3.svg" /></a>';
				
				// set row
				$response->rows[$i]['id']=$dtc_id;
				$response->rows[$i]['cell']=array($dt_tracker,$object_name,$code,$position,$modify);
				$i++;
			}
         // $mysqli->close();
		}
		
		header('Content-type: application/json');
		echo json_encode($response);
		die;
	}
	
	if(@$_POST['cmd'] == 'delete_record')
	{
		$dtc_id = $_POST["dtc_id"];
		
		$q = "DELETE FROM `gs_dtc_data` WHERE `dtc_id`='".$dtc_id."'";
		$r = mysqli_query($ms, $q);
		
		echo 'OK';
		die;
	}
	
	if(@$_POST['cmd'] == 'delete_selected_records')
	{
		$items = $_POST["items"];
		
		for ($i = 0; $i < count($items); ++$i)
		{
			$item = $items[$i];
			
			$q = "DELETE FROM `gs_dtc_data` WHERE `dtc_id`='".$item."'";
			$r = mysqli_query($ms, $q);
		}
		
		echo 'OK';
		die;
	}
	
	if(@$_POST['cmd'] == 'delete_all_records')
	{		
		if ($_SESSION["privileges"] == 'subuser')
		{
			$q = "DELETE FROM `gs_dtc_data` WHERE `imei` IN (".$_SESSION["privileges_imei"].")";
		}
		else
		{
			$q = "DELETE FROM `gs_dtc_data` WHERE `imei` IN (".getUserObjectIMEIs($user_id).")";
		}
		
		$r = mysqli_query($ms, $q);
		
		echo 'OK';
		die;
	}
?>
