<?php

    include('/var/www/html/track/server/s_insert.php');
    include('/var/www/html/track/server/eventos.php');
    $data = json_decode(file_get_contents("php://input"), true);
    $loc = $data;

    // var_dump($loc);

    // $loc['overpass'] = 0;

       $url = 'http://10.128.15.198/api/interpreter?data=[out:json];way(around:05.0,'.$loc['latitud'].','.$loc['longitud'].');out;';
    // $url = 'http://35.226.245.223/api/interpreter?data=[out:json];way(around:20.0,'.$loc['lat'].','.$loc['lng'].');out;';
    // $url = 'http://overpass-api.de/api/interpreter?data=[out:json];way(around:5.0,'.$lat.','.$lng.');out;';


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

    // var_dump(intval($result2));

    $loc['overpass'] = intval($result2);


    //  var_dump($loc['overpass']);
    
    // $loc['overpass'] = 0;


    // $result4 = '';
    // $q = 'SELECT overpass FROM gs_objects WHERE imei = '.$loc['imei'];
    // $r = mysqli_query($ms, $q) or print_r(mysqli_error($ms));

    //     $row = mysqli_fetch_array($r);
    //         if ($row[0] == 1) {
    //             $url = 'http://overpass-api.de/api/interpreter?data=[out:json];way(around:5.0,'.$loc['lat'].','$loc['lng']');out;';
    //             $jsondata = json_decode(file_get_contents($url), true);
    //             // var_dump($jsondata);
    //             for ($i = 0; $i < count($jsondata); $i++) {
    //                 if (isset($jsondata['elements'][$i]['tags']['maxspeed'])) {
                         
    //                     $result4 = $jsondata['elements'][$i]['tags']['maxspeed'];
    //                     // var_dump($result4);
    //                     // break;
    //                 }
    //             }
    //         }


    //     $result2 = json_encode($result4);
    //     $result2 = str_replace('"', '', $result2);
    //     $loc['overpass']=$result2;

    if (!isset($loc['imei'])) {
        mysqli_close($ms);
        die;
    }

    // if (!isset($loc['speed']) || !isset($loc['lat']) || !isset($loc['lat']) || !isset($loc['altitud']) || !isset($loc['port'])) {
    //     mysqli_close($ms);
    //     die;
    // }

    // if ($loc['speed'] > 145) {
    //     mysqli_close($ms);
    //     die;
    // }

    // if ($loc['lat'] > 0 || $loc['lng'] > 0) {
    //     mysqli_close($ms);
    //     die;
    // }
/*
    if ($result2 != '') {
        $loc['overpass'] = $result2;
    } else {
        $loc['overpass'] = 0;
    }
*/
        // $loc['dt_server'] = gmdate("Y-m-d H:i:s");
        // $dt_tracker = strtotime($loc['dt_tracker']);
        // if ($dt_tracker == 0) {
        //     $loc['dt_tracker'] = $loc['dt_server'];
        // }

        $loc['dt_server'] = gmdate("Y-m-d H:i:s");
        // if (!isset($loc['dt_tracker'])) {
        //     mysqli_close($ms);
        //     die;
        // }

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
    
            // // $loc['imei'] = $loc['imei'];
             $loc['dt_tracker'] = $loc['fecha'];

             $loc['loc_valid'] = 1;

           //   var_dump($loc['dt_tracker']);
            // // $loc['senial'] = $loc['senial'];
             $loc['lat'] = $loc['latitud'];
            // $loc['posicionLatitud'] = $loc['senial'];
             $loc['lng'] = $loc['longitud'];
            // $loc['posicionLongitud'] = $loc['senial'];
             $loc['speed'] = $loc['velocidad'];
             $loc['angle'] = $loc['angulo'];
            // // $loc['hdop'] = $loc['hdop'];
            // $loc['altitude'] = $loc['altitud'];
            // // $loc['loc_valid'] = $loc['loc_valid'];
            // $loc['adiAdi2'] = $loc['senial'];
            // $loc['odometro'] = $loc['maxspeed'];
            // $loc['event'] = $loc['senial'];
            // $loc['rfidId'] = $loc['maxpeed'];
            $loc['op'] = "loc";
            $loc['net_protocol'] = $loc['net_protocolo'];
            $loc['protocol'] = $loc['protocolo'];
            // $loc['ip'] = $loc['ip'];
            // $loc['port'] = $loc['puerto'];
            $loc['params'] = $loc['parametros'];

        //    $loc['overpass'] = 0;
	        // $loc['overpass'] = 100;       
            // $params = str_replace('{', '', json_encode($loc['parametros']));
            // $params = str_replace('}', '', $params);
            // $params = str_replace('[', '{', $params);
            // $params = str_replace(']', '}', $params);
            // $params = str_replace('"id":', '', $params);
            // $params = str_replace(',"value"', '', $params);

            // $loc['params'] =  json_decode($params, true);

            if ($loc["op"] == "loc") {
                insert_db_loc($loc);
            } elseif ($loc["op"] == "noloc") {
                insert_db_noloc($loc);
            } elseif ($loc["op"] == "imgloc") {
                insert_db_imgloc($loc);
            }

    mysqli_close($ms);
    die;
