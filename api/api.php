<?
        include ('../init.php');
	include ('../func/fn_common.php');
	include ('../tools/gc_func.php');
	include ('../tools/email.php');
	include ('../tools/sms.php');
	
	function getUserIdFromAPIKey($key)
	{
		global $ms;
		
		$q = "SELECT * FROM `gs_users` WHERE `api_key`='".$key."'";
		$r = mysqli_query($ms, $q);
		$row = mysqli_fetch_array($r);

		if($row["api"] == "true")
		{
			return $row["id"];
		}
		else
		{
			return false;	
		}
	}
	
	function getUserIdFromUsername($username)
	{
		global $ms;
		
		$q = "SELECT * FROM `gs_users` WHERE `username`='".$username."'";
		$r = mysqli_query($ms, $q);
		$row = mysqli_fetch_array($r);
		
		return $row["id"];
	}
	
	function getUserIdFromEmail($email)
	{
		global $ms;
		
		$q = "SELECT * FROM `gs_users` WHERE `email`='".$email."'";
		$r = mysqli_query($ms, $q);
		
		if (!$r)
		{
			return false;
		}
		
		$row = mysqli_fetch_array($r);
		
		return $row["id"];
	}
	
	function getUserAPIKeyFromEmail($email)
	{
		global $ms;
		
		$q = "SELECT * FROM `gs_users` WHERE `email`='".$email."'";
		$r = mysqli_query($ms, $q);
		
		if (!$r)
		{
			return false;
		}
		
		$row = mysqli_fetch_array($r);
		
		return $row["api_key"];
	}
	
        // validate access to api
	$api_access = false;
	
	$api = @$_GET['api'];
	$ver = @$_GET['ver'];
        $key = @$_GET['key'];
        $cmd = @$_GET['cmd'];
	
	if ($api == '') { die; }
        if ($ver != '1.0') { die; }
        if ($cmd == '') { die; }
	
	if ($api == 'server')
	{
		if ($key != $gsValues['SERVER_API_KEY']) { die; }
		$api_access = true;
		include ('api_server.php');
	}
	
	if ($api == 'user')
	{
		$user_id = getUserIdFromAPIKey($key);
		if ($user_id == false) { die; }
		//check user usage
		if (!checkUserUsage($user_id, 'api')) { die; }
		
		//update user usage
		updateUserUsage($user_id, false, false, false, 1);
		
		$api_access = true;		
		include ('api_user.php');
	}
	
	die;
?>