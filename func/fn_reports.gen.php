
<?php
    set_time_limit(0);

    // check if reports are called by user or service
    if (!isset($_POST['schedule'])) {
        session_start();
    }

    include('/var/www/html/track/init.php');
    include('fn_common.php');
    include('fn_route.php');
    include('/var/www/html/track/tools/gc_func.php');
    include('/var/www/html/track/tools/email.php');
    include('/var/www/html/track/tools/html2pdf.php');

    // check if reports are called by user or service


    if(@$_POST['cmd'] == 'reportApi'){

        // var_dump("hola api");
        $report = reportsGenerate();
        // var_dump($_POST);

        if ($report != false) {

            // var_dump("hola api if");

             echo($report);
        }

    }

    if (isset($_POST['schedule'])) {
        $_SESSION = getUserData($_POST['user_id']);
        loadLanguage($_SESSION["language"], $_SESSION["units"]);
    } else {
        checkUserSession();
        loadLanguage($_SESSION["language"], $_SESSION["units"]);
    }

    if (@$_POST['cmd'] == 'report') {
        // check privileges
        if ($_SESSION["privileges"] == 'subuser') {
            $user_id = $_SESSION["manager_id"];
        } else {
            $user_id = $_SESSION["user_id"];
        }

        // generate or send report to e-mail
        if (isset($_POST['schedule'])) {
            //check user usage
            if (!checkUserUsage($user_id, 'email')) {
                die;
            }

            reportsSend();
        } else {
            $report = reportsGenerate();

            if ($report != false) {
                echo ($report);
            }
        }

        die;
    }

    function reportsSend()
    {
        global $_POST, $la, $user_id;

        $subject = $la['REPORT'].' - '.$_POST['name'];

        $message = $la['HELLO'].",\r\n\r\n";
        $message .=  $la['THIS_IS_REPORT_MESSAGE'];

        $filename = $_POST['type'].'_'.$_POST['dtf'].'_'.$_POST['dtt'].'.'.$_POST['format'];
        $report = reportsGenerate();



        if ($report != false) {
            $result = sendEmail($_POST['email'], $subject, $message, true, $filename, $report);

            if ($result) {
                //update user usage
                updateUserUsage($user_id, false, $result, false, false);
            }
        }

        die;
    }

    function reportsGenerate()
    {
        global $_POST, $ms, $gsValues, $user_id,$_COOKIE;

        // $menorA = false;
        // $mayorA = false;

        $name = $_POST['name'];
        $type = $_POST['type'];
        $format = $_POST['format'];
        $show_coordinates = $_POST['show_coordinates'];
        $show_addresses = $_POST['show_addresses'];
        $zones_addresses = $_POST['zones_addresses'];
        $stop_duration = $_POST['stop_duration'];
        $speed_limit = $_POST['speed_limit'];
        $imei = $_POST['imei'];
        $zone_ids = $_POST['zone_ids'];
        $sensor_names = $_POST['sensor_names'];
        $data_items = $_POST['data_items'];
        $dtf = $_POST['dtf'];
        $dtt = $_POST['dtt'];

        $menorA = 0;
        $mayorA = 0;
        $cantidadR = 0;
        $vel_superior_a = 0;
		$vel_rutas = 0;
		$diferencial_velocidad = 0;

        if(isset($_POST['menor_a'])){
            $menorA = $_POST['menor_a'];
        }

        if(isset($_POST['mayor_a'])){
            $mayorA = $_POST['mayor_a'];
        }

        if(isset($_POST['cantidad_reportes'])){
            $cantidadR = $_POST['cantidad_reportes'];
        }

        if(isset($_POST['filtro_uno'])){
            $vel_superior_a = $_POST["filtro_uno"];
        }

        if(isset($_POST['filtro_dos'])){
            $vel_rutas = $_POST["filtro_dos"];
        }

        if(isset($_POST['filtro_tres'])){
            $diferencial_velocidad = $_POST["filtro_tres"];
        }

         //DESARROLLO REPORTE 3 HORAS
         $cantidadhoras = 0;
         $fechaenvio = "00:00:00";
 
         if(isset($_POST['cantidad_horas'])){
             $cantidadhoras = $_POST["cantidad_horas"];
         }
 
         if(isset($_POST['fecha_envio'])){
             $fechaenvio = $_POST["fecha_envio"];
         }

        // $cantidadR = $_POST['cantidad_reportes'];
        // $vel_superior_a = $_POST["filtro_uno"];
		// $vel_rutas = $_POST["filtro_dos"];
		// $diferencial_velocidad = $_POST["filtro_tres"];

        $id_usuario =null;
        $falsopositivo = false;
        $prive='admin';

        if(isset($_POST["id_empresa"])){
            $id_usuario = $_POST["id_empresa"]; 
        }
       
        if(isset($_POST["fp"])){
           $falsopositivo = $_POST["fp"]; 
        }

        if(isset($_SESSION["privileges"])){
            $prive=$_SESSION["privileges"];
        }

        // check if object is not removed from system and also if it is active
        $imeis = array();
        $imeisApi = array();

        $imeis_ = explode(",", $imei);
        for ($i=0; $i<count($imeis_); ++$i) {
            $imei = $imeis_[$i];

            if (checkObjectActive($imei)) {
                if ($prive == 'subuser') {
                    if (checkSubuserToObjectPrivileges($_SESSION["privileges_imei"], $imei)) {
                        $imeis[] = $imei;
                    }
                } else {
                    if (checkUserToObjectPrivileges($user_id, $imei)) {
                        $imeis[] = $imei;
                    }

                $imeisApi[] = $imei;


                }
            }
        }

        if($format == 'json'){

            $report = array();

            //  var_dump(count($imeisApi));
            for ($i=0; $i<count($imeisApi); ++$i) {

                $imei = $imeisApi[$i];
                //  var_dump($imei);
                $arrayReport = reportsGenerateTravelSheet2Json($id_usuario, $imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                array_push($report,$arrayReport);

              }
            //   print_r(json_encode($report));
              return json_encode($report);

            }elseif($format == 'rep_rag'){
                $report = array();
                  //var_dump(count($imeisApi));
                // for ($i=0; $i<count($imeisApi); ++$i) {
                    //  $imei = $imeisApi[$i];
                     $arrayReport = reportsGenerateRagApi($id_usuario,$imeisApi, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $data_items);

                     array_push($report,$arrayReport);
                // }
                 return json_encode($report);

            }elseif($format == 'rep_event'){
                $report = array();
                //  var_dump(count($imeisApi));
                for ($i=0; $i<count($imeisApi); ++$i) {
                     $imei = $imeisApi[$i];
                     $arrayReport = reportsGenerateEventsApi($id_usuario,$imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                     array_push($report,$arrayReport);
                }
                return json_encode($report);
            }elseif($format == 'rep_veldin'){
                $report = array();
                //  var_dump(count($imeisApi));
                for ($i=0; $i<count($imeisApi); ++$i) {

                     $imei = $imeisApi[$i];
                     $arrayReport =reportsGenerateOverspeed3Api($falsopositivo,$id_usuario,$imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                     array_push($report,$arrayReport);
                }
                return json_encode($report);
            }




        if (count($imeis) == 0) {
            return false;
        }

        $data_items = explode(',', $data_items);

        $report_html = reportsAddHeaderStart($format);
        $report_html .= reportsAddStyle($format);
        $report_html .= reportsAddJS($type);
        $report_html .= reportsAddHeaderEnd();

        if (($format == 'html') || ($format == 'pdf')) {
            $report_html .= '<img class="logo" src="'.$gsValues['URL_ROOT'].'/img/'.$gsValues['LOGO'].'" /><hr/>';
        }

        $report_html .= reportsGenerateLoop($type, $imeis, $dtf, $dtt, $speed_limit, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $sensor_names, $data_items,$menorA,$mayorA,$cantidadR,$vel_superior_a,$vel_rutas, $diferencial_velocidad,$cantidadhoras,$fechaenvio);
        $report_html .= '</body></html>';

        $report = $report_html;

        if ($format == 'pdf') {
            $report = html2pdf($report);
        }

        if (!isset($_POST['schedule'])) {
            $report = base64_encode($report);
        }

        // store generated report
        if ($zone_ids != '') {
            $zones = count(explode(",", $zone_ids));
        } else {
            $zones = 0;
        }

        if ($sensor_names != '') {
            $sensors = count(explode(",", $sensor_names));
        } else {
            $sensors = 0;
        }

        if (isset($_POST['schedule'])) {
            $schedule = 'true';
        } else {
            $schedule = 'false';
        }

        $filename = $type.'_'.$dtf.'_'.$dtt;

        $report_file = $user_id.'_'.md5($type.$dtf.$dtt.gmdate("Y-m-d H:i:s").rand());
        $file_path = $gsValues['PATH_ROOT'].'data/user/reports/'.$report_file;

        $report_html = base64_encode($report_html);

        $fp = fopen($file_path, 'wb');
        fwrite($fp, $report_html);
        fclose($fp);

        if (is_file($file_path)) {
            $q = "INSERT INTO `gs_user_reports_generated`(	`user_id`,
									`dt_report`,
									`name`,
									`type`,
									`format`,
									`objects`,
									`zones`,
									`sensors`,
									`schedule`,
									`filename`,
									`report_file`)
									VALUES
									('".$user_id."',
									'".gmdate("Y-m-d H:i:s")."',
									'".$name."',
									'".$type."',
									'".$format."',
									'".count($imeis)."',
									'".$zones."',
									'".$sensors."',
									'".$schedule."',
									'".$filename."',
									'".$report_file."')";
            $r = mysqli_query($ms, $q);
        }

        return $report;
    }

    function reportsGenerateLoop($type, $imeis, $dtf, $dtt, $speed_limit, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $sensor_names, $data_items,$menorA,$mayorA,$cantidadR,$vel_superior_a,$vel_rutas,$diferencial_velocidad,$cantidadhoras,$fechaenvio)
    {
        global $la, $ms;

        $result = '';
        $valida = 0;

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];

            if ($type == "general") { //GENERAL_INFO
                $result .= '<h3>'.$la['GENERAL_INFO'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGenInfo($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $stop_duration, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "drives_stops") { //DRIVES_AND_STOPS
                $result .= '<h3>'.$la['DRIVES_AND_STOPS'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateDrivesAndStops($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "drives_stops2") { //DRIVES_AND_STOPS
                if ($valida == 0) {
                    $result .= '<h3>'.$la['DRIVES_AND_STOPS'].'</h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>Inicio</th>';
                    $result .= '<th>Fin</th>';
                    $result .= '<th>Duración</th>';
                    $result .= '<th>Longitud</th>';
                    $result .= '<th>Velocidad Maxima</th>';
                    $result .= '<th>Velocidad Promedio</th>';
                    $result .= '<th>Motor Inactivo</th>';
                    $result .= '<th>Dirección Detención</th>';
                    $result .= '</tr>';
                    $valida = 1;
                }
                //$result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateDrivesAndStops2($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
            //$result .= '<br/><hr/>';
            } elseif ($type == "drives_stops3") { //DRIVES_AND_STOPS
                if ($valida == 0) {
                    $result .= '<h3>'.$la['DRIVES_AND_STOPS'].'</h3>';
                    $result = '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th rowspan="2"> Patente </th>';
                    $result .= '<th rowspan="2">'.$la['STATUS'].'</th>';
                    $result .= '<th rowspan="2">'.$la['START'].'</th>';
                    $result .= '<th rowspan="2">'.$la['END'].'</th>';
                    $result .= '<th rowspan="2">'.$la['DURATION'].'</th>';
                    $result .= '<th colspan="3">'.$la['STOP_POSITION'].'</th>';
                    $result .= '<th rowspan="2">'.$la['FUEL_CONSUMPTION'].'</th>';
                    $result .= '<th rowspan="2">'.$la['FUEL_COST'].'</th>';
                    $result .= '<th rowspan="2">'.$la['ENGINE_IDLE'].'</th>';
                    $result .= '</tr>';
                    $result .= '<tr align="center">
					<th>'.$la['LENGTH'].'</th>
					<th>'.$la['TOP_SPEED'].'</th>
					<th>'.$la['AVG_SPEED'].'</th>
					</tr>';
                    $valida = 1;
                }
                //$result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateDrivesAndStops3($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
            //$result .= '<br/><hr/>';
            } elseif ($type == "travel_sheet") { //TRAVEL_SHEET
                $result .= '<h3>'.$la['TRAVEL_SHEET'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateTravelSheet($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "hoja_viaje_excel") {
                if ($valida == 0) {
                    $result .= '<h3>Hoja de Viaje</h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>Time A</th>';
                    $result .= '<th>Posicion A</th>';
                    $result .= '<th>Time B</th>';
                    $result .= '<th>Posicion B</th>';
                    $result .= '<th>Duracion</th>';
                    $result .= '<th>Longitud</th>';
                    $result .= '</tr>';
                    $valida = 1;
                }
                //$valida = 1;
                $q2 = "SELECT speed FROM gs_object_data_".$imei." WHERE speed > 0 AND dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' LIMIT 1";

                $r2 = mysqli_query($ms, $q2);

                while ($row2 = mysqli_fetch_row($r2)) {
                    if ($row2[0] = '') {
                    } else {
                        $result .= reportsGenerateTravelSheet2($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                    }
                }
                //$result .= '</table>';
            } elseif ($type == "mileage_daily") { //MILEAGE_DAILY
                $result .= '<h3>'.$la['MILEAGE_DAILY'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateMileageDaily($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $data_items, $show_coordinates, $show_addresses, $zones_addresses);
                $result .= '<br/><hr/>';
			} elseif ($type == "overspeed") { //OVERSPEED
				/*if ($valida == 0) {
                    $result .= '<h3>Excesos de Velocidad</h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>'.$la['START'].'</th>';
                    $result .= '<th>'.$la['END'].'</th>';
                    $result .= '<th>'.$la['DURATION'].'</th>';
                    $result .= '<th>'.$la['TOP_SPEED'].'</th>';
                    $result .= '<th>'.$la['AVG_SPEED'].'</th>';
                    //$result .= '<th>RPM</th>';
                    $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
                    $result .= '</tr>';
                    $valida = 1;
				}*/
                $q2 = "SELECT speed FROM gs_object_data_".$imei." WHERE speed > ".$speed_limit. " AND dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' LIMIT 1";

                $r2 = mysqli_query($ms, $q2);

                while ($row2 = mysqli_fetch_row($r2)) {
                    //$valida = 1;
                    if ($row2[0] = '') {
                        //$result .= '<h3>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</h3>';
                    } else {
                        $result .= '<h3>'.$la['OVERSPEEDS'].'</h3>';
                        $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                        $result .= reportsGenerateOverspeed($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                        $result .= '<br/><hr/>';
                    }
                }

                /*if ($valida == 0){

                        $result .= '<h3>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</h3>';
                        $valida = 1;

                    }*/
                }

            elseif ($type == "overspeedT") {
            
                $result .= '<h3>'.$la['OVERSPEEDS'].' en geocerca por más de un minuto </h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= overSpeedGeoMinPrueba($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA);
                $result .= '<br/><hr/>';
            }
            
              //Reporte exceso de velocidad personalizado niveles medidos: leve, medio, critico.
             elseif ($type == "overspeedLmc") {


                $q2 = "SELECT speed FROM gs_object_data_".$imei." WHERE speed > ".$speed_limit. " AND dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' LIMIT 1";

                $r2 = mysqli_query($ms, $q2);

                    while ($row2 = mysqli_fetch_row($r2)) {
                        //$valida = 1;
                        if ($row2[0] = '') {
                        } else {
                        $result .= '<h3>'.$la['OVERSPEEDS'].'</h3>';
                        $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                        $result .= reportsGenerateOverspeedLmc($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$menorA,$mayorA);
                        $result .= '<br/><hr/>';
                           }
                    }
             }
             elseif ($type == "overspeedLmcE") {

                if ($valida == 0) {
                    $result .= '<h3>'.$la['OVERSPEEDS'].' Personalizado </h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>Nombre</th>';
                    $result .= '<th>Grupo</th>';
                    $result .= '<th>Mes</th>';
                    $result .= '<th>'.$la['START'].'</th>';
                    $result .= '<th>'.$la['END'].'</th>';
                    $result .= '<th>'.$la['DURATION'].'</th>';
                    $result .= '<th>'.$la['TOP_SPEED'].'</th>';
                    $result .= '<th>'.$la['AVG_SPEED'].'</th>';
                    $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
                    $result .= '<th>'."Diferencial".'</th>';
                    $result .= '<th>Clasificacion de eventos</th>';
                    $result .= '</tr>';
                    $valida = 1;
                }
                // $result .='</table>';

                $q2 = "SELECT speed FROM gs_object_data_".$imei." WHERE speed > ".$speed_limit. " AND dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' LIMIT 1";

                $r2 = mysqli_query($ms, $q2);

                    while ($row2 = mysqli_fetch_row($r2)) {
                        //$valida = 1;
                        if ($row2[0] = '') {
                        } else {
                        // $result .= '<h3>'.$la['OVERSPEEDS'].'</h3>';
                        // $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                        $result .= reportsGenerateOverspeedLmcE($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$menorA,$mayorA);
                           }

                    }


             }
             elseif ($type == "overSpeedGeo") {

                $result .= '<h3>'.$la['OVERSPEEDS'].' en geocerca </h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= overSpeedGeo($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA);
                $result .= '<br/><hr/>';

             }
             elseif ($type == "overSpeedGeoE") {

                // $result .= '<h3>'.$la['OVERSPEEDS'].' en geocerca </h3>';
                // // $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                // $result .= overSpeedGeoE($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids);
                // $result .= '<br/><hr/>';
                    if ($valida == 0) {

                        $result .= '<h3>'.$la['OVERSPEEDS'].' en geocerca </h3>';
                        $result .= '<table class="report" width="100%"><tr align="center">';
                        $result .= '<th>Patente</th>';
                        $result .= '<th>Nombre</th>';
                        $result .= '<th>Grupo</th>';
                        $result .= '<th>Mes</th>';
                        $result .= '<th>'."Fecha evento".'</th>';
                        // $result .= '<th>'.$la['END'].'</th>';
                        // $result .= '<th>'.$la['DURATION'].'</th>';
                        $result .= '<th>'.$la['TOP_SPEED'].'</th>';
                        // $result .= '<th>'.$la['AVG_SPEED'].'</th>';
                        $result .= '<th>'."Nombre Geocerca".'</th>';
                        $result .= '<th>'."Direccion".'</th>';
                        $result .= '<th>'."Diferencial".'</th>';
                        $result .= '<th>Clasificacion de evento</th>';
                        $result .= '<th>Nombre evento</th>';
                        $result .= '</tr>';
                        $valida = 1;
                    }
                    // if (strlen($zone_ids) > 6) {

                    //     return '<table><tr><td>Favor seleccione solo una geocerca a la vez para este reporte</td></tr></table>';

                    //     // return $result;
                    // }

                  $result .= overSpeedGeoE($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA);



                // $result .= '</table>';


             }
            elseif ($type == "overspeed2") { //OVERSPEED2
                if ($valida == 0) {
                    $result .= '<h3>Excesos de Velocidad</h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>Nombre</th>';
                    $result .= '<th>Grupo</th>';
                    $result .= '<th>'.$la['START'].'</th>';
                    $result .= '<th>'.$la['END'].'</th>';
                    $result .= '<th>'.$la['DURATION'].'</th>';
                    $result .= '<th>'.$la['TOP_SPEED'].'</th>';
                    $result .= '<th>'.$la['AVG_SPEED'].'</th>';
                    //$result .= '<th>RPM</th>';
                    $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
                    $result .= '</tr>';
                    $valida = 1;
                }
                //$valida = 1;
                $q2 = "SELECT speed FROM gs_object_data_".$imei." WHERE speed > 0 AND dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' LIMIT 1";

                $r2 = mysqli_query($ms, $q2);

                while ($row2 = mysqli_fetch_row($r2)) {
                    if ($row2[0] = '') {
                    } else {
                        $result .= reportsGenerateOverspeed2($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                    }
                }
            } elseif ($type == "overspeed3") {
                //$result .= '<h3>'.$la['RUTAS'].'</h3>';
                $result .= '<h3>Excesos de Velocidad Dinamica</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateOverspeed3($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            }
            elseif ($type == "overspeed3E") {
                //$result .= '<h3>'.$la['RUTAS'].'</h3>';
            if ($valida == 0) {
                $result .= '<h3>Excesos de Velocidad Dinamica (excel)</h3>';
                $result .= '<table class="report" width="100%"><tr align="center">';
                $result .= '<th>'.$la['OBJECT'].'</th>';
                $result .= '<th>Patente</th>';
                $result .= '<th>Grupo</th>';
                $result .= '<th>Fecha</th>';
                $result .= '<th>Velocidad Vehiculo</th>';
                $result .= '<th>Velocidad Esperada</th>';
                $result .= '<th>Velocidad Superada por</th>';
                $result .= '<th>Direccion de la Falta</th>';
                $result .= '</tr>';
                $valida = 1;
                }

                // $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateOverspeed3E($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                // $result .= '<br/>';
            }
            elseif ($type == "overspeed3H") {
                // $result .= '<h3>'.$la['RUTAS'].'</h3>';
                if ($valida == 0) {
                    $result .= '<h3>Excesos de Velocidad Dinamica (excel)</h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>'.$la['OBJECT'].'</th>';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>Grupo</th>';
                    $result .= '<th>Fecha</th>';
                    $result .= '<th>Velocidad Vehiculo</th>';
                    $result .= '<th>Velocidad Esperada</th>';
                    $result .= '<th>Velocidad Superada por</th>';
                    $result .= '<th>Direccion de la Falta</th>';
                    $result .= '</tr>';
                    $valida = 1;
                    }

                // $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateOverspeed3EH($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$cantidadhoras,$fechaenvio);
                // $result .= '<br/>';
            }
            elseif ($type == "overspeed3P") {
                //$result .= '<h3>'.$la['RUTAS'].'</h3>';
                $result .= '<h3>Excesos de Velocidad Dinamica</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateOverspeed3P($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$cantidadR,$vel_superior_a,$vel_rutas,$diferencial_velocidad);
                $result .= '<br/><hr/>';
            }  elseif ($type == "overspeed4") {
                if ($valida == 0) {
                    $result .= '<h3>Excesos de Velocidad</h3>';
                    $result .= '<table class="report" width="100%"><tr align="center">';
                    $result .= '<th>Patente</th>';
                    $result .= '<th>'.$la['START'].'</th>';
                    $result .= '<th>'.$la['END'].'</th>';
                    $result .= '<th>'.$la['DURATION'].'</th>';
                    $result .= '<th>'.$la['TOP_SPEED'].'</th>';
                    $result .= '<th>'.$la['AVG_SPEED'].'</th>';
                    $result .= '<th>RPM</th>';
                    $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
                    $result .= '</tr>';
                    $valida = 1;
                }
                //$valida = 1;
                $q2 = "SELECT speed FROM gs_object_data_".$imei." WHERE speed > 0 AND dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' LIMIT 1";

                $r2 = mysqli_query($ms, $q2);

                while ($row2 = mysqli_fetch_row($r2)) {
                    if ($row2[0] = '') {
                    } else {
                        $result .= reportsGenerateOverspeed4($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                    }
                }
            } elseif ($type == "underspeed") { //UNDERSPEED
                $result .= '<h3>'.$la['UNDERSPEEDS'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateUnderspeed($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "zone_in_out") { //ZONE_IN_OUT
                $result .= '<h3>'.$la['ZONE_IN_OUT'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateZoneInOut($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items);
                $result .= '<br/><hr/>';

		} else if ($type == "zone_in_out2") {
                    if ($valida == 0){
                                       $result .= '<h3>'.$la['ZONE_IN_OUT'].'</h3>';
                                       $result = '<table class="report" width="100%"><tr align="center">';
                                       $result .= '<th> Patente </th>';
                                       $result .= '<th>'.'Entrada a Geocerca'.'</th>';
                                       $result .= '<th>'.'Salida a Geocerca'.'</th>';
                                       $result .= '<th>'.'Duracion'.'</th>';
                                       $result .= '<th>'.'Longitud de la ruta'.'</th>';
                                       $result .= '<th>'.'Nombre Geocerca'.'</th>';
                                       $result .= '<th>'.'Posicion de la Geocerca'.'</th>';
                                       $result .= '</tr>';
                                       $valida = 1;
                    }
                    $result .= reportsGenerateZoneInOut2($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items);
                               //$result .= '<br/><hr/>';
            } else if ($type == "geocercaAS") {
                $result .= '<h3>'.$la['ZONE_IN_OUT'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateZoneInOutGeoAsig($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items);
                $result .= '<br/><hr/>';

                // if ($valida == 0){
                //                    $result .= '<h3>'.$la['ZONE_IN_OUT'].'</h3>';
                //                    $result = '<table class="report" width="100%"><tr align="center">';
                //                    $result .= '<th style="width:50px">'.'Patente'.'</th>';
                //                    $result .= '<th style="width:50px">'.'Entrada a Geocerca'.'</th>';
                //                    $result .= '<th style="width:50px">'.'Salida a Geocerca'.'</th>';
                //                    $result .= '<th style="width:50px">'.'Duracion'.'</th>';
                //                    $result .= '<th style="width:50px">'.'Longitud de la ruta'.'</th>';
                //                    $result .= '<th style="width:50px">'.'Nombre Geocerca'.'</th>';
                //                    $result .= '<th style="width:50px">'.'Posicion de la Geocerca'.'</th>';
                //                    $result .= '</tr>';
                //                    $result .= '</table>';
                //                    $valida = 1;
                // }
                // $result .= reportsGenerateZoneInOutGeoAsig($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items);
                //            //$result .= '<br/><hr/>';
            }
            elseif ($type == "events") { //EVENTS
                $result .= '<h3>'.$la['EVENTS'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateEvents($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';

            }
            elseif ($type == "geocercaES") { //EVENTS GEOCERCA
                $result .= '<h3>Geocercas Entrada/Salida</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateEventsInOut($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "service") { //SERVICE
                $result .= '<h3>'.$la['SERVICE'].'</h3>';
                $result .= reportsAddReportHeader($imei);
                $result .= reportsGenerateService($imei, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "fuelfillings") { //FUEL_FILLINGS
                $result .= '<h3>'.$la['FUEL_FILLINGS'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateFuelFillings($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "fuelthefts") { //FUEL_THEFTS
                $result .= '<h3>'.$la['FUEL_THEFTS'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateFuelThefts($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "logic_sensors") { //LOGIC_SENSORS
                $sensors = getSensors($imei);
                $sensors_ = array();

                $sensor_names_ = explode(",", $sensor_names);
                for ($j=0; $j<count($sensor_names_); ++$j) {
                    for ($k=0; $k<count($sensors); ++$k) {
                        if ($sensors[$k]['result_type'] == 'logic') {
                            if ($sensor_names_[$j] == $sensors[$k]['name']) {
                                $sensors_[] = $sensors[$k];
                            }
                        }
                    }
                }

                $result .= '<h3>'.$la['LOGIC_SENSORS'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateLogicSensorInfo($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors_, $show_coordinates, $show_addresses, $zones_addresses, $data_items);
                $result .= '<br/><hr/>';
            } elseif ($type == "speed_graph") { //SPEED
                $sensors = array(array('name' => '', 'type' => 'speed', 'units' => $la["UNIT_SPEED"], 'result_type' => ''));

                $result .= '<h3>'.$la['SPEED_GRAPH'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGraph($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors);
                $result .= '<br/><hr/>';
            } elseif ($type == "altitude_graph") { //ALTITUDE
                $sensors = array(array('name' => '', 'type' => 'altitude', 'units' => $la["UNIT_HEIGHT"], 'result_type' => ''));

                $result .= '<h3>'.$la['ALTITUDE_GRAPH'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGraph($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors);
                $result .= '<br/><hr/>';
            } elseif ($type == "acc_graph") { //ACC
                $sensors = getSensorFromType($imei, 'acc');

                $result .= '<h3>'.$la['IGNITION_GRAPH'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGraph($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors);
                $result .= '<br/><hr/>';
            } elseif ($type == "fuellevel_graph") { //FUEL_LEVEL
                $sensors = getSensorFromType($imei, 'fuel');

                $result .= '<h3>'.$la['FUEL_LEVEL_GRAPH'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGraph($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors);
                $result .= '<br/><hr/>';
            } elseif ($type == "temperature_graph") { //TEMPERATURE
                $sensors = getSensorFromType($imei, 'temp');

                $result .= '<h3>'.$la['TEMPERATURE_GRAPH'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGraph($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors);
                $result .= '<br/><hr/>';
            } elseif ($type == "sensor_graph") { //SENSOR
                $sensors = getSensors($imei);
                $sensors_ = array();

                $sensor_names_ = explode(",", $sensor_names);
                for ($j=0; $j<count($sensor_names_); ++$j) {
                    for ($k=0; $k<count($sensors); ++$k) {
                        if ($sensor_names_[$j] == $sensors[$k]['name']) {
                            $sensors_[] = $sensors[$k];
                        }
                    }
                }

                $result .= '<h3>'.$la['SENSOR_GRAPH'].'</h3>';
                $result .= reportsAddReportHeader($imei, $dtf, $dtt);
                $result .= reportsGenerateGraph($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $sensors_);
                $result .= '<br/><hr/>';
            }
        }

        if ($type == "general_merged") { //GENERAL_INFO_MERGED
            $result .= '<h3>'.$la['GENERAL_INFO_MERGED'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateGenInfoMerged($imeis, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $stop_duration, $data_items);
            $result .= '<br/><hr/>';
        } elseif ($type == "object_info") { //OBJECT_INFO
            $result .= '<h3>'.$la['OBJECT_INFO'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateObjectInfo($imeis, $data_items);
            $result .= '<br/><hr/>';
 	} elseif ($type == "object_info2") { //OBJECT_INFO
            $result .= '<h3>'.$la['OBJECT_INFO'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateObjectInfo2($imeis, $data_items);
            $result .= '<br/><hr/>';
        } elseif ($type == "current_position") { //CURRENT POSITION
            $result .= '<h3>'.$la['CURRENT_POSITION'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateCurrentPosition($imeis, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items, false);
            $result .= '<br/><hr/>';
        } elseif ($type == "current_position_off") { //CURRENT POSITION OFFLINE
            $result .= '<h3>'.$la['CURRENT_POSITION_OFFLINE'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateCurrentPosition($imeis, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items, 'offline');
            $result .= '<br/><hr/>';
        } elseif ($type == "rag") { //RAG
            $result .= '<h3>'.$la['DRIVER_BEHAVIOR_RAG'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateRag($imeis, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $data_items);
            $result .= '<br/><hr/>';
        } elseif ($type == "rilogbook") { //RFID_AND_IBUTTON_LOGBOOK
            $result .= '<h3>'.$la['RFID_AND_IBUTTON_LOGBOOK'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateRiLogbook($imeis, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
            $result .= '<br/><hr/>';
        } elseif ($type == "dtc") { //DIAGNOSTIC_TROUBLE_CODES
            $result .= '<h3>'.$la['DIAGNOSTIC_TROUBLE_CODES'].'</h3>';
            $result .= reportsAddReportHeader('', $dtf, $dtt);
            $result .= reportsGenerateDTC($imeis, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $show_coordinates, $show_addresses, $zones_addresses, $data_items);
            $result .= '<br/><hr/>';
        }

        return $result;
    }

    //Reporte configurado por horas.
    function reportsGenerateOverspeed3EH($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$cantidadhoras,$fechaenvio) //OVERSPEED SP
    {
        global $_SESSION, $la, $user_id,$ms;

         $accuracy = getObjectAccuracy($imei);

        $result = "";
        $mifecha = date('Y-m-d H:i:s'); 
        $desde   = strtotime ( "".'-'."$cantidadhoras".' hour'."" , strtotime ($mifecha)) ; 
        $desde   = date('Y-m-d H:i:s',$desde);
      

        $q2  = "SELECT dt_tracker,lat,lng,speed,overpass, abs(overpass-speed) FROM gs_object_data_".$imei."
				WHERE dt_tracker BETWEEN '".$desde."' AND '".$mifecha."' and overpass-speed < 0
				and overpass > 0";

        $r2 = mysqli_query($ms, $q2);


        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups 
                    where gs_user_objects.group_id = gs_user_object_groups.group_id  
                    and gs_user_objects.user_id = gs_user_object_groups.user_id 
                    and gs_user_objects.imei = ".$imei." and gs_user_objects.user_id = ".$user_id;

         $result2 = $ms->query($sql);
         $grupos = "sin grupo";

            while($row = $result2->fetch_assoc()) {
                $grupos = $row[group_name];
                
            }
            
  
        while ($row2 = mysqli_fetch_row($r2)) {
            $dt_tracker = $row2[0];
            $lat = $row2[1];
            $lng = $row2[2];
            $speed = $row2[3];
            $overspeed = $row2[4];
            $overspeedDif = $row2[5];


            if ($row2[0] = '') {
                return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
            } else {

            round($speed);
            round($overspeedDif);

                $result .= '<tr align="center">';
                $result .= '<td>'.getObjectName($imei).'</td>';
                $result .= '<td>'.getObjectPlate($imei).'</td>';
                $result .= '<td>'.$grupos.'</td>';
                $result .= '<td>'.convUserTimezone($dt_tracker).'</td>';
                $result .= '<td>'.round($speed,0).'</td>';
                $result .= '<td>'.$overspeed.'</td>'; 
                $result .= '<td>'.round($overspeedDif,0).'</td>';
                $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                $result .= '</tr>';
            }
        }

        // $result .= '</table>';

        return $result;
    }

    function reportsGenerateGenInfo($imei, $dtf, $dtt, $speed_limit, $stop_duration, $data_items) //GENERAL_INFO
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';
        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

        if ($speed_limit > 0) {
            $overspeeds = getRouteOverspeeds($data['route'], $speed_limit);
            $overspeeds_count = count($overspeeds);
        } else {
            $overspeeds_count = 0;
        }

        if (count($data['route']) == 0) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $odometer = getObjectOdometer($imei);
        $odometer = floor(convDistanceUnits($odometer, 'km', $_SESSION["unit_distance"]));

        $result .= '<table>';
        if (in_array("route_start", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ROUTE_START'].':</strong></td>
					<td>'.$data['route'][0][0].'</td>
				</tr>';
        }

        if (in_array("route_end", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ROUTE_END'].':</strong></td>
					<td>'.$data['route'][count($data['route'])-1][0].'</td>
				</tr>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ROUTE_LENGTH'].':</strong></td>
					<td>'.$data['route_length'].' '.$la["UNIT_DISTANCE"].'</td>
				</tr>';
        }

        if (in_array("move_duration", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['MOVE_DURATION'].':</strong></td>
					<td>'.$data['drives_duration'].'</td>
				</tr>';
        }

        if (in_array("stop_duration", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['STOP_DURATION'].':</strong></td>
					<td>'.$data['stops_duration'].'</td>
				</tr>';
        }

        if (in_array("stop_count", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['STOP_COUNT'].':</strong></td>
					<td>'.count($data['stops']).'</td>
				</tr>';
        }

        if (in_array("top_speed", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['TOP_SPEED'].':</strong></td>
					<td>'.$data['top_speed'].' '.$la["UNIT_SPEED"].'</td>
				</tr>';
        }

        if (in_array("avg_speed", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['AVG_SPEED'].':</strong></td>
					<td>'.$data['avg_speed'].' '.$la["UNIT_SPEED"].'</td>
				</tr>';
        }

        if (in_array("overspeed_count", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['OVERSPEED_COUNT'].':</strong></td>
					<td>'.$overspeeds_count.'</td>
				</tr>';
        }

        if (in_array("fuel_consumption", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['FUEL_CONSUMPTION'].':</strong></td>
					<td>'.$data['fuel_consumption'].' '.$la["UNIT_CAPACITY"].'</td>
				</tr>';
        }

        if (in_array("fuel_cost", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['FUEL_COST'].':</strong></td>
					<td>'.$data['fuel_cost'].' '.$_SESSION["currency"].'</td>
				</tr>';
        }

        if (in_array("engine_work", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ENGINE_WORK'].':</strong></td>
					<td>'.$data['engine_work'].'</td>
				</tr>';
        }

        if (in_array("engine_idle", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ENGINE_IDLE'].':</strong></td>
					<td>'.$data['engine_idle'].'</td>
				</tr>';
        }

        if (in_array("odometer", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ODOMETER'].':</strong></td>
					<td>'.$odometer.' '.$la["UNIT_DISTANCE"].'</td>
				</tr>';
        }

        if (in_array("engine_hours", $data_items)) {
            $result .= '<tr>
					<td><strong>'.$la['ENGINE_HOURS'].':</strong></td>
					<td>'.getObjectEngineHours($imei, true).'</td>
				</tr>';
        }

        if (in_array("driver", $data_items)) {
            $result .= '<tr>';

            $params = $data['route'][count($data['route'])-1][6];

            $driver = getObjectDriver($user_id, $imei, $params);
            if ($driver['driver_name'] == '') {
                $driver['driver_name'] = $la['NA'];
            }

            $result .= 	'<td><strong>'.$la['DRIVER'].':</strong></td>
					<td>'.$driver['driver_name'].'</td>
					</tr>';
        }

        if (in_array("trailer", $data_items)) {
            $result .= '<tr>';

            $params = $data['route'][count($data['route'])-1][6];
            $trailer = getObjectTrailer($user_id, $imei, $params);
            if ($trailer['trailer_name'] == '') {
                $trailer['trailer_name'] = $la['NA'];
            }

            $result .= 	'<td><strong>'.$la['TRAILER'].':</strong></td>
					<td>'.$trailer['trailer_name'].'</td>
					</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateGenInfoMerged($imeis, $dtf, $dtt, $speed_limit, $stop_duration, $data_items) //GENERAL_INFO_MERGED
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '<table class="report" width="100%"><tr align="center">';

        $result .= '<th>'.$la['OBJECT'].'</th>';

        if (in_array("route_start", $data_items)) {
            $result .= '<th>'.$la['ROUTE_START'].'</th>';
        }

        if (in_array("route_end", $data_items)) {
            $result .= '<th>'.$la['ROUTE_END'].'</th>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= '<th>'.$la['ROUTE_LENGTH'].'</th>';
        }

        if (in_array("move_duration", $data_items)) {
            $result .= '<th>'.$la['MOVE_DURATION'].'</th>';
        }

        if (in_array("stop_duration", $data_items)) {
            $result .= '<th>'.$la['STOP_DURATION'].'</th>';
        }

        if (in_array("stop_count", $data_items)) {
            $result .= '<th>'.$la['STOP_COUNT'].'</th>';
        }

        if (in_array("top_speed", $data_items)) {
            $result .= '<th>'.$la['TOP_SPEED'].'</th>';
        }

        if (in_array("avg_speed", $data_items)) {
            $result .= '<th>'.$la['AVG_SPEED'].'</th>';
        }

        if (in_array("overspeed_count", $data_items)) {
            $result .= '<th>'.$la['OVERSPEED_COUNT'].'</th>';
        }

        if (in_array("fuel_consumption", $data_items)) {
            $result .= '<th>'.$la['FUEL_CONSUMPTION'].'</th>';
        }

        if (in_array("fuel_cost", $data_items)) {
            $result .= '<th>'.$la['FUEL_COST'].'</th>';
        }

        if (in_array("engine_work", $data_items)) {
            $result .= '<th>'.$la['ENGINE_WORK'].'</th>';
        }

        if (in_array("engine_idle", $data_items)) {
            $result .= '<th>'.$la['ENGINE_IDLE'].'</th>';
        }

        if (in_array("odometer", $data_items)) {
            $result .= '<th>'.$la['ODOMETER'].'</th>';
        }

        if (in_array("engine_hours", $data_items)) {
            $result .= '<th>'.$la['ENGINE_HOURS'].'</th>';
        }

        if (in_array("driver", $data_items)) {
            $result .= '<th>'.$la['DRIVER'].'</th>';
        }

        if (in_array("trailer", $data_items)) {
            $result .= '<th>'.$la['TRAILER'].'</th>';
        }

        $result .= '</tr>';

        $total_route_length = 0;
        $total_drives_duration = 0;
        $total_stops_duration = 0;
        $total_stop_count = 0;
        $total_top_speed = 0;
        $total_avg_speed = 0;
        $total_overspeed_count = 0;
        $total_fuel_consumption = 0;
        $total_fuel_cost = 0;
        $total_engine_work = 0;
        $total_engine_idle = 0;
        $total_odometer = 0;
        $total_engine_hours = 0;

        $is_data = false;

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];

            $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

            if (count($data['route']) == 0) {
                $result .= '<tr align="center">';
                $result .= '<td>'.getObjectName($imei).'</td>';
                $result .= '<td colspan="17">'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td>';
                $result .= '</tr>';
            } else {
                $is_data = true;

                if ($speed_limit > 0) {
                    $overspeeds = getRouteOverspeeds($data['route'], $speed_limit);
                    $overspeed_count = count($overspeeds);
                } else {
                    $overspeed_count = 0;
                }

                $odometer = getObjectOdometer($imei);
                $odometer = floor(convDistanceUnits($odometer, 'km', $_SESSION["unit_distance"]));

                $result .= '<tr align="center">';

                $result .= '<td>'.getObjectName($imei).'</td>';

                if (in_array("route_start", $data_items)) {
                    $result .= '<td>'.$data['route'][0][0].'</td>';
                }

                if (in_array("route_end", $data_items)) {
                    $result .= '<td>'.$data['route'][count($data['route'])-1][0].'</td>';
                }

                if (in_array("route_length", $data_items)) {
                    $result .= '<td>'.$data['route_length'].' '.$la["UNIT_DISTANCE"].'</td>';

                    $total_route_length += $data['route_length'];
                }

                if (in_array("move_duration", $data_items)) {
                    $result .= '<td>'.$data['drives_duration'].'</td>';

                    $total_drives_duration += $data['drives_duration_time'];
                }

                if (in_array("stop_duration", $data_items)) {
                    $result .= '<td>'.$data['stops_duration'].'</td>';

                    $total_stops_duration += $data['stops_duration_time'];
                }

                if (in_array("stop_count", $data_items)) {
                    $result .= '<td>'.count($data['stops']).'</td>';

                    $total_stop_count += count($data['stops']);
                }

                if (in_array("top_speed", $data_items)) {
                    $result .= '<td>'.$data['top_speed'].' '.$la["UNIT_SPEED"].'</td>';
                }

                if (in_array("avg_speed", $data_items)) {
                    $result .= '<td>'.$data['avg_speed'].' '.$la["UNIT_SPEED"].'</td>';
                }

                if (in_array("overspeed_count", $data_items)) {
                    $result .= '<td>'.$overspeed_count.'</td>';

                    $total_overspeed_count += $overspeed_count;
                }

                if (in_array("fuel_consumption", $data_items)) {
                    $result .= '<td>'.$data['fuel_consumption'].' '.$la["UNIT_CAPACITY"].'</td>';

                    $total_fuel_consumption += $data['fuel_consumption'];
                }

                if (in_array("fuel_cost", $data_items)) {
                    $result .= '<td>'.$data['fuel_cost'].' '.$_SESSION["currency"].'</td>';

                    $total_fuel_cost += $data['fuel_cost'];
                }

                if (in_array("engine_work", $data_items)) {
                    $result .= '<td>'.$data['engine_work'].'</td>';

                    $total_engine_work += $data['engine_work_time'];
                }

                if (in_array("engine_idle", $data_items)) {
                    $result .= '<td>'.$data['engine_idle'].'</td>';

                    $total_engine_idle += $data['engine_idle_time'];
                }

                if (in_array("odometer", $data_items)) {
                    $result .= '<td>'.$odometer.' '.$la["UNIT_DISTANCE"].'</td>';

                    $total_odometer += $odometer;
                }

                if (in_array("engine_hours", $data_items)) {
                    $engine_hours = getObjectEngineHours($imei, true);

                    $result .= '<td>'.$engine_hours.'</td>';

                    $total_engine_hours += $engine_hours;
                }

                if (in_array("driver", $data_items)) {
                    $params = $data['route'][count($data['route'])-1][6];
                    $driver = getObjectDriver($user_id, $imei, $params);
                    if ($driver['driver_name'] == '') {
                        $driver['driver_name'] = $la['NA'];
                    }

                    $result .= '<td>'.$driver['driver_name'].'</td>';
                }

                if (in_array("trailer", $data_items)) {
                    $params = $data['route'][count($data['route'])-1][6];
                    $trailer = getObjectTrailer($user_id, $imei, $params);
                    if ($trailer['trailer_name'] == '') {
                        $trailer['trailer_name'] = $la['NA'];
                    }

                    $result .= '<td>'.$trailer['trailer_name'].'</td>';
                }

                $result .= '</tr>';
            }
        }

        if (in_array("total", $data_items) && ($is_data == true)) {
            $result .= '<tr align="center">';

            $result .= '<td></td>';

            if (in_array("route_start", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("route_end", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("route_length", $data_items)) {
                $result .= '<td>'.$total_route_length.' '.$la["UNIT_DISTANCE"].'</td>';
            }

            if (in_array("move_duration", $data_items)) {
                $result .= '<td>'.getTimeDetails($total_drives_duration, true).'</td>';
            }

            if (in_array("stop_duration", $data_items)) {
                $result .= '<td>'.getTimeDetails($total_stops_duration, true).'</td>';
            }

            if (in_array("stop_count", $data_items)) {
                $result .= '<td>'.$total_stop_count.'</td>';
            }

            if (in_array("top_speed", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("avg_speed", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("overspeed_count", $data_items)) {
                $result .= '<td>'.$total_overspeed_count.'</td>';
            }

            if (in_array("fuel_consumption", $data_items)) {
                $result .= '<td>'.$total_fuel_consumption.' '.$la["UNIT_CAPACITY"].'</td>';
            }

            if (in_array("fuel_cost", $data_items)) {
                $result .= '<td>'.$total_fuel_cost.' '.$_SESSION["currency"].'</td>';
            }

            if (in_array("engine_work", $data_items)) {
                $result .= '<td>'.getTimeDetails($total_engine_work, true).'</td>';
            }

            if (in_array("engine_idle", $data_items)) {
                $result .= '<td>'.getTimeDetails($total_engine_idle, true).'</td>';
            }

            if (in_array("odometer", $data_items)) {
                $result .= '<td>'.$total_odometer.' '.$la["UNIT_DISTANCE"].'</td>';
            }

            if (in_array("engine_hours", $data_items)) {
                $result .= '<td>'.$total_engine_hours.' '.$la["UNIT_H"].'</td>';
            }

            if (in_array("driver", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("trailer", $data_items)) {
                $result .= '<td></td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

	function reportsGenerateObjectInfo2($imeis, $data_items)
	{
        global $ms, $_SESSION, $la, $user_id;
        $result = '<table class="report" width="100%" ><tr align="center">';

        $result .= '<th>'.$la['OBJECT'].'</th>';
        $result .= '<th>'.$la['PLATE_NUMBER'].'</th>';
        $result .= '<th>Fecha y Hora Ultimo Reporte</th>';
        $result .= '<th>Fecha Ultimo Reporte</th>';
        $result .= '<th>Hora Ultimo Reporte</th>';
        $result .= '<th>'.$la['IMEI'].'</th>';
        $result .= '<th>'.$la['TRANSPORT_MODEL'].'</th>';
        $result .= '<th>'.$la['VIN'].'</th>';
        $result .= '<th>Fecha Actual</th>';
        $result .= '<th>Dias sin reportar</th>';

        $result .= '</tr>';

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];
            $q = "SELECT * FROM `gs_objects` WHERE `imei`='".$imei."'";
            $r = mysqli_query($ms, $q);
            $row = mysqli_fetch_array($r);
            $odometer = getObjectOdometer($imei);
            $odometer = floor(convDistanceUnits($odometer, 'km', $_SESSION["unit_distance"]));

            $date1d = new DateTime(date("Y-m-d"));
            $date2d = new DateTime(substr($row['dt_tracker'], 0, 10));
            $diffd = $date1d->diff($date2d);

            $result .= '<tr align="center">';

            $result .= '<td>'.$row['name'].'</td>';
            $result .= '<td>'.$row['plate_number'].'</td>';
            $result .= '<td>'.convUserTimezone($row['dt_tracker']).'</td>';
            $result .= '<td>'.substr($row['dt_tracker'], 0, 10).'</td>';
            $result .= '<td>'.substr(convUserTimezone($row['dt_tracker']), 11, 18).'</td>';
            $result .= '<td>'.$row['imei'].'</td>';
            $result .= '<td>'.$row['model'].'</td>';
            $result .= '<td>'.$row['vin'].'</td>';
            $result .= '<td>'.date("Y-m-d").'</td>';
            $result .= '<td>'.$diffd->days .' dias '.'</td>';

            $result .= '</tr>';

        }

        $result .= '</table>';
        return $result;
    }










    function reportsGenerateObjectInfo($imeis, $data_items)
    {
        global $ms, $_SESSION, $la, $user_id;

        $result = '<table class="report" width="100%" ><tr align="center">';

        $result .= '<th>'.$la['OBJECT'].'</th>';

        if (in_array("imei", $data_items)) {
            $result .= '<th>'.$la['IMEI'].'</th>';
        }

        if (in_array("transport_model", $data_items)) {
            $result .= '<th>'.$la['TRANSPORT_MODEL'].'</th>';
        }

        if (in_array("vin", $data_items)) {
            $result .= '<th>'.$la['VIN'].'</th>';
        }

        if (in_array("plate_number", $data_items)) {
            $result .= '<th>'.$la['PLATE_NUMBER'].'</th>';
        }

        if (in_array("odometer", $data_items)) {
            $result .= '<th>'.$la['ODOMETER'].'</th>';
        }

        if (in_array("engine_hours", $data_items)) {
            $result .= '<th>'.$la['ENGINE_HOURS'].'</th>';
        }

        if (in_array("driver", $data_items)) {
            $result .= '<th>'.$la['DRIVER'].'</th>';
        }

        if (in_array("trailer", $data_items)) {
            $result .= '<th>'.$la['TRAILER'].'</th>';
        }

        if (in_array("gps_device", $data_items)) {
            $result .= '<th>'.$la['GPS_DEVICE'].'</th>';
        }

        if (in_array("sim_card_number", $data_items)) {
            $result .= '<th>'.$la['SIM_CARD_NUMBER'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];

            $q = "SELECT * FROM `gs_objects` WHERE `imei`='".$imei."'";
            $r = mysqli_query($ms, $q);
            $row = mysqli_fetch_array($r);

            $odometer = getObjectOdometer($imei);
            $odometer = floor(convDistanceUnits($odometer, 'km', $_SESSION["unit_distance"]));

            $result .= '<tr align="center">';

            $result .= '<td>'.$row['name'].'</td>';

            if (in_array("imei", $data_items)) {
                $result .= '<td>'.$row['imei'].'</td>';
            }

            if (in_array("transport_model", $data_items)) {
                $result .= '<td>'.$row['model'].'</td>';
            }

            if (in_array("vin", $data_items)) {
                $result .= '<td>'.$row['vin'].'</td>';
            }

            if (in_array("plate_number", $data_items)) {
                $result .= '<td>'.$row['plate_number'].'</td>';
            }

            if (in_array("odometer", $data_items)) {
                $result .= '<td>'.$odometer.' '.$la["UNIT_DISTANCE"].'</td>';
            }

            if (in_array("engine_hours", $data_items)) {
                $result .= '<td>'.getObjectEngineHours($imei, true).'</td>';
            }

            if (in_array("driver", $data_items)) {
                $params = json_decode($row['params'], true);
                $driver = getObjectDriver($user_id, $imei, $params);
                if ($driver['driver_name'] == '') {
                    $driver['driver_name'] = $la['NA'];
                }

                $result .= '<td>'.$driver['driver_name'].'</td>';
            }

            if (in_array("trailer", $data_items)) {
                $params = json_decode($row['params'], true);
                $trailer = getObjectTrailer($user_id, $imei, $params);
                if ($trailer['trailer_name'] == '') {
                    $trailer['trailer_name'] = $la['NA'];
                }

                $result .= '<td>'.$trailer['trailer_name'].'</td>';
            }

            if (in_array("gps_device", $data_items)) {
                $result .= '<td>'.$row['device'].'</td>';
            }

            if (in_array("sim_card_number", $data_items)) {
                $result .= '<td>'.$row['sim_number'].'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateCurrentPosition($imeis, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items, $status)
    {
        global $ms, $_SESSION, $gsValues, $la;

        $result = '';

        $result = '<table class="report" width="100%" ><tr align="center">';

        $result .= '<th>'.$la['OBJECT'].'</th>';

        if (in_array("time", $data_items)) {
            $result .= '<th>'.$la['TIME'].'</th>';
        }

        if (in_array("position", $data_items)) {
            $result .= '<th>'.$la['POSITION'].'</th>';
        }

        if (in_array("speed", $data_items)) {
            $result .= '<th>'.$la['SPEED'].'</th>';
        }

        if (in_array("altitude", $data_items)) {
            $result .= '<th>'.$la['ALTITUDE'].'</th>';
        }

        if (in_array("angle", $data_items)) {
            $result .= '<th>'.$la['ANGLE'].'</th>';
        }

        if (in_array("status", $data_items)) {
            $result .= '<th>'.$la['STATUS'].'</th>';
        }

        if (in_array("odometer", $data_items)) {
            $result .= '<th>'.$la['ODOMETER'].'</th>';
        }

        if (in_array("engine_hours", $data_items)) {
            $result .= '<th>'.$la['ENGINE_HOURS'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];

            $q = "SELECT * FROM `gs_objects` WHERE `imei`='".$imei."'";
            $r = mysqli_query($ms, $q);

            while ($row = mysqli_fetch_array($r)) {
                $dt_server = $row['dt_server'];
                $dt_tracker = $row['dt_tracker'];
                $lat = $row['lat'];
                $lng = $row['lng'];
                $altitude = $row['altitude'];
                $angle = $row['angle'];
                $speed = $row['speed'];

                if (($lat != 0) && ($lng != 0)) {
                    $speed = convSpeedUnits($speed, 'km', $_SESSION["unit_distance"]);
                    $altitude = convAltitudeUnits($altitude, 'km', $_SESSION["unit_distance"]);

                    // status
                    $status_type = false;
                    $status_str = '';
                    $dt_last_stop = strtotime($row['dt_last_stop']);
                    $dt_last_idle = strtotime($row['dt_last_idle']);
                    $dt_last_move = strtotime($row['dt_last_move']);



                    if (($dt_last_stop > 0) || ($dt_last_move > 0)) {
                        // stopped and moving
                        if ($dt_last_stop >= $dt_last_move) {
                            $status_type = 'stopped';
                            $status_str = $la['STOPPED'].' '.getTimeDetails(strtotime(gmdate("Y-m-d H:i:s")) - $dt_last_stop, true);
                        } else {
                            $status_type = 'moving';
                            $status_str = $la['MOVING'].' '.getTimeDetails(strtotime(gmdate("Y-m-d H:i:s")) - $dt_last_move, true);
                        }

                        // idle
                        if (($dt_last_stop <= $dt_last_idle) && ($dt_last_move <= $dt_last_idle)) {
                            $status_type = 'idle';
                            $status_str = $la['ENGINE_IDLE'].' '.getTimeDetails(strtotime(gmdate("Y-m-d H:i:s")) - $dt_last_idle, true);
                        }
                    }

                    // offline status
                    $dt_now = gmdate("Y-m-d H:i:s");
                    $dt_difference = strtotime($dt_now) - strtotime($dt_server);
                    if ($dt_difference > $gsValues['CONNECTION_TIMEOUT'] * 60) {
                        if (strtotime($dt_server) > 0) {
                            $status_type = 'offline';
                            $status_str = $la['OFFLINE'].' '.getTimeDetails(strtotime(gmdate("Y-m-d H:i:s")) - strtotime($dt_server), true);
                        }

                        $speed = 0;
                    }

                    // filter status
                    if (($status != false) && ($status != $status_type)) {
                        continue;
                    }

                    $odometer = getObjectOdometer($imei);
                    $odometer = floor(convDistanceUnits($odometer, 'km', $_SESSION["unit_distance"]));

                    $result .= '<tr align="center">';

                    $result .= '<td>'.getObjectName($imei).'</td>';

                    if (in_array("time", $data_items)) {
                        $result .= '<td>'.convUserTimezone($dt_tracker).'</td>';
                    }

                    if (in_array("position", $data_items)) {
                        $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                    }

                    if (in_array("speed", $data_items)) {
                        $result .= '<td>'.$speed.' '.$la["UNIT_SPEED"].'</td>';
                    }

                    if (in_array("altitude", $data_items)) {
                        $result .= '<td>'.$altitude.' '.$la["UNIT_HEIGHT"].'</td>';
                    }

                    if (in_array("angle", $data_items)) {
                        $result .= '<td>'.$angle.'</td>';
                    }

                    if (in_array("status", $data_items)) {
                        $result .= '<td>'.$status_str.'</td>';
                    }

                    if (in_array("odometer", $data_items)) {
                        $result .= '<td>'.$odometer.' '.$la["UNIT_DISTANCE"].'</td>';
                    }

                    if (in_array("engine_hours", $data_items)) {
                        $result .= '<td>'.getObjectEngineHours($imei, true).'</td>';
                    }

                    $result .= '</tr>';
                } else {
                    $result .= '<tr align="center">';
                    $result .= '<td>'.getObjectName($imei).'</td>';
                    $result .= '<td colspan="9">'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td>';
                    $result .= '</tr>';
                }
            }
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateDrivesAndStops($imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //DRIVES_AND_STOPS
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';

        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

        if (count($data['route']) < 2) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("status", $data_items)) {
            $result .= '<th rowspan="2">'.$la['STATUS'].'</th>';
        }

        if (in_array("start", $data_items)) {
            $result .= '<th rowspan="2">'.$la['START'].'</th>';
        }

        if (in_array("end", $data_items)) {
            $result .= '<th rowspan="2">'.$la['END'].'</th>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<th rowspan="2">'.$la['DURATION'].'</th>';
        }

        $result .= '<th colspan="3">'.$la['STOP_POSITION'].'</th>';

        if (in_array("fuel_consumption", $data_items)) {
            $result .= '<th rowspan="2">'.$la['FUEL_CONSUMPTION'].'</th>';
        }

        if (in_array("fuel_cost", $data_items)) {
            $result .= '<th rowspan="2">'.$la['FUEL_COST'].'</th>';
        }

        if (in_array("engine_idle", $data_items)) {
            $result .= '<th rowspan="2">'.$la['ENGINE_IDLE'].'</th>';
        }

        $result .= '</tr>';

        $result .= '<tr align="center">
				<th>'.$la['LENGTH'].'</th>
				<th>'.$la['TOP_SPEED'].'</th>
				<th>'.$la['AVG_SPEED'].'</th>
				</tr>';

        $dt_sort = array();
        for ($i=0; $i<count($data['stops']); ++$i) {
            $dt_sort[] = $data['stops'][$i][6];
        }
        for ($i=0; $i<count($data['drives']); ++$i) {
            $dt_sort[] = $data['drives'][$i][4];
        }
        sort($dt_sort);

        for ($i=0; $i<count($dt_sort); ++$i) {
            for ($j=0; $j<count($data['stops']); ++$j) {
                if ($data['stops'][$j][6] == $dt_sort[$i]) {
                    $lat = sprintf("%01.6f", $data['stops'][$j][2]);
                    $lng = sprintf("%01.6f", $data['stops'][$j][3]);

                    $result .= '<tr align="center">';

                    if (in_array("status", $data_items)) {
                        $result .= '<td>'.$la['STOPPED'].'</td>';
                    }

                    if (in_array("start", $data_items)) {
                        $result .= '<td>'.$data['stops'][$j][6].'</td>';
                    }

                    if (in_array("end", $data_items)) {
                        $result .= '<td>'.$data['stops'][$j][7].'</td>';
                    }

                    if (in_array("duration", $data_items)) {
                        $result .= '<td>'.$data['stops'][$j][8].'</td>';
                    }

                    $result .= '<td colspan="3">'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';

                    if (in_array("fuel_consumption", $data_items)) {
                        $result .= '<td></td>';
                    }

                    if (in_array("fuel_cost", $data_items)) {
                        $result .= '<td></td>';
                    }

                    if (in_array("engine_idle", $data_items)) {
                        $result .= '<td>'.$data['stops'][$j][11].'</td>';
                    }

                    $result .= '</tr>';
                }
            }
            for ($j=0; $j<count($data['drives']); ++$j) {
                if ($data['drives'][$j][4] == $dt_sort[$i]) {
                    $result .= '<tr align="center">';

                    if (in_array("status", $data_items)) {
                        $result .= '<td>'.$la['MOVING'].'</td>';
                    }

                    if (in_array("start", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][4].'</td>';
                    }

                    if (in_array("end", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][5].'</td>';
                    }

                    if (in_array("duration", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][6].'</td>';
                    }

                    $result .= '<td>'.$data['drives'][$j][7].' '.$la["UNIT_DISTANCE"].'</td>
							<td>'.$data['drives'][$j][8].' '.$la["UNIT_SPEED"].'</td>
							<td>'.$data['drives'][$j][9].' '.$la["UNIT_SPEED"].'</td>';

                    if (in_array("fuel_consumption", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][10].' '.$la["UNIT_CAPACITY"].'</td>';
                    }

                    if (in_array("fuel_cost", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][11].' '.$_SESSION["currency"].'</td>';
                    }

                    if (in_array("engine_idle", $data_items)) {
                        $result .= '<td></td>';
                    }

                    $result .= '</tr>';
                }
            }
        }
        $result .= '</table><br/>';

        $result .= '<table>';

        if (in_array("move_duration", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['MOVE_DURATION'].':</strong></td>
						<td>'.$data['drives_duration'].'</td>
					</tr>';
        }

        if (in_array("stop_duration", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['STOP_DURATION'].':</strong></td>
						<td>'.$data['stops_duration'].'</td>
					</tr>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['ROUTE_LENGTH'].':</strong></td>
						<td>'.$data['route_length'].' '.$la["UNIT_DISTANCE"].'</td>
					</tr>';
        }

        if (in_array("top_speed", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['TOP_SPEED'].':</strong></td>
						<td>'.$data['top_speed'].' '.$la["UNIT_SPEED"].'</td>
					</tr>';
        }

        if (in_array("avg_speed", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['AVG_SPEED'].':</strong></td>
						<td>'.$data['avg_speed'].' '.$la["UNIT_SPEED"].'</td>
					</tr>';
        }

        if (in_array("fuel_consumption", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['FUEL_CONSUMPTION'].':</strong></td>
						<td>'.$data['fuel_consumption'].' '.$la["UNIT_CAPACITY"].'</td>
					</tr>';
        }

        if (in_array("fuel_cost", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['FUEL_COST'].':</strong></td>
						<td>'.$data['fuel_cost'].' '.$_SESSION["currency"].'</td>
					</tr>';
        }

        if (in_array("engine_work", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['ENGINE_WORK'].':</strong></td>
						<td>'.$data['engine_work'].'</td>
					</tr>';
        }

        if (in_array("engine_idle", $data_items)) {
            $result .= 	'<tr>
						<td><strong>'.$la['ENGINE_IDLE'].':</strong></td>
						<td>'.$data['engine_idle'].'</td>
					</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateDrivesAndStops2($imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //DRIVES_AND_STOPS
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';

        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

        if (count($data['route']) < 2) {
            //return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $dt_sort = array();
        for ($i=0; $i<count($data['stops']); ++$i) {
            $dt_sort[] = $data['stops'][$i][6];
        }
        for ($i=0; $i<count($data['drives']); ++$i) {
            $dt_sort[] = $data['drives'][$i][4];
        }
        sort($dt_sort);

        for ($i=0; $i<count($dt_sort); ++$i) {
            for ($j=0; $j<count($data['stops']); ++$j) {
                if ($data['stops'][$j][6] == $dt_sort[$i]) {
                    $lat = sprintf("%01.6f", $data['stops'][$j][2]);
                    $lng = sprintf("%01.6f", $data['stops'][$j][3]);
                }
            }
            for ($j=0; $j<count($data['drives']); ++$j) {
                if ($data['drives'][$j][4] == $dt_sort[$i]) {
                    $result .= '<tr align="center">';

                    $result .= '<td>'.getObjectName($imei).'</td>';

                    $result .= '<td>'.$data['drives'][$j][4].'</td>';

                    $result .= '<td>'.$data['drives'][$j][5].'</td>';

                    $result .= '<td>'.$data['drives'][$j][6].'</td>';

                    $result .= '<td>'.$data['drives'][$j][7].' '.$la["UNIT_DISTANCE"].'</td>
							<td>'.$data['drives'][$j][8].' '.$la["UNIT_SPEED"].'</td>
							<td>'.$data['drives'][$j][9].' '.$la["UNIT_SPEED"].'</td>';

                    $result .= '<td>'.$data['stops'][$j][11].'</td>';

                    $result .= '<td colspan="3">'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                    $result .= '</tr>';
                }
            }
        }

        return $result;
    }

    function reportsGenerateDrivesAndStops3($imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //DRIVES_AND_STOPS
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';

        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

        if (count($data['route']) < 2) {
            //return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $dt_sort = array();
        for ($i=0; $i<count($data['stops']); ++$i) {
            $dt_sort[] = $data['stops'][$i][6];
        }
        for ($i=0; $i<count($data['drives']); ++$i) {
            $dt_sort[] = $data['drives'][$i][4];
        }
        sort($dt_sort);

        for ($i=0; $i<count($dt_sort); ++$i) {
            for ($j=0; $j<count($data['stops']); ++$j) {
                if ($data['stops'][$j][6] == $dt_sort[$i]) {
                    $lat = sprintf("%01.6f", $data['stops'][$j][2]);
                    $lng = sprintf("%01.6f", $data['stops'][$j][3]);

                    $result .= '<tr align="center">';

                    $result .= '<td>'.getObjectName($imei).'</td>';

                    $result .= '<td>'.$la['STOPPED'].'</td>';

                    $result .= '<td>'.$data['stops'][$j][6].'</td>';

                    $result .= '<td>'.$data['stops'][$j][7].'</td>';

                    $result .= '<td>'.$data['stops'][$j][8].'</td>';

                    $result .= '<td colspan="3">'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';

                    if (in_array("fuel_consumption", $data_items)) {
                        $result .= '<td></td>';
                    }

                    if (in_array("fuel_cost", $data_items)) {
                        $result .= '<td></td>';
                    }

                    if (in_array("engine_idle", $data_items)) {
                        $result .= '<td>'.$data['stops'][$j][11].'</td>';
                    }

                    $result .= '</tr>';
                }
            }
            for ($j=0; $j<count($data['drives']); ++$j) {
                if ($data['drives'][$j][4] == $dt_sort[$i]) {
                    $result .= '<tr align="center">';

                    $result .= '<td>'.getObjectName($imei).'</td>';

                    $result .= '<td>'.$la['MOVING'].'</td>';

                    $result .= '<td>'.$data['drives'][$j][4].'</td>';

                    $result .= '<td>'.$data['drives'][$j][5].'</td>';

                    $result .= '<td>'.$data['drives'][$j][6].'</td>';

                    $result .= '<td>'.$data['drives'][$j][7].' '.$la["UNIT_DISTANCE"].'</td>
							<td>'.$data['drives'][$j][8].' '.$la["UNIT_SPEED"].'</td>
							<td>'.$data['drives'][$j][9].' '.$la["UNIT_SPEED"].'</td>';

                    if (in_array("fuel_consumption", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][10].' '.$la["UNIT_CAPACITY"].'</td>';
                    }

                    if (in_array("fuel_cost", $data_items)) {
                        $result .= '<td>'.$data['drives'][$j][11].' '.$_SESSION["currency"].'</td>';
                    }

                    if (in_array("engine_idle", $data_items)) {
                        $result .= '<td></td>';
                    }

                    $result .= '</tr>';
                }
            }
        }
        //$result .= '</table><br/>';

        /*$result .= '<table>';

        if (in_array("move_duration", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['MOVE_DURATION'].':</strong></td>
                        <td>'.$data['drives_duration'].'</td>
                    </tr>';
        }

        if (in_array("stop_duration", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['STOP_DURATION'].':</strong></td>
                        <td>'.$data['stops_duration'].'</td>
                    </tr>';
        }

        if (in_array("route_length", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['ROUTE_LENGTH'].':</strong></td>
                        <td>'.$data['route_length'].' '.$la["UNIT_DISTANCE"].'</td>
                    </tr>';
        }

        if (in_array("top_speed", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['TOP_SPEED'].':</strong></td>
                        <td>'.$data['top_speed'].' '.$la["UNIT_SPEED"].'</td>
                    </tr>';
        }

        if (in_array("avg_speed", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['AVG_SPEED'].':</strong></td>
                        <td>'.$data['avg_speed'].' '.$la["UNIT_SPEED"].'</td>
                    </tr>';
        }

        if (in_array("fuel_consumption", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['FUEL_CONSUMPTION'].':</strong></td>
                        <td>'.$data['fuel_consumption'].' '.$la["UNIT_CAPACITY"].'</td>
                    </tr>';
        }

        if (in_array("fuel_cost", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['FUEL_COST'].':</strong></td>
                        <td>'.$data['fuel_cost'].' '.$_SESSION["currency"].'</td>
                    </tr>';
        }

        if (in_array("engine_work", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['ENGINE_WORK'].':</strong></td>
                        <td>'.$data['engine_work'].'</td>
                    </tr>';
        }

        if (in_array("engine_idle", $data_items))
        {
            $result .= 	'<tr>
                        <td><strong>'.$la['ENGINE_IDLE'].':</strong></td>
                        <td>'.$data['engine_idle'].'</td>
                    </tr>';
        }

        $result .= '</table>';*/

        return $result;
    }

    function reportsGenerateTravelSheet($imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //TRAVEL_SHEET
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';
        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

        if (count($data['drives']) < 1) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("time_a", $data_items)) {
            $result .= '<th>'.$la['TIME_A'].'</th>';
        }

        if (in_array("position_a", $data_items)) {
            $result .= '<th>'.$la['POSITION_A'].'</th>';
        }

        if (in_array("time_b", $data_items)) {
            $result .= '<th>'.$la['TIME_B'].'</th>';
        }

        if (in_array("position_b", $data_items)) {
            $result .= '<th>'.$la['POSITION_B'].'</th>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<th>'.$la['DURATION'].'</th>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= '<th>'.$la['LENGTH'].'</th>';
        }

        if (in_array("fuel_consumption", $data_items)) {
            $result .= '<th>'.$la['FUEL_CONSUMPTION'].'</th>';
        }

        if (in_array("fuel_cost", $data_items)) {
            $result .= '<th>'.$la['FUEL_COST'].'</th>';
        }

        $result .= '</tr>';

        $total_route_length = 0;
        $total_fuel_consumption = 0;
        $total_fuel_cost = 0;

        for ($j=0; $j<count($data['drives']); ++$j) {
            $route_id_a = $data['drives'][$j][0];
            $route_id_b = $data['drives'][$j][2];

            $lat1 = sprintf("%01.6f", $data['route'][$route_id_a][1]);
            $lng1 = sprintf("%01.6f", $data['route'][$route_id_a][2]);
            $lat2 = sprintf("%01.6f", $data['route'][$route_id_b][1]);
            $lng2 = sprintf("%01.6f", $data['route'][$route_id_b][2]);

            $time_a = $data['drives'][$j][4];

            $time_b = $data['drives'][$j][5];

            // this prevents double geocoder calling
            if (!isset($position_a)) {
                $position_a = reportsGetPossition($lat1, $lng1, $show_coordinates, $show_addresses, $zones_addresses);
            } else {
                $position_a = $position_b;
            }

            $position_b = reportsGetPossition($lat2, $lng2, $show_coordinates, $show_addresses, $zones_addresses);

            $duration = $data['drives'][$j][6];

            $route_length = $data['drives'][$j][7];
            $fuel_consumption = $data['drives'][$j][10];
            $fuel_cost = $data['drives'][$j][11];

            $result .= '<tr align="center">';

            if (in_array("time_a", $data_items)) {
                $result .= '<td>'.$time_a.'</td>';
            }

            if (in_array("position_a", $data_items)) {
                $result .= '<td>'.$position_a.'</td>';
            }

            if (in_array("time_b", $data_items)) {
                $result .= '<td>'.$time_b.'</td>';
            }

            if (in_array("position_b", $data_items)) {
                $result .= '<td>'.$position_b.'</td>';
            }

            if (in_array("duration", $data_items)) {
                $result .= '<td>'.$duration.'</td>';
            }

            if (in_array("route_length", $data_items)) {
                $result .= '<td>'.$route_length.' '.$la["UNIT_DISTANCE"].'</td>';

                $total_route_length += $route_length;
            }

            if (in_array("fuel_consumption", $data_items)) {
                $result .= '<td>'.$fuel_consumption.' '.$la["UNIT_CAPACITY"].'</td>';

                $total_fuel_consumption += $fuel_consumption;
            }

            if (in_array("fuel_cost", $data_items)) {
                $result .= '<td>'.$fuel_cost.' '.$_SESSION["currency"].'</td>';

                $total_fuel_cost += $fuel_cost;
            }

            $result .= '</tr>';
        }

        if (in_array("total", $data_items)) {
            $result .= '<tr align="center">';

            if (in_array("time_a", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("position_a", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("time_b", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("position_b", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("duration", $data_items)) {
                $result .= '<td></td>';
            }

            if (in_array("route_length", $data_items)) {
                $result .= '<td>'.$total_route_length.' '.$la["UNIT_DISTANCE"].'</td>';
            }

            if (in_array("fuel_consumption", $data_items)) {
                $result .= '<td>'.$total_fuel_consumption.' '.$la["UNIT_CAPACITY"].'</td>';
            }

            if (in_array("fuel_cost", $data_items)) {
                $result .= '<td>'.$total_fuel_cost.' '.$_SESSION["currency"].'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateTravelSheet2($imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //TRAVEL_SHEET
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';
        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);

        if (count($data['drives']) < 1) {
            //	return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        //		$result = '<table class="report" width="100%"><tr align="center">';

        $total_route_length = 0;
        $total_fuel_consumption = 0;
        $total_fuel_cost = 0;

        for ($j=0; $j<count($data['drives']); ++$j) {
            $route_id_a = $data['drives'][$j][0];
            $route_id_b = $data['drives'][$j][2];

            $lat1 = sprintf("%01.6f", $data['route'][$route_id_a][1]);
            $lng1 = sprintf("%01.6f", $data['route'][$route_id_a][2]);
            $lat2 = sprintf("%01.6f", $data['route'][$route_id_b][1]);
            $lng2 = sprintf("%01.6f", $data['route'][$route_id_b][2]);

            $time_a = $data['drives'][$j][4];

            $time_b = $data['drives'][$j][5];

            if (!isset($position_a)) {
                $position_a = reportsGetPossition($lat1, $lng1, $show_coordinates, $show_addresses, $zones_addresses);
            } else {
                $position_a = $position_b;
            }

            $position_b = reportsGetPossition($lat2, $lng2, $show_coordinates, $show_addresses, $zones_addresses);

            $duration = $data['drives'][$j][6];

            $route_length = $data['drives'][$j][7];
            $fuel_consumption = $data['drives'][$j][10];
            $fuel_cost = $data['drives'][$j][11];

            //			$result .= '<tr align="center">';
            $result .= '<td>'.getObjectName($imei).'</td>';
            $result .= '<td>'.$time_a.'</td>';
            $result .= '<td>'.$position_a.'</td>';
            $result .= '<td>'.$time_b.'</td>';
            $result .= '<td>'.$position_b.'</td>';
            $result .= '<td>'.$duration.'</td>';
            $result .= '<td>'.$route_length.' '.$la["UNIT_DISTANCE"].'</td>';

            $total_route_length += $route_length;

            $result .= '</tr>';
        }

        //	$result .= '</table>';

        return $result;
    }


    function reportsGenerateMileageDaily($imei, $dtf, $dtt, $data_items) //MILEAGE_DAILY
    {
        global $_SESSION, $la, $user_id,$ms;

        $accuracy = getObjectAccuracy($imei);

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);

        $route = removeRouteJunkPoints($route, $accuracy);

        if (count($route) < 2) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("time", $data_items)) {
            $result .= '<th>Dia</th>';
        }

        if (in_array("start", $data_items)) {
            $result .= '<th>'.$la['START'].'</th>';
        }

        if (in_array("end", $data_items)) {
            $result .= '<th>'.$la['END'].'</th>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= '<th>'.$la['LENGTH'].'</th>';
        }

        if (in_array("fuel_consumption", $data_items)) {
            $result .= '<th>'.$la['FUEL_CONSUMPTION'].'</th>';
        }

        if (in_array("fuel_cost", $data_items)) {
            $result .= '<th>'.$la['FUEL_COST'].'</th>';
        }

        $result .= '</tr>';

        $date_prev = '';
        $id_start = -1;
        $id_end = -1;
        $date = '';
        $dt_start = '';
        $dt_end = '';

        $route_length = 0;
        $fuel_consumption = 0;
        $fuel_cost = 0;

        $total_route_length = 0;
        $total_fuel_consumption = 0;
        $total_fuel_cost = 0;

        $fcr = getObjectFCR($imei);
        $fuel_sensors = getSensorFromType($imei, 'fuel');
        $fuelcons_sensors = getSensorFromType($imei, 'fuelcons');

        for ($i=0; $i<count($route)-1; ++$i) {
            $lat1 = $route[$i][1];
            $lng1 = $route[$i][2];
            $lat2 = $route[$i+1][1];
            $lng2 = $route[$i+1][2];
            $route_length += getLengthBetweenCoordinates($lat1, $lng1, $lat2, $lng2);

            $date_cur = substr($route[$i+1][0], 0, 10);

            if ($date_prev == '') {
                $date_prev = $date_cur;
            }

            if ($id_start == -1) {
                $id_start = $i;
                $date = $date_cur;
                $dt_start = $route[$i+1][0];
            }

            if (($date_prev != $date_cur) || (count($route)-2 == $i)) {
                $id_end = $i + 1;
                $dt_end = $route[$i][0];

                $route_length = convDistanceUnits($route_length, 'km', $_SESSION["unit_distance"]);

                if ($route_length > 0) {
                    $route_length = sprintf("%01.2f", $route_length);

                    $fuel_consumption = getRouteFuelConsumption($route, $id_start, $id_end, $accuracy, $fcr, $fuel_sensors, $fuelcons_sensors);
                    $fuel_cost = getRouteFuelCost($fuel_consumption, $fcr);

                    $result .= '<tr align="center">';

                    if (in_array("time", $data_items)) {
                        $result .= '<td>'.$date.'</td>';
                    }

                    if (in_array("start", $data_items)) {
                        $result .= '<td>'.$dt_start.'</td>';
                    }

                    if (in_array("end", $data_items)) {
                        $result .= '<td>'.$dt_end.'</td>';
                    }

                    if (in_array("route_length", $data_items)) {
                        $result .= '<td>'.$route_length.' '.$la["UNIT_DISTANCE"].'</td>';
                        $total_route_length += $route_length;
                    }

                    if (in_array("fuel_consumption", $data_items)) {
                        $result .= '<td>'.$fuel_consumption.' '.$la["UNIT_CAPACITY"].'</td>';
                        $total_fuel_consumption += $fuel_consumption;
                    }

                    if (in_array("fuel_cost", $data_items)) {
                        $result .= '<td>'.$fuel_cost.' '.$_SESSION["currency"].'</td>';
                        $total_fuel_cost += $fuel_cost;
                    }

                    $result .= '</tr>';
                }

                $route_length = 0;
                $fuel_consumption = 0;
                $fuel_cost = 0;
                $id_start = -1;
                $id_end = -1;
            }

            $date_prev = $date_cur;
        }
    //TOTALES


        // if (in_array("total", $data_items)) {
        //     $result .= '<tr align="center">';

        //     if (in_array("time", $data_items)) {
        //         $result .= '<td>Totales</td>';
        //     }

        //     if (in_array("start", $data_items)) {
        //         $result .= '<td></td>';
        //     }

        //     if (in_array("end", $data_items)) {
        //         $result .= '<td></td>';
        //     }
        //     // if (in_array("time", $data_items)) {
        //     //     $result .= '<td>'.$date.'</td>';
        //     // }

        //     // if (in_array("start", $data_items)) {
        //     //     $result .= '<td>'.$dt_start.'</td>';
        //     // }

        //     // if (in_array("end", $data_items)) {
        //     //     $result .= '<td>'.$dt_end.'</td>';
        //     // }

        //     if (in_array("route_length", $data_items)) {
        //         $result .= '<td>'.$total_route_length.' '.$la["UNIT_DISTANCE"].'</td>';
        //     }

        //     if (in_array("fuel_consumption", $data_items)) {
        //         $result .= '<td>'.$total_fuel_consumption.' '.$la["UNIT_CAPACITY"].'</td>';
        //     }

        //     if (in_array("fuel_cost", $data_items)) {
        //         $result .= '<td>'.$total_fuel_cost.' '.$_SESSION["currency"].'</td>';
        //     }

        //     $result .= '</tr>';
        // }

        $result .= '</table>';

        return $result;
    }
    //Reporte de exceso de velocidad personalizado
    function reportsGenerateOverspeed3P($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$cantidadR,$vel_superior_a,$vel_rutas,$diferencial_velocidad) //OVERSPEED SP
    {
        global $_SESSION, $la, $user_id,$ms;

        $accuracy = getObjectAccuracy($imei);

        // $mysqli  = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');
        // $mysqli = new mysqli('104.200.25.198', 'root', 'Stech..,', 'gpsimple');

        $q2  = "SELECT dt_tracker,lat,lng,speed,overpass, abs(overpass-speed), overpass FROM gs_object_data_".$imei."
				WHERE dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."'
				and speed >= '".$vel_superior_a."' and overpass = '".$vel_rutas."'  and abs(overpass-speed) >= '".$diferencial_velocidad."'";

        $r2 = mysqli_query($ms, $q2);

        $conteo_registro = mysqli_num_rows($r2);
        // $conteo_registro = 18;


        $result = '<table class="report" width="100%"><tr align="center">';
        $result .= '<th>'.$la['OBJECT'].'</th>';
        $result .= '<th>Fecha</th>';
        $result .= '<th>Velocidad Vehiculo</th>';
        $result .= '<th>Velocidad Esperada</th>';
        $result .= '<th>Velocidad Superada por</th>';
        $result .= '<th>Direccion de la Falta</th>';
        $result .= '<th>Velocidad superior a </th>';
        $result .= '<th>En rutas de</th>';
        $result .= '</tr>';

        // $contador_registros = 0;
        while ($row2 = mysqli_fetch_row($r2)) {
            $dt_server = $row2[0];
            $speed = $row2[3];
            $maxSpeed= $row2[6];

         if($conteo_registro > $cantidadR){
            if($speed >= $speed_limit){
                if($dt_server_anterior){

                    if($dt_server > $dt_server_anterior){

                        $lat = $row2[1];
                        $lng = $row2[2];
                        $speed = $row2[3];
                        $overspeed = $row2[4];
                        $overspeedDif = $row2[5];

                        $diferencia = ((strtotime($dt_server)) - (strtotime($dt_server_anterior)));
                        $diferencia = round($diferencia);


                    // if($diferencia > 30){
                        // var_dump("lleva ".$diferencia. " minutos en exceso de velocidad");
                        //filtro 1
                        round($speed);
                        round($overspeedDif);
                       //velocidad es mayor a variable x y overpass de la data es igual a variable y.
                       if($overspeedDif >= $diferencial_velocidad){
                            // if($speed >= $vel_superior_a && $maxSpeed == $vel_rutas){
                                //  $contador_registros ++;

                                //  if($contador_registros > $cantidadR-1){

                                    $result .= '<tr align="center">';
                                    $result .= '<td>'.getObjectName($imei).'</td>';
                                    $result .= '<td>'.convUserTimezone($dt_server).'</td>';
                                    $result .= '<td>'.round($speed,0).'</td>';
                                    $result .= '<td>'.$overspeed.'</td>';
                                    $result .= '<td>'.round($overspeedDif,0).'</td>';
                                    $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                                    $result .= '<td>'.$vel_superior_a.'</td>';
                                    $result .= '<td>'.$vel_rutas.'</td>';
                                    $result .= '</tr>';
                                 }

                            // }

                        //
                        //  else {
                        //         $result .= '<tr align="center">';
                        //         $result .= '<td>'.getObjectName($imei).'</td>';
                        //         $result .= '<td>'.convUserTimezone($dt_server).'</td>';
                        //         $result .= '<td>'.$speed.'</td>';
                        //         $result .= '<td>'.$overspeed.'</td>';
                        //         $result .= '<td>'.$overspeedDif.'</td>';
                        //         $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                        //         $result .= '<td>sin filtros</td>';
                        //         $result .= '<td>sin filtros</td>';
                        //         $result .= '</tr>';
                        //  }
                        // }else {
                        //     return '<table><tr><td>'.'1'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
                        // }

                    }else {
                        return '<table><tr><td>'.'2'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
                    }

                }else {
                    // return '<table><tr><td>'.'3'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
                }
                $dt_server_anterior = $row2[0];

            }
            // else {
            //     return '<table><tr><td>'.'4'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
            // }
         }
            else {
                return '<table><tr><td>'.'5'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
            }
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateOverspeed($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED
    {
        global $_SESSION, $la, $user_id,$ms;

        $accuracy = getObjectAccuracy($imei);

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        //$route = removeRouteFakeCoordinates($route, array());
        $overspeeds = getRouteOverspeeds($route, $speed_limit);

        if ((count($route) == 0) || (count($overspeeds) == 0)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("start", $data_items)) {
            $result .= '<th>'.$la['START'].'</th>';
        }

        if (in_array("end", $data_items)) {
            $result .= '<th>'.$la['END'].'</th>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<th>'.$la['DURATION'].'</th>';
        }

        if (in_array("top_speed", $data_items)) {
            $result .= '<th>'.$la['TOP_SPEED'].'</th>';
        }

        if (in_array("avg_speed", $data_items)) {
            $result .= '<th>'.$la['AVG_SPEED'].'</th>';
		}

		//if (in_array("rpm", $data_items)) {
            //$result .= '<th>RPM</th>';
        //}

        if (in_array("overspeed_position", $data_items)) {
            $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
		}

        $result .= '</tr>';

        for ($i=0; $i<count($overspeeds); ++$i) {
	   //if ($overspeeds[$i][7] != 0) {

            $result .= '<tr align="center">';

            if (in_array("start", $data_items)) {
                $result .= '<td>'.$overspeeds[$i][0].'</td>';
            }

            if (in_array("end", $data_items)) {
                $result .= '<td>'.$overspeeds[$i][1].'</td>';
            }

            if (in_array("duration", $data_items)) {
                $result .= '<td>'.$overspeeds[$i][2].'</td>';
            }

            if (in_array("top_speed", $data_items)) {
                $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
            }

            if (in_array("avg_speed", $data_items)) {
                $result .= '<td>'.$overspeeds[$i][4].' '.$la["UNIT_SPEED"].'</td>';
			}

			//if (in_array("rpm", $data_items)) {
                //$result .= '<td>'.$overspeeds[$i][7].' rpm</td>';
            //}

            if (in_array("overspeed_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            $result .= '</tr>';
	   //}
        }

        $result .= '</table>';

        return $result;
    }

     //Funcion de reporte exceso de velocidad personalizado
     function reportsGenerateOverspeedLmc($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$menorA,$mayorA) //OVERSPEED
     {

         global $_SESSION, $la, $user_id,$ms;

         $accuracy = getObjectAccuracy($imei);

         $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
         //$route = removeRouteFakeCoordinates($route, array());
         $overspeeds = getRouteOverspeeds($route, $speed_limit);

            //  $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

        //  $conn = new mysqli('104.200.25.198', 'root', 'Stech..,', 'gpsimple');

         $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                     where gs_user_objects.group_id = gs_user_object_groups.group_id
                     and gs_user_objects.user_id = gs_user_object_groups.user_id
                     and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

         $result2 = $ms->query($sql);
            $grupos = "sin grupo";
            while($row = $result2->fetch_assoc()) {
                 $grupos = $row['group_name'];

            }
             
            if($grupos != "sin grupo"){
               $grupos = $grupos;
            }
            else {
                 $grupos = "sin grupo";
            }



         if (count($route) == 0){
             return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
         }

         $result = '<table class="report" width="100%"><tr align="center">';

             $result .= '<th>Patente</th>';
             $result .= '<th>Nombre</th>';
             $result .= '<th>Grupo</th>';
             $result .= '<th>Mes</th>';
             $result .= '<th>'.$la['START'].'</th>';
             $result .= '<th>'.$la['END'].'</th>';
             $result .= '<th>'.$la['DURATION'].'</th>';
             $result .= '<th>'.$la['TOP_SPEED'].'</th>';
             $result .= '<th>'.$la['AVG_SPEED'].'</th>';
             $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
             $result .= '<th>'."Diferencial".'</th>';
             $result .= '<th>Clasificacion de eventos</th>';
             $result .= '</tr>';


            //  $menorA = $_COOKIE['nuevaCookieMenor'];
            //  $mayorA = $_COOKIE['nuevaCookieMayor'];

         for ($i=0; $i<count($overspeeds); ++$i) {

         $patente = getObjectPlate($imei);
         if($menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0){

             $diferenciaO = -1;
             $nivelLmc = -1;
         }
         else{
             //resta exceso velocidad vehiculo con exceso velocidad configurado
             $diferenciaO = $overspeeds[$i][3] - $speed_limit;
             //Niveles de gravedad
             $nivelLmc = "";
                 if($diferenciaO <= $menorA){
                     $nivelLmc = "leve";
                 }
                 else if ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                     $nivelLmc = "medio";
                 }
                 else if ($diferenciaO >= $mayorA){
                     $nivelLmc = "critico";
                 }
         }

         $fechaComoEntero = strtotime($overspeeds[$i][1]);
         $mes = (int) date("m", $fechaComoEntero);
         $año = (int) date("Y", $fechaComoEntero);

         setlocale(LC_TIME, 'es_ES');
         $monthNum  = $mes;
         $dateObj   = DateTime::createFromFormat('!m', $monthNum);
         $monthName = strftime('%B', $dateObj->getTimestamp());

         switch($monthNum)
         {
             case 1:
             $monthNameSpanish = "Enero";
             break;
             case 2:
             $monthNameSpanish = "Febrero";
             break;
             case 3:
             $monthNameSpanish = "Marzo";
             break;
             case 4:
             $monthNameSpanish = "Abril";
             break;
             case 5:
             $monthNameSpanish = "Mayo";
             break;
             case 6:
             $monthNameSpanish = "Junio";
             break;
             case 7:
             $monthNameSpanish = "Julio";
             break;
             case 8:
             $monthNameSpanish = "Agosto";
             break;
             case 9:
             $monthNameSpanish = "Septiembre";
             break;
             case 10:
             $monthNameSpanish = "Octubre";
             break;
             case 11:
             $monthNameSpanish = "Noviembre";
             break;
             case 12:
             $monthNameSpanish = "Diciembre";
             break;

         }

         // echo $monthName;

                $result .= '<tr align="center">';

             // if (in_array("start", $data_items)) {
                 $result .= '<td>'.$patente.'</td>';
                 $result .= '<td>'.getObjectName($imei).'</td>';
                 $result .= '<td>'.$grupos.'</td>';
                 $result .= '<td>'.$monthNameSpanish.' '.$año.'</td>';
                 $result .= '<td>'.$overspeeds[$i][0].'</td>';
             // }
             // if (in_array("end", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][1].'</td>';
             // }
             // if (in_array("duration", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][2].'</td>';
             // }
             // if (in_array("top_speed", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
             // }
             // if (in_array("avg_speed", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][4].' '.$la["UNIT_SPEED"].'</td>';
             // }
             //if (in_array("rpm", $data_items)) {
                 //$result .= '<td>'.$overspeeds[$i][7].' rpm</td>';
             //}
             // if (in_array("overspeed_position", $data_items)) {
                 $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
             // }
             // if (in_array("overspeed_position", $data_items)) {
                 $result .= '<td>'.TipoDato($diferenciaO).'</td>';
             // }
             // if (in_array("overspeed_position", $data_items)) {
                 $result .= '<td>'.TipoDato($nivelLmc).'</td>';
             // }


             $result .= '</tr>';
        //}
         }

         $result .= '</table>';

         return $result;
     }
     //Funcion de reporte exceso de velodcidad personalizado formato para trabajar en excel
     function reportsGenerateOverspeedLmcE($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$menorA,$mayorA) //OVERSPEED
     {

         global $_SESSION, $la, $user_id,$ms;

         $accuracy = getObjectAccuracy($imei);

         $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
         //$route = removeRouteFakeCoordinates($route, array());
         $overspeeds = getRouteOverspeeds($route, $speed_limit);


        //  $conn = new mysqli('104.200.25.198', 'root', 'Stech..,', 'gpsimple');
        //  $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');


         $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                     where gs_user_objects.group_id = gs_user_object_groups.group_id
                     and gs_user_objects.user_id = gs_user_object_groups.user_id
                     and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

         $result2 = $ms->query($sql);

             while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

             }
             if($grupos){
               $grupos = $grupos;
             }
             else {
                 $grupos = "sin grupo";
             }



         if (count($route) == 0){
             return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
         }

         // $result = '<table class="report" width="100%"><tr align="center">';

         //     $result .= '<th>Patente</th>';
         //     $result .= '<th>Nombre</th>';
         //     $result .= '<th>Grupo</th>';
         //     $result .= '<th>Mes</th>';
         //     $result .= '<th>'.$la['START'].'</th>';
         //     $result .= '<th>'.$la['END'].'</th>';
         //     $result .= '<th>'.$la['DURATION'].'</th>';
         //     $result .= '<th>'.$la['TOP_SPEED'].'</th>';
         //     $result .= '<th>'.$la['AVG_SPEED'].'</th>';
         //     $result .= '<th>'.$la['OVERSPEED_POSITION'].'</th>';
         //     $result .= '<th>'."Diferencial".'</th>';
         //     $result .= '<th>Clasificacion de eventos</th>';
         //     $result .= '</tr>';

         $result = "";
        //  $menorA = $_COOKIE['nuevaCookieMenor'];
        //  $mayorA = $_COOKIE['nuevaCookieMayor'];


         for ($i=0; $i<count($overspeeds); ++$i) {

         $patente = getObjectPlate($imei);
             if($menorA < 0 || $menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0 || $mayorA < 0){

                 $diferenciaO = -1;
                 $nivelLmc = -1;
             }
             else{
                 //resta exceso velocidad vehiculo con exceso velocidad configurado
                 $diferenciaO = $overspeeds[$i][3] - $speed_limit;
                 //Niveles de gravedad
                 $nivelLmc = "";
                     if($diferenciaO <= $menorA){
                         $nivelLmc = "leve";
                     }
                     else if ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                         $nivelLmc = "medio";
                     }
                     else if ($diferenciaO >= $mayorA){
                         $nivelLmc = "critico";
                     }
             }


         $fechaComoEntero = strtotime($overspeeds[$i][1]);
         $mes = (int) date("m", $fechaComoEntero);
         $año = (int) date("Y", $fechaComoEntero);

         setlocale(LC_TIME, 'es_ES');
         $monthNum  = $mes;
         $dateObj   = DateTime::createFromFormat('!m', $monthNum);
         $monthName = strftime('%B', $dateObj->getTimestamp());

         switch($monthNum)
         {
             case 1:
             $monthNameSpanish = "Enero";
             break;
             case 2:
             $monthNameSpanish = "Febrero";
             break;
             case 3:
             $monthNameSpanish = "Marzo";
             break;
             case 4:
             $monthNameSpanish = "Abril";
             break;
             case 5:
             $monthNameSpanish = "Mayo";
             break;
             case 6:
             $monthNameSpanish = "Junio";
             break;
             case 7:
             $monthNameSpanish = "Julio";
             break;
             case 8:
             $monthNameSpanish = "Agosto";
             break;
             case 9:
             $monthNameSpanish = "Septiembre";
             break;
             case 10:
             $monthNameSpanish = "Octubre";
             break;
             case 11:
             $monthNameSpanish = "Noviembre";
             break;
             case 12:
             $monthNameSpanish = "Diciembre";
             break;

         }

         // echo $monthName;
            if ($diferenciaO > 0) {
                # code...
                $result .= '<tr align="center">';

             // if (in_array("start", $data_items)) {
                 $result .= '<td>'.$patente.'</td>';
                 $result .= '<td>'.getObjectName($imei).'</td>';
                 $result .= '<td>'.$grupos.'</td>';
                 $result .= '<td>'.$monthNameSpanish.' '.$año.'</td>';
                 $result .= '<td>'.$overspeeds[$i][0].'</td>';
             // }
             // if (in_array("end", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][1].'</td>';
             // }
             // if (in_array("duration", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][2].'</td>';
             // }
             // if (in_array("top_speed", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
             // }
             // if (in_array("avg_speed", $data_items)) {
                 $result .= '<td>'.$overspeeds[$i][4].' '.$la["UNIT_SPEED"].'</td>';
             // }
             //if (in_array("rpm", $data_items)) {
                 //$result .= '<td>'.$overspeeds[$i][7].' rpm</td>';
             //}
             // if (in_array("overspeed_position", $data_items)) {
                 $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
             // }
             // if (in_array("overspeed_position", $data_items)) {
                 $result .= '<td>'.TipoDato($diferenciaO).'</td>';
             // }
             // if (in_array("overspeed_position", $data_items)) {
                 $result .= '<td>'.TipoDato($nivelLmc).'</td>';
             // }


             $result .= '</tr>';

            }

        //}
         }

         // $result .= '</table>';

         return $result;
     }


     function overSpeedGeoMinPrueba($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA) //OVERSPEED
    {
        global $ms, $_SESSION, $la, $user_id;

		$route = array();
		$q = "SELECT DISTINCT 
                    dt_tracker,
					lat,
					lng,
					altitude,
					angle,
					speed,
					params,
                    event_id
					FROM `gs_user_events_data` WHERE imei = '".$imei."' AND speed > ".$speed_limit." AND type = 'overspeedT' AND user_id = '".$user_id."'  AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
                	// -- FROM `gs_user_events_data` WHERE imei = '".$imei."' AND speed >".$speed_limit. " AND TIMESTAMPDIFF(SECOND ,dt_tracker,'dt_server') >= 60 AND type = 'overspeed' AND user_id = '".$user_id."'  AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";


		$r = mysqli_query($ms, $q);

		while($route_data=mysqli_fetch_array($r))
		{
			$dt_tracker = convUserTimezone($route_data['dt_tracker']);
			$lat = $route_data['lat'];
			$lng = $route_data['lng'];
			$altitude = $route_data['altitude'];
			$angle = $route_data['angle'];
            $speed = $route_data['speed'];
            $event_id = $route_data['event_id'];

			$params = json_decode($route_data['params'],true);
			// $params = mergeParams($params_prev, $params);
			$params2 = $route_data['params'];

			$speed = convSpeedUnits($speed, 'km', $_SESSION["unit_distance"]);
			$altitude = convAltitudeUnits($altitude, 'km', $_SESSION["unit_distance"]);

				if (($lat != 0) && ($lng != 0))
				{
					$route[] = array(	$dt_tracker,
								$lat,
								$lng,
								$altitude,
								$angle,
								$speed,
                                $params,
                                $event_id
								);
				}
        }


        // $accuracy = getObjectAccuracy($imei);
        // $route = getRouteRawEvent($imei, $dtf, $dtt);
        $overspeeds = getRouteOverspeedsEvent($route);
        // $result .= '<h3>'.$dtf." ".$dtt.'</h3>';
        // $result .= '<h3>'.json_encode($overspeeds).'</h3>';
        // return $result;

            // $conn = new mysqli('104.200.25.198', 'root', 'Stech..,', 'gpsimple');
            // $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

            $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                        where gs_user_objects.group_id = gs_user_object_groups.group_id
                        and gs_user_objects.user_id = gs_user_object_groups.user_id
                        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

            $result2 = $ms->query($sql);
            $grupos = "sin grupo";
            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

            }

            if($grupos != "sin grupo"){
            $grupos = $grupos;
            }
            else {
                $grupos = "sin grupo";
            }

        $prueba = $zone_ids;
        $prueba2 = explode(",", $prueba);

        $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
        $r = mysqli_query($ms, $q);
        $zones = array();

        while ($row=mysqli_fetch_array($r)) {
            if (in_array($row['zone_id'], $prueba2)) {
                $mineq=0;
                $mayeq=0;

                if(isset($row['menor_igual_a'])){
                    $mineq=$row['menor_igual_a'];
                }

                if(isset($row['mayor_igual_a'])){
                    $mayeq=$row['mayor_igual_a'];
                }
                

                $zones[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices'],$row['menor_igual_a'],$row['mayor_igual_a']);


            }
        }

     if($route){

        $result = '<table class="report" width="100%"><tr align="center">';

        $result .= '<th>Patente</th>';
        $result .= '<th>Nombre</th>';
        $result .= '<th>Grupo</th>';
        $result .= '<th>Mes</th>';
        $result .= '<th>'."Fecha evento".'</th>';
        // $result .= '<th>'.$la['END'].'</th>';
        // $result .= '<th>'.$la['DURATION'].'</th>';
        $result .= '<th>'.$la['TOP_SPEED'].'</th>';
        // $result .= '<th>'.$la['AVG_SPEED'].'</th>';
        $result .= '<th>'."Nombre Geocerca".'</th>';
        $result .= '<th>'."Direccion".'</th>';
        $result .= '<th>'."Diferencial".'</th>';
        $result .= '<th>Clasificacion de evento</th>';
        $result .= '</tr>';

                $in_zones = array();
                $in_zone = 0;
                $in_zone_route_length = 0;

                for ($i=0; $i<count($route); ++$i) {

                    $point_lat = $route[$i][1];
                    $point_lng = $route[$i][2];

                    for ($j=0; $j<count($zones); ++$j) {
                        $zone_id = $zones[$j][0];
                        $zone_name = $zones[$j][1];
                        $zone_vertices = $zones[$j][2];
                        $menor_igual_a = $zones[$j][3];
                        $mayor_igual_a = $zones[$j][4];


                        $query = "SELECT * FROM `gs_user_events` WHERE `imei` LIKE '%$imei%' AND zones != ''  AND `type` = 'overspeed' AND `zones` LIKE '%$zone_id%'" ;
                        $resultado = mysqli_query($ms, $query);
                        $zonasReporte = mysqli_fetch_assoc($resultado);

                        $checkValue = $zonasReporte['checked_value'];
                        $diferenciaO = $overspeeds[$i][3] - $checkValue;
                        if ($diferenciaO>0) {

                        $isPointInPoylgon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

                        if ($isPointInPoylgon == 1) {

                            //$patente = getObjectPlate($imei);
                            // $menorA = $_COOKIE['nuevaCookieMenor'];
                            // $mayorA = $_COOKIE['nuevaCookieMayor'];


                            if(!$checkValue || $menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0){
                                $checkValue = -1;
                                $diferenciaO = -1;
                                $nivelLmc = -1;
                            }
                            else{
                            //resta exceso velocidad vehiculo con exceso velocidad configurado
                            $diferenciaO = $overspeeds[$i][3] - $checkValue;
                            //Niveles de gravedad
                            $nivelLmc = "";

                                if($diferenciaO < $menorA +1){
                                    $nivelLmc = "Leve";
                                }
                                elseif ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                                    $nivelLmc = "Grave";
                                }
                                elseif ($diferenciaO > $mayorA -1){
                                    $nivelLmc = "Muy Grave";
                                }

                            }

                            if($menorA < 0 || $menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0 || $mayorA < 0){

                                $diferenciaO = -1;
                                $nivelLmc = -1;
                            }
                            else{
                                //resta exceso velocidad vehiculo con exceso velocidad configurado
                                $diferenciaO = $overspeeds[$i][3] - $speed_limit;
                                //Niveles de gravedad
                                $nivelLmc = "";
                                    if($diferenciaO <= $menorA){
                                        $nivelLmc = "Leve";
                                    }
                                    else if ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                                        $nivelLmc = "Grave";
                                    }
                                    else if ($diferenciaO >= $mayorA){
                                        $nivelLmc = "Muy grave";
                                    }
                            }

                            $fechaComoEntero = strtotime($overspeeds[$i][1]);
                            $mes = (int) date("m", $fechaComoEntero);
                            $año = (int) date("Y", $fechaComoEntero);

                            setlocale(LC_TIME, 'es_ES');
                            $monthNum  = $mes;
                            $dateObj   = DateTime::createFromFormat('!m', $monthNum);
                            $monthName = strftime('%B', $dateObj->getTimestamp());

                            switch($monthNum)
                            {
                                case 1:
                                $monthNameSpanish = "Enero";
                                break;
                                case 2:
                                $monthNameSpanish = "Febrero";
                                break;
                                case 3:
                                $monthNameSpanish = "Marzo";
                                break;
                                case 4:
                                $monthNameSpanish = "Abril";
                                break;
                                case 5:
                                $monthNameSpanish = "Mayo";
                                break;
                                case 6:
                                $monthNameSpanish = "Junio";
                                break;
                                case 7:
                                $monthNameSpanish = "Julio";
                                break;
                                case 8:
                                $monthNameSpanish = "Agosto";
                                break;
                                case 9:
                                $monthNameSpanish = "Septiembre";
                                break;
                                case 10:
                                $monthNameSpanish = "Octubre";
                                break;
                                case 11:
                                $monthNameSpanish = "Noviembre";
                                break;
                                case 12:
                                $monthNameSpanish = "Diciembre";
                                break;

                            }


                                // $result = '<table class="report" width="100%"><tr align="center">';
                                    $result .= '<tr align="center">';
                                    $result .= '<td>'.getObjectPlate($imei).'</td>';
                                    $result .= '<td>'.getObjectName($imei).'</td>';
                                    $result .= '<td>'.$grupos.'</td>';
                                    $result .= '<td>'.$monthNameSpanish.' '.$año.'</td>';
                                    $result .= '<td>'.$overspeeds[$i][0].'</td>';
                                    // $result .= '<td>'.$overspeeds[$i][1].'</td>';
                                    // $result .= '<td>'.$overspeeds[$i][2].'</td>';
                                    $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
                                    //  $result .= '<td>'.$overspeeds[$i][7].' '.$la["UNIT_SPEED"].'</td>';
                                    $result .= '<td>'.$zone_name.'</td>';
                                    $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                                    $result .= '<td>'.TipoDato($diferenciaO).'</td>';
                                    $result .= '<td>'.TipoDato($nivelLmc).'</td>';
                                    $result .= '</tr>';

                                    setcookie("nuevaCookieMenor", "", time() - 1 );
                                    setcookie("nuevaCookieMayor", "", time() - 1 );


                            }
                          }
                        }

                }

                $result .= '</table>';
            }
    else{

    $result = '<h3>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</h3>';

    }
     return $result;

    }

    //Funcion de reporte exceso de velocidad dentro de las geocercas
    function overSpeedGeo($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA) //OVERSPEED
    {
        global $ms, $_SESSION, $la, $user_id;

		$route = array();
		$q = "SELECT DISTINCT dt_tracker,
					lat,
					lng,
					altitude,
					angle,
					speed,
					params,
                    event_id
					FROM `gs_user_events_data` WHERE imei = '".$imei."' AND type = 'overspeed' AND user_id = '".$user_id."'  AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";

		$r = mysqli_query($ms, $q);

		while($route_data=mysqli_fetch_array($r))
		{
			$dt_tracker = convUserTimezone($route_data['dt_tracker']);
			$lat = $route_data['lat'];
			$lng = $route_data['lng'];
			$altitude = $route_data['altitude'];
			$angle = $route_data['angle'];
            $speed = $route_data['speed'];
            $event_id = $route_data['event_id'];

			$params = json_decode($route_data['params'],true);
			// $params = mergeParams($params_prev, $params);
			$params2 = $route_data['params'];

			$speed = convSpeedUnits($speed, 'km', $_SESSION["unit_distance"]);
			$altitude = convAltitudeUnits($altitude, 'km', $_SESSION["unit_distance"]);

				if (($lat != 0) && ($lng != 0))
				{
					$route[] = array(	$dt_tracker,
								$lat,
								$lng,
								$altitude,
								$angle,
								$speed,
                                $params,
                                $event_id
								);
				}
        }


        // $accuracy = getObjectAccuracy($imei);
        // $route = getRouteRawEvent($imei, $dtf, $dtt);
        $overspeeds = getRouteOverspeedsEvent($route);
        // $result .= '<h3>'.$dtf." ".$dtt.'</h3>';
        // $result .= '<h3>'.json_encode($overspeeds).'</h3>';
        // return $result;

            // $conn = new mysqli('104.200.25.198', 'root', 'Stech..,', 'gpsimple');
            // $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

            $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                        where gs_user_objects.group_id = gs_user_object_groups.group_id
                        and gs_user_objects.user_id = gs_user_object_groups.user_id
                        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

            $result2 = $ms->query($sql);
            $grupos = "sin grupo";
            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

            }

            if($grupos != "sin grupo"){
            $grupos = $grupos;
            }
            else {
                $grupos = "sin grupo";
            }

        $prueba = $zone_ids;
        $prueba2 = explode(",", $prueba);

        $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
        $r = mysqli_query($ms, $q);
        $zones = array();

        while ($row=mysqli_fetch_array($r)) {
            if (in_array($row['zone_id'], $prueba2)) {
                $mineq=0;
                $mayeq=0;

                if(isset($row['menor_igual_a'])){
                    $mineq=$row['menor_igual_a'];
                }

                if(isset($row['mayor_igual_a'])){
                    $mayeq=$row['mayor_igual_a'];
                }
                

                $zones[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices'],$row['menor_igual_a'],$row['mayor_igual_a']);


            }
        }

     if($route){

        $result = '<table class="report" width="100%"><tr align="center">';

        $result .= '<th>Patente</th>';
        $result .= '<th>Nombre</th>';
        $result .= '<th>Grupo</th>';
        $result .= '<th>Mes</th>';
        $result .= '<th>'."Fecha evento".'</th>';
        // $result .= '<th>'.$la['END'].'</th>';
        // $result .= '<th>'.$la['DURATION'].'</th>';
        $result .= '<th>'.$la['TOP_SPEED'].'</th>';
        // $result .= '<th>'.$la['AVG_SPEED'].'</th>';
        $result .= '<th>'."Nombre Geocerca".'</th>';
        $result .= '<th>'."Direccion".'</th>';
        $result .= '<th>'."Diferencial".'</th>';
        $result .= '<th>Clasificacion de evento</th>';
        $result .= '</tr>';

                $in_zones = array();
                $in_zone = 0;
                $in_zone_route_length = 0;

                for ($i=0; $i<count($route); ++$i) {

                    $point_lat = $route[$i][1];
                    $point_lng = $route[$i][2];

                    for ($j=0; $j<count($zones); ++$j) {
                        $zone_id = $zones[$j][0];
                        $zone_name = $zones[$j][1];
                        $zone_vertices = $zones[$j][2];
                        $menor_igual_a = $zones[$j][3];
                        $mayor_igual_a = $zones[$j][4];


                        $query = "SELECT * FROM `gs_user_events` WHERE `imei` LIKE '%$imei%' AND zones != ''  AND `type` = 'overspeed' AND `zones` LIKE '%$zone_id%'";
                        $resultado = mysqli_query($ms, $query);
                        $zonasReporte = mysqli_fetch_assoc($resultado);

                        $checkValue = $zonasReporte['checked_value'];
                        $diferenciaO = $overspeeds[$i][3] - $checkValue;
                        if ($diferenciaO>0) {

                        $isPointInPoylgon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

                        if ($isPointInPoylgon == 1) {

                            //$patente = getObjectPlate($imei);
                            // $menorA = $_COOKIE['nuevaCookieMenor'];
                            // $mayorA = $_COOKIE['nuevaCookieMayor'];

                            if(!$checkValue || $menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0){
                                $checkValue = -1;
                                $diferenciaO = -1;
                                $nivelLmc = -1;
                            }
                            else{
                            //resta exceso velocidad vehiculo con exceso velocidad configurado
                            $diferenciaO = $overspeeds[$i][3] - $checkValue;
                            //Niveles de gravedad
                            $nivelLmc = "";

                                if($diferenciaO < $menorA +1){
                                    $nivelLmc = "leve";
                                }
                                elseif ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                                    $nivelLmc = "medio";
                                }
                                elseif ($diferenciaO > $mayorA -1){
                                    $nivelLmc = "critico";
                                }

                            }

                            $fechaComoEntero = strtotime($overspeeds[$i][1]);
                            $mes = (int) date("m", $fechaComoEntero);
                            $año = (int) date("Y", $fechaComoEntero);

                            setlocale(LC_TIME, 'es_ES');
                            $monthNum  = $mes;
                            $dateObj   = DateTime::createFromFormat('!m', $monthNum);
                            $monthName = strftime('%B', $dateObj->getTimestamp());

                            switch($monthNum)
                            {
                                case 1:
                                $monthNameSpanish = "Enero";
                                break;
                                case 2:
                                $monthNameSpanish = "Febrero";
                                break;
                                case 3:
                                $monthNameSpanish = "Marzo";
                                break;
                                case 4:
                                $monthNameSpanish = "Abril";
                                break;
                                case 5:
                                $monthNameSpanish = "Mayo";
                                break;
                                case 6:
                                $monthNameSpanish = "Junio";
                                break;
                                case 7:
                                $monthNameSpanish = "Julio";
                                break;
                                case 8:
                                $monthNameSpanish = "Agosto";
                                break;
                                case 9:
                                $monthNameSpanish = "Septiembre";
                                break;
                                case 10:
                                $monthNameSpanish = "Octubre";
                                break;
                                case 11:
                                $monthNameSpanish = "Noviembre";
                                break;
                                case 12:
                                $monthNameSpanish = "Diciembre";
                                break;

                            }


                                // $result = '<table class="report" width="100%"><tr align="center">';
                                    $result .= '<tr align="center">';
                                    $result .= '<td>'.getObjectPlate($imei).'</td>';
                                    $result .= '<td>'.getObjectName($imei).'</td>';
                                    $result .= '<td>'.$grupos.'</td>';
                                    $result .= '<td>'.$monthNameSpanish.' '.$año.'</td>';
                                    $result .= '<td>'.$overspeeds[$i][0].'</td>';
                                    // $result .= '<td>'.$overspeeds[$i][1].'</td>';
                                    // $result .= '<td>'.$overspeeds[$i][2].'</td>';
                                    $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
                                    //  $result .= '<td>'.$overspeeds[$i][7].' '.$la["UNIT_SPEED"].'</td>';
                                    $result .= '<td>'.$zone_name.'</td>';
                                    $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                                    $result .= '<td>'.TipoDato($diferenciaO).'</td>';
                                    $result .= '<td>'.TipoDato($nivelLmc).'</td>';
                                    $result .= '</tr>';

                                    setcookie("nuevaCookieMenor", "", time() - 1 );
                                    setcookie("nuevaCookieMayor", "", time() - 1 );


                            }
                          }
                        }

                }

                $result .= '</table>';
            }
     else{

        $result = '<h3>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</h3>';

       }
     return $result;

    }

    function TipoDato($dato) {
        if($dato == -1){
             return "sin datos";
        }
        else{
            return $dato;
        }
    }


    //Funcion de reporte exceso de velocidad dentro de las geocercas formato para trabajar excel.
    function overSpeedGeoEOLD($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA) //OVERSPEED
    {
        global $ms, $_SESSION, $la, $user_id, $_COOKIE;

        // $menorA = 5;
        // $mayorA = 10;

		$route = array();
		// $q = "SELECT DISTINCT dt_tracker,
		// 			lat,
		// 			lng,
		// 			altitude,
		// 			angle,
		// 			speed,
		// 			params,
        //             event_id
		// 			FROM `gs_user_events_data` WHERE imei = '".$imei."' AND type = 'overspeed' AND user_id = '".$user_id."' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";


        // $q = "SELECT DISTINCT gued.dt_tracker,
		// 			gued.lat,
		// 			gued.lng,
		// 			gued.altitude,
		// 			gued.angle,
		// 			gued.speed,
		// 			gued.params,
        //             gued.event_id FROM `gs_user_events_data as gued` inner join `gs_user_events as gue` on gued.event_desc = gue.name WHERE gued.imei = '".$imei."' and gued.user_id = '".$user_id."' AND gued.type = 'overspeed' and gue.zones in (2460) AND gued.dt_tracker  BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY gued.dt_tracker ASC";


         $q = "SELECT DISTINCT gued.dt_tracker,
         gued.lat,
         gued.lng,
         gued.altitude,
         gued.angle,
         gued.speed,
         gued.params,
         gued.event_id,
         gued.event_desc,
         gue.checked_value,
         (gued.speed - gue.checked_value) as diferencia,
         guz.zone_name
         FROM gs_user_events_data gued inner join gs_user_events gue on gued.event_desc = gue.name inner join gs_user_zones guz on guz.zone_id = gue.zones WHERE (gued.speed - gue.checked_value) > 0 AND  gued.imei = '".$imei."' and gued.user_id = '".$user_id."' AND gued.type = 'overspeed' and gue.zones in (".$zone_ids.") AND gued.dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY gued.dt_tracker ASC";


		$r = mysqli_query($ms, $q);

		while($route_data=mysqli_fetch_array($r))
		{
			$dt_tracker = convUserTimezone($route_data['dt_tracker']);
			$lat = $route_data['lat'];
			$lng = $route_data['lng'];
			$altitude = $route_data['altitude'];
			$angle = $route_data['angle'];
            $speed = $route_data['speed'];
            $event_id = $route_data['event_id'];
            $event_desc = $route_data['event_desc'];
            $checked_value = $route_data['checked_value'];
            $diferencia = $route_data['diferencia'];
            $zone_name = $route_data['zone_name'];


			$params = json_decode($route_data['params'],true);
			// $params = mergeParams($params_prev, $params);
			$params2 = $route_data['params'];

			$speed = convSpeedUnits($speed, 'km', $_SESSION["unit_distance"]);
			$altitude = convAltitudeUnits($altitude, 'km', $_SESSION["unit_distance"]);

				if (($lat != 0) && ($lng != 0))
				{
					$route[] = array(
                                $dt_tracker,
								$lat,
								$lng,
								$altitude,
								$angle,
								$speed,
                                $params,
                                $event_id,
                                $event_desc,
                                $checked_value,
                                $diferencia,
                                $zone_name
								);
				}
        }


         $result = "";

        //   if (isset($route)) {

        //     $result .= '<table class="report" width="100%">Favor solo seleccione una geocerca<tr align="center">';

        //     return $result;

        //   }

        // $accuracy = getObjectAccuracy($imei);
        // $route = getRouteRawEvent($imei, $dtf, $dtt);
        $overspeeds = getRouteOverspeedsEvent($route);
        $patente = getObjectPlate($imei);
        // $result .= '<h3>'.$dtf." ".$dtt.'</h3>';
        // $result .= '<h3>'.json_encode($overspeeds).'</h3>';
        // return $result;

            // // $conn = new mysqli('104.200.25.198', 'root', 'Stech..,', 'gpsimple');
            // $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

            $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                        where gs_user_objects.group_id = gs_user_object_groups.group_id
                        and gs_user_objects.user_id = gs_user_object_groups.user_id
                        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

            $result2 = $ms->query($sql);

            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

            }
            if($grupos){
            $grupos = $grupos;
            }
            else {
                $grupos = "sin grupo";
            }

      //    $grupo = "sin grupo";


        // $query = "SELECT zones, checked_value FROM `gs_user_events` WHERE `imei` LIKE '%$imei%' AND zones != ''  AND `type` LIKE '%overspeed%'";
        // $resultado = mysqli_query($ms, $query);
        // $zonasReporte = mysqli_fetch_assoc($resultado);

        // $checkValue = $zonasReporte['checked_value'];

        // $prueba = $zonasReporte['zones'];
        // $prueba = $zone_ids;
        // $prueba2 = explode(",", $prueba);

        // $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
        // $r = mysqli_query($ms, $q);
        // $zones = array();

        // while ($row=mysqli_fetch_array($r)) {
        //     if (in_array($row['zone_id'], $prueba2)) {
        //         $zones[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices']);


        //     }
        // }


        if($route){

            // $query = "SELECT * FROM `gs_user_events` WHERE `imei` LIKE '%$imei%' AND zones != ''  AND `type` = 'overspeed' AND `zones` LIKE '%$zone_id%'";
            // $resultado = mysqli_query($ms, $query);
            // $zonasReporte = mysqli_fetch_assoc($resultado);


        // $result .= '<h3>'.$la['OVERSPEEDS'].' en geocerca </h3>';
        // // $result .= reportsAddReportHeader($imei, $dtf, $dtt);
        // $result .= overSpeedGeoE($imei, convUserUTCTimezone($dtf), convUserUTCTimezone($dtt), $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids);
        // $result .= '<br/><hr/>';

                $in_zones = array();
                $in_zone = 0;
                $in_zone_route_length = 0;

                for ($i=0; $i<count($route); ++$i) {


                    $event_desc = $route[$i][8];
                    $checkValue = $route[$i][9];
                    $diferenciaO = $route[$i][10];
                    $zone_name = $route[$i][11];

                    // $diferenciaO = $overspeeds[$i][3] - $checkValue;

                    // $point_lat = $route[$i][1];
                    // $point_lng = $route[$i][2];

                    // for ($j=0; $j<count($zones); ++$j) {
                    //     $zone_id = $zones[$j][0];
                    //     $zone_name = $zones[$j][1];
                    //     $zone_vertices = $zones[$j][2];



                        // if ($diferenciaO>0) {


                            // $isPointInPoylgon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

                            // if ($isPointInPoylgon == 1) {
                            if (true) {


                                        //$patente = getObjectPlate($imei);
                                        // $menorA = $_COOKIE['nuevaCookieMenor'];
                                        // $mayorA = $_COOKIE['nuevaCookieMayor'];

                                        if($menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0){
                                            $checkValue = -1;
                                            $diferenciaO = -1;
                                            $nivelLmc = -1;
                                        }
                                        else{
                                        //resta exceso velocidad vehiculo con exceso velocidad configurado
                                        // $diferenciaO = $overspeeds[$i][3] - $checkValue;
                                        //Niveles de gravedad
                                        $nivelLmc = "";

                                            if($diferenciaO < $menorA +1){
                                                $nivelLmc = "leve";
                                            }
                                            elseif ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                                                $nivelLmc = "medio";
                                            }
                                            elseif ($diferenciaO > $mayorA -1){
                                                $nivelLmc = "critico";
                                            }

                                        }

                                        $fechaComoEntero = strtotime($overspeeds[$i][1]);
                                        $mes = (int) date("m", $fechaComoEntero);
                                        $año = (int) date("Y", $fechaComoEntero);

                                        setlocale(LC_TIME, 'es_ES');
                                        $monthNum  = $mes;
                                        $dateObj   = DateTime::createFromFormat('!m', $monthNum);
                                        $monthName = strftime('%B', $dateObj->getTimestamp());

                                        switch($monthNum)
                                        {
                                            case 1:
                                            $monthNameSpanish = "Enero";
                                            break;
                                            case 2:
                                            $monthNameSpanish = "Febrero";
                                            break;
                                            case 3:
                                            $monthNameSpanish = "Marzo";
                                            break;
                                            case 4:
                                            $monthNameSpanish = "Abril";
                                            break;
                                            case 5:
                                            $monthNameSpanish = "Mayo";
                                            break;
                                            case 6:
                                            $monthNameSpanish = "Junio";
                                            break;
                                            case 7:
                                            $monthNameSpanish = "Julio";
                                            break;
                                            case 8:
                                            $monthNameSpanish = "Agosto";
                                            break;
                                            case 9:
                                            $monthNameSpanish = "Septiembre";
                                            break;
                                            case 10:
                                            $monthNameSpanish = "Octubre";
                                            break;
                                            case 11:
                                            $monthNameSpanish = "Noviembre";
                                            break;
                                            case 12:
                                            $monthNameSpanish = "Diciembre";
                                            break;

                                        }





                                            // $result = '<table class="report" width="100%"><tr align="center">';
                                                $result .= '<tr align="center">';
                                                $result .= '<td>'.$patente.'</td>';
                                                $result .= '<td>'.getObjectName($imei).'</td>';
                                                $result .= '<td>'.$grupos.'</td>';
                                                $result .= '<td>'.$monthNameSpanish.' '.$año.'</td>';
                                                $result .= '<td>'.$overspeeds[$i][0].'</td>';
                                                // $result .= '<td>'.$overspeeds[$i][1].'</td>';
                                                // $result .= '<td>'.$overspeeds[$i][2].'</td>';
                                                $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
                                                //  $result .= '<td>'.$overspeeds[$i][7].' '.$la["UNIT_SPEED"].'</td>';
                                                $result .= '<td>'.$zone_name.'</td>';
                                                $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                                                $result .= '<td>'.$diferenciaO.'</td>';
                                                $result .= '<td>'.$nivelLmc.'</td>';
                                                $result .= '<td>'.$event_desc.'</td>';
                                                $result .= '</tr>';




                                }
                            // }
                        // }



                }

            }
        else{

            // $result = '<table class="report" width="100%"><tr align="center">';

            // $result .= '<tr align="center">';
            // $result .= '<td>'.getObjectPlate($imei).'</td>';
            // $result .= '<td>'.getObjectName($imei).'</td>';
            // $result .= '<td>sin datos</td>';
            // $result .= '<td>sin datos</td>';
            // $result .= '<td>sin datos</td>';
            // // $result .= '<td>'.$overspeeds[$i][1].'</td>';
            // // $result .= '<td>'.$overspeeds[$i][2].'</td>';
            // $result .= '<td>sin datos</td>';
            // //  $result .= '<td>'.$overspeeds[$i][7].' '.$la["UNIT_SPEED"].'</td>';
            // $result .= '<td>sin datos</td>';
            // $result .= '<td>sin datos</td>';
            // $result .= '<td>sin datos</td>';
            // $result .= '<td>sin datos</td>';
            // $result .= '</tr>';


        }
        // if (isset($route)) {
        //     $result .= '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';

        //   }
        //$result .= '</table>';
        return $result;

    }

    //Funcion de reporte exceso de velocidad dentro de las geocercas formato para trabajar excel.
    function overSpeedGeoE($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items,$zone_ids,$menorA,$mayorA)
    {
        global $ms, $_SESSION, $la, $user_id, $_COOKIE;

        $cantroute=0;
        $result = "";

        $route = array();

        $q = "SELECT DISTINCT gued.dt_tracker,
        gued.lat,
        gued.lng,
        gued.altitude,
        gued.angle,
        gued.speed,
        gued.params,
        gued.event_id,
        gued.event_desc,
        gue.checked_value,
        (gued.speed - gue.checked_value) as diferencia,
        guz.zone_name,
        guz.zone_vertices
        FROM gs_user_events_data gued
        inner join gs_user_events gue on gued.event_desc = gue.name
        inner join gs_user_zones guz on guz.zone_id = gue.zones
        WHERE (gued.speed - gue.checked_value) > 0 and gue.zones !=''
        AND  gued.imei = '".$imei."' and gued.user_id = '".$user_id."'
        AND gued.type = 'overspeed' and gue.zones in (".$zone_ids.")
        AND gued.dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY gued.dt_tracker ASC";

        $selectcon=$q;
        $respdatevent = mysqli_query($ms, $q);
        // $cantroute=count(mysqli_fetch_assoc($respdatevent));
        while($route_data=mysqli_fetch_array($respdatevent))
        {
            //$cantroute++;
            $dt_tracker = convUserTimezone($route_data['dt_tracker']);
            $lat = $route_data['lat'];
            $lng = $route_data['lng'];
            $altitude = $route_data['altitude'];
            $angle = $route_data['angle'];
            $speed = $route_data['speed'];
            $event_id = $route_data['event_id'];
            $event_desc = $route_data['event_desc'];
            $checked_value = $route_data['checked_value'];
            $diferencia = $route_data['diferencia'];
            $zone_name = $route_data['zone_name'];
            $zone_vertices = $route_data['zone_vertices'];

            // $cantroute.='/'.$zone_name;

            $params = json_decode($route_data['params'],true);
            // $params = mergeParams($params_prev, $params);
            $params2 = $route_data['params'];

            $speed = convSpeedUnits($speed, 'km', $_SESSION["unit_distance"]);
            $altitude = convAltitudeUnits($altitude, 'km', $_SESSION["unit_distance"]);

                if (($lat != 0) && ($lng != 0))
                {
                    $route[] = array(
                                $dt_tracker,
                                $lat,
                                $lng,
                                $altitude,
                                $angle,
                                $speed,
                                $params,
                                $event_id,
                                $event_desc,
                                $checked_value,
                                $diferencia,
                                $zone_name,
                                $zone_vertices
                                );
                }
        }


        // $result = "";
        $overspeeds = getRouteOverspeedsEvent($route);
        $patente = getObjectPlate($imei);
            //error 1
            // $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

            $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                        where gs_user_objects.group_id = gs_user_object_groups.group_id
                        and gs_user_objects.user_id = gs_user_object_groups.user_id
                        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

            $result2 = $ms->query($sql);

            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

            }   
            $grupos = "sin grupo";
            if(isset($grupos)){
                $grupos = $grupos;
            }

                // $grupos = "pruebas";

        if($route){

                $in_zones = array();
                $in_zone = 0;
                $in_zone_route_length = 0;

                for ($i=0; $i<count($route); ++$i) {

                    $latitud = $route[$i][1];
                    $longitud = $route[$i][2];
                    $event_desc = $route[$i][8];
                    $checkValue = $route[$i][9];
                    $diferenciaO = $route[$i][10];
                    $zone_name = $route[$i][11];
                    $vertices_zonas = $route[$i][12];

                         $isPointInPoylgon = isPointInPolygon($vertices_zonas, $latitud, $longitud);

                            if ($isPointInPoylgon == 1) {
                                $cantroute++;
                                        if($menorA == '' || $menorA == 0 || $mayorA == '' || $mayorA == 0){
                                            $checkValue = -1;
                                            $diferenciaO = -1;
                                            $nivelLmc = -1;
                                        }
                                        else{

                                        $nivelLmc = "";

                                            if($diferenciaO < $menorA +1){
                                                $nivelLmc = "leve";
                                            }
                                            elseif ($diferenciaO > $menorA && $diferenciaO < $mayorA){
                                                $nivelLmc = "medio";
                                            }
                                            elseif ($diferenciaO > $mayorA -1){
                                                $nivelLmc = "critico";
                                            }

                                        }

                                        $fechaComoEntero = strtotime($overspeeds[$i][1]);
                                        $mes = (int) date("m", $fechaComoEntero);
                                        $año = (int) date("Y", $fechaComoEntero);

                                        setlocale(LC_TIME, 'es_ES');
                                        $monthNum  = $mes;
                                        $dateObj   = DateTime::createFromFormat('!m', $monthNum);
                                        $monthName = strftime('%B', $dateObj->getTimestamp());

                                        switch($monthNum)
                                        {
                                            case 1:
                                            $monthNameSpanish = "Enero";
                                            break;
                                            case 2:
                                            $monthNameSpanish = "Febrero";
                                            break;
                                            case 3:
                                            $monthNameSpanish = "Marzo";
                                            break;
                                            case 4:
                                            $monthNameSpanish = "Abril";
                                            break;
                                            case 5:
                                            $monthNameSpanish = "Mayo";
                                            break;
                                            case 6:
                                            $monthNameSpanish = "Junio";
                                            break;
                                            case 7:
                                            $monthNameSpanish = "Julio";
                                            break;
                                            case 8:
                                            $monthNameSpanish = "Agosto";
                                            break;
                                            case 9:
                                            $monthNameSpanish = "Septiembre";
                                            break;
                                            case 10:
                                            $monthNameSpanish = "Octubre";
                                            break;
                                            case 11:
                                            $monthNameSpanish = "Noviembre";
                                            break;
                                            case 12:
                                            $monthNameSpanish = "Diciembre";
                                            break;

                                        }

                                                $result .= '<tr align="center">';
                                                $result .= '<td>'.$patente.'</td>';
                                                $result .= '<td>'.getObjectName($imei).'</td>';
                                                $result .= '<td>'.$grupos.'</td>';
                                                $result .= '<td>'.$monthNameSpanish.' '.$año.'</td>';
                                                $result .= '<td>'.$overspeeds[$i][0].'</td>';
                                                $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
                                                $result .= '<td>'.$zone_name.'</td>';
                                                $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                                                $result .= '<td>'.TipoDato($diferenciaO).'</td>';
                                                $result .= '<td>'.TipoDato($nivelLmc).'</td>';
                                                $result .= '<td>'.$event_desc.'</td>';
                                                $result .= '</tr>';
                                }

                }

            }
        else{

        }
        //  $result .= '</br><p>cantidad de eventos en geocercas: '.$cantroute.'</p>';
        // $result .= '</br><p>sql: '.$selectcon.'</p>';

        return $result;

    }


    function reportsGenerateOverspeed2($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED
    {
		global $_SESSION, $la, $user_id, $ms;

		// $q  = "SELECT params FROM gs_object_data_".$imei."
		// 		WHERE dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' and overpass-speed < 0
		// 		and overpass > 0";

        // $r = mysqli_query($ms, $q);


        // $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                    where gs_user_objects.group_id = gs_user_object_groups.group_id
                    and gs_user_objects.user_id = gs_user_object_groups.user_id
                    and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id."";

            $result2 = $ms->query($sql);
            $grupos = "sin grupo";

            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];
            }
            if($grupos != "sin grupo"){
                $grupos = $grupos;
            }

        $result = '';

        $accuracy = getObjectAccuracy($imei);

		$route = getRouteRaw($imei, $accuracy, $dtf, $dtt);

        $overspeeds = getRouteOverspeeds($route, $speed_limit);

        if ((count($route) == 0) || (count($overspeeds) == 0)) {
            //	return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        for ($i=0; $i<count($overspeeds); ++$i) {
	    //if ($overspeeds[$i][7] != 0) {
            $result .= '<tr align="center">';
            $result .= '<td>'.getObjectPlate($imei).'</td>';
            $result .= '<td>'.getObjectName($imei).'</td>';
            $result .= '<td>'.$grupos.'</td>';
            $result .= '<td>'.$overspeeds[$i][0].'</td>';
            $result .= '<td>'.$overspeeds[$i][1].'</td>';
            $result .= '<td>'.$overspeeds[$i][2].'</td>';
            $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
	        $result .= '<td>'.$overspeeds[$i][4].' '.$la["UNIT_SPEED"].'</td>';
	    //$result .= '<td>'.$overspeeds[$i][7].' rpm</td>';
            $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';

            $result .= '</tr>';
          //}
	    }

        //$result .= '</table>';

        return $result;
    }

    function reportsGenerateOverspeed3($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED SP
    {
        global $_SESSION, $la, $user_id,$ms;

        $accuracy = getObjectAccuracy($imei);

        // $mysqli = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

        $q2  = "SELECT dt_tracker,lat,lng,speed,overpass, abs(overpass-speed) FROM gs_object_data_".$imei."
				WHERE dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' and overpass-speed < 0
				and overpass > 0";

        $r2 = mysqli_query($ms, $q2);

        $result = '<table class="report" width="100%"><tr align="center">';
        $result .= '<th>'.$la['OBJECT'].'</th>';
        $result .= '<th>Fecha</th>';
        $result .= '<th>Velocidad Vehiculo</th>';
        $result .= '<th>Velocidad Esperada</th>';
        $result .= '<th>Velocidad Superada por</th>';
        $result .= '<th>Direccion de la Falta</th>';
        $result .= '</tr>';
        while ($row2 = mysqli_fetch_row($r2)) {
            $dt_server = $row2[0];
            $lat = $row2[1];
            $lng = $row2[2];
            $speed = $row2[3];
            $overspeed = $row2[4];
            $overspeedDif = $row2[5];

            if ($row2[0] = '') {
                return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
            } else {
                $result .= '<tr align="center">';
                $result .= '<td>'.getObjectName($imei).'</td>';
                $result .= '<td>'.convUserTimezone($dt_server).'</td>';
                $result .= '<td>'.round($speed).'</td>';
                $result .= '<td>'.$overspeed.'</td>';
                $result .= '<td>'.round($overspeedDif).'</td>';
                $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                $result .= '</tr>';
            }
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateOverspeed3Api($falsopositivo,$id_usuario, $imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED SP
    {
        global $_SESSION, $la,$ms;


        $user_id = $id_usuario;

        $accuracy = getObjectAccuracy($imei);

        // $mysqli = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

        if($falsopositivo == 'true'){

                $q2  = "SELECT  dt_tracker,lat,lng,speed,overpass, abs(overpass-speed) FROM gs_object_data_".$imei."
                        WHERE dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' and overpass-speed < 0
                        and overpass > 0";

                $r2 = mysqli_query($ms, $q2);


                $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                where gs_user_objects.group_id = gs_user_object_groups.group_id
                and gs_user_objects.user_id = gs_user_object_groups.user_id
                and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

                $result2 = $ms->query($sql);
                $grupos = "sin grupo";

                while($row = $result2->fetch_assoc()) {
                    $grupos = $row['group_name'];

                }
                if( $grupos != "sin grupo"){
                    $grupos = $grupos;
                }

                    $patente = getObjectPlate($imei);

                $json = [];

                while ($row2 = mysqli_fetch_row($r2)) {
                    $dt_server = $row2[0];
                    $lat = $row2[1];
                    $lng = $row2[2];
                    $speed = $row2[3];
                    $overspeed = $row2[4];
                    $overspeedDif = $row2[5];

                    if ($row2[0] = '') {
                        // return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
                    } else {

                        $fecha = convUserTimezone($dt_server);

                        $resp = [
                            'patente' => $falsopositivo,
                            'grupo' =>   $grupos,
                            'usuario' => getObjectName($imei),
                            'fecha' =>  $fecha,
                            'lat' => $lat,
                            'lng'  => $lng,
                            'velocidad' => round($speed),
                            'vel_max' => $overspeed,
                            'superada' => round($overspeedDif)

                        ];

                        array_push($json,$resp);
                    }
                }

                    if($json == []){
                    return ["patente"=>$patente,"data"=>"sin datos"];
                    }
                    return ["patente"=>$patente,"data"=>$json];
        }
        else
        {

                $q2  = "SELECT  dt_tracker,lat,lng,speed,overpass, abs(overpass-speed) FROM gs_object_data_".$imei."
                        WHERE dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' and overpass-speed < 0
                        and overpass > 0";

                $r2 = mysqli_query($ms, $q2);

                $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                where gs_user_objects.group_id = gs_user_object_groups.group_id
                and gs_user_objects.user_id = gs_user_object_groups.user_id
                and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

                $result2 = $ms->query($sql);

                $grupos = "sin grupo";
                while($row = $result2->fetch_assoc()) {
                    $grupos = $row['group_name'];

                }
                // if($grupos){
                // $grupos = $grupos;
                // }
                // else {
                //     $grupos = "sin grupo";
                // }
                    $patente = getObjectPlate($imei);
                $json = [];

                while ($row2 = mysqli_fetch_row($r2)) {

                    $dt_server = $row2[0];
                    $lat = $row2[1];
                    $lng = $row2[2];
                    $speed = $row2[3];
                    $overspeed = $row2[4];
                    $overspeedDif = $row2[5];

                    if ($row2[0] = '') {
                        // return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
                    } else {

                        $fecha = convUserTimezone($dt_server);

                        $resp = [
                            'patente' => $patente,
                            'grupo' =>   $grupos,
                            'usuario' => getObjectName($imei),
                            'fecha' =>  $fecha,
                            'lat' => $lat,
                            'lng'  => $lng,
                            'velocidad' => round($speed),
                            'vel_max' => $overspeed,
                            'superada' => round($overspeedDif)

                        ];

                        array_push($json,$resp);
                    }
                }

                    if($json == []){
                    return ["patente"=>$patente,"data"=>"sin datos"];
                    }
                    return ["patente"=>$patente,"data"=>$json];
                }
    }



    function reportsGenerateOverspeed3ApiFP($id_usuario, $imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED SP
    {
        global $_SESSION, $la, $ms;


        $user_id = $id_usuario;

        $accuracy = getObjectAccuracy($imei);

        // $mysqli = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

        $q2  = "SELECT dt_tracker,lat,lng,speed,overpass, abs(overpass-speed) FROM gs_object_data_".$imei."
				WHERE dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' and overpass-speed < 0
				and overpass > 0";

        $r2 = mysqli_query($ms, $q2);

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
        where gs_user_objects.group_id = gs_user_object_groups.group_id
        and gs_user_objects.user_id = gs_user_object_groups.user_id
        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

        $result2 = $ms->query($sql);
        $grupos = "sin grupo";
        while($row = $result2->fetch_assoc()) {
            $grupos = $row['group_name'];

        }
        if( $grupos != "sin grupo"){
            $grupos = $grupos;
        }
            $patente = getObjectPlate($imei);
        $json = [];

        while ($row2 = mysqli_fetch_row($r2)) {

            $dt_server = $row2[0];
            $lat = $row2[1];
            $lng = $row2[2];
            $speed = $row2[3];
            $overspeed = $row2[4];
            $overspeedDif = $row2[5];

            if ($row2[0] = '') {
                // return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
            } else {

                $fecha = convUserTimezone($dt_server);

                $resp = [
                    'patente' => $patente,
                    'grupo' =>   $grupos,
                    'usuario' => getObjectName($imei),
                    'fecha' =>  $fecha,
                    'lat' => $lat,
                    'lng'  => $lng,
                    'velocidad' => round($speed),
                    'vel_max' => $overspeed,
                    'superada' => round($overspeedDif)

                 ];

                array_push($json,$resp);
            }
          }

            if($json == []){
            return ["patente"=>$patente,"data"=>"sin datos"];
            }
            return ["patente"=>$patente,"data"=>$json];

    }

    function reportsGenerateOverspeed3E($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED SP
    {
        global $_SESSION, $la, $user_id, $ms;

        $accuracy = getObjectAccuracy($imei);

        // $mysqli = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');


        $q2  = "SELECT dt_tracker,lat,lng,speed,overpass, abs(overpass-speed) FROM gs_object_data_".$imei."
				WHERE dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' and overpass-speed < 0
				and overpass > 0";

        $r2 = mysqli_query($ms, $q2);

        // $conn = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
                    where gs_user_objects.group_id = gs_user_object_groups.group_id
                    and gs_user_objects.user_id = gs_user_object_groups.user_id
                    and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$user_id;

         $result2 = $ms->query($sql);

            $grupos = "sin grupo";
            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

            }

            // if($grupos){
            // $grupos = $grupos;
            // }
            // else {
            //     $grupos = "sin grupo";
            // }


        // $result = '<table class="report" width="100%"><tr align="center">';
        // $result .= '<th>'.$la['OBJECT'].'</th>';
        // $result .= '<th>Fecha</th>';
        // $result .= '<th>Velocidad Vehiculo</th>';
        // $result .= '<th>Velocidad Esperada</th>';
        // $result .= '<th>Velocidad Superada por</th>';
        // $result .= '<th>Direccion de la Falta</th>';
        $result = '';
        while ($row2 = mysqli_fetch_row($r2)) {
            $dt_server = $row2[0];
            $lat = $row2[1];
            $lng = $row2[2];
            $speed = $row2[3];
            $overspeed = $row2[4];
            $overspeedDif = $row2[5];


            if ($row2[0] = '') {
                return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
            } else {

            round($speed);
            round($overspeedDif);

                $result .= '<tr align="center">';
                $result .= '<td>'.getObjectName($imei).'</td>';
                $result .= '<td>'.getObjectPlate($imei).'</td>';
                $result .= '<td>'.$grupos.'</td>';
                $result .= '<td>'.convUserTimezone($dt_server).'</td>';
                $result .= '<td>'.round($speed,0).'</td>';
                $result .= '<td>'.$overspeed.'</td>';
                $result .= '<td>'.round($overspeedDif,0).'</td>';
                $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                $result .= '</tr>';
            }
        }

        // $result .= '</table>';

        return $result;
    }


    function reportsGenerateOverspeed4($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //OVERSPEED SP
    {
        global $_SESSION, $la, $user_id, $ms;

		$q  = "SELECT params FROM gs_object_data_".$imei."
				WHERE dt_tracker BETWEEN '".convUserUTCTimezone($dtf)."' AND '".convUserUTCTimezone($dtt)."' and overpass-speed < 0
				and overpass > 0";

        $r = mysqli_query($ms, $q);

        $result = '';

        $accuracy = getObjectAccuracy($imei);

		$route = getRouteRaw($imei, $accuracy, $dtf, $dtt);

        $overspeeds = getRouteOverspeeds($route, $speed_limit);

        if ((count($route) == 0) || (count($overspeeds) == 0)) {
            //	return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        for ($i=0; $i<count($overspeeds); ++$i) {
          if ($overspeeds[$i][7] != 0) {
            if ($overspeeds[$i][7] > 800) {
                $result .= '<tr align="center">';
                $result .= '<td>'.getObjectName($imei).'</td>';
                $result .= '<td>'.$overspeeds[$i][0].'</td>';
                $result .= '<td>'.$overspeeds[$i][1].'</td>';
                $result .= '<td>'.$overspeeds[$i][2].'</td>';
                $result .= '<td>'.$overspeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
                $result .= '<td>'.$overspeeds[$i][4].' '.$la["UNIT_SPEED"].'</td>';
                $result .= '<td>'.$overspeeds[$i][7].'</td>';
                $result .= '<td>'.reportsGetPossition($overspeeds[$i][5], $overspeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                $result .= '</tr>';
            }
          }
	}

        //$result .= '</table>';

        return $result;
    }

    function reportsGenerateUnderspeed($imei, $dtf, $dtt, $speed_limit, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //UNDERSPEED
    {
        global $_SESSION, $la, $user_id,$ms;

        $accuracy = getObjectAccuracy($imei);

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        //$route = removeRouteFakeCoordinates($route, array());
        $underpeeds = getRouteUnderspeeds($route, $speed_limit);

        if ((count($route) == 0) || (count($underpeeds) == 0)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("start", $data_items)) {
            $result .= '<th>'.$la['START'].'</th>';
        }

        if (in_array("end", $data_items)) {
            $result .= '<th>'.$la['END'].'</th>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<th>'.$la['DURATION'].'</th>';
        }

        if (in_array("top_speed", $data_items)) {
            $result .= '<th>'.$la['TOP_SPEED'].'</th>';
        }

        if (in_array("avg_speed", $data_items)) {
            $result .= '<th>'.$la['AVG_SPEED'].'</th>';
        }

        if (in_array("underspeed_position", $data_items)) {
            $result .= '<th>'.$la['UNDERSPEED_POSITION'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($underpeeds); ++$i) {
            $result .= '<tr align="center">';

            if (in_array("start", $data_items)) {
                $result .= '<td>'.$underpeeds[$i][0].'</td>';
            }

            if (in_array("end", $data_items)) {
                $result .= '<td>'.$underpeeds[$i][1].'</td>';
            }

            if (in_array("duration", $data_items)) {
                $result .= '<td>'.$underpeeds[$i][2].'</td>';
            }

            if (in_array("top_speed", $data_items)) {
                $result .= '<td>'.$underpeeds[$i][3].' '.$la["UNIT_SPEED"].'</td>';
            }

            if (in_array("avg_speed", $data_items)) {
                $result .= '<td>'.$underpeeds[$i][4].' '.$la["UNIT_SPEED"].'</td>';
            }

            if (in_array("underspeed_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($underpeeds[$i][5], $underpeeds[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

function reportsGenerateZoneInOut2($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items) //ZONE_IN_OUT
    {
        global $ms, $_SESSION, $la, $user_id;

        $zone_ids = explode(",", $zone_ids);

        $accuracy = getObjectAccuracy($imei);

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        //$route = removeRouteFakeCoordinates($route, array());

        $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
        $r = mysqli_query($ms, $q);
        $zones = array();

        while ($row=mysqli_fetch_array($r)) {
            if (in_array($row['zone_id'], $zone_ids)) {
                $zones[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices']);
            }
        }

        if ((count($route) == 0) || (count($zones) == 0)) {
            //return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $in_zones = array();
        $in_zone = 0;
        $in_zone_route_length = 0;

        for ($i=0; $i<count($route); ++$i) {
            $point_lat = $route[$i][1];
            $point_lng = $route[$i][2];

            for ($j=0; $j<count($zones); ++$j) {
                $zone_id = $zones[$j][0];
                $zone_name = $zones[$j][1];
                $zone_vertices = $zones[$j][2];

                $isPointInPolygon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

                if ($isPointInPolygon) {
                    if ($in_zone == 0) {
                        $in_zone_start = $route[$i][0];
                        $in_zone_name = $zone_name;
                        $in_zone_lat = $point_lat;
                        $in_zone_lng = $point_lng;
                        $in_zone = $zone_id;
                    }

                    if (isset($prev_point_lat) && isset($prev_point_lng)) {
                        $in_zone_route_length += getLengthBetweenCoordinates($prev_point_lat, $prev_point_lng, $point_lat, $point_lng);
                    }
                } else {
                    if ($in_zone == $zone_id) {
                        $in_zone_end = $route[$i][0];
                        $in_zone_duration = getTimeDifferenceDetails($in_zone_start, $in_zone_end);

                        $in_zone_route_length = convDistanceUnits($in_zone_route_length, 'km', $_SESSION["unit_distance"]);
                        $in_zone_route_length = sprintf("%01.2f", $in_zone_route_length).' '.$la['UNIT_DISTANCE'];

                        $in_zones[] = array($in_zone_start,
                                    $in_zone_end,
                                    $in_zone_duration,
                                    $in_zone_route_length,
                                    $in_zone_name,
                                    $in_zone_lat,
                                    $in_zone_lng
                                    );

                        $in_zone = 0;
                        $in_zone_route_length = 0;
                    }
                }
            }

            $prev_point_lat = $point_lat;
            $prev_point_lng = $point_lng;
        }

        // add last zone record if it did not leave
        if ($in_zone != 0) {
            $in_zones[] = array($in_zone_start,
                        $la['NA'],
                        $la['NA'],
                        $la['NA'],
                        $in_zone_name,
                        $in_zone_lat,
                        $in_zone_lng
                        );
        }

        if (count($in_zones) == 0) {
            //return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result='';
    	for ($i=0; $i<count($in_zones); ++$i) {
            if ($in_zones[$i][3] != 'n/a') {
		    $result .= '<tr align="center">';
                    $result .= '<td>'.getObjectName($imei).'</td>';
                    $result .= '<td>'.$in_zones[$i][0].'</td>';
                    $result .= '<td>'.$in_zones[$i][1].'</td>';
                    $result .= '<td>'.$in_zones[$i][2].'</td>';
                    $result .= '<td>'.$in_zones[$i][3].'</td>';
                    $result .= '<td>'.$in_zones[$i][4].'</td>';
                    $result .= '<td>'.reportsGetPossition($in_zones[$i][5], $in_zones[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
                    $result .= '</tr>';
	    }
        }

        return $result;
    }

    function reportsGenerateZoneInOut($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items) //ZONE_IN_OUT
    {
        global $ms, $_SESSION, $la, $user_id;

        $zone_ids = explode(",", $zone_ids);

        $accuracy = getObjectAccuracy($imei);

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        //$route = removeRouteFakeCoordinates($route, array());

        $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
        $r = mysqli_query($ms, $q);
        $zones = array();

        while ($row=mysqli_fetch_array($r)) {
            if (in_array($row['zone_id'], $zone_ids)) {
                $zones[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices']);
            }
        }

        if ((count($route) == 0) || (count($zones) == 0)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $in_zones = array();
        $in_zone = 0;
        $in_zone_route_length = 0;

        for ($i=0; $i<count($route); ++$i) {
            $point_lat = $route[$i][1];
            $point_lng = $route[$i][2];

            for ($j=0; $j<count($zones); ++$j) {
                $zone_id = $zones[$j][0];
                $zone_name = $zones[$j][1];
                $zone_vertices = $zones[$j][2];

                $isPointInPolygon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

                if ($isPointInPolygon) {
                    if ($in_zone == 0) {
                        $in_zone_start = $route[$i][0];
                        $in_zone_name = $zone_name;
                        $in_zone_lat = $point_lat;
                        $in_zone_lng = $point_lng;
                        $in_zone = $zone_id;
                    }

                    if (isset($prev_point_lat) && isset($prev_point_lng)) {
                        $in_zone_route_length += getLengthBetweenCoordinates($prev_point_lat, $prev_point_lng, $point_lat, $point_lng);
                    }
                } else {
                    if ($in_zone == $zone_id) {
                        $in_zone_end = $route[$i][0];
                        $in_zone_duration = getTimeDifferenceDetails($in_zone_start, $in_zone_end);

                        $in_zone_route_length = convDistanceUnits($in_zone_route_length, 'km', $_SESSION["unit_distance"]);
                        $in_zone_route_length = sprintf("%01.2f", $in_zone_route_length).' '.$la['UNIT_DISTANCE'];

                        $in_zones[] = array($in_zone_start,
                                    $in_zone_end,
                                    $in_zone_duration,
                                    $in_zone_route_length,
                                    $in_zone_name,
                                    $in_zone_lat,
                                    $in_zone_lng
                                    );

                        $in_zone = 0;
                        $in_zone_route_length = 0;
                    }
                }
            }

            $prev_point_lat = $point_lat;
            $prev_point_lng = $point_lng;
        }

        // add last zone record if it did not leave
        if ($in_zone != 0) {
            $in_zones[] = array($in_zone_start,
                        $la['NA'],
                        $la['NA'],
                        $la['NA'],
                        $in_zone_name,
                        $in_zone_lat,
                        $in_zone_lng
                        );
        }

        if (count($in_zones) == 0) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("zone_in", $data_items)) {
            $result .= '<th>'.$la['ZONE_IN'].'</th>';
        }

        if (in_array("zone_out", $data_items)) {
            $result .= '<th>'.$la['ZONE_OUT'].'</th>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<th>'.$la['DURATION'].'</th>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= '<th>'.$la['ROUTE_LENGTH'].'</th>';
        }

        if (in_array("zone_name", $data_items)) {
            $result .= '<th>'.$la['ZONE_NAME'].'</th>';
        }

        if (in_array("zone_position", $data_items)) {
            $result .= '<th>'.$la['ZONE_POSITION'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($in_zones); ++$i) {
            $result .= '<tr align="center">';

            if (in_array("zone_in", $data_items)) {
                $result .= '<td>'.$in_zones[$i][0].'</td>';
            }

            if (in_array("zone_out", $data_items)) {
                $result .= '<td>'.$in_zones[$i][1].'</td>';
            }

            if (in_array("duration", $data_items)) {
                $result .= '<td>'.$in_zones[$i][2].'</td>';
            }

            if (in_array("route_length", $data_items)) {
                $result .= '<td>'.$in_zones[$i][3].'</td>';
            }

            if (in_array("zone_name", $data_items)) {
                $result .= '<td>'.$in_zones[$i][4].'</td>';
            }

            if (in_array("zone_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($in_zones[$i][5], $in_zones[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }



function reportsGenerateZoneInOutGeoAsig($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $zone_ids, $data_items) //ZONE_IN_OUT
{
    global $ms, $_SESSION, $la, $user_id;

    // $largoZone=strlen($zone_ids);

    $zone_ids = explode(",", $zone_ids);

    $accuracy = getObjectAccuracy($imei);

    $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
    //$route = removeRouteFakeCoordinates($route, array());


    // $sentencia = $ms->prepare("SELECT * FROM `gs_user_events` WHERE `imei` like '%".$imei."%' AND `zones` LIKE '%".$zone_ids."%'");

    $query = "SELECT `zones` FROM `gs_user_events` WHERE `imei` LIKE '%$imei%' AND `type` LIKE '%zone%' limit 1";
    $resultado = mysqli_query($ms, $query);
    $zonasReporte = mysqli_fetch_assoc($resultado);

    $prueba = $zonasReporte['zones'];
    $prueba2 = explode(",", $prueba);

    // $variablex = print_r($zonasReporte);

    $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
    $r = mysqli_query($ms, $q);
    $zones = array();

    while ($row=mysqli_fetch_array($r)) {
        if (in_array($row['zone_id'], $prueba2)) {
            $zones[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices']);
        }
    }


    if ((count($route) == 0) || (count($zones) == 0)) {
        // return '<table><strong>'.getObjectName($imei).'</strong></td></tr></table>';
    //    return'<table class="report" width="100%"><tr align="center">
    //    <td style="width:200px"><center>'.getObjectName($imei).'</center></td>
    //    <td style="width:200px"><center>n/a</center></td>
    //    <td style="width:200px"><center>n/a</center></td>
    //    <td style="width:200px"><center>n/a</center></td>
    //    <td style="width:200px"><center>n/a</center></td>
    //    <td style="width:200px"><center>n/a</center></td>
    //    <td style="width:200px"><center>n/a</center></td>
    //    </tr>
    //    </table>';
        // return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'para patente: <strong>'.getObjectName($imei).'</strong></td></tr></table>';
    }

    // $in_zones = array();
    // $in_zone = 0;
    // $in_zone_route_length = 0;

    // for ($i=0; $i<count($route); ++$i) {
    //     $point_lat = $route[$i][1];
    //     $point_lng = $route[$i][2];

    //     for ($j=0; $j<count($zones); ++$j) {
    //         $zone_id = $zones[$j][0];
    //         $zone_name = $zones[$j][1];
    //         $zone_vertices = $zones[$j][2];

    //         $isPointInPolygon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

    //         if ($isPointInPolygon) {
    //             if ($in_zone == 0) {
    //                 $in_zone_start = $route[$i][0];
    //                 $in_zone_name = $zone_name;
    //                 $in_zone_lat = $point_lat;
    //                 $in_zone_lng = $point_lng;
    //                 $in_zone = $zone_id;
    //             }

    //             if (isset($prev_point_lat) && isset($prev_point_lng)) {
    //                 $in_zone_route_length += getLengthBetweenCoordinates($prev_point_lat, $prev_point_lng, $point_lat, $point_lng);
    //             }
    //         } else {
    //             if ($in_zone == $zone_id) {
    //                 $in_zone_end = $route[$i][0];
    //                 $in_zone_duration = getTimeDifferenceDetails($in_zone_start, $in_zone_end);

    //                 $in_zone_route_length = convDistanceUnits($in_zone_route_length, 'km', $_SESSION["unit_distance"]);
    //                 $in_zone_route_length = sprintf("%01.2f", $in_zone_route_length).' '.$la['UNIT_DISTANCE'];

    //                 $in_zones[] = array($in_zone_start,
    //                             $in_zone_end,
    //                             $in_zone_duration,
    //                             $in_zone_route_length,
    //                             $in_zone_name,
    //                             $in_zone_lat,
    //                             $in_zone_lng
    //                             );

    //                 $in_zone = 0;
    //                 $in_zone_route_length = 0;
    //             }
    //         }
    //     }

    //     $prev_point_lat = $point_lat;
    //     $prev_point_lng = $point_lng;
    // }

    // // add last zone record if it did not leave
    // if ($in_zone != 0) {
    //     $in_zones[] = array($in_zone_start,
    //                 $la['NA'],
    //                 $la['NA'],
    //                 $la['NA'],
    //                 $in_zone_name,
    //                 $in_zone_lat,
    //                 $in_zone_lng
    //                 );
    // }

    // if (count($in_zones) == 0) {
    // //    return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
    // }

    // for ($i=0; $i<count($in_zones); ++$i) {
    //     if ($in_zones[$i][3] != 'n/a') {
    //             $result .= '<table class="report" width="100%">';
    //             $result .= '<tr align="center">';
    //             $result .= '<td style="width:200px">'.getObjectName($imei).'</td>';
    //             $result .= '<td style="width:200px"><center>'.$in_zones[$i][0].'</center></td>';
    //             $result .= '<td style="width:200px"><center>'.$in_zones[$i][1].'</center></td>';
    //             $result .= '<td style="width:200px"><center>'.$in_zones[$i][2].'</center></td>';
    //             $result .= '<td style="width:200px"><center>'.$in_zones[$i][3].'</center></td>';
    //             $result .= '<td style="width:200px"><center>'.$in_zones[$i][4].'</center></td>';
    //             $result .= '<td style="width:200px"><center>'.reportsGetPossition($in_zones[$i][5], $in_zones[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</center></td>';
    //             $result .= '</tr>';
    //             $result .= '</table>';





    //     }

    // }

    // return $result;


    $in_zones = array();
    $in_zone = 0;
    $in_zone_route_length = 0;

    for ($i=0; $i<count($route); ++$i) {
        $point_lat = $route[$i][1];
        $point_lng = $route[$i][2];

        for ($j=0; $j<count($zones); ++$j) {
            $zone_id = $zones[$j][0];
            $zone_name = $zones[$j][1];
            $zone_vertices = $zones[$j][2];

            $isPointInPolygon = isPointInPolygon($zone_vertices, $point_lat, $point_lng);

            if ($isPointInPolygon) {
                if ($in_zone == 0) {
                    $in_zone_start = $route[$i][0];
                    $in_zone_name = $zone_name;
                    $in_zone_lat = $point_lat;
                    $in_zone_lng = $point_lng;
                    $in_zone = $zone_id;
                }

                if (isset($prev_point_lat) && isset($prev_point_lng)) {
                    $in_zone_route_length += getLengthBetweenCoordinates($prev_point_lat, $prev_point_lng, $point_lat, $point_lng);
                }
            } else {
                if ($in_zone == $zone_id) {
                    $in_zone_end = $route[$i][0];
                    $in_zone_duration = getTimeDifferenceDetails($in_zone_start, $in_zone_end);

                    $in_zone_route_length = convDistanceUnits($in_zone_route_length, 'km', $_SESSION["unit_distance"]);
                    $in_zone_route_length = sprintf("%01.2f", $in_zone_route_length).' '.$la['UNIT_DISTANCE'];

                    $in_zones[] = array($in_zone_start,
                                $in_zone_end,
                                $in_zone_duration,
                                $in_zone_route_length,
                                $in_zone_name,
                                $in_zone_lat,
                                $in_zone_lng
                                );

                    $in_zone = 0;
                    $in_zone_route_length = 0;
                }
            }
        }

        $prev_point_lat = $point_lat;
        $prev_point_lng = $point_lng;
    }

    // add last zone record if it did not leave
    if ($in_zone != 0) {
        $in_zones[] = array($in_zone_start,
                    $la['NA'],
                    $la['NA'],
                    $la['NA'],
                    $in_zone_name,
                    $in_zone_lat,
                    $in_zone_lng
                    );
    }

    if (count($in_zones) == 0) {
        return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
    }

    $result = '<table class="report" width="100%"><tr align="center">';

    if (in_array("zone_in", $data_items)) {
        $result .= '<th>'.$la['ZONE_IN'].'</th>';
    }

    if (in_array("zone_out", $data_items)) {
        $result .= '<th>'.$la['ZONE_OUT'].'</th>';
    }

    if (in_array("duration", $data_items)) {
        $result .= '<th>'.$la['DURATION'].'</th>';
    }

    if (in_array("route_length", $data_items)) {
        $result .= '<th>'.$la['ROUTE_LENGTH'].'</th>';
    }

    if (in_array("zone_name", $data_items)) {
        $result .= '<th>'.$la['ZONE_NAME'].'</th>';
    }

    if (in_array("zone_position", $data_items)) {
        $result .= '<th>'.$la['ZONE_POSITION'].'</th>';
    }

    $result .= '</tr>';

    for ($i=0; $i<count($in_zones); ++$i) {
        $result .= '<tr align="center">';

        if (in_array("zone_in", $data_items)) {
            $result .= '<td>'.$in_zones[$i][0].'</td>';
        }

        if (in_array("zone_out", $data_items)) {
            $result .= '<td>'.$in_zones[$i][1].'</td>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<td>'.$in_zones[$i][2].'</td>';
        }

        if (in_array("route_length", $data_items)) {
            $result .= '<td>'.$in_zones[$i][3].'</td>';
        }

        if (in_array("zone_name", $data_items)) {
            $result .= '<td>'.$in_zones[$i][4].'</td>';
        }

        if (in_array("zone_position", $data_items)) {
            $result .= '<td>'.reportsGetPossition($in_zones[$i][5], $in_zones[$i][6], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
        }

        $result .= '</tr>';
    }

    $result .= '</table>';

    return $result;
}


    function reportsGenerateEvents($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //EVENTS
    {
        global $ms, $_SESSION, $la, $user_id;

        $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
        $r = mysqli_query($ms, $q);
        $count = mysqli_num_rows($r);

        if ($count == 0) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("time", $data_items)) {
            $result .= '<th>'.$la['TIME'].'</th>';
        }

        if (in_array("event", $data_items)) {
            $result .= '<th>'.$la['EVENT'].'</th>';
        }

        if (in_array("event_position", $data_items)) {
            $result .= '<th>'.$la['EVENT_POSITION'].'</th>';
        }

        $result .= '</tr>';

        $total_events = array();

        while ($event_data=mysqli_fetch_array($r)) {
            $result .= '<tr align="center">';

            if (in_array("time", $data_items)) {
                $result .= '<td>'.convUserTimezone($event_data['dt_tracker']).'</td>';
            }

            if (in_array("event", $data_items)) {
                $result .= '<td>'.$event_data['event_desc'].'</td>';
            }

            if (in_array("event_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($event_data['lat'], $event_data['lng'], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            $result .= '</tr>';

            if (isset($total_events[$event_data['event_desc']])) {
                $total_events[$event_data['event_desc']]++;
            } else {
                $total_events[$event_data['event_desc']] = 1;
            }
        }

        $result .= '</table>';

        if (in_array("total", $data_items)) {
            $result .= '<br/>';

            ksort($total_events);

            $result .= '<table>';
            foreach ($total_events as $key=>$value) {
                $result .= '<tr>
					<td><strong>'.$key.':</strong></td>
					<td>'.$value.'</td>
				</tr>';
            }
            $result .= '</table>';
        }

        return $result;
    }

    //Reportes por api
    function reportsGenerateTravelSheet2Json($id_usuario, $imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //TRAVEL_SHEET
    {
        global $ms, $_SESSION, $la;
        // var_dump($imei);

        $q = "SELECT SUBSTRING(timezone, 1, 3) AS timezone from gs_users where username = 'admin'";
        $r = mysqli_query($ms, $q);


        while($row = $r->fetch_assoc()) {
            $tiempo = $row['timezone'];
        }

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
        where gs_user_objects.group_id = gs_user_object_groups.group_id
        and gs_user_objects.user_id = gs_user_object_groups.user_id
        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

        $result2 = $ms->query($sql);
        $grupos = "sin grupo";

        while($row = $result2->fetch_assoc()) {
            $grupos = $row['group_name'];

        }

        // if($grupos){
        // $grupos = $grupos;
        // }
        // else {
        //     $grupos = "sin grupo";
        // }

        // var_dump($tiempo);


        $patente = getObjectPlate($imei);

        $q2 = "SELECT name FROM `gs_objects` WHERE `plate_number`='".$patente."'";;
        $r2 = mysqli_query($ms, $q2);

        while($row2 = $r2->fetch_assoc()) {
            $name = $row2['name'];
        }

        if($name == "" || $name == null || $name == []){


            $name = "sin datos";
        }

        $json = [];

        $result = '';
        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);
        // var_dump($data);
        if (count($data['drives']) < 1) {
            //	return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        //		$result = '<table class="report" width="100%"><tr align="center">';

        $total_route_length = 0;
        $total_fuel_consumption = 0;
        $total_fuel_cost = 0;

        for ($j=0; $j<count($data['drives']); ++$j) {
            $route_id_a = $data['drives'][$j][0];
            $route_id_b = $data['drives'][$j][2];

            $lat1 = sprintf("%01.6f", $data['route'][$route_id_a][1]);
            $lng1 = sprintf("%01.6f", $data['route'][$route_id_a][2]);
            $lat2 = sprintf("%01.6f", $data['route'][$route_id_b][1]);
            $lng2 = sprintf("%01.6f", $data['route'][$route_id_b][2]);

            $time_a = $data['drives'][$j][4];

            $time_b = $data['drives'][$j][5];






            if (!isset($position_a)) {
                $position_a = reportsGetPossition($lat1, $lng1, $show_coordinates, $show_addresses, $zones_addresses);
            } else {
                $position_a = $position_b;
            }

            $position_b = reportsGetPossition($lat2, $lng2, $show_coordinates, $show_addresses, $zones_addresses);

            $duration = $data['drives'][$j][6];

            $dteStart = new DateTime($time_a);
            $dteEnd   = new DateTime($time_b);

            $dteDiff  = $dteStart->diff($dteEnd);
            $duration = $dteDiff->format("%H:%I:%S");

            // $dteStart->modify($tiempo.'hours');
            // $dteEnd->modify($tiempo.'hours');
            $NuevaFechaA = $dteStart->format('d-m-Y H:i:s');
            $NuevaFechaB = $dteEnd->format('d-m-Y H:i:s');


            $route_length = $data['drives'][$j][7];
            $fuel_consumption = $data['drives'][$j][10];
            $fuel_cost = $data['drives'][$j][11];


            $resp = [

                'grupo'  => $grupos,
                'patente' => $patente,
                'usuario' => $name,
                'time A'=>$NuevaFechaA,
                'posicion A' => $position_a,
                'time B' => $NuevaFechaB,
                'posicion B'=>$position_b,
                'duracion' => $duration,
                'longitud' => $route_length." km",

            ];

             array_push($json,$resp);

        }
         if($json == []){
           return ["patente"=>$patente,"data"=>"sin datos"];
         }

        return ["patente"=>$patente,"data"=>$json];
    }

    function reportsGenerateEventsApi($id_usuario,$imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //EVENTS
    {
        global $ms, $_SESSION, $la;

        $user_id = $id_usuario;

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
        where gs_user_objects.group_id = gs_user_object_groups.group_id
        and gs_user_objects.user_id = gs_user_object_groups.user_id
        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

        $result2 = $ms->query($sql);

        $grupos = "sin grupo";

        while($row = $result2->fetch_assoc()) {
            $grupos = $row['group_name'];

        }
        // if($grupos){
        // $grupos = $grupos;
        // }
        // else {
        //     $grupos = "sin grupo";
        // }

        $events = array();
        $json = [];
        $patente = getObjectPlate($imei);


        $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
        $r = mysqli_query($ms, $q);
        $count = mysqli_num_rows($r);

        if ($count == 0) {
            // return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

    //    echo ($event_data=mysqli_fetch_array($r));
        // var_dump ($count);

        while ($event_data=mysqli_fetch_array($r)) {

            // $result .= '<tr align="center">';
             $hora = convUserTimezone($event_data['dt_tracker']);
             $evento = $event_data['event_desc'];
             $posicion = reportsGetPossition($event_data['lat'], $event_data['lng'], $show_coordinates, $show_addresses, $zones_addresses);

             $resp = [
                'patente' => $patente,
                'grupo' => $grupos,
                'evento' => $evento,
                'fecha'  => $hora,
                'posicion' => $posicion
             ];

            array_push($json,$resp);
        }

        if($json == []){
        return ["patente"=>$patente,"data"=>"sin datos"];
        }
        return ["patente"=>$patente,"data"=>$json];

    }



    function reportsGenerateEventsInOut($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //EVENTS
    {
        global $ms, $_SESSION, $la, $user_id;

        $q = "SELECT * FROM `gs_user_events_data` WHERE  `user_id`='".$user_id."' AND `imei`='".$imei."' AND `type` LIKE '%zone%' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
        // $q = "SELECT * FROM `gs_user_events_data` WHERE `type` = `zone_in` ";

        $r = mysqli_query($ms, $q);
        $count = mysqli_num_rows($r);




        if ($count == 0) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';


        if (in_array("event", $data_items)) {
            $result .= '<th>Nombre geocerca</th>';
        }

        if (in_array("time", $data_items)) {
            $result .= '<th>'.$la['TIME'].'</th>';
        }

        if (in_array("event", $data_items)) {
            $result .= '<th>Evento</th>';
        }

        if (in_array("event_position", $data_items)) {
            $result .= '<th>'.$la['EVENT_POSITION'].'</th>';
        }

        $result .= '</tr>';

        $total_events = array();


      // CACULO DIFERENCIA FECHA ENTRADA SALIDA.

        while ($event_data=mysqli_fetch_array($r)) {
            $result .= '<tr align="center">';
            $contador = 0;
            //SACAR NOMBRE DE GEOCERCA
            $texto = $event_data['event_desc'];
            $largoTexto = strlen($texto);
            $variable = strpos($texto,'(');

            $stringA = substr($texto, $variable, $largoTexto);
            $stringB = str_replace("$stringA","",$texto);
            $stringA = str_replace("(", "",$stringA);
            $stringA = str_replace(")", "",$stringA);

         //CALCULO DIFERENCIA FECHAS

            $fechaEntrada = '';
            $fechaSalida = '';
            $diferencia = '';


            if (in_array("event", $data_items)) {
                $result .= '<td>'.$stringA.'</td>';
            }

            if (in_array("event", $data_items)) {

                $result .= '<td>'.convUserTimezone($event_data['dt_tracker']).'</td>';
            }

            if (in_array("event", $data_items)) {

                $result .= '<td>'.$stringB.'</td>';
            }


            if (in_array("event_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($event_data['lat'], $event_data['lng'], $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            $result .= '</tr>';

            if (isset($total_events[$event_data['event_desc']])) {
                $total_events[$event_data['event_desc']]++;
            } else {
                $total_events[$event_data['event_desc']] = 1;
            }
        }

        $result .= '</table>';

        if (in_array("total", $data_items)) {
            $result .= '<br/>';

            ksort($total_events);

            $result .= '<table>';
            foreach ($total_events as $key=>$value) {
                $result .= '<tr>
					<td><strong>'.$key.':</strong></td>
					<td>'.$value.'</td>
				</tr>';
            }
            $result .= '</table>';
        }

        return $result;
    }

    function reportsGenerateService($imei, $data_items) //SERVICE
    {
        global $ms, $_SESSION, $la, $user_id;

        $result = '';

        $q = "SELECT * FROM `gs_object_services` WHERE `imei`='".$imei."' ORDER BY name asc";
        $r = mysqli_query($ms, $q);
        $count = mysqli_num_rows($r);

        if ($count == 0) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("service", $data_items)) {
            $result .= '<th width="20%">'.$la['SERVICE'].'</th>';
        }

        if (in_array("last_service", $data_items)) {
            $result .= 	'<th width="15%">'.$la['LAST_SERVICE'].' ('.$la["UNIT_DISTANCE"].')</th>
					<th width="15%">'.$la['LAST_SERVICE'].' (h)</th>
					<th width="15%">'.$la['LAST_SERVICE'].'</th>';
        }

        if (in_array("status", $data_items)) {
            $result .= '<th width="35%">'.$la['STATUS'].'</th>';
        }

        $result .= '</tr>';

        // get real odometer and engine hours
        $odometer = getObjectOdometer($imei);
        $odometer = floor(convDistanceUnits($odometer, 'km', $_SESSION["unit_distance"]));

        $engine_hours = getObjectEngineHours($imei, false);

        while ($row = mysqli_fetch_array($r)) {
            $service_id = $row["service_id"];
            $name = $row['name'];
            $odo_last = $la['NA'];
            $engh_last = $la['NA'];
            $days_last = $la['NA'];

            $status_arr = array();

            if ($row['odo'] == 'true') {
                $row['odo_interval'] = floor(convDistanceUnits($row['odo_interval'], 'km', $_SESSION["unit_distance"]));
                $row['odo_last'] = floor(convDistanceUnits($row['odo_last'], 'km', $_SESSION["unit_distance"]));

                $odo_diff = $odometer - $row['odo_last'];
                $odo_diff = $row['odo_interval'] - $odo_diff;

                if ($odo_diff <= 0) {
                    $odo_diff = abs($odo_diff);
                    $status_arr[] = '<font color="red">'.$la['ODOMETER_EXPIRED'].' ('.$odo_diff.' '.$la["UNIT_DISTANCE"].')</font>';
                } else {
                    $status_arr[] = $la['ODOMETER_LEFT'].' ('.$odo_diff.' '.$la["UNIT_DISTANCE"].')';
                }

                $odo_last = $row['odo_last'];
            }

            if ($row['engh'] == 'true') {
                $engh_diff = $engine_hours - $row['engh_last'];
                $engh_diff = $row['engh_interval'] - $engh_diff;

                if ($engh_diff <= 0) {
                    $engh_diff = abs($engh_diff);
                    $status_arr[] = '<font color="red">'.$la['ENGINE_HOURS_EXPIRED'].' ('.$engh_diff.' '.$la["UNIT_H"].')</font>';
                } else {
                    $status_arr[] = $la['ENGINE_HOURS_LEFT'].' ('.$engh_diff.' '.$la["UNIT_H"].')';
                }

                $engh_last = $row['engh_last'];
            }

            if ($row['days'] == 'true') {
                $days_diff = strtotime(gmdate("M d Y ")) - (strtotime($row['days_last']));
                $days_diff = floor($days_diff/3600/24);
                $days_diff = $row['days_interval'] - $days_diff;

                if ($days_diff <= 0) {
                    $days_diff = abs($days_diff);
                    $status_arr[] = '<font color="red">'.$la['DAYS_EXPIRED'].' ('.$days_diff.')</font>';
                } else {
                    $status_arr[] = $la['DAYS_LEFT'].' ('.$days_diff.')';
                }

                $days_last = $row['days_last'];
            }

            if (in_array("service", $data_items)) {
                $result .= '<tr><td>'.$name.'</td>';
            }

            if (in_array("last_service", $data_items)) {
                $result .= '<td align="center">'.$odo_last.'</td>
					<td align="center">'.$engh_last.'</td>
					<td align="center">'.$days_last.'</td>';
            }

            if (in_array("status", $data_items)) {
                $status = strtolower(implode(", ", $status_arr));
                $result .= '<td>'.$status.'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }


    function reportsGenerateRag($imeis, $dtf, $dtt, $speed_limit, $data_items)
    {
        global $ms, $_SESSION, $la, $user_id;

        $result = '<table class="report" width="100%" ><tr align="center">';

        $result .= '<th>'.$la['DRIVER'].'</th>';
        $result .= '<th>'.$la['OBJECT'].'</th>';
        $result .= '<th>'.$la['ROUTE_LENGTH'].'</th>';

        if (in_array("overspeed_score", $data_items)) {
            $result .= '<th>'.$la['OVERSPEED_DURATION'].'</th>';
            $result .= '<th>'.$la['OVERSPEED_SCORE'].'</th>';
        }

        if (in_array("harsh_acceleration_score", $data_items)) {
            $result .= '<th>'.$la['HARSH_ACCELERATION_COUNT'].'</th>';
            $result .= '<th>'.$la['HARSH_ACCELERATION_SCORE'].'</th>';
        }

        if (in_array("harsh_braking_score", $data_items)) {
            $result .= '<th>'.$la['HARSH_BRAKING_COUNT'].'</th>';
            $result .= '<th>'.$la['HARSH_BRAKING_SCORE'].'</th>';
        }

        if (in_array("harsh_cornering_score", $data_items)) {
            $result .= '<th>'.$la['HARSH_CORNERING_COUNT'].'</th>';
            $result .= '<th>'.$la['HARSH_CORNERING_SCORE'].'</th>';
        }

        $result .= '<th>'.$la['RAG'].'</th>';
        $result .= '</tr>';

        $rag = array();

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];

            $data = getRoute($imei, $dtf, $dtt, 1, true);

            if (count($data['route']) == 0) {
                continue;
            }

            $haccel_count = 0;
            $hbrake_count = 0;
            $hcorn_count = 0;

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
            AND `type`='haccel' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $haccel_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
            AND `type`='hbrake' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $hbrake_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
            AND `type`='hcorn' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $hcorn_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_objects` WHERE `imei`='".$imei."'";
            $r = mysqli_query($ms, $q);
            $row = mysqli_fetch_array($r);
            $params = json_decode($row['params'], true);
            $driver = getObjectDriver($user_id, $imei, $params);

            if ($driver == false) {
                continue;
            }

            $route_length = $data['route_length'];

            $overspeed_duration = 0;
            $overspeed = 0;

            for ($j=0; $j<count($data['route']); ++$j) {
                $speed = $data['route'][$j][5];

                if ($speed > $speed_limit) {
                    if ($overspeed == 0) {
                        $overspeed_start = $data['route'][$j][0];
                        $overspeed = 1;
                    }
                } else {
                    if ($overspeed == 1) {
                        $overspeed_end = $data['route'][$j][0];
                        $overspeed_duration += strtotime($overspeed_end) - strtotime($overspeed_start);
                        $overspeed = 0;
                    }
                }
            }

            if ($route_length > 0) {
                $overspeed_score = $overspeed_duration / 10 / $route_length * 100;
                $overspeed_score = sprintf('%0.2f', $overspeed_score);

                $haccel_score = $haccel_count / $route_length * 100;
                $haccel_score = sprintf('%0.2f', $haccel_score);

                $hbrake_score = $hbrake_count / $route_length * 100;
                $hbrake_score = sprintf('%0.2f', $hbrake_score);

                $hcorn_score = $hcorn_count / $route_length * 100;
                $hcorn_score = sprintf('%0.2f', $hcorn_score);
            } else {
                $overspeed_score = 0;
                $haccel_score = 0;
                $hbrake_score = 0;
                $hcorn_score = 0;
            }

            $rag_score = 0;

            if (in_array("overspeed_score", $data_items)) {
                $rag_score += $overspeed_score;
            }

            if (in_array("harsh_acceleration_score", $data_items)) {
                $rag_score += $haccel_score;
            }

            if (in_array("harsh_braking_score", $data_items)) {
                $rag_score += $hbrake_score;
            }

            if (in_array("harsh_cornering_score", $data_items)) {
                $rag_score += $hcorn_score;
            }

            $rag_score = sprintf('%0.2f', $rag_score);

            $rag[] = array('driver_name' => $driver['driver_name'],
                    'object_name' => getObjectName($imei),
                    'route_length' => $route_length,
                    'overspeed_duration' => $overspeed_duration,
                    'overspeed_score' => $overspeed_score,
                    'haccel_count' => $haccel_count,
                    'haccel_score' => $haccel_score,
                    'hbrake_count' => $hbrake_count,
                    'hbrake_score' => $hbrake_score,
                    'hcorn_count' => $hcorn_count,
                    'hcorn_score' => $hcorn_score,
                    'rag_score' => $rag_score
            );
        }

        if (count($rag) == 0) {
            $result .= '<tr><td align="center" colspan="12">'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr>';
        }

        // list all drivers
        for ($i=0; $i<count($rag); ++$i) {
            $result .= '<tr align="center">';

            $result .= '<td>'.$rag[$i]['driver_name'].'</td>';
            $result .= '<td>'.$rag[$i]['object_name'].'</td>';
            $result .= '<td>'.$rag[$i]['route_length'].' '.$la['UNIT_DISTANCE'].'</td>';

            if (in_array("overspeed_score", $data_items)) {
                $result .= '<td>'.$rag[$i]['overspeed_duration'].' '.$la['UNIT_S'].'</td>';
                $result .= '<td>'.$rag[$i]['overspeed_score'].'</td>';
            }

            if (in_array("harsh_acceleration_score", $data_items)) {
                $result .= '<td>'.$rag[$i]['haccel_count'].'</td>';
                $result .= '<td>'.$rag[$i]['haccel_score'].'</td>';
            }

            if (in_array("harsh_braking_score", $data_items)) {
                $result .= '<td>'.$rag[$i]['hbrake_count'].'</td>';
                $result .= '<td>'.$rag[$i]['hbrake_score'].'</td>';
            }

            if (in_array("harsh_cornering_score", $data_items)) {
                $result .= '<td>'.$rag[$i]['hcorn_count'].'</td>';
                $result .= '<td>'.$rag[$i]['hcorn_score'].'</td>';
            }

            if ($rag[$i]['rag_score'] <= 10) {
                $rag_color = '#00FF00';
            } elseif (($rag[$i]['rag_score'] > 10) && ($rag[$i]['rag_score'] <= 30)) {
                $rag_color = '#FFFF00';
            } elseif ($rag[$i]['rag_score'] > 30) {
                $rag_color = '#FF0000';
            }

            $result .= '<td bgcolor="'.$rag_color.'">'.$rag[$i]['rag_score'].'</td>';

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }


    function reportsGenerateRagApi2($id_usuario,$imei, $dtf, $dtt, $speed_limit, $data_items)
    {
        global $ms, $_SESSION, $la;

        $user_id = $id_usuario;

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
        where gs_user_objects.group_id = gs_user_object_groups.group_id
        and gs_user_objects.user_id = gs_user_object_groups.user_id
        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

        $result2 = $ms->query($sql);

        $grupos = "sin grupo";

        while($row = $result2->fetch_assoc()) {
            $grupos = $row['group_name'];

        }

        // if($grupos){
        // $grupos = $grupos;
        // }
        // else {
        //     $grupos = "sin grupo";
        // }

            $rag = array();

            $data = getRoute($imei, $dtf, $dtt, 1, true);

            $patente = getObjectPlate($imei);


            $haccel_count = 0;
            $hbrake_count = 0;
            $hcorn_count = 0;

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
			AND `type`='haccel' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $haccel_count = mysqli_num_rows($r);

            // var_dump($user_id);
            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
			AND `type`='hbrake' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $hbrake_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
			AND `type`='hcorn' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $hcorn_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_objects` WHERE `imei`='".$imei."'";
            $r = mysqli_query($ms, $q);
            $row = mysqli_fetch_array($r);
            $params = json_decode($row['params'], true);
            $driver = getObjectDriver($user_id, $imei, $params);

            if ($driver == false) {
                $driver['driver_name'] = 'sin datos';

            }

            $route_length = $data['route_length'];

            $overspeed_duration = 0;
            $overspeed = 0;

            for ($j=0; $j<count($data['route']); ++$j) {
                $speed = $data['route'][$j][5];

                if ($speed > $speed_limit) {
                    if ($overspeed == 0) {
                        $overspeed_start = $data['route'][$j][0];
                        $overspeed = 1;
                    }
                } else {
                    if ($overspeed == 1) {
                        $overspeed_end = $data['route'][$j][0];
                        $overspeed_duration += strtotime($overspeed_end) - strtotime($overspeed_start);
                        $overspeed = 0;
                    }
                }
            }

            if ($route_length > 0) {
                $overspeed_score = $overspeed_duration / 10 / $route_length * 100;
                $overspeed_score = sprintf('%0.2f', $overspeed_score);

                $haccel_score = $haccel_count / $route_length * 100;
                $haccel_score = sprintf('%0.2f', $haccel_score);

                $hbrake_score = $hbrake_count / $route_length * 100;
                $hbrake_score = sprintf('%0.2f', $hbrake_score);

                $hcorn_score = $hcorn_count / $route_length * 100;
                $hcorn_score = sprintf('%0.2f', $hcorn_score);
            } else {
                $overspeed_score = 0;
                $haccel_score = 0;
                $hbrake_score = 0;
                $hcorn_score = 0;
            }

            $rag_score = 0;

            if (in_array("overspeed_score", $data_items)) {
                $rag_score += $overspeed_score;
            }

            if (in_array("harsh_acceleration_score", $data_items)) {
                $rag_score += $haccel_score;
            }

            if (in_array("harsh_braking_score", $data_items)) {
                $rag_score += $hbrake_score;
            }

            if (in_array("harsh_cornering_score", $data_items)) {
                $rag_score += $hcorn_score;
            }

            $rag_score = sprintf('%0.2f', $rag_score);

            $rag[] = array('driver_name' => $driver['driver_name'],
                       'object_name' => getObjectName($imei),
                       'plate_number' => $patente,
                       'group_name' =>$grupos,
                       'route_length' => $route_length,
                       'overspeed_duration' => $overspeed_duration,
                       'overspeed_score' => $overspeed_score,
                       'haccel_count' => $haccel_count,
                       'haccel_score' => $haccel_score,
                       'hbrake_count' => $hbrake_count,
                       'hbrake_score' => $hbrake_score,
                       'hcorn_count' => $hcorn_count,
                       'hcorn_score' => $hcorn_score
            );


        if($rag == []){
            return ["patente"=>$patente,"data"=>"sin datos"];
        }


        return ["patente"=>$patente,"data"=>$rag];

    }

    function reportsGenerateRagApi($id_usuario,$imeis, $dtf, $dtt, $speed_limit, $data_items)
    {
        global $ms, $_SESSION, $la;

        $user_id = 691;
        $speed_limit = 120;
        // $imei = '864403044838929';

        // $dtf = '2021-04-01 00:00:00';
        // $dtt = '2021-04-30 00:00:00';

        // $dtf = convUserUTCTimezone($dtf);
        // $dtt = convUserUTCTimezone($dtt);




            // return $route_length;

            $rag = array();

        for ($i=0; $i<count($imeis); ++$i) {
            $imei = $imeis[$i];


            $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
            where gs_user_objects.group_id = gs_user_object_groups.group_id
            and gs_user_objects.user_id = gs_user_object_groups.user_id
            and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

            $result2 = $ms->query($sql);

            $grupos = "sin grupo";

            while($row = $result2->fetch_assoc()) {
                $grupos = $row['group_name'];

            }

            // if($grupos){
            // $grupos = $grupos;
            // }
            // else {
            //     $grupos = "sin grupo";
            // }



            $data = getRoute($imei, $dtf, $dtt, 1, true);

            $patente = getObjectPlate($imei);


            $haccel_count = 0;
            $hbrake_count = 0;
            $hcorn_count = 0;

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
			AND `type`='haccel' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $haccel_count = mysqli_num_rows($r);

            // var_dump($user_id);
            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
			AND `type`='hbrake' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $hbrake_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_user_events_data` WHERE `user_id`='".$user_id."' AND `imei`='".$imei."'
			AND `type`='hcorn' AND dt_tracker BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_tracker ASC";
            $r = mysqli_query($ms, $q);

            $hcorn_count = mysqli_num_rows($r);

            $q = "SELECT * FROM `gs_objects` WHERE `imei`='".$imei."'";
            $r = mysqli_query($ms, $q);
            $row = mysqli_fetch_array($r);
            $params = json_decode($row['params'], true);
            $driver = getObjectDriver($user_id, $imei, $params);

            if ($driver == false) {
                $driver['driver_name'] = 'sin datos';

            }
            $route_length = $data['route_length'];

            // $route_length = 3625.41;



            $overspeed_duration = 0;
            $overspeed = 0;

            for ($j=0; $j<count($data['route']); ++$j) {
                $speed = $data['route'][$j][5];

                if ($speed > $speed_limit) {
                    if ($overspeed == 0) {
                        $overspeed_start = $data['route'][$j][0];
                        $overspeed = 1;
                    }
                } else {
                    if ($overspeed == 1) {
                        $overspeed_end = $data['route'][$j][0];
                        $overspeed_duration += strtotime($overspeed_end) - strtotime($overspeed_start);
                        $overspeed = 0;
                    }
                }
            }



            if ($route_length > 0) {
                $overspeed_score = $overspeed_duration / 10 / $route_length * 100;
                $overspeed_score = sprintf('%0.2f', $overspeed_score);

                $haccel_score = $haccel_count / $route_length * 100;
                $haccel_score = sprintf('%0.2f', $haccel_score);

                $hbrake_score = $hbrake_count / $route_length * 100;
                $hbrake_score = sprintf('%0.2f', $hbrake_score);

                $hcorn_score = $hcorn_count / $route_length * 100;
                $hcorn_score = sprintf('%0.2f', $hcorn_score);
            } else {
                $overspeed_score = 0;
                $haccel_score = 0;
                $hbrake_score = 0;
                $hcorn_score = 0;
            }



            // $rag_score = 0;

            // if (in_array("overspeed_score", $data_items)) {
            //     $rag_score += $overspeed_score;
            // }

            // if (in_array("harsh_acceleration_score", $data_items)) {
            //     $rag_score += $haccel_score;
            // }

            // if (in_array("harsh_braking_score", $data_items)) {
            //     $rag_score += $hbrake_score;
            // }

            // if (in_array("harsh_cornering_score", $data_items)) {
            //     $rag_score += $hcorn_score;
            // }

            // $rag_score = sprintf('%0.2f', $rag_score);



            $rag[] = array('driver_name' => $driver['driver_name'],
                       'object_name' => getObjectName($imei),
                       'plate_number' => $patente,
                       'group_name' =>$grupos,
                       'route_length' => $route_length,
                       'overspeed_duration' => $overspeed_duration,
                       'overspeed_score' => $overspeed_score,
                       'haccel_count' => $haccel_count,
                       'haccel_score' => $haccel_score,
                       'hbrake_count' => $hbrake_count,
                       'hbrake_score' => $hbrake_score,
                       'hcorn_count' => $hcorn_count,
                       'hcorn_score' => $hcorn_score
            );
        }

        if($rag == []){
            return ["patente"=>$patente,"data"=>"sin datos"];
        }


        return ["patente"=>$patente,"data"=>$rag];

    }



    function reportsGenerateTravelSheet2Jsons($id_usuario, $imei, $dtf, $dtt, $stop_duration, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //TRAVEL_SHEET
    {
        global $ms, $_SESSION, $la;
        // var_dump($imei);

        $q = "SELECT SUBSTRING(timezone, 1, 3) AS timezone from gs_users where username = 'admin'";
        $r = mysqli_query($ms, $q);


        while($row = $r->fetch_assoc()) {
            $tiempo = $row['timezone'];
        }

        $sql  =  "select gs_user_object_groups.group_name from gs_user_objects, gs_user_object_groups
        where gs_user_objects.group_id = gs_user_object_groups.group_id
        and gs_user_objects.user_id = gs_user_object_groups.user_id
        and gs_user_objects.imei = '".$imei."' and gs_user_objects.user_id = ".$id_usuario;

        $result2 = $ms->query($sql);

        $grupos = "sin grupo";

        while($row = $result2->fetch_assoc()) {
            $grupos = $row['group_name'];

        }

        // if($grupos){
        // $grupos = $grupos;
        // }
        // else {
        //     $grupos = "sin grupo";
        // }

        // var_dump($tiempo);


        $patente = getObjectPlate($imei);

        $q2 = "SELECT name FROM `gs_objects` WHERE `plate_number`='".$patente."'";;
        $r2 = mysqli_query($ms, $q2);

        while($row2 = $r2->fetch_assoc()) {
            $name = $row2['name'];
        }

        if($name == "" || $name == null || $name == []){


            $name = "sin datos";
        }

        $json = [];

        $result = '';
        $data = getRoute($imei, $dtf, $dtt, $stop_duration, true);
        // var_dump($data);
        if (count($data['drives']) < 1) {
            //	return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        //		$result = '<table class="report" width="100%"><tr align="center">';

        $total_route_length = 0;
        $total_fuel_consumption = 0;
        $total_fuel_cost = 0;

        for ($j=0; $j<count($data['drives']); ++$j) {
            $route_id_a = $data['drives'][$j][0];
            $route_id_b = $data['drives'][$j][2];

            $lat1 = sprintf("%01.6f", $data['route'][$route_id_a][1]);
            $lng1 = sprintf("%01.6f", $data['route'][$route_id_a][2]);
            $lat2 = sprintf("%01.6f", $data['route'][$route_id_b][1]);
            $lng2 = sprintf("%01.6f", $data['route'][$route_id_b][2]);

            $time_a = $data['drives'][$j][4];

            $time_b = $data['drives'][$j][5];






            if (!isset($position_a)) {
                $position_a = reportsGetPossition($lat1, $lng1, $show_coordinates, $show_addresses, $zones_addresses);
            } else {
                $position_a = $position_b;
            }

            $position_b = reportsGetPossition($lat2, $lng2, $show_coordinates, $show_addresses, $zones_addresses);

            $duration = $data['drives'][$j][6];

            $dteStart = new DateTime($time_a);
            $dteEnd   = new DateTime($time_b);

            $dteDiff  = $dteStart->diff($dteEnd);
            $duration = $dteDiff->format("%H:%I:%S");

            $dteStart->modify($tiempo.'hours');
            $dteEnd->modify($tiempo.'hours');
            $NuevaFechaA = $dteStart->format('d-m-Y H:i:s');
            $NuevaFechaB = $dteEnd->format('d-m-Y H:i:s');


            $route_length = $data['drives'][$j][7];
            $fuel_consumption = $data['drives'][$j][10];
            $fuel_cost = $data['drives'][$j][11];


            $resp = [

                'grupo'  => $grupos,
                'patente' => $patente,
                'usuario' => $name,
                'time A'=>$NuevaFechaA,
                'posicion A' => $position_a,
                'time B' => $NuevaFechaB,
                'posicion B'=>$position_b,
                'duracion' => $duration,
                'longitud' => $route_length." km",

            ];

             array_push($json,$resp);

        }
         if($json == []){
           return ["patente"=>$patente,"data"=>"sin datos"];
         }

        return ["patente"=>$patente,"data"=>$json];
    }



    function reportsGenerateRiLogbook($imeis, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items)
    {
        global $ms, $_SESSION, $la, $user_id;

        $result = '<table class="report" width="100%" ><tr align="center">';

        $result .= '<th>'.$la['TIME'].'</th>';
        $result .= '<th>'.$la['OBJECT'].'</th>';

        if (in_array("group", $data_items)) {
            $result .= '<th>'.$la['GROUP'].'</th>';
        }

        if (in_array("name", $data_items)) {
            $result .= '<th>'.$la['NAME'].'</th>';
        }

        if (in_array("position", $data_items)) {
            $result .= '<th>'.$la['POSITION'].'</th>';
        }

        $result .= '</tr>';

        $imeis_str = '';
        for ($i = 0; $i < count($imeis); ++$i) {
            $imeis_str .= '"'.$imeis[$i].'",';
        }
        $imeis_str = rtrim($imeis_str, ',');

        $q = "SELECT * FROM `gs_rilogbook_data` WHERE `imei` IN (".$imeis_str.") AND dt_server BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_server DESC";
        $r = mysqli_query($ms, $q);
        $count = mysqli_num_rows($r);

        if ($count == 0) {
            $result .= '<tr><td align="center" colspan="5">'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr>';
        }

        while ($row = mysqli_fetch_array($r)) {
            $dt_tracker = convUserTimezone($row['dt_tracker']);
            $imei = $row['imei'];
            $group = $row["group"];
            $assign_id = strtoupper($row["assign_id"]);
            $lat = $row["lat"];
            $lng = $row["lng"];

            $object_name = getObjectName($imei);

            if ($group == 'da') {
                $q2 = "SELECT * FROM `gs_user_object_drivers` WHERE `user_id`='".$user_id."' AND `driver_assign_id`='".$assign_id."'";
                $r2 = mysqli_query($ms, $q2);
                $row2 = mysqli_fetch_array($r2);

                if ($row2) {
                    $assign_id = '<a href="#" onclick="utilsShowDriverInfo(\''.$row2["driver_id"].'\');">';
                    $assign_id .= $row2["driver_name"];
                    $assign_id .= '</a>';
                }

                $group = $la['DRIVER'];
            } elseif ($group == 'pa') {
                $q2 = "SELECT * FROM `gs_user_object_passengers` WHERE `user_id`='".$user_id."' AND `passenger_assign_id`='".$assign_id."'";
                $r2 = mysqli_query($ms, $q2);
                $row2 = mysqli_fetch_array($r2);

                if ($row2) {
                    $assign_id = '<a href="#" onclick="utilsShowPassengerInfo(\''.$row2["passenger_id"].'\');">';
                    $assign_id .= $row2["passenger_name"];
                    $assign_id .= '</a>';
                }

                $group = $la['PASSENGER'];
            } elseif ($group == 'ta') {
                $q2 = "SELECT * FROM `gs_user_object_trailers` WHERE `user_id`='".$user_id."' AND `trailer_assign_id`='".$assign_id."'";
                $r2 = mysqli_query($ms, $q2);
                $row2 = mysqli_fetch_array($r2);

                if ($row2) {
                    $assign_id = '<a href="#" onclick="utilsShowTrailerInfo(\''.$row2["trailer_id"].'\');">';
                    $assign_id .= $row2["trailer_name"];
                    $assign_id .= '</a>';
                }

                $group = $la['TRAILER'];
            }

            $result .= '<tr align="center">';

            $result .= '<td>'.$dt_tracker.'</td>';
            $result .= '<td>'.$object_name.'</td>';

            if (in_array("group", $data_items)) {
                $result .= '<td>'.$group.'</td>';
            }

            if (in_array("name", $data_items)) {
                $result .= '<td>'.$assign_id.'</td>';
            }

            if (in_array("position", $data_items)) {
                $position = reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses);
                $result .= '<td>'.$position.'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateDTC($imeis, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items)
    {
        global $ms, $_SESSION, $la, $user_id;

        $result = '<table class="report" width="100%" ><tr align="center">';

        $result .= '<th>'.$la['TIME'].'</th>';
        $result .= '<th>'.$la['OBJECT'].'</th>';

        if (in_array("code", $data_items)) {
            $result .= '<th>'.$la['CODE'].'</th>';
        }

        if (in_array("position", $data_items)) {
            $result .= '<th>'.$la['POSITION'].'</th>';
        }

        $result .= '</tr>';

        $imeis_str = '';
        for ($i = 0; $i < count($imeis); ++$i) {
            $imeis_str .= '"'.$imeis[$i].'",';
        }
        $imeis_str = rtrim($imeis_str, ',');

        $q = "SELECT * FROM `gs_dtc_data` WHERE `imei` IN (".$imeis_str.") AND dt_server BETWEEN '".$dtf."' AND '".$dtt."' ORDER BY dt_server DESC";
        $r = mysqli_query($ms, $q);
        $count = mysqli_num_rows($r);

        if ($count == 0) {
            $result .= '<tr><td align="center" colspan="4">'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr>';
        }

        while ($row = mysqli_fetch_array($r)) {
            $dt_tracker = convUserTimezone($row['dt_tracker']);
            $imei = $row['imei'];
            $code = strtoupper($row["code"]);
            $lat = $row["lat"];
            $lng = $row["lng"];

            $object_name = getObjectName($imei);

            $result .= '<tr align="center">';

            $result .= '<td>'.$dt_tracker.'</td>';
            $result .= '<td>'.$object_name.'</td>';

            if (in_array("code", $data_items)) {
                $result .= '<td>'.$code.'</td>';
            }

            if (in_array("position", $data_items)) {
                $position = reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses);
                $result .= '<td>'.$position.'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateFuelFillings($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //FUEL_FILLINGS
    {
        global $_SESSION, $la, $user_id,$ms;

        $result = '';

        $accuracy = getObjectAccuracy($imei);
        $fuel_sensors = getSensorFromType($imei, 'fuel');

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        $ff = getRouteFuelFillings($route, $accuracy, $fuel_sensors);

        if ((count($route) == 0) || (count($ff['fillings']) == 0)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("time", $data_items)) {
            $result .= '<th>'.$la['TIME'].'</th>';
        }

        if (in_array("position", $data_items)) {
            $result .= '<th>'.$la['POSITION'].'</th>';
        }

        if (in_array("before", $data_items)) {
            $result .= '<th>'.$la['BEFORE'].'</th>';
        }

        if (in_array("after", $data_items)) {
            $result .= '<th>'.$la['AFTER'].'</th>';
        }

        if (in_array("filled", $data_items)) {
            $result .= '<th>'.$la['FILLED'].'</th>';
        }

        if (in_array("sensor", $data_items)) {
            $result .= '<th>'.$la['SENSOR'].'</th>';
        }

        if (in_array("driver", $data_items)) {
            $result .= '<th>'.$la['DRIVER'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($ff['fillings']); ++$i) {
            $lat = $ff['fillings'][$i][1];
            $lng = $ff['fillings'][$i][2];

            $params = $ff['fillings'][$i][7];
            $driver = getObjectDriver($user_id, $imei, $params);
            if ($driver['driver_name'] == '') {
                $driver['driver_name'] = $la['NA'];
            }

            $result .= '<tr align="center">';

            if (in_array("time", $data_items)) {
                $result .= '<td>'.$ff['fillings'][$i][0].'</td>';
            }

            if (in_array("position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            if (in_array("before", $data_items)) {
                $result .= '<td>'.$ff['fillings'][$i][3].'</td>';
            }

            if (in_array("after", $data_items)) {
                $result .= '<td>'.$ff['fillings'][$i][4].'</td>';
            }

            if (in_array("filled", $data_items)) {
                $result .= '<td>'.$ff['fillings'][$i][5].'</td>';
            }

            if (in_array("sensor", $data_items)) {
                $result .= '<td>'.$ff['fillings'][$i][6].'</td>';
            }

            if (in_array("driver", $data_items)) {
                $result .= '<td>'.$driver['driver_name'].'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        if (in_array("total", $data_items)) {
            $result .= '<br/>';
            $result .= '<table>';
            $result .= '<tr><td><strong>'.$la['FILLED'].':</strong></td><td>'.$ff['total_filled'].'</td></tr>';
            $result .= '</table>';
        }

        return $result;
    }

    function reportsGenerateFuelThefts($imei, $dtf, $dtt, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //FUEL_THEFTS
    {
        global $_SESSION, $la, $user_id;

        $result = '';

        $accuracy = getObjectAccuracy($imei);
        $fuel_sensors = getSensorFromType($imei, 'fuel');

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        $ft = getRouteFuelThefts($route, $accuracy, $fuel_sensors);

        if ((count($route) == 0) || (count($ft['thefts']) == 0)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("time", $data_items)) {
            $result .= '<th>'.$la['TIME'].'</th>';
        }

        if (in_array("position", $data_items)) {
            $result .= '<th>'.$la['POSITION'].'</th>';
        }

        if (in_array("before", $data_items)) {
            $result .= '<th>'.$la['BEFORE'].'</th>';
        }

        if (in_array("after", $data_items)) {
            $result .= '<th>'.$la['AFTER'].'</th>';
        }

        if (in_array("stolen", $data_items)) {
            $result .= '<th>'.$la['STOLEN'].'</th>';
        }

        if (in_array("sensor", $data_items)) {
            $result .= '<th>'.$la['SENSOR'].'</th>';
        }

        if (in_array("driver", $data_items)) {
            $result .= '<th>'.$la['DRIVER'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($ft['thefts']); ++$i) {
            $lat = $ft['thefts'][$i][1];
            $lng = $ft['thefts'][$i][2];

            $params = $ft['thefts'][$i][7];
            $driver = getObjectDriver($user_id, $imei, $params);
            if ($driver['driver_name'] == '') {
                $driver['driver_name'] = $la['NA'];
            }

            $result .= '<tr align="center">';

            if (in_array("time", $data_items)) {
                $result .= '<td>'.$ft['thefts'][$i][0].'</td>';
            }

            if (in_array("position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            if (in_array("before", $data_items)) {
                $result .= '<td>'.$ft['thefts'][$i][3].'</td>';
            }

            if (in_array("after", $data_items)) {
                $result .= '<td>'.$ft['thefts'][$i][4].'</td>';
            }

            if (in_array("stolen", $data_items)) {
                $result .= '<td>'.$ft['thefts'][$i][5].'</td>';
            }

            if (in_array("sensor", $data_items)) {
                $result .= '<td>'.$ft['thefts'][$i][6].'</td>';
            }

            if (in_array("driver", $data_items)) {
                $result .= '<td>'.$driver['driver_name'].'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        if (in_array("total", $data_items)) {
            $result .= '<br/>';
            $result .= '<table>';
            $result .= '<tr><td><strong>'.$la['STOLEN'].':</strong></td><td>'.$ft['total_stolen'].'</td></tr>';
            $result .= '</table>';
        }

        return $result;
    }

    function reportsGenerateLogicSensorInfo($imei, $dtf, $dtt, $sensors, $show_coordinates, $show_addresses, $zones_addresses, $data_items) //LOGIC_SENSORS
    {
        global $_SESSION, $gsValues, $la, $user_id;

        $accuracy = getObjectAccuracy($imei);
        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);
        $lsi = getRouteLogicSensorInfo($route, $accuracy, $sensors);

        if ((count($route) == 0) || (count($lsi) == 0) || ($sensors == false)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        $result = '<table class="report" width="100%"><tr align="center">';

        if (in_array("sensor", $data_items)) {
            $result .= '<th>'.$la['SENSOR'].'</th>';
        }

        if (in_array("activation_time", $data_items)) {
            $result .= '<th>'.$la['ACTIVATION_TIME'].'</th>';
        }

        if (in_array("deactivation_time", $data_items)) {
            $result .= '<th>'.$la['DEACTIVATION_TIME'].'</th>';
        }

        if (in_array("duration", $data_items)) {
            $result .= '<th>'.$la['DURATION'].'</th>';
        }

        if (in_array("activation_position", $data_items)) {
            $result .= '<th>'.$la['ACTIVATION_POSITION'].'</th>';
        }

        if (in_array("deactivation_position", $data_items)) {
            $result .= '<th>'.$la['DEACTIVATION_POSITION'].'</th>';
        }

        $result .= '</tr>';

        for ($i=0; $i<count($lsi); ++$i) {
            $sensor_name = $lsi[$i][0];
            $lsi_activation_time = $lsi[$i][1];
            $lsi_deactivation_time = $lsi[$i][2];
            $lsi_duration = $lsi[$i][3];
            $lsi_activation_lat = $lsi[$i][4];
            $lsi_activation_lng = $lsi[$i][5];
            $lsi_deactivation_lat = $lsi[$i][6];
            $lsi_deactivation_lng = $lsi[$i][7];

            $result .= '<tr align="center">';

            if (in_array("sensor", $data_items)) {
                $result .= '<td>'.$sensor_name.'</td>';
            }

            if (in_array("activation_time", $data_items)) {
                $result .= '<td>'.$lsi_activation_time.'</td>';
            }

            if (in_array("deactivation_time", $data_items)) {
                $result .= '<td>'.$lsi_deactivation_time.'</td>';
            }

            if (in_array("duration", $data_items)) {
                $result .= '<td>'.$lsi_duration.'</td>';
            }

            if (in_array("activation_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($lsi_activation_lat, $lsi_activation_lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            if (in_array("deactivation_position", $data_items)) {
                $result .= '<td>'.reportsGetPossition($lsi_deactivation_lat, $lsi_deactivation_lng, $show_coordinates, $show_addresses, $zones_addresses).'</td>';
            }

            $result .= '</tr>';
        }

        $result .= '</table>';

        return $result;
    }

    function reportsGenerateGraph($imei, $dtf, $dtt, $sensors) //SENSOR GRAPH
    {
        global $_SESSION, $gsValues, $la, $user_id;

        $result = '';

        $accuracy = getObjectAccuracy($imei);

        $route = getRouteRaw($imei, $accuracy, $dtf, $dtt);

        if ((count($route) == 0) || ($sensors == false)) {
            return '<table><tr><td>'.$la['NOTHING_HAS_BEEN_FOUND_ON_YOUR_REQUEST'].'</td></tr></table>';
        }

        // loop per sensors
        for ($i=0; $i<count($sensors); ++$i) {
            $graph = array();
            $graph['data'] = array();
            $graph['data_index'] = array();

            // prepare graph plot id
            $graph_plot_id = $imei.'_'.$i;

            // prepare data
            $sensor = $sensors[$i];

            for ($j=0; $j<count($route); ++$j) {
                $dt_tracker = $route[$j][0];
                $dt_tracker_timestamp = strtotime($dt_tracker) * 1000;

                if ($sensor['type'] == 'speed') {
                    $value = $route[$j][5];
                } elseif ($sensor['type'] == 'altitude') {
                    $value = $route[$j][3];
                } else {
                    $data = getSensorValue($route[$j][6], $sensor);

                    if ($sensor['type'] == 'engh') {
                        $data['value'] = $data['value'] / 60 / 60;
                        $data['value'] = sprintf("%01.2f", $data['value']);
                    }

                    $value = $data['value'];
                }

                $graph['data'][] = array($dt_tracker_timestamp, $value);
                $graph['data_index'][$dt_tracker_timestamp] = $j;
            }

            // set units
            if ($sensor['type'] == 'odo') {
                $graph['units'] = $la['UNIT_DISTANCE'];
                $graph['result_type'] = $sensor['result_type'];
            } elseif ($sensor['type'] == 'engh') {
                $graph['units'] = $la['UNIT_H'];
                $graph['result_type'] = $sensor['result_type'];
            } else {
                $graph['units'] = $sensor['units'];
                $graph['result_type'] = $sensor['result_type'];
            }

            $result .= '<script type="text/javascript">$(document).ready(function () {var graph = '.json_encode($graph).';initGraph("'.$graph_plot_id.'", graph);})</script>';

            $result .= '<div class="graph-controls">';

            if (($sensor['type'] != 'speed') && ($sensor['type'] != 'altitude')) {
                $result .= '<div class="graph-controls-left"><b>'.$la['SENSOR'].':</b> '.$sensor['name'].'</div>';
            }

            $result .= '<div class="graph-controls-right">
					<div id="graph_label_'.$graph_plot_id.'" class="graph-label"></div>

					<a href="#" onclick="graphPanLeft(\''.$graph_plot_id.'\');">
						<div class="panel-button" title="'.$la['PAN_LEFT'].'">
							<img src="'.$gsValues['URL_ROOT'].'/theme/images/arrow-left.svg" width="12px" border="0"/>
						</div>
					</a>

					<a href="#" onclick="graphPanRight(\''.$graph_plot_id.'\');">
						<div class="panel-button" title="'.$la['PAN_RIGHT'].'">
							<img src="'.$gsValues['URL_ROOT'].'/theme/images/arrow-right.svg" width="12px" border="0"/>
						</div>
					</a>

					<a href="#" onclick="graphZoomIn(\''.$graph_plot_id.'\');">
						<div class="panel-button" title="'.$la['ZOOM_IN'].'">
							<img src="'.$gsValues['URL_ROOT'].'/theme/images/plus.svg" width="12px" border="0"/>
						</div>
					</a>

					<a href="#" onclick="graphZoomOut(\''.$graph_plot_id.'\');">
						<div class="panel-button" title="'.$la['ZOOM_OUT'].'">
							<img src="'.$gsValues['URL_ROOT'].'/theme/images/minus.svg" width="12px" border="0"/>
						</div>
					</a>
				</div>
			</div>
			<div id="graph_plot_'.$graph_plot_id.'" style="height: 150px; width:100%;"></div>';
        }

        return $result;
    }

    $zones_addr = array();
    $zones_addr_loaded = false;

    function reportsGetPossition($lat, $lng, $show_coordinates, $show_addresses, $zones_addresses)
    {
        global $ms, $user_id, $zones_addr, $zones_addr_loaded;

        $lat = sprintf('%0.6f', $lat);
        $lng = sprintf('%0.6f', $lng);

        if ($show_coordinates == 'true') {
            $position = '<a href="http://maps.google.com/maps?q='.$lat.','.$lng.'&t=m" target="_blank">'.$lat.' &deg;, '.$lng.' &deg;</a>';
        } else {
            $position = '';
        }

        if ($zones_addresses == 'true') {
            if ($zones_addr_loaded == false) {
                $q = "SELECT * FROM `gs_user_zones` WHERE `user_id`='".$user_id."'";
                $r = mysqli_query($ms, $q);

                while ($row=mysqli_fetch_array($r)) {
                    $zones_addr[] = array($row['zone_id'],$row['zone_name'], $row['zone_vertices']);
                }

                $zones_addr_loaded = true;
            }

            for ($j=0; $j<count($zones_addr); ++$j) {
                $zone_name = $zones_addr[$j][1];
                $zone_vertices = $zones_addr[$j][2];

                $isPointInPolygon = isPointInPolygon($zone_vertices, $lat, $lng);

                if ($isPointInPolygon) {
                    if ($position == '') {
                        $position = $zone_name;
                    } else {
                        $position .= ' - '.$zone_name;
                    }

                    return $position;
                }
            }
        }

        if ($show_addresses == 'true') {
            $address = geocoderGetAddress($lat, $lng);

            if ($address != '') {
                if ($position == '') {
                    $position = $address;
                } else {
                    $position .= ' - '.$address;
                }
            }
        }

        return $position;
    }

    function reportsAddReportHeader($imei, $dtf = false, $dtt = false)
    {
        global $la, $user_id;

        $result = '<table>';

        if ($imei != "") {
            $result .= '<tr><td><strong>'.$la['OBJECT'].':</strong></td><td>'.getObjectName($imei).'</td></tr>';
        }

        if (($dtf != false) && ($dtt != false)) {
            $result .= '<tr><td><strong>'.$la['PERIOD'].':</strong></td><td>'.$dtf.' - '.$dtt.'</td></tr>';
        }

        $result .= '</table><br/>';

        return $result;
    }

    function reportsAddHeaderStart($format)
    {
        global $ms, $gsValues;

        $result = '';

        if (($format == 'html') || ($format == 'pdf')) {
            $result = 	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
					<html>
					<head>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<title>'.$gsValues['NAME'].' '.$gsValues['VERSION'].'</title>
					<link rel="icon" href="'.$gsValues['URL_ROOT'].'/favicon.ico" />';
        } elseif ($format == 'xls') {
            $result = 	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
					<html xmlns="http://www.w3.org/1999/xhtml">
					<head>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7">
					<title></title>';
        }

        return $result;
    }

    function reportsAddHeaderEnd()
    {
        $result = '</head><body>';

        return $result;
    }

    function reportsAddStyle($format)
    {
        $result = "<style type='text/css'>";

        if ($format == 'html') {
            $result .= "@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600,300,700&subset=latin,greek,greek-ext,cyrillic,cyrillic-ext,latin-ext,vietnamese);

				html, body {
					text-align: left;
					margin: 10px;
					padding: 0px;
					font-size: 11px;
					font-family: 'open sans';
					color: #444444;
				}";
        } elseif ($format == 'pdf') {
            $result .= "	html, body {
					text-align: left;
					margin: 10px;
					padding: 0px;
					font-size: 11px;
					font-family: 'DejaVu Sans';
					color: #444444;
				}";
        } elseif ($format == 'xls') {
            $result .= "	html, body {
					text-align: left;
					margin: 10px;
					padding: 0px;
					font-size: 11px;
					color: #444444;
				}";
        }

        $result .= ".logo { border:0px; width:250px; height:56px; }

				h3 {
					font-size: 13px;
					font-weight: 600;
				}

				hr {
					border-color: #eeeeee;
					border-style: solid none none;
					border-width: 1px 0 0;
					height: 1px;
					margin-left: 1px;
					margin-right: 1px;
				}

				a,
				a:hover { text-decoration: none; color: #2b82d4; }
				b, strong{ font-weight: 600; }

				.graph-controls
				{
					margin-bottom: 10px;
					display: table;
					width: 100%;
				}
				.graph-controls div
				{
					display: inline-block;
					vertical-align: middle;
					font-size: 11px;
				}
				.graph-controls-left
				{
					float: left;
					margin-top: 5px;
				}
				.graph-controls-right
				{
					float: right;
				}
				.graph-label
				{
					line-height: 24px;
					margin-right: 5px;
				}
				.panel-button img {
					display: block;
					padding: 6px;
					background: #f5f5f5;
				}
				.panel-button img:hover {
					background: #ffffff;
				}

				caption,
				th,
				td { vertical-align: middle; }

				table.report {
]					border: 1px solid #eeeeee;
					border-collapse: collapse;
				}

				table.report th {
					font-weight: 600;
					padding: 2px;
					border: 1px solid #eeeeee;
					background-color: #eeeeee;
				}

				table.report td {
					padding: 2px;
					border: 1px solid #eeeeee;
				}

				table.report tr:hover { background-color: #f5f5f5; }

				td { mso-number-format:'\@';/*force text*/ }

			</style>";

        return $result;
    }

    function reportsAddJS($type)
    {
        global $ms, $gsValues;

        $result = '';

        if (($type == 'speed_graph') || ($type == 'altitude_graph') || ($type == 'acc_graph') || ($type == 'fuellevel_graph') || ($type == 'temperature_graph') || ($type == 'sensor_graph')) {
            $result .= '<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery-2.1.4.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery-migrate-1.2.1.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery.flot.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery.flot.crosshair.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery.flot.navigate.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery.flot.selection.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery.flot.time.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/jquery.flot.resize.min.js"></script>
				<script type="text/javascript" src="'.$gsValues['URL_ROOT'].'/js/gs.common.js"></script>

				<script type="text/javascript">
					var graphPlot = new Array();

					function initGraph(id, graph)
					{
						if (!graph)
						{
							var data = []; // if no data, just create array for empty graph
							var units = "";
							var steps_flag = false;
							var points_flag = false;
						}
						else
						{
							var data = graph["data"];
							var units = graph["units"];

							if (graph["result_type"] == "logic")
							{
								var steps_flag = true;
								var points_flag = false;
							}
							else
							{
								var steps_flag = false;
								var points_flag = false;
							}
						}

						var minzoomRange = 30000;//	min zoom in is within 1 minute range (1*60*1000 = 60000)
						var maxzoomRange = 30 * 86400000;//	max zoom out is 5 times greater then chosen period (default is equal to 30 days 30 * 24*60*60*1000 = 86400000 )

						var options = {
							xaxis: {
								mode: "time",
								zoomRange: [minzoomRange, maxzoomRange]
								},
							yaxis: {
								//min: 0,
								tickFormatter: function (v) {
										var result = "";
										if (graph)
										{
											result = Math.round(v * 100)/100  + " " + units;
										}
										return result;
									},
								zoomRange: [0, 0],
								panRange: false
								},
							selection: {mode: "x"},
							crosshair: {mode: "x"},
							lines: {show: true, lineWidth: 1, fill: true, fillColor: "rgba(43,130,212,0.3)", steps: steps_flag},
							series: {lines: {show: true} , points: { show: points_flag, radius: 1 }},
							colors: ["#2b82d4"],
							grid: {hoverable: true, autoHighlight: true, clickable: true},
							zoom: {
								//interactive: true,
								animate: true,
								trigger: "dblclick", // or "click" for single click
								amount: 3         // 2 = 200% (zoom in), 0.5 = 50% (zoom out)
							},
							pan: {interactive: false, animate: true}
						};

						graphPlot[id] = $.plot($("#graph_plot_"+id), [data], options);

						$("#graph_plot_"+id).unbind("plothover");
						$("#graph_plot_"+id).bind("plothover", function (event, pos, item) {
							if (item)
							{
								var dt_tracker = getDatetimeFromTimestamp(item.datapoint[0]);

								var value = item.datapoint[1];
								document.getElementById("graph_label_"+id).innerHTML = value + " " + units + " - " + dt_tracker;
							}
						});

						$("#graph_plot_"+id).unbind("plotselected");
						$("#graph_plot_"+id).bind("plotselected", function (event, ranges) {
							graphPlot[id] = $.plot($("#graph_plot_"+id),
							[data],
							$.extend(true, {}, options, {
								xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
							}));

							// dont fire event on the overview to prevent eternal loop
							overview.setSelection(ranges, true);
						});
					}

					function graphPanLeft(id)
					{
						graphPlot[id].pan({left: -100})
					}

					function graphPanRight(id)
					{
						graphPlot[id].pan({left: +100})
					}

					function graphZoomIn(id)
					{
						graphPlot[id].zoom();
					}

					function graphZoomOut(id)
					{
						graphPlot[id].zoomOut();
					}
				</script>';
        }

        return $result;
    }
