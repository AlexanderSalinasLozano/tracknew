<?php
    include('/var/www/html/track/server/s_insert.php');
    include('/var/www/html/track/server/eventos.php');
    $data = json_decode(file_get_contents("php://input"), true);
    $loc = $data;
   
    if (!isset($loc['imei'])) {
        mysqli_close($ms);
        die;
    }

    // $result4 = '';
    // $q = 'SELECT overpass FROM gs_objects WHERE imei = '.$loc['imei'];
    // $r = mysqli_query($ms, $q) or print_r(mysqli_error($ms));

    //     $row = mysqli_fetch_array($r);
    //         if ($row[0] == 1) {
    //             $url = 'http://35.239.114.66/api/interpreter?data=[out:json];way(around:40,'.$loc['lat'].','.$loc['lng'].');out;';
    //             $jsondata = json_decode(file_get_contents($url), true);
    //             // var_dump($jsondata);
    //             for ($i = 0; $i < count($jsondata); $i++) {
    //                 if (isset($jsondata['elements'][$i]['tags']['maxspeed'])) {
                         
    //                     $result4 = $jsondata['elements'][$i]['tags']['maxspeed'];
    //                     var_dump($result4);
    //                     // break;
    //                 }
    //             }
    //         }


    //     $result2 = json_encode($result4);
    //     $result2 = str_replace('"', '', $result2);
    //      $loc['overpass']=$result2;
    //    var_dump($loc['maxSpeed']);


    if ($loc['lat'] > 0 || $loc['lng'] > 0) {
        mysqli_close($ms);
        die;
    }

    // if ($result2 != '') {
    //     $loc['overpass'] = $result2;
    // } else {
    //     $loc['overpass'] = 0;
    // }

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

         var_dump("SALUDOS DESDE GPSIMPLE");
         var_dump($loc['dt_tracker']);

        //  $loc['event'] = $evento;

    //  $loc['params'] = "{'alarm':'tracker','acc':'0','hdop':'11.5','di5':'0','odo':'11','rfid':'0','batv':'0','rpm':'0','run_spd':'0','tps':'0','eng_load':'0','ect':'11','ifc':'11','afc':'11','drv_range':'0','sfcv':'11','tfcv':'0','cecn':'0','harsh_accel':'0','harsh_brake':'0'}"; 

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