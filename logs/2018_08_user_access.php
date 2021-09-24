<?
session_start();
include ('../init.php');
include ('../func/fn_common.php');
checkUserSession();
checkUserCPanelPrivileges();
header('Content-Type:text/plain');
?>
[2018-08-30 12:47:22] 190.153.243.116 [1]admin - User login: successful
