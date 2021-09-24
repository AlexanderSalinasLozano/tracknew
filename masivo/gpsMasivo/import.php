<?php

include('conexion.php');
include('PHPExcel-1.8/Classes/PHPExcel.php');


$fileContacts = $_FILES['archivoexcel']['tmp_name'];
$excel = PHPExcel_IOFactory::createReaderForFile($fileContacts);
  
$excelobj = $excel ->load($fileContacts);
$hoja 	  = $excelobj -> getSheet(0);
$filas    = $hoja ->getHighestRow(); 

// echo "<table id='tabla_detalle' class='table table-dark' style='width:100%; table-layout:fixed'>
// 		<thead>
// 			<tr>
// 			<td>Imei</td>
// 			<td>ID</td>
// 			<td>Señal</td>
// 			<td>Telefono</td>
// 			<td>GPS</td>
// 			<td>ModeloGPS</td>
// 			</td>	
// 		<thead><tbody id = 'tbody_tabla_datelle'>";
		
// 		for($row = 2; $row<=$filas;$row++){
		 
// 		  $imei  			 = $hoja ->getCell('A'.$row)->getValue();
// 		  $id  	 			 = $hoja ->getCell('B'.$row)->getValue();
// 		  $senial 	 		     = $hoja ->getCell('C'.$row)->getValue();
// 		  $telefono 	 				 = $hoja ->getCell('D'.$row)->getValue();
// 		  $gps               = $hoja ->getCell('E'.$row)->getValue();
// 		  $modeloGps       		 = $hoja ->getCell('F'.$row)->getValue();
		  

		  	
// 		  echo "<tr>";
// 		  echo "<td>".$imei."</td>";
// 		  echo "<td>".$id."</td>";
// 		  echo "<td>".$senial."</td>";
// 		  echo "<td>".$telefono."</td>";
// 		  echo "<td>".$gps."</td>";
// 		  echo "<td>".$modeloGps."</td>";
		  
// 		  echo "</tr>";
// 		}
// 		  echo "</tbody></table>";


		  for($i=2;$i<=$filas;$i++){
			
			
			$imei  			= $hoja ->getCell('A'.$i)->getValue();
			$id  	 		= $hoja ->getCell('B'.$i)->getValue();
			$senial 	 	= $hoja ->getCell('C'.$i)->getValue();
			$telefono 	 	= $hoja ->getCell('D'.$i)->getValue();
			$gps            = $hoja ->getCell('E'.$i)->getValue();
			$modeloGps      = $hoja ->getCell('F'.$i)->getValue();
			
  
			//$conexion->query
			$conexion->query("CALL cargaMasiva(
				'$imei',
				'$id',
				'$senial',
				'$telefono',
				'$gps',
				'$modeloGps')");
				
		}

?>