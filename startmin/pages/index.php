<?php
// header('Content-Type', 'text/javascript');
header("Content-Type: text/html;charset=utf-8");

session_start();
$user_id = $_SESSION['user_id'];

// $uid = "root";
// $pwd = "Stech..,";
// $host = "104.200.25.198";
// $base = "gpsimple";

$uid = "stech";
$pwd = "Stech#306..,";
 $host = "10.118.144.7";
//$host = "35.188.97.141";
$base = "gpsimple";

try {

    $conn = new PDO("mysql:host=$host;dbname=$base", $uid, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos");
}


$today = date(mktime(0,0,0,date("m"),date("d"),date("Y")));
$time_hoy_star = date('Y-m-d 00:00:00', $today);
$time_hoy = date('Y-m-d 23:59:59', $today);

$today_un_dia = date(mktime(0,0,0,date("m"),date("d")-1,date("Y")));
$time_hoy_un_dia = date('Y-m-d 00:00:00', $today_un_dia);

$today_cinco_dia = date(mktime(0,0,0,date("m"),date("d")-5,date("Y")));
$time_hoy_cinco_dia = date('Y-m-d 00:00:00', $today_cinco_dia);



// var jmov = 9;
// var jpar = 20;
// var evnt = [];
// var dodo = [{y:'Dia: 16',a:0}];
// var mxve = [{y:'Patente: ULBO2867',a:0}];
// var dtc = [{y:'B2AAA',a:255},{y:'C0644',a:1}];
// var dtcpatente = [{y:'-',a:592},{y:'FM3001',a:27},{y:'-',a:23},{y:'TESTROBADO',a:16}];

$jmov= 0;
$jpar= 0;
$eventosExplode= [];
$diasOdometro= [];
$barmaxVel= [];
$datosDTC= [];
$datosDTCPatente=[]; 

// pie de equipos en linea
$queryLinea = "select plate_number, gs_objects.imei, dt_tracker,speed from gs_user_objects, gs_objects 
where gs_user_objects.imei = gs_objects.imei 
and gs_objects.active = 'true'
and user_id=".$user_id;

$stmt = $conn->query($queryLinea);
$arraya = [];
$incrementaM = 1;
$incrementaD = 1;
$movimiento = 0;
$detendido = 0;
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $id_disp = $row['imei'];
    $id_speed = $row['speed'];

    $array = array(
        'id_disp' => $id_disp,
        'speed' => $id_speed,
    );
    // echo print_r($array).'imeisarrary';
    array_push($arraya,$array);
}
$contador = count($arraya);

for ($i=0; $i < $contador; $i++) { 
    if($arraya[$i]['speed']>0){
        $movimiento = $incrementaM++;
    }
    if($arraya[$i]['speed']==0){
        $detendido = $incrementaD++;
    }
}
$jmov = json_encode($movimiento);
$jpar = json_encode($detendido);

// pie de eventos
// and dt_tracker BETWEEN '".$time_hoy_star."' and '".$time_hoy."'

$queryEventos = "select event_desc,COUNT(event_desc) as event_total
from gs_user_events_data
where user_id=".$user_id."
and dt_tracker BETWEEN  CONCAT(date(DATE_ADD(now(),INTERVAL -3 HOUR)),' ','00:00:00') and DATE_ADD(now(),INTERVAL -3 HOUR)
group by event_desc";

$ct = 0;
$resultEvnt = $conn->query($queryEventos);
$arrEventos = array();
while ($rowevent = $resultEvnt->fetch(PDO::FETCH_ASSOC)) {
    
    $text_event  = $rowevent['event_desc'];
    $event_total = $rowevent['event_total'];
    $ct = $ct + $event_total;
    $arrayevent  = "{label:"."'".$text_event."'".","."value:".$event_total."}";

    array_push($arrEventos,$arrayevent);
}
//echo $ct;
$contadorEvent = $ct;
$eventosEx = json_encode($arrEventos);
$eventosExplode = str_replace('"', "", $eventosEx);


// km ultimos 5 dias
// and dt_tracker BETWEEN '".$time_hoy_cinco_dia."' and '".$time_hoy."'

// $querydiasodometro = "SELECT DAY(dt_tracker) as dias, MONTH(dt_tracker) ,sum(odometer) as odometro
// from gs_user_objects, gs_objects 
// where gs_user_objects.imei = gs_objects.imei
// and user_id=".$user_id."
// and dt_tracker BETWEEN '".$time_hoy_cinco_dia."' and '".$time_hoy."'
// GROUP BY DAY(dt_tracker), MONTH(dt_tracker)
// order by dias DESC";

$querydiasodometro = "select plate_number, round(odometer,0) as 'odometer' 
from gs_objects,gs_user_objects 
where gs_user_objects.imei = gs_objects.imei 
and user_id= ".$user_id."
order by odometer desc limit 5";

$resultdiasOdometro = $conn->query($querydiasodometro);
$arrdiasOdometro = array();
while ($rowdiasodometro = $resultdiasOdometro->fetch(PDO::FETCH_ASSOC)) {
    $text_odometro  = $rowdiasodometro['plate_number'];
    $total_odometro = round($rowdiasodometro['odometer'],2);
    $arraydiasOdometro  = "{y:"."'".$text_odometro."'".","."a:".$total_odometro."}";

    array_push($arrdiasOdometro,$arraydiasOdometro);
}
$eventosOd = json_encode($arrdiasOdometro);
$diasOdometro = str_replace('"', "", $eventosOd);

// max velocidad por dia

// $querymaxvel = "select device,plate_number,speed,odometer  from gs_user_objects, gs_objects 
// where gs_user_objects.imei = gs_objects.imei 
// and date(gs_objects.dt_tracker) = date(now())
// and gs_objects.active = 'true'
// and user_id= ".$user_id." order by speed DESC LIMIT 5";

$querymaxvel = "select plate_number,max_speed, (gs_objects.odometer-st_odoCapturado.odometro) as 'odoDiario' 
from gs_objects,st_odoCapturado,gs_user_objects
where gs_objects.imei = st_odoCapturado.imei
and gs_user_objects.imei = gs_objects.imei
and (gs_objects.odometer-st_odoCapturado.odometro) > 0
and user_id = ".$user_id."
order by max_speed DESC LIMIT 5";

$resultMaxVel = $conn->query($querymaxvel);
$arrayMaxVel = array();
while ($rowdiasodometro = $resultMaxVel->fetch(PDO::FETCH_ASSOC)) {
    $text_odometro  = $rowdiasodometro['plate_number'];
    $total_odometro = $rowdiasodometro['max_speed'];
    $total_suma_odo = $rowdiasodometro['odoDiario'];
    $arraydiasOdometro  = "{y:"."'Patente: ".$text_odometro."'".","."a:".$total_odometro."}";

    array_push($arrayMaxVel,$arraydiasOdometro);
}
$maxVel = json_encode($arrayMaxVel);
$barmaxVel= str_replace('"', "", $maxVel);


// total kilometraje superior
$querymaxvelSup = "select plate_number,speed, (gs_objects.odometer-st_odoCapturado.odometro) as 'odoDiario' 
from gs_objects,st_odoCapturado,gs_user_objects
where gs_objects.imei = st_odoCapturado.imei
and gs_user_objects.imei = gs_objects.imei
and (gs_objects.odometer-st_odoCapturado.odometro) > 0
and user_id = ".$user_id."
order by odoDiario DESC";

$resultMaxVel = $conn->query($querymaxvelSup);
$arrayMaxVel = array();
$arrayOdometro = array();
while ($rowdiasodometro = $resultMaxVel->fetch(PDO::FETCH_ASSOC)) {
    $total_suma_odo = $rowdiasodometro['odoDiario'];
    array_push($arrayOdometro,$total_suma_odo);
}



// tabla mantencion
$queryMantencionImei = "select imei from gs_user_objects
where user_id = ".$user_id;
$arrayImeiMantencion = array();
$resultManIme = $conn->query($queryMantencionImei);
while ($rowManImei = $resultManIme->fetch(PDO::FETCH_ASSOC)) {
    $mantencionImei  = $rowManImei['imei'];
    $arrayMantencionImei  = "'".$mantencionImei."'";
    array_push($arrayImeiMantencion,$arrayMantencionImei);
}

// $imeiMantencion = json_encode($arrayImeiMantencion);
$imeiMantencion = implode(',',$arrayImeiMantencion);
$datosImei= str_replace('"', "", $imeiMantencion);

$queryMantencion = "select gs_objects.imei,plate_number,odo ,odo_interval,odo_last,odo_left from gs_object_services, gs_objects
where gs_object_services.imei = gs_objects.imei
and gs_object_services.imei in (".$datosImei.")";
$dataMantencion = $conn->query($queryMantencion);
$arrayMantencionData = array();
while ($rowMantencion = $dataMantencion->fetch(PDO::FETCH_ASSOC)) {
    $mantencionplate  = $rowMantencion['plate_number'];
    $mantencionodoin  = $rowMantencion['odo_interval'];
    $mantencionodolast  = $rowMantencion['odo_last'];
    $mantencionodoleft  = $rowMantencion['odo_left'];
    $arrayMantencion = array(
        'plate_number' => $mantencionplate,
        'odo_interval' => $mantencionodoin,
        'odo_last' => $mantencionodolast,
        'odo_left' => $mantencionodoleft,
    );

    array_push($arrayMantencionData,$arrayMantencion);

}
$equipos_mantencion_totales = count($arrayMantencionData);


// query vel max por conductores
$queryvelMax = "SELECT 
gs_objects.imei,
gs_objects.max_speed,
gs_objects.plate_number,
gs_user_objects.user_id,
gs_user_objects.driver_id,
gs_user_object_drivers.driver_name 
FROM gs_objects
left join gs_user_objects on gs_objects.imei = gs_user_objects.imei 
left join gs_user_object_drivers on gs_user_objects.driver_id = gs_user_object_drivers.driver_id 
where gs_user_objects.user_id = ".$user_id."
and gs_user_objects.driver_id > 0
order by max_speed desc LIMIT 10";

$dataMaxDrivers = $conn->query($queryvelMax);
$arrayMaxConductor = array();
while ($rowMaxDrivers = $dataMaxDrivers->fetch(PDO::FETCH_ASSOC)) {
    $maxDriversPlate  = $rowMaxDrivers['plate_number'];
    $maxDriversSpeed  = $rowMaxDrivers['max_speed'];
    $maxDriversName   = $rowMaxDrivers['driver_name'];
    $arrayMaxconductor = array(
        'plate_number' => $maxDriversPlate,
        'speed' => $maxDriversSpeed,
        'name' => $maxDriversName,
    );
    array_push($arrayMaxConductor,$arrayMaxconductor);

}

// $queryDTC = "SELECT count(code) as cantidad,code,st_codigos_dtc.descripcion from gs_dtc_data
// left join st_codigos_dtc on gs_dtc_data.code = st_codigos_dtc.codigo
// GROUP BY st_codigos_dtc.descripcion,gs_dtc_data.code ORDER by cantidad DESC;";

// $queryDTC = "select count(code) as cantidad,code,st_codigos_dtc.descripcion from gs_dtc_data, st_codigos_dtc , gs_user_objects
// where gs_dtc_data.code = st_codigos_dtc.codigo and date(dt_tracker) = date(now()) and gs_user_objects.imei = gs_dtc_data.imei
// and gs_user_objects.user_id = ".$user_id."
// GROUP BY st_codigos_dtc.descripcion,gs_dtc_data.code ORDER by cantidad DESC;";

//$queryDTC = "select * from st_dtc where user_id ='".$user_id."' ";

$queryDTC = "select sum(st_dtc2.cantidadCodigo) as 'cantidadCodigo',st_dtc2.codigo,st_codigos_dtc.descripcion
                from st_dtc2, st_codigos_dtc, gs_user_objects
                where st_dtc2.codigo = st_codigos_dtc.codigo
                and st_codigos_dtc.tipo = 'Generico'
                and st_dtc2.imei = gs_user_objects.imei 
                and gs_user_objects.user_id = '".$user_id."' 
                group by st_dtc2.codigo,st_codigos_dtc.descripcion";



$dataDTC = $conn->query($queryDTC);
// echo print_r($dataDTC);
$datarrayDTC = array();
$dataTable = array();
while ($rowDTC = $dataDTC->fetch(PDO::FETCH_ASSOC)) {
    $rowCantidad  = $rowDTC['cantidadCodigo'];
    $rowCode  = $rowDTC['codigo'];
    $rowDesc  = $rowDTC['descripcion'];
    $arrayDTC  = "{y:'".$rowCode."'".","."a:".$rowCantidad."}";
    array_push($datarrayDTC,$arrayDTC);

    $arrayListaTable = array(
        'cantidadCodigo' => $rowCantidad,
        'codigo' => $rowCode,
        'descripcion' => $rowDesc,
    );
    array_push($dataTable,$arrayListaTable);
}

$dataDTCfinal = json_encode($datarrayDTC);
$datosDTC= str_replace('"', "", $dataDTCfinal);


// $queryPatentesDTC = "SELECT count(gs_dtc_data.imei) as cantidad,gs_dtc_data.imei,gs_objects.plate_number from gs_dtc_data
// left join gs_objects on gs_dtc_data.imei = gs_objects.imei
// GROUP BY gs_objects.plate_number,gs_dtc_data.imei ORDER by cantidad DESC
// LIMIT 10;";

// $queryPatentesDTC = "select * from st_dtc_patentes where user_id ='".$user_id."' "; 
//$queryPatentesDTC = "select count(imei) as contador,patente from st_dtc_patentes where user_id = '".$user_id."'  GROUP BY patente";

$queryPatentesDTC = "select gs_objects.plate_number as 'patente', count(st_dtc2.codigo) as 'contador'
from st_dtc2, gs_user_objects, gs_objects
where st_dtc2.imei = gs_user_objects.imei 
and st_dtc2.imei = gs_objects.imei 
and gs_user_objects.user_id = '".$user_id."' 
and LENGTH(plate_number) >= 6
group by gs_objects.plate_number
order by count(st_dtc2.codigo) DESC";

$dataPatentesDTC = $conn->query($queryPatentesDTC);

$datarrayPatentesDTC = array();
// $dataTablePantentes = array();
while ($rowPatentesDTC = $dataPatentesDTC->fetch(PDO::FETCH_ASSOC)) {
    $rowPatenteCantidad  = $rowPatentesDTC['contador'];
    $rowDescPatente  = $rowPatentesDTC['patente'];
    $rowcodepatente  = $rowPatentesDTC['code'];
    if($rowDescPatente!=null){
        $arrayPantentesDTC  = "{y:'".$rowDescPatente."'".","."a:".$rowPatenteCantidad."}";
    }else{
        $arrayPantentesDTC  = "{y:'-'".","."a:".$rowPatenteCantidad."}";
    }
    
    
    array_push($datarrayPatentesDTC,$arrayPantentesDTC);

    // $arrayListaPatentes = array(
    //     'cantidadImei' => $rowPatenteCantidad,
    //     'imei' => $rowPatenteImei,
    //     'patente' => $rowDescPatente,
    // );
    // array_push($dataTablePantentes,$arrayListaPatentes);
}

$dataDTCPatente = json_encode($datarrayPatentesDTC);
$datosDTCPatente= str_replace('"', "", $dataDTCPatente);

?>
<!DOCTYPE html>
<html lang="en">
<style>
.page-header {
    padding-bottom: 9px;
    margin: 5px 0 20px !important;
    border-bottom: 1px solid #eee;
}
</style>
    <head>

        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Startmin - Bootstrap Admin Theme</title>

        <!-- Bootstrap Core CSS -->
        <link href="../css/bootstrap.min.css" rel="stylesheet">

        <!-- MetisMenu CSS -->
        <link href="../css/metisMenu.min.css" rel="stylesheet">

        <!-- Timeline CSS -->
        <link href="../css/timeline.css" rel="stylesheet">

        <!-- Custom CSS -->
        <link href="../css/startmin.css" rel="stylesheet">

        <!-- Morris Charts CSS -->
        <link href="../css/morris.css" rel="stylesheet">

        <!-- Custom Fonts -->
        <link href="../css/font-awesome.min.css" rel="stylesheet" type="text/css">
        <link href="../css/dataTables/dataTables.bootstrap.css" rel="stylesheet">

        <!-- DataTables Responsive CSS -->
        <link href="../css/dataTables/dataTables.responsive.css" rel="stylesheet">
        <!-- /#wrapper -->
        <!-- jQuery -->
        <script src="../js/jquery.min.js"></script>
        <script src="../js/bootstrap.min.js"></script>
        <script src="../js/metisMenu.min.js"></script>
        <script src="../js/raphael.min.js"></script>
        <!-- <script src="../js/morris.min.js"></script> -->
        <script src="../js/morris-data.js"></script>
        <script src="../js/morris.js"></script>
        <script src="../js/startmin.js"></script>
        <script src="../js/dataTables/jquery.dataTables.min.js"></script>
        <script src="../js/dataTables/dataTables.bootstrap.min.js"></script>

    </head>
    <body>
    
        <div id="wrapper">

            <!-- Navigation -->
            <!-- <nav class="" role="">

                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

               

                <div class="navbar-default sidebar" role="navigation">
                    <div class="sidebar-nav navbar-collapse">
                        <ul class="nav" id="side-menu">
                            <li>
                                <a href="index.php" class="active"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a>
                            </li>
                            <li>
                                <a href="#"><i class="fa fa-bar-chart-o fa-fw"></i> Charts<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    <li>
                                        <a href="flot.html">Flot Charts</a>
                                    </li>
                                    <li>
                                        <a href="morris.html">Morris.js Charts</a>
                                    </li>
                                </ul>

                            </li>
                            <li>
                                <a href="tables.html"><i class="fa fa-table fa-fw"></i> Tables</a>
                            </li>
                            <li>
                                <a href="forms.html"> Forms</a>
                            </li>
                            <li>
                                <a href="cargaMasiva.php">Carga Masiva</a>
                            </li>
                            <li>
                                <a href="#"><i class="fa fa-wrench fa-fw"></i> UI Elements<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    <li>
                                        <a href="panels-wells.html">Panels and Wells</a>
                                    </li>
                                    <li>
                                        <a href="buttons.html">Buttons</a>
                                    </li>
                                    <li>
                                        <a href="notifications.html">Notifications</a>
                                    </li>
                                    <li>
                                        <a href="typography.html">Typography</a>
                                    </li>
                                    <li>
                                        <a href="icons.html"> Icons</a>
                                    </li>
                                    <li>
                                        <a href="grid.html">Grid</a>
                                    </li>
                                </ul>
      
                            </li>
                            <li>
                                <a href="#"><i class="fa fa-sitemap fa-fw"></i> Multi-Level Dropdown<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    <li>
                                        <a href="#">Second Level Item</a>
                                    </li>
                                    <li>
                                        <a href="#">Second Level Item</a>
                                    </li>
                                    <li>
                                        <a href="#">Third Level <span class="fa arrow"></span></a>
                                        <ul class="nav nav-third-level">
                                            <li>
                                                <a href="#">Third Level Item</a>
                                            </li>
                                            <li>
                                                <a href="#">Third Level Item</a>
                                            </li>
                                            <li>
                                                <a href="#">Third Level Item</a>
                                            </li>
                                            <li>
                                                <a hre <a href="forms.html"> Forms</a>f="#">Third Level Item</a>
                                            </li>
                                        </ul>
                                       
                                    </li>
                                </ul>
                               
                            </li>
                            <li>
                                <a href="#"><i class="fa fa-files-o fa-fw"></i> Sample Pages<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    <li>
                                        <a href="blank.html">Blank Page</a>
                                    </li>
                                </ul>
                               
                            </li>

                        </ul>
                    </div>
                </div>
            </nav> -->

            <div id="page-wrapper" style="margin-left='1px !important';">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">Dashboard</h1>
                        </div>
                        <!-- /.col-lg-12 -->
                    </div>
                    <!-- /.row -->
                    <div class="row">
                        <div class="col-lg-3 col-md-6">
                            <div class="panel panel-primary">
                                <div class="panel-heading">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <i class="fa fa-wifi fa-5x"></i>
                                        </div>
                                        <div class="col-xs-9 text-right">
                                            <div class="huge"><?php echo $contador ?></div>
                                            <div>Equipos plataforma</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <a href="#">
                                    <div class="panel-footer">
                                        <span class="pull-left">View Details</span>
                                        <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>

                                        <div class="clearfix"></div>
                                    </div>
                                </a> -->
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="panel panel-green">
                                <div class="panel-heading">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <i class="fa fa-tasks fa-5x"></i>
                                        </div>
                                        <div class="col-xs-9 text-right">
                                            <div class="huge"><?php echo $contadorEvent ?></div>
                                            <div>Eventos Diarios</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <a href="#">
                                    <div class="panel-footer">
                                        <span class="pull-left">View Details</span>
                                        <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>

                                        <div class="clearfix"></div>
                                    </div>
                                </a> -->
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="panel panel-yellow">
                                <div class="panel-heading">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <i class="fa fa-tachometer fa-5x"></i>
                                        </div>
                                        <div class="col-xs-9 text-right">
                                            <div class="huge"><?php echo round(array_sum($arrayOdometro),0) ?></div>
                                            <div>Kilometraje total diario</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <a href="#">
                                    <div class="panel-footer">
                                        <span class="pull-left">View Details</span>
                                        <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>

                                        <div class="clearfix"></div>
                                    </div>
                                </a> -->
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6">
                            <div class="panel panel-red">
                                <div class="panel-heading">
                                    <div class="row">
                                        <div class="col-xs-3">
                                            <i class="fa fa-tag fa-5x"></i>
                                        </div>
                                        <div class="col-xs-9 text-right">
                                            <div class="huge"><?php echo $equipos_mantencion_totales?></div>
                                            <div>Equipos en mantencion</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <a href="#">
                                    <div class="panel-footer">
                                        <span class="pull-left">View Details</span>
                                        <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>

                                        <div class="clearfix"></div>
                                    </div>
                                </a> -->
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                    <div class="row">
                        <div class="col-lg-3 col-md-3">
                         <div class="panel panel-default">
                            <div class="panel-heading">
                                <i class="fa fa-bar-chart-o fa-fw"></i> Cantidad de Objetos en linea
                            </div>
                            <div class="panel-body">
                                <div id="pie-objetos-linea"></div>
                                
                            </div>
                            <!-- /.panel-body -->
                         </div>
                        </div>
                        <div class="col-lg-3 col-md-3">
                            <div class="panel panel-default">
                               <div class="panel-heading">
                                   <i class="fa fa-bar-chart-o fa-fw"></i> Eventos del dia
                               </div>
                               <div class="panel-body">
                                   <div id="pie-eventos"></div>
                                   
                               </div>
                               <!-- /.panel-body -->
                            </div>
                           </div>
                        <div class="col-lg-6 col-md-3">
                            <div class="panel panel-default">
                               <div class="panel-heading">
                                   <i class="fa fa-bar-chart-o fa-fw"></i> Patentes con mas kilometraje
                               </div>
                               <div class="panel-body">
                                <div id="km-flota"></div>
                               </div>
                               <!-- /.panel-body -->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6 col-md-6">
                            <div class="panel panel-default">
                               <div class="panel-heading">
                                   <i class="fa fa-bar-chart-o fa-fw"></i> Patentes con mas DTC ultimos 5 dias
                               </div>
                               <div class="panel-body">
                                <div id="bar-example"></div>
                               </div>
                               <!-- /.panel-body -->
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                Cantidad codigos de falla ultimos 5 dias
                                </div>
                                <!-- /.panel-heading -->
                                <div class="panel-body">
                                    <div class="table-responsive">
                                        <table class="table" id="codigos_descp" class="display">
                                            <thead>
                                                <tr>
                                                    <th>Codigo</th>
                                                    <th>Descripcion</th>
                                                    <th>Cantidad</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php 
                                                foreach ($dataTable as $key => $valueDes) {
                                                    // <td><a href="#">'.$valueDes['code'].'</a></td>
                                                    echo '<tr>
                                                            <td>'.$valueDes['codigo'].'</td>
                                                            <td>'.$valueDes['descripcion'].'</td>
                                                            <td>'.$valueDes['cantidadCodigo'].'</td>
                                                          </tr>';
                                                }
                                                ?>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- /.table-responsive -->
                                </div>
                                <!-- /.panel-body -->
                            </div>
                            <!-- /.panel -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 col-md-12">
                            <div class="panel panel-default">
                               <div class="panel-heading">
                                   <i class="fa fa-bar-chart-o fa-fw"></i> Ranking Velocidad maxima por dia
                               </div>
                               <div class="panel-body">
                                <div id="max-vel"></div>
                               </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- /.row -->
                </div>
                <div class="row">
                        <!-- /.col-lg-6 -->
                        <!-- <div class="col-lg-6">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    Equipos en mantenimiento
                                </div>
                               
                                <div class="panel-body">
                                    <div class="table-responsive">
                                        <table class="table" id="patentestes_mas_dtc">
                                            <thead>
                                                <tr>
                                                    <th>Patente</th>
                                                    <th>Odo.Interval</th>
                                                    <th>Odo.Last</th>
                                                    <th>Odo.Left</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <?php 
                                                foreach ($arrayMantencionData as $key => $value) {
                                                    echo '<tr>
                                                            <td>'.$value['plate_number'].'</td>
                                                            <td>'.$value['odo_interval'].'</td>
                                                            <td>'.$value['odo_last'].'</td>
                                                            <td>'.$value['odo_left'].'</td>
                                                          </tr>';
                                                }
                                                ?>
                                            </tbody>
                                        </table>
                                    </div>
                                   
                                </div>
                
                            </div> -->
           
                        </div>
                        <div class="col-lg-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    Velocidad Maxima Conductores
                                </div>
                                <!-- /.panel-heading -->
                                <div class="panel-body">
                                    <div class="table-responsive">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>Patente</th>
                                                    <th>Velocidad</th>
                                                    <th>Conductor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            <tbody>
                                                <?php 
                                                foreach ($arrayMaxConductor as $key => $valMaxDriver) {
                                                    echo '<tr>
                                                            <td>'.$valMaxDriver['plate_number'].'</td>
                                                            <td>'.$valMaxDriver['speed'].'</td>
                                                            <td>'.$valMaxDriver['name'].'</td>
                                                          </tr>';
                                                }
                                                ?>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!-- /.table-responsive -->
                                </div>
                                <!-- /.panel-body -->
                            </div>
                            <!-- /.panel -->
                        </div>
                        <!-- /.col-lg-6 -->
                    </div>
                <!-- /.container-fluid -->
            </div>
            <!-- /#page-wrapper -->

        </div>


    </body>
</html>
<script>

var jmov = <?php echo $jmov ?>;
var jpar = <?php echo $jpar ?>;
var evnt = <?php echo $eventosExplode ?>;
var dodo = <?php echo $diasOdometro ?>;
var mxve = <?php echo $barmaxVel ?>;
var dtc = <?php echo $datosDTC ?>;
var dtcpatente = <?php echo $datosDTCPatente ?>;



Morris.Donut({
    element: 'pie-objetos-linea',
    data: [{
        label: "Detenido",
        color:'yellow',
        value: jpar
    }, {
        label: "Movimiento",
        color:'green',
        value: jmov
    }, 
    // {
    //     label: "Offline",
    //     color:'red',
    //     value: 20
    // }
    ],
    resize: true
});

if(evnt.length === 0){
    Morris.Donut({
        element: 'pie-eventos',
        data: [{label:'sin datos',value:0}],
        resize: true
});
}else{
    Morris.Donut({
        element: 'pie-eventos',
        data: evnt,
        resize: true
});
}


Morris.Bar({
        element: 'km-flota',
        data: dodo,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['KM'],
        hideHover: 'auto',
        resize: true
});

Morris.Bar({
        element: 'max-vel',
        data: mxve,
        xkey: 'y',
        ykeys: ['a'],
        labels: ['Velocidad'],
        hideHover: 'auto',
        resize: true
});

    Morris.Bar({
      element: 'bar-example',
      data: dtcpatente,
      xkey: 'y',
      ykeys: ['a'],
      labels: ['Cantidad'],
    //   horizontal: true,
      gridIntegers: true,
      stacked: true,

    });
    
    $(document).ready(function() {
    $('#codigos_descp').DataTable( {
        "scrollY":        "230px",
        "scrollCollapse": true,
        "paging":         false,
        "dom": 'lrtip',
        "order": [[ 2, "desc" ]]
        } );
    } );

    $(document).ready(function() {
    $('#patentestes_mas_dtc').DataTable( {
        "scrollY":        "230px",
        "scrollCollapse": true,
        "paging":         false,
        "order": [[ 2, "desc" ]],
        "language": {
            "search": "Buscar:"
        }
        } );
    } );




</script>
