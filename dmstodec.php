<?php



	$dms = 7112.6382;

	$datos 			= explode(".", $dms);

	$parte_entera 	= $datos[0];

	$parte_decimal 	= $datos[1];

	$dec_entero		= substr($parte_entera, 0, -2);		

	$dec_decimales 	= substr($parte_entera, -2) . "." . $parte_decimal;

	$dec_decimales 	= $dec_decimales/60;	

	

	echo ($dec_entero + $dec_decimales);



?>