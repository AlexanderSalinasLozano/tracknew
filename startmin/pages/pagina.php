<?php

$host="104.200.25.198";
$port=3306;
$socket="";
$user="root";
$password="Stech..,";
$dbname="gpsimple";

$conn = mysqli_connect($host, $user, $password, $dbname, $port, $socket)
	or die ('Could not connect to the database server '. mysqli_connect_error());
//include connect.php;
echo "<br>";
echo"Datos guardados correctamente";

//Recibimos el Array y lo decodificamos desde json, para poder utilizarlo como objeto
$resultado = json_decode($_POST["data"],true);

$filaActual =1;
$filaPasada=0;
$celda=1;

for ($i=0; $i<count($resultado);$i++){
//$

$indice= $filaActual.'.'.$celda;
$resultadoData = $resultado[$i][$indice];

if(!(empty($resultadoData))){
//$casilla = "casilla".$celda;
$dataFinal= $casilla.'.'.$resultadoData;
//echo "Fila".$filaActual;
//echo "<br>";
//echo $resultadoData;
${"casilla".$celda} = $resultadoData;
//echo ${"casilla".$celda};
//echo $i.".".$celda;
console.log($celda);
//echo $i.$resultadoData;


if($celda==5){

$sql = "CALL `PruebaCargaMasiva`('".$casilla1."','".$casilla2."','".$casilla3."','".$casilla4."','".$casilla5."')";

if(mysqli_query($conn, $sql)){
  console.log("New record created successfully<br>");
} else {
  console.log("Error: " . $sql . "<br>" . mysqli_error($conn));
}
}

//$casilla++;
}
if(count($resultadoData)==0){
  $i--;
  console.log("--------------------");
  //echo "<br>";
  $filaActual++;
  $celda=1;
}
else{
  
  $celda++;
  $filaPasada=$FilaActual;
}
 
  }
?>

