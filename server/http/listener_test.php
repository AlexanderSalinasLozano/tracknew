<?php
    include('/var/www/html/track/server/s_insert.php');
    include('/var/www/html/track/server/eventos.php');
    $data = json_decode(file_get_contents("php://input"), true);
    $loc = $data;

    $loc['overpass'] = 0;
    
    if (!isset($loc['imei'])) {
        mysqli_close($ms);
        die;
    }

    $url = 'http://10.128.15.198/api/interpreter?data=[out:json];way(around:05.0,'.$loc['lat'].','.$loc['lng'].');out;';
    

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

    $loc['overpass'] = intval($result2);

    var_dump($loc['overpass']);

    // $result4 = '';
    // $q = 'SELECT overpass FROM gs_objects WHERE imei = '.$loc['imei'];
    // $r = mysqli_query($ms, $q) or print_r(mysqli_error($ms));

    //     $row = mysqli_fetch_array($r);
    //         if ($row[0] == 1) {
    //             $url = 'http://35.239.114.66/api/interpreter?data=[out:json];way(around:40,'.$loc['lat'].','.$loc['lng'].');out;';

    //             if(file_get_contents($url)){

    //                     $jsondata = json_decode(file_get_contents($url), true);
    //                     // var_dump($jsondata);
    //                     for ($i = 0; $i < count($jsondata); $i++) {
    //                         if (isset($jsondata['elements'][$i]['tags']['maxspeed'])) {
                                
    //                             $result4 = $jsondata['elements'][$i]['tags']['maxspeed'];
    //                             // var_dump($result4);
    //                             // break;
    //                         }
    //                     }

    //                     $result2 = json_encode($result4);
    //                     $result2 = str_replace('"', '', $result2);
    //                     $loc['overpass']=$result2;
    //             }
    //             else{
    //                 $loc['overpass'] = 0;
    //             }
    //         }



    if ($loc['lat'] > 0 || $loc['lng'] > 0) {
        mysqli_close($ms);
        die;
    }

/*    if ($result2 != '') {
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
        if (!isset($loc['dt_tracker'])) {
            mysqli_close($ms);
            die;
        }

        $q_run_speed = 'SELECT run_speed FROM gs_objects WHERE imei = '.$loc['imei'].'';
        $r_run_speed = mysqli_query($ms, $q_run_speed) or print_r(mysqli_error($ms));
        $row = mysqli_fetch_array($r_run_speed);

        if ($row[0] == 1) {
            $direferncia_speed = $loc["speed"] - $loc["params"]["run_spd"];
            if($direferncia_speed > 10){
                $loc["speed"] = $loc["params"]["run_spd"];
            }
            if($direferncia_speed < -10){
                $loc["speed"] = $loc["params"]["run_spd"];
            }
        }
        
            $params = str_replace('{', '', json_encode($loc['params']));
            $params = str_replace('}', '', $params);
            $params = str_replace('[', '{', $params);
            $params = str_replace(']', '}', $params);
            $params = str_replace('"id":', '', $params);
            $params = str_replace(',"value"', '', $params);
            
            $loc['params'] =  json_decode($params, true);
            $evento = "";

            foreach($loc['params'] as $clave => $valor) {
                if($clave == 'io247'){
                    if($valor == '1'){
                        $evento  = "shock";
                        }
                        else if ($valor == '2'){
                        $evento  = "limited crash trace (device not calibrated)";
                        }
                        else if ($valor == '3'){
                        $evento  = "limited crash trace (device is calibrated)";
                        }
                        else if ($valor == '4'){
                        $evento  = "full crash trace (device not calibrated)";
                        }
                        else if ($valor == '5'){
                        $evento  = "full crash trace (device is calibrated)";
                        }
                        else if ($valor == '6'){
                        $evento  = "crash detected (device not calibrated)";
                        }
                }   

                if($clave == 'io253'){
                    if($valor == '1'){
                        $evento  = "haccel";
                        }
                        else if ($valor == '2'){
                        $evento  = "hbrake";
                        }
                        else if ($valor == '3'){
                        $evento  = "hcorn";
                        }
                }  

                if($clave == 'io252'){
                    if($valor == '0'){
                        $evento  = "conexion";
                        }
                        else if ($valor == '1'){
                        $evento  = "desconexion";
                        }
                }   
            //   print "$clave => $valor\n";
         }
 	        // $loc['overpass'] = 2;          
             $loc['event'] = $evento;

           

            //  var_dump($loc['event']);


           

            if ($loc["op"] == "loc") {
                insert_db_loc($loc);
            } 
            // elseif ($loc["op"] == "noloc") {
            //     insert_db_noloc($loc);
            // } elseif ($loc["op"] == "imgloc") {
            //     insert_db_imgloc($loc);
            // }

    mysqli_close($ms);
    die;
