<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>Startmin - Bootstrap Admin Theme</title>

        <!-- Bootstrap Core CSS -->
        <link href="../css/bootstrap.min.css" rel="stylesheet">

        <!-- MetisMenu CSS -->
        <link href="../css/metisMenu.min.css" rel="stylesheet">

        <!-- Custom CSS -->
        <link href="../css/startmin.css" rel="stylesheet">

        <!-- Custom Fonts -->
        <link href="../css/font-awesome.min.css" rel="stylesheet" type="text/css">

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->

        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
        <link rel="stylesheet" href="../css/style.css">
    </head>
    <body>

        <div id="wrapper">

            <!-- Navigation -->
            <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div class="navbar-header">
                    <a class="navbar-brand" href="index.php">Startmin</a>
                </div>

                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <ul class="nav navbar-nav navbar-left navbar-top-links">
                    <li><a href="#"><i class="fa fa-home fa-fw"></i> Website</a></li>
                </ul>

                <ul class="nav navbar-right navbar-top-links">
                    <li class="dropdown navbar-inverse">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="fa fa-bell fa-fw"></i> <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu dropdown-alerts">
                            <li>
                                <a href="#">
                                    <div>
                                        <i class="fa fa-comment fa-fw"></i> New Comment
                                        <span class="pull-right text-muted small">4 minutes ago</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <div>
                                        <i class="fa fa-twitter fa-fw"></i> 3 New Followers
                                        <span class="pull-right text-muted small">12 minutes ago</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <div>
                                        <i class="fa fa-envelope fa-fw"></i> Message Sent
                                        <span class="pull-right text-muted small">4 minutes ago</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <div>
                                        <i class="fa fa-tasks fa-fw"></i> New Task
                                        <span class="pull-right text-muted small">4 minutes ago</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <div>
                                        <i class="fa fa-upload fa-fw"></i> Server Rebooted
                                        <span class="pull-right text-muted small">4 minutes ago</span>
                                    </div>
                                </a>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a class="text-center" href="#">
                                    <strong>See All Alerts</strong>
                                    <i class="fa fa-angle-right"></i>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="fa fa-user fa-fw"></i> secondtruth <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu dropdown-user">
                            <li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>
                            </li>
                            <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
                            </li>
                            <li class="divider"></li>
                            <li><a href="login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <!-- /.navbar-top-links -->

                <div class="navbar-default sidebar" role="navigation">
                    <div class="sidebar-nav navbar-collapse">
                        <ul class="nav" id="side-menu">
                            <li class="sidebar-search">
                                <div class="input-group custom-search-form">
                                    <input type="text" class="form-control" placeholder="Search...">
                                    <span class="input-group-btn">
                                        <button class="btn btn-primary" type="button">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </span>
                                </div>
                                <!-- /input-group -->
                            </li>
                            <li>
                                <a href="index.php"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a>
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
                                <!-- /.nav-second-level -->
                            </li>
                            <li>
                                <a href="tables.html"><i class="fa fa-table fa-fw"></i> Tables</a>
                            </li>
                            <li>
                                <a href="forms.html"><i class="fa fa-edit fa-fw"></i> Forms</a>
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
                                <!-- /.nav-second-level -->
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
                                                <a href="#">Third Level Item</a>
                                            </li>
                                        </ul>
                                        <!-- /.nav-third-level -->
                                    </li>
                                </ul>
                                <!-- /.nav-second-level -->
                            </li>
                            <li class="active">
                                <a href="#"><i class="fa fa-files-o fa-fw"></i> Sample Pages<span class="fa arrow"></span></a>
                                <ul class="nav nav-second-level">
                                    <li>
                                        <a class="active" href="blank.html">Blank Page</a>
                                    </li>
                                    <li>
                                        <a href="login.html">Login Page</a>
                                    </li>
                                </ul>
                                <!-- /.nav-second-level -->
                            </li>
                        </ul>
                    </div>
                    <!-- /.sidebar-collapse -->
                </div>
                <!-- /.navbar-static-side -->
            </nav>

            <!-- Page Content -->
            <div id="page-wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="page-header">Carga Masiva</h1>
                            <fomr name="tuFormulario2">
  <section class="contenedor seccion">
  <h2 class="fw-300 centrar-texto">Pegar Documento Aqui</h2>
  <textarea rows="10" cols="50" name = "csv" id = "textarea" required="Es necesario rellenar el campo"></textarea>


  <div class="contenedor centrar-texto fw-300">Previsualización de Tabla</div>
  <br>
 <div id="team" name="team" class="contenedor centrar-texto fw-300"></div>

<div class="convertir">
<button type="button" class="boton boton-verde" onclick="myFunction()">Convertir</button>
</div> 
<br><br>
<button class="boton boton-verde button" onclick="pregunta(); grabaTodoTabla('listaF');" title="Grabar">Guardar</button>

<div id="respuesta">
</div>




</section>
</fomr>
<script type="text/javascript">
  function myFunction() {

                
                var tbl = "<form name=tuformulario ><table class='contenedor centrar-texto fw-300' style='font-size: 11px;' border='1' id='listaF'><tbody>"
                var lines = document.getElementById("textarea").value.split("\n");
                var numero=0;
                var numero2=0;

                for (var i = 0; i < lines.length; i++) {
                  numero ++;
                  tbl = tbl + (`<tr id='tr_${numero}'>`);
                  var items = lines[i].split("\t");

                  for (var j = 0; j < items.length; j++) {
                  numero2++;
                  tbl = tbl + (`<td id='td_${numero}.${numero2}'>`) + items[j] + "</td>";

                  }
                  numero2=0;

                   tbl = tbl + "</tr>";
                }
                tbl = tbl + "</tbody></table></form>";
                var divTable = document.getElementById('team');
                console.log(tbl);
                divTable.innerHTML= tbl;

             }    

document.getElementById("textarea").addEventListener('keyup', (e) => {

let nombre = e.target.value;
e.target.value = nombre.toUpperCase().trim();

});

/* Evento para cuando el usuario libera la tecla escrita dentro del input */

$(document).ready(function() {    
    $('.button').on('click', function(){
        //Añadimos la imagen de carga en el contenedor
        $('#respuesta').html('<div class="loader contenedor centrar-texto fw-300" "><img src="img/status.gif" alt="loading" /><br/>Un momento, por favor...</div>');
 
      });              
});    

function pregunta(){ 
    if (!(confirm('¿Estas seguro que deseas guardar la tabla?'))){ 
            
        system.exit(0)
          return false;
    } 
  }
// Funcion que graba los datos de la tabla.
 
function grabaTodoTabla(TABLAID){
        var DATA 	= [];
        var TABLA 	= $("#"+ TABLAID +" tbody");
       
        validadorTR = false;
        numeroTR=1;
     
        TABLA.each(function(){

        while(validadorTR == false){
         var ID = $(this).find(`tr[id='tr_${numeroTR}']`).text();
       
         validadorTD = false;
         numeroTD=1;
        while(validadorTD == false){

        var TD = $(this).find(`td[id='td_${numeroTR}.${numeroTD}']`).text();
          if(TD ==""){
                validadorTD=true; 
           }
 
              item = {};
               if(TD !==''){
                item [`${numeroTR}.${numeroTD}`]= TD;
                DATA.push(item);
              
            }
            
            numeroTD++;
        }

         if(ID ==''){
           validadorTR=true;
         }
            numeroTR++;

          }
        });
  //    
    console.log(DATA);
        //eventualmente se lo vamos a enviar por PHP por ajax de una forma bastante simple y además convertiremos el array en json para evitar cualquier incidente con compativilidades.
        INFO 	= new FormData();
        aInfo 	= JSON.stringify(DATA);
        

        INFO.append('data', aInfo);
        
        console.log('AINFO'+ aInfo);

      $.ajax({

           
            data: INFO,
            type: 'POST',
            url : 'pagina.php',
            processData: false, 
            contentType: false,
            success: function(r){

              $('#respuesta').fadeIn(1000).html(r);
             // $("#respuesta").html("");
		         //	$("#respuesta").html(r);
      // window.location="pagina.php"  ;
            alert("Datos Guardados Exitosamente");
               
          //    alert("tabla guardada en ajax" );
                //Una vez que se haya ejecutado de forma exitosa hacer el código para que muestre esto mismo.
            },


            error: function () {
                alert("Error");
            } 
        })

      
    }



</script>

                        </div>



                        <!-- /.col-lg-12 -->
                    </div>
                    <!-- /.row -->
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- /#page-wrapper -->

        </div>
        <!-- /#wrapper -->

        <!-- jQuery -->
        <script src="../js/jquery.min.js"></script>

        <!-- Bootstrap Core JavaScript -->
        <script src="../js/bootstrap.min.js"></script>

        <!-- Metis Menu Plugin JavaScript -->
        <script src="../js/metisMenu.min.js"></script>

        <!-- Custom Theme JavaScript -->
        <script src="../js/startmin.js"></script>

    </body>
</html>
