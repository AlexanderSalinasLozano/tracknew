<?
	error_reporting(E_ALL ^ E_DEPRECATED);

	session_start();
	set_time_limit(0);
	
	include ('../config.php');
	include ('../config.custom.php');
	
	$ms = mysqli_connect($gsValues['DB_HOSTNAME'], $gsValues['DB_USERNAME'], $gsValues['DB_PASSWORD'], $gsValues['DB_NAME'], $gsValues['DB_PORT']);
	if (!$ms)
	{
	    echo "Error connecting to database.";
	    die;
	}
	
	$q = "SET @@global.sql_mode= '';";
	$r = mysqli_query($ms, $q);
	
	// --------------------------------------------------------
	// modify database tables
	// --------------------------------------------------------
	
	$q = "alter table gs_user_events_data add column name varchar(50) not null after `imei`";
	$r = mysqli_query($ms, $q);
		
	$gsValuesNew['MAP_GOOGLE_STREET_VIEW'] = $gsValues['MAP_GOOGLE'];
	$gsValuesNew['GEOCODER_BING_KEY'] = '';
	$gsValuesNew['GEOCODER_GOOGLE_KEY'] = '';
	$gsValuesNew['GEOCODER_PICKPOINT_KEY'] = '';
	$gsValuesNew['GEOCODER_SERVICE'] = 'google';	
		
	$gsValuesNew['USER_MAP_OSM'] = $gsValues['MAP_OSM'];
	$gsValuesNew['USER_MAP_BING'] = $gsValues['MAP_BING'];
	$gsValuesNew['USER_MAP_GOOGLE'] = $gsValues['MAP_GOOGLE'];
	$gsValuesNew['USER_MAP_GOOGLE_STREET_VIEW'] = $gsValues['MAP_GOOGLE'];
	$gsValuesNew['USER_MAP_GOOGLE_TRAFFIC'] = $gsValues['MAP_GOOGLE_TRAFFIC'];
	$gsValuesNew['USER_MAP_MAPBOX'] = $gsValues['MAP_MAPBOX'];
	$gsValuesNew['USER_MAP_YANDEX'] = $gsValues['MAP_YANDEX'];
	
	$config = '';
	foreach ($gsValuesNew as $key => $value)
	{
		$config .= '$gsValues[\''.strtoupper($key).'\'] = "'.$value.'";'."\r\n";
	}
	
	$config = "<?\r\n".$config. "?>";
	
	file_put_contents('../config.custom.php', $config, FILE_APPEND | LOCK_EX);

	echo 'Script successfully finished!';
?>