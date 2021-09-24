<?php

    include('/var/www/html/track/server/s_insert.php');
    include('/var/www/html/track/server/eventos.php');
    $data = json_decode(file_get_contents("php://input"), true);
    $loc = $data;

    // var_dump($loc);

    // $loc['overpass'] = 0;

    //    $url = 'http://10.128.15.197/api/interpreter?data=[out:json];way(around:05.0,'.$loc['latitud'].','.$loc['longitud'].');out;';
    $url = 'http://35.226.245.223/api/interpreter?data=[out:json];way(around:10.0,'.$loc['lat'].','.$loc['lng'].');out;';
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

    if (!isset($loc['imei'])) {
        mysqli_close($ms);
        die;
    }

    if ($loc['lat'] == 0 || $loc['lng'] == 0) {
        mysqli_close($ms);
        die;
    }

    $loc['dt_server'] = gmdate("Y-m-d H:i:s");
    if (!isset($loc['dt_tracker'])) {
        mysqli_close($ms);
        die;
    }


    var_dump("SALUDOS DESDE GPSIMPLE");
    var_dump($loc['dt_tracker']);
    var_dump('Punto entrante: '.$loc['imei']);
    var_dump('Overpass: '.$loc['overpass']);

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
