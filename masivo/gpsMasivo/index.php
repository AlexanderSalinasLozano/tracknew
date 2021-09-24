<script>
    var validador = localStorage.getItem("checkItem");
    if(validador=='admin'){}else{
        window.location.href = 'sinacceso.php';
    }
</script>
<html lang="es">
	<head> 
		<title>Cargar Masiva </title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
		<link rel="stylesheet" href="css/estilos.css">

        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

        <!-- jQuery library -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

        <!-- Latest compiled JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

	</head>
	<body>
		<header>
			<div class="alert alert-dark">
			<h3>Insertar registros a la BD desde un Excel </h3>
			</div>
		</header>

        <form action="files.php" method="post" enctype="multipart/form-data" id="filesForm">
            <!-- <div class="col-md-4 offset-md-4">
                <input class="form-control" id="txt_archivo" type="file" name="fileContacts" accept=".csv,.xlsx,.xls">
                <button type="button" onclick="uploadContacts()" class="btn btn-primary form-control" >Cargar</button>
              </div> -->
              <div class="col-md-4 offset-md-4">
                  <div class="custom-file">
                   <input class="text-white " id="txt_archivo" type="file" name="fileContacts" accept=".csv,.xlsx,.xls">
                  </div>
                 <button type="button" onclick="uploadContactsvisual()" class="btn btn-dark form-control" >Visualizar tabla</button>
                 <button type="button" onclick="uploadContacts()" class="btn btn-dark form-control" disabled id='btnGuardar'>Cargar</button>

              </div>
        </form>


        <div class="col-md-12" id="div_tabla"><br></div>


</body>
</html>

<script type="text/javascript">

    function uploadContacts()
    {
        var Form = $('#txt_archivo').val();
        if(Form === ""){
          alert("excel vacio");
        }
        var formData = new FormData();
        var files = $('#txt_archivo')[0].files[0];
        formData.append('archivoexcel',files);

        $.ajax({

            url: "import.php",
            type: "post",
            data : formData,
            processData: false,
            contentType: false,
            success: function(data)
            {
                 alert("Datos guardados");
                 location.reload();
                // $("#div_tabla").html(data);
            }
        });
        return false;
    }

    function uploadContactsvisual()
    {
        var Form = $('#txt_archivo').val();
        if(Form === ""){
          alert("excel vacio");
        }
        
        var formData = new FormData();
        var files = $('#txt_archivo')[0].files[0];
        formData.append('archivoexcel',files);

        $.ajax({

            url: "convertir.php",
            type: "post",
            data : formData,
            processData: false,
            contentType: false,
            success: function(data)
            {
                // alert(data);
                $("#div_tabla").html(data);
                btnGuardar.disabled = false;
            }
        });
        return false;
    }
 
</script>