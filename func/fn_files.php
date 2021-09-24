<?
	session_start();
	include ('/var/www/html/track/init.php');
	include ('fn_common.php');
	checkUserSession();

	if (isset($_POST['path']))
	{
		$result = getFileList($_POST['path']);
		echo json_encode($result);
		die;
	}	
 ?>
 
 
