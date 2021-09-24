<?php
    include('/var/www/html/track/server/s_insert.php');
    include('/var/www/html/track/server/eventos.php');
    $data = json_decode(file_get_contents("php://input"), true);
    $loc = $data;


    if (!isset($loc['imei'])) {
        mysqli_close($ms);
        die;
    }

    // $url = 'http://10.128.0.16/api/interpreter?data=[out:json];way(around:40.0,'.$loc['lat'].','.$loc['lng'].');out;';
    // $data = @file_get_contents($url);
    // $jsondata = json_decode($data,true);
    // $result4 = 0;
    // for($i = 0; $i < 16; $i++){
    //         if (isset($jsondata['elements'][$i]['tags']['maxspeed']))
    //         {
    //             $result4 = $jsondata['elements'][$i]['tags']['maxspeed'];
    //             break;
    //         }
    // }
    // $result2 = json_encode($result4);
    // $result2 = str_replace('"','',$result2);
    // $loc['overpass']=$result2;

    // $result4 = '';
    // $q = 'SELECT overpass FROM gs_objects WHERE imei = '.$loc['imei'];
    // $r = mysqli_query($ms, $q) or print_r(mysqli_error($ms));

    //     $row = mysqli_fetch_array($r);
    //         if ($row[0] == 1) {
    //             $url = 'http://35.239.114.66/api/interpreter?data=[out:json];way(around:40,'.$loc['lat'].','.$loc['lng'].');out;';
    //             $jsondata = json_decode(file_get_contents($url), true);
    //             for ($i = 0; $i < 16; $i++) {
    //                 if (isset($jsondata['elements'][$i]['tags']['maxspeed'])) {
    //                     $result4 = $jsondata['elements'][$i]['tags']['maxspeed'];
    //                     break;
    //                 }
    //             }
    //         }

    //         $result2 = json_encode($result4);
    //         $result2 = str_replace('"', '', $result2);
    //         $loc['overpass']=$result2;


 
            // $mysqli = new mysqli('10.118.144.7', 'root', 'Stech@306..,', 'gpsimple');

            // $q2  = "SELECT * FROM gs_object_data_".$loc['imei']." where dt_tracker < '".$loc['dt_tracker']."' order by dt_tracker desc limit 1";
    
            // $r2 = mysqli_query($mysqli, $q2);
            // $r2 = mysqli_fetch_row($r2);
            // $fecha_anterior = $r2[1];
            // $arrayParams = $r2[7];
            // $array = json_decode($arrayParams, true);
    
            // //Valor odometro reporte anterior bd.
            // $array = $array['odo'];
    
            // // $array = 39590;
            // var_dump("odo  anterior: ".$array);
    
            // //valor odometro reporte entrante.
            // $r3 = (strval($loc['params']['odo']));
            // // $r3 = 40000;
            // var_dump("odo entrante: ".$r3);
            // //Calculo de dias
    
            // // $diff = strtotime($loc['dt_tracker'])->diff(strtotime($fecha_anterior));
            // $diferencia = ((strtotime($loc['dt_tracker'])) - (strtotime($fecha_anterior)));
    
            // // var_dump($fecha_anterior);
            // // var_dump($loc['dt_tracker']);
            // // var_dump("diferencia: ".$diferencia);
    
            // $calculo_a_dias = $diferencia / (60 * 60 * 24);
       
            // var_dump("dias: ".$calculo_a_dias);
            // $km_diarios = 800;
            // $calculo_odometro = $calculo_a_dias * $km_diarios;
            // $calculo_odometro = intval($calculo_odometro) + 10;
    
            // $dif = ($r3) - ($array);
            // $dif = abs($dif);
            // // var_dump($r3);
            // // var_dump(strval($array));
            // var_dump("calculo odo: ".$calculo_odometro);
            // var_dump("diferencia odo entre fechas: ".$dif);
    
            
            // if($dif > $calculo_odometro){
            //     mysqli_close($ms);
            //     die;
            // }

            $loc['overpass'] = 0;

        if ($loc['speed'] > 200) {
            mysqli_close($ms);
            die;
        }

        if ($loc['lat'] > 0 || $loc['lng'] > 0) {
            mysqli_close($ms);
            die;
        }

        // if ($result2 != '') {
        //     $loc['overpass'] = $result2;
        // } else {
        //     $loc['overpass'] = 0;
        // }

        $loc['dt_server'] = gmdate("Y-m-d H:i:s");
        if (!isset($loc['dt_tracker'])) {
            mysqli_close($ms);
            die;
        }

        // $dt_server = strtotime($loc['dt_server']);
        // $dt_tracker = strtotime($loc['dt_tracker']);
        // $dt_diferencia = $dt_server - $dt_tracker;

        // $q_run_speed = 'SELECT run_speed FROM gs_objects WHERE imei = '.$loc['imei'].'';
        // $r_run_speed = mysqli_query($ms, $q_run_speed) or print_r(mysqli_error($ms));
        // $row = mysqli_fetch_array($r_run_speed);

        // if ($row[0] == 1) {
        //     $direferncia_speed = $loc["speed"] - $loc["params"]["run_spd"];
        //     if($direferncia_speed > 10){
        //         $loc["speed"] = $loc["params"]["run_spd"];
        //     }
        //     if($direferncia_speed < -10){
        //         $loc["speed"] = $loc["params"]["run_spd"];
        //     }
        // }


            $loc['loc_valid'] = 1;
//		if($dt_diferencia < 30){
            if ($loc["op"] == "loc") {
                insert_db_loc($loc);
            } elseif ($loc["op"] == "noloc") {
                insert_db_noloc($loc);
            } elseif ($loc["op"] == "imgloc") {
                insert_db_imgloc($loc);
            }
//		}

    mysqli_close($ms);
    die;
