<?php
set_time_limit(0);

ob_start();

//require_once ('/var/www/html/ruta.php');
include('s_init.php');
include('eventos.php');
include('s_events.php');
include('/var/www/html/track/func/fn_common.php');
include('/var/www/html/track/func/fn_cleanup.php');
include('/var/www/html/track/tools/gc_func.php');

$data = json_decode(file_get_contents("php://input"), true);
var_dump('SOY S_SERVICE');
// var_dump($data["op"]);
// #################################################
//  WILL BE DEPRECATED IN 4.0 VERSION
// #################################################

if (@$_GET["op"] == "sms_gateway_app") {
    if (!isset($_GET["identifier"])) {
        die;
    }

    if ($_GET["identifier"] == '') {
        die;
    }

    $format = strtolower(@$_GET["format"]);

    $q = "SELECT * FROM `gs_sms_gateway_app` WHERE `identifier`='" . $_GET["identifier"] . "' ORDER BY `dt_sms` ASC";
    $r = mysqli_query($ms, $q);

    if ($format == 'json') {
        $result = array();

        while ($row = mysqli_fetch_array($r)) {
            $result[] = array($row['dt_sms'], $row['number'], $row['message']);
        }

        echo json_encode($result);
    } else {
        $result = '';

        while ($row = mysqli_fetch_array($r)) {
            $result .= $row['dt_sms'] . chr(30) . $row['number'] . chr(30) . $row['message'] . chr(29);
        }

        echo $result;
    }

    $q2 = "DELETE FROM `gs_sms_gateway_app` WHERE `identifier`='" . $_GET['identifier'] . "'";
    $r2 = mysqli_query($ms, $q2);

    die;
}

if (@$_GET["op"] == "chat_new_messages") {
    $imei = $_GET["imei"];

    // get unread messages number
    $q = "SELECT * FROM `gs_object_chat` WHERE `imei`='" . $imei . "' AND `side`='S' AND `status`=0";
    $r = mysqli_query($ms, $q);
    $msg_num = mysqli_num_rows($r);

    // set messages to delivered
    $q = "UPDATE `gs_object_chat` SET `status`=1 WHERE `imei`='" . $imei . "' AND `side`='S' AND `status`=0";
    $r = mysqli_query($ms, $q);

    echo $msg_num;
    die;
}

if ((@$_GET["op"] == "object_exists_system") || (@$_GET["op"] == "check_object_exists_system")) {
    echo checkObjectExistsSystem($_GET["imei"]);
    die;
}

if (@$_GET["op"] == "cmd_exec_imei_get") {
    $format = strtolower(@$_GET["format"]);

    $q = "SELECT * FROM `gs_object_cmd_exec` WHERE `status`='0' AND `imei`='" . $_GET["imei"] . "'";
    $r = mysqli_query($ms, $q);

    if ($format == 'json') {
        $result = array();

        while ($row = mysqli_fetch_array($r)) {
            $result[] = array($row['cmd_id'], $row['cmd']);

            $q2 = "UPDATE `gs_object_cmd_exec` SET `status`='1' WHERE `cmd_id`='" . $row["cmd_id"] . "'";
            $r2 = mysqli_query($ms, $q2);
        }

        echo json_encode($result);
    } else {
        $result = '';

        while ($row = mysqli_fetch_array($r)) {
            $result .= $row['cmd_id'] . chr(30) . $row['cmd'] . chr(29);

            $q2 = "UPDATE `gs_object_cmd_exec` SET `status`='1' WHERE `cmd_id`='" . $row["cmd_id"] . "'";
            $r2 = mysqli_query($ms, $q2);
        }

        echo $result;
    }

    die;
}

if (@$_GET["op"] == "service_1h") {
    serviceSendReportDailyH();
}

// #################################################
//  END WILL BE DEPRECATED IN 4.0 VERSION
// #################################################

/*if ($gsValues['HW_KEY'] != @$data["key"])
    {
        echo 'Incorrect hardware key.';
        die;
    }
    else
    {*/
if ((@$data["op"] != "get_cmd_exec") && (@$data["op"] != "set_cmd_exec")) {
    echo "OK";
}
//}

if (@$data["op"] == "clear_object_history") {
    clearObjectHistory($data['imei']);
}

if (@$data["op"] == "get_cmd_exec") {
    $q = "SELECT gs_objects.*, gs_object_cmd_exec.*
			FROM gs_objects
			INNER JOIN gs_object_cmd_exec ON gs_objects.imei = gs_object_cmd_exec.imei
			WHERE gs_object_cmd_exec.status='0' ORDER BY gs_object_cmd_exec.cmd_id ASC";
    $r = mysqli_query($ms, $q);

    $result = array();

    while ($row = mysqli_fetch_array($r)) {
        $result[] = array(
            "cmd_id" => intval($row['cmd_id']),
            "protocol" => $row['protocol'],
            "net_protocol" => $row['net_protocol'],
            "ip" => $row['ip'],
            "port" => intval($row['port']),
            "imei" => $row['imei'],
            "type" => $row['type'],
            "cmd" => $row['cmd']
        );
    }

    header('Content-type: application/json');
    echo json_encode($result);
    die;
}

if (@$data["op"] == "set_cmd_exec") {
    if (isset($data["re_hex"])) {
        $q = "UPDATE `gs_object_cmd_exec` SET `status`='" . $data["status"] . "', `re_hex`='" . $data["re_hex"] . "' WHERE `cmd_id`='" . $data["cmd_id"] . "'";
    } else {
        $q = "UPDATE `gs_object_cmd_exec` SET `status`='" . $data["status"] . "' WHERE `cmd_id`='" . $data["cmd_id"] . "'";
    }

    $r = mysqli_query($ms, $q);

    echo "OK";
    die;
}

header("Connection: close");
header("Content-length: " . (string) ob_get_length());
ob_end_flush();

if (@$data["op"] == "service_12h") {
    serviceServerCleanup();
}

if (@$data["op"] == "service_1h") {
    // serviceSendReportDailyH();
    serviceCheckAccountDateLimit();
    serviceCheckObjectDateLimit();
    serviceClearVarious();
    serviceClearHistory();
}

if (@$data["op"] == "service_30min") {
    if ($gsValues['REPORTS_SCHEDULE'] == 'true') {
        serviceSendReportDaily();
        serviceSendReportWeekly();
        serviceSendReportMonthly();
    }
}

if (@$data["op"] == "service_5min") {
    actualizarApagado();
    serviceCMDSchedule();
    serviceEventService();
    //serviceDbBackup();
}


if (@$data["op"] == "service_1min") {
    servicioNotificacionMovil();
    serviceClearCounters();
    serviceEvents();
}

// service 24h
function serviceDbBackup()
{
    global $ms, $gsValues;

    $email = $gsValues['DB_BACKUP_EMAIL'];

    if ($email == '') {
        die;
    }

    // check when last time sent
    $q = "SELECT * FROM `gs_system` WHERE `key`='DB_BACKUP_TIME_LAST'";
    $r = mysqli_query($ms, $q);
    $row = mysqli_fetch_array($r);

    if ($row) {
        $dt_send = gmdate("Y-m-d") . ' ' . $gsValues['DB_BACKUP_TIME'] . ':00';

        if (strtotime($row['value']) < strtotime($dt_send)) {
            if (strtotime(gmdate('Y-m-d H:i:s')) < strtotime($dt_send)) {
                die;
            }
        } else {
            die;
        }
    }

    // get all of the tables
    $tables = array();
    $r = mysqli_query($ms, 'SHOW TABLES');
    while ($row = mysqli_fetch_row($r)) {
        $tables[] = $row[0];
    }

    $return = '';

    // cycle through
    foreach ($tables as $table) {
        $row2 = mysqli_fetch_row(mysqli_query($ms, 'SHOW CREATE TABLE ' . $table));
        $return .= $row2[1] . ";\n";

        if ((stristr($table, 'gs_dtc_data') == false) &&
            (stristr($table, 'gs_geocoder_cache') == false) &&
            (stristr($table, 'gs_objects_unused') == false) &&
            (stristr($table, 'gs_object_chat') == false) &&
            (stristr($table, 'gs_object_cmd_exec') == false) &&
            (stristr($table, 'gs_object_data') == false) &&
            (stristr($table, 'gs_object_img') == false) &&
            (stristr($table, 'gs_rilogbook_data') == false) &&
            (stristr($table, 'gs_sms_gateway_app') == false) &&
            (stristr($table, 'gs_user_account_recover') == false) &&
            (stristr($table, 'gs_user_events_data') == false) &&
            (stristr($table, 'gs_user_events_status') == false) &&
            (stristr($table, 'gs_user_failed_logins') == false) &&
            (stristr($table, 'gs_user_reports_generated') == false) &&
            (stristr($table, 'gs_user_usage') == false)
        ) {
            $return .= "\n";

            $r = mysqli_query($ms, 'SELECT * FROM ' . $table);
            $num_fields = mysqli_num_fields($r);

            for ($i = 0; $i < $num_fields; $i++) {
                while ($row = mysqli_fetch_row($r)) {
                    $return .= 'INSERT INTO ' . $table . ' VALUES(';
                    for ($j = 0; $j < $num_fields; $j++) {
                        $row[$j] = addslashes($row[$j]);
                        if (isset($row[$j])) {
                            $return .= '"' . $row[$j] . '"';
                        } else {
                            $return .= '""';
                        }
                        if ($j < ($num_fields - 1)) {
                            $return .= ',';
                        }
                    }
                    $return .= ");\n";
                }
            }
        }
        $return .= "\n";
    }

    //save file
    $file = 'database_backup.sql';

    //send file via email
    $template = getDefaultTemplate('database_backup', 'english');

    $subject = $template['subject'];
    $message = $template['message'];

    $subject = str_replace("%SERVER_NAME%", $gsValues['NAME'], $subject);
    $subject = str_replace("%URL_SHOP%", $gsValues['URL_SHOP'], $subject);

    $message = str_replace("%SERVER_NAME%", $gsValues['NAME'], $message);
    $message = str_replace("%URL_SHOP%", $gsValues['URL_SHOP'], $message);

    if (sendEmail($email, $subject, $message, false, $file, $return)) {
        $q = "SELECT * FROM `gs_system` WHERE `key`='DB_BACKUP_TIME_LAST'";
        $r = mysqli_query($ms, $q);
        $row = mysqli_fetch_array($r);

        if ($row) {
            $q = "UPDATE gs_system SET `value`='" . gmdate("Y-m-d H:i:s") . "' WHERE `key`='DB_BACKUP_TIME_LAST'";
            $r = mysqli_query($ms, $q);
        } else {
            $q = "INSERT INTO `gs_system`(`key`,`value`) VALUES ('DB_BACKUP_TIME_LAST', '" . gmdate("Y-m-d H:i:s") . "')";
            $r = mysqli_query($ms, $q);
        }
    }
}

// service 12h
function serviceServerCleanup()
{
    global $ms, $gsValues;

    if ($gsValues['SERVER_CLEANUP_USERS_AE'] == "true") {
        $days = $gsValues['SERVER_CLEANUP_USERS_DAYS'];
        $result = serverCleanupUsers($days);
    }

    if ($gsValues['SERVER_CLEANUP_OBJECTS_NOT_ACTIVATED_AE'] == "true") {
        $days = $gsValues['SERVER_CLEANUP_OBJECTS_NOT_ACTIVATED_DAYS'];
        $result = serverCleanupObjectsNotActivated($days);
    }

    if ($gsValues['SERVER_CLEANUP_OBJECTS_NOT_USED_AE'] == "true") {
        $result = serverCleanupObjectsNotUsed();
    }

    if ($gsValues['SERVER_CLEANUP_DB_JUNK_AE'] == "true") {
        $result = serverCleanupDbJunk();
    }
}

// service 1h
function serviceCheckAccountDateLimit()
{
    global $ms, $gsValues, $la;

    // deactivate expired accounts
    $q = "UPDATE gs_users SET `active`='false' WHERE account_expire ='true' AND account_expire_dt <= UTC_DATE()";
    $r = mysqli_query($ms, $q);

    // remind about object expiry
    if ($gsValues['NOTIFY_ACCOUNT_EXPIRE'] == 'true') {
        $q = "SELECT * FROM `gs_users`";
        $r = mysqli_query($ms, $q);

        while ($ud = mysqli_fetch_array($r)) {
            $user_id = $ud["id"];
            $account_expire = $ud["account_expire"];
            $account_expire_dt = $ud["account_expire_dt"];
            $email = $ud["email"];
            $notify_account_expire = $ud['notify_account_expire'];

            if ($account_expire == 'true') {
                $notify = false;

                $diff = strtotime($account_expire_dt) - strtotime(gmdate("Y-m-d"));
                $days = $diff / 86400;

                if ($days <= $gsValues['NOTIFY_ACCOUNT_EXPIRE_PERIOD']) {
                    $notify = true;
                }

                if ($notify == true) {
                    if ($notify_account_expire != 'true') {
                        $template = getDefaultTemplate('expiring_account', $ud["language"]);

                        $subject = $template['subject'];
                        $message = $template['message'];

                        $subject = str_replace("%SERVER_NAME%", $gsValues['NAME'], $subject);
                        $subject = str_replace("%URL_SHOP%", $gsValues['URL_SHOP'], $subject);

                        $message = str_replace("%SERVER_NAME%", $gsValues['NAME'], $message);
                        $message = str_replace("%URL_SHOP%", $gsValues['URL_SHOP'], $message);

                        if (sendEmail($email, $subject, $message)) {
                            $q4 = "UPDATE gs_users SET `notify_account_expire`='true' WHERE `id`='" . $user_id . "'";
                            $r4 = mysqli_query($ms, $q4);
                        }
                    }
                } else {
                    $q4 = "UPDATE gs_users SET `notify_account_expire`='false' WHERE `id`='" . $user_id . "'";
                    $r4 = mysqli_query($ms, $q4);
                }
            }
        }
    }
}

function serviceCheckObjectDateLimit()
{
    global $ms, $gsValues, $la;

    // deactivate expired objects
    $q = "UPDATE gs_objects SET `active`='false' WHERE `active`='true' AND `object_expire`='true' AND object_expire_dt <= UTC_DATE()";
    $r = mysqli_query($ms, $q);

    // remind about object expiry
    if ($gsValues['NOTIFY_OBJ_EXPIRE'] == 'true') {
        $q = "SELECT * FROM `gs_users` WHERE `privileges` NOT LIKE ('%subuser%')";
        $r = mysqli_query($ms, $q);

        while ($ud = mysqli_fetch_array($r)) {
            $notify = false;

            $user_id = $ud["id"];
            $email = $ud["email"];

            $q2 = "SELECT * FROM `gs_user_objects` WHERE `user_id`='" . $user_id . "'";
            $r2 = mysqli_query($ms, $q2);

            while ($row2 = mysqli_fetch_array($r2)) {
                $imei = $row2['imei'];

                $q3 = "SELECT * FROM `gs_objects` WHERE `imei`='" . $imei . "' AND `active`='true' AND `object_expire`='true'";
                $r3 = mysqli_query($ms, $q3);
                $row3 = mysqli_fetch_array($r3);

                $diff = strtotime($row3['object_expire_dt']) - strtotime(gmdate("Y-m-d"));
                $days = $diff / 86400;

                if ($days <= $gsValues['NOTIFY_OBJ_EXPIRE_PERIOD']) {
                    $notify = true;
                    break;
                }
            }

            if ($notify == true) {
                if ($ud['notify_object_expire'] != 'true') {
                    $template = getDefaultTemplate('expiring_objects', $ud["language"]);

                    $subject = $template['subject'];
                    $message = $template['message'];

                    $subject = str_replace("%SERVER_NAME%", $gsValues['NAME'], $subject);
                    $subject = str_replace("%URL_SHOP%", $gsValues['URL_SHOP'], $subject);

                    $message = str_replace("%SERVER_NAME%", $gsValues['NAME'], $message);
                    $message = str_replace("%URL_SHOP%", $gsValues['URL_SHOP'], $message);

                    if (sendEmail($email, $subject, $message)) {
                        $q4 = "UPDATE gs_users SET `notify_object_expire`='true' WHERE `id`='" . $user_id . "'";
                        $r4 = mysqli_query($ms, $q4);
                    }
                }
            } else {
                $q4 = "UPDATE gs_users SET `notify_object_expire`='false' WHERE `id`='" . $user_id . "'";
                $r4 = mysqli_query($ms, $q4);
            }
        }
    }
}

function serviceClearHistory()
{
    global $ms, $gsValues;

    if (!isset($gsValues['HISTORY_PERIOD'])) {
        die;
    }

    if ($gsValues['HISTORY_PERIOD'] < 30) {
        die;
    }

    $q = "SELECT * FROM `gs_objects` ORDER BY `imei` ASC";
    $r = mysqli_query($ms, $q);

    while ($row = mysqli_fetch_array($r)) {
        $q2 = "DELETE FROM `gs_object_data_" . $row['imei'] . "` WHERE dt_tracker < DATE_SUB(UTC_DATE(), INTERVAL " . $gsValues['HISTORY_PERIOD'] . " DAY)";
        $r2 = mysqli_query($ms, $q2);
    }
}

function serviceClearVarious()
{
    global $ms, $gsValues;

    if (!isset($gsValues['HISTORY_PERIOD'])) {
        die;
    }

    if ($gsValues['HISTORY_PERIOD'] < 30) {
        die;
    }

    $q = "DELETE FROM `gs_user_failed_logins` WHERE dt_login < DATE_SUB(UTC_DATE(), INTERVAL 1 DAY)";
    $r = mysqli_query($ms, $q);

    $q = "DELETE FROM `gs_user_account_recover` WHERE dt_recover < DATE_SUB(UTC_DATE(), INTERVAL 1 DAY)";
    $r = mysqli_query($ms, $q);

    $q = "DELETE FROM `gs_user_usage` WHERE dt_usage < DATE_SUB(UTC_DATE(), INTERVAL 7 DAY)";
    $r = mysqli_query($ms, $q);

    $q = "DELETE FROM `gs_object_cmd_exec` WHERE dt_cmd < DATE_SUB(UTC_DATE(), INTERVAL 1 DAY)";
    $r = mysqli_query($ms, $q);

    $q = "DELETE FROM `gs_sms_gateway_app` WHERE dt_sms < DATE_SUB(UTC_DATE(), INTERVAL 1 DAY)";
    $r = mysqli_query($ms, $q);

    $q = "SELECT * FROM `gs_user_reports_generated` WHERE dt_report < DATE_SUB(UTC_DATE(), INTERVAL 30 DAY)";
    $r = mysqli_query($ms, $q);

    while ($row = mysqli_fetch_array($r)) {
        $q2 = "DELETE FROM `gs_user_reports_generated` WHERE `report_id`='" . $row['report_id'] . "'";
        $r2 = mysqli_query($ms, $q2);

        $report_file = $gsValues['PATH_ROOT'] . 'data/user/reports/' . $row['report_file'];
        if (is_file($report_file)) {
            @unlink($report_file);
        }
    }

    $q = "DELETE FROM `gs_user_events_data` WHERE dt_tracker < DATE_SUB(UTC_DATE(), INTERVAL " . $gsValues['HISTORY_PERIOD'] . " DAY)";
    $r = mysqli_query($ms, $q);

    $q = "DELETE FROM `gs_rilogbook_data` WHERE dt_tracker < DATE_SUB(UTC_DATE(), INTERVAL " . $gsValues['HISTORY_PERIOD'] . " DAY)";
    $r = mysqli_query($ms, $q);

    $q = "DELETE FROM `gs_dtc_data` WHERE dt_tracker < DATE_SUB(UTC_DATE(), INTERVAL " . $gsValues['HISTORY_PERIOD'] . " DAY)";
    $r = mysqli_query($ms, $q);

    $q = "SELECT * FROM `gs_object_img` WHERE dt_tracker < DATE_SUB(UTC_DATE(), INTERVAL " . $gsValues['HISTORY_PERIOD'] . " DAY)";
    $r = mysqli_query($ms, $q);

    while ($row = mysqli_fetch_array($r)) {
        $q2 = "DELETE FROM `gs_object_img` WHERE `img_id`='" . $row['img_id'] . "'";
        $r2 = mysqli_query($ms, $q2);

        $img_file = $gsValues['PATH_ROOT'] . 'data/img/' . $row['img_file'];
        if (is_file($img_file)) {
            @unlink($img_file);
        }
    }

    $q = "SELECT * FROM `gs_object_chat` WHERE dt_server < DATE_SUB(UTC_DATE(), INTERVAL " . $gsValues['HISTORY_PERIOD'] . " DAY)";
    $r = mysqli_query($ms, $q);
}

function serviceSendReportWeekly()
{
    global $ms, $gsValues;

    // get weekly reports
    $q = "SELECT * FROM `gs_user_reports` WHERE schedule_period LIKE '%w%' AND dt_schedule_w < DATE_SUB(UTC_DATE(), INTERVAL 6 DAY)";
    $r = mysqli_query($ms, $q);

    if (!$r) {
        die;
    }

    $reports = array();

    while ($report = mysqli_fetch_array($r)) {
        // check if user day passed depending on set timezone
        $dt = convUserIDTimezone($report['user_id'], gmdate("Y-m-d H:i:s"));
        if (strtotime($dt) < strtotime(gmdate('Y-m-d'))) {
            //				continue;
        }

        $previous_week = strtotime("-1 week +1 day");

        // get prev week monday
        $start_week = strtotime("last monday", $previous_week);

        // get next week monday
        $end_week = strtotime("next monday", $start_week);

        $report['dtf'] = gmdate("Y-m-d", $start_week) . ' 00:00:00';
        $report['dtt'] = gmdate("Y-m-d", $end_week) . ' 00:00:00';

        $dt_schedule_w = gmdate('Y-m-d', strtotime('monday')) . ' 00:00:00';

        $q2 = 'UPDATE gs_user_reports SET `dt_schedule_w` = "' . $dt_schedule_w . '" WHERE report_id="' . $report['report_id'] . '"';
        $r2 = mysqli_query($ms, $q2);

        if ($r2) {
            $reports[] = $report;
        }

        // generate 5 reports at once
        if (count($reports) > 4) {
            if ($gsValues['CURL'] == true) {
                serviceSendReportsCURL($reports);
            } else {
                serviceSendReports($reports);
            }

            // reset previous reports
            $reports = array();
        }
    }

    // generate left reports
    if (count($reports) > 0) {
        if ($gsValues['CURL'] == true) {
            serviceSendReportsCURL($reports);
        } else {
            serviceSendReports($reports);
        }

        // reset previous reports
        $reports = array();
    }
}


function serviceSendReportMonthly()
{
    global $ms, $gsValues;

    $q3 = "UPDATE gs_user_reports SET `dt_schedule_m` = (select adddate(last_day(curdate()), 1)) WHERE schedule_period LIKE '%m%';";
    $r3 = mysqli_query($ms, $q3);

    // get weekly reports
    $q = "SELECT * FROM gpsimple.gs_user_reports WHERE schedule_period LIKE '%m%' AND (select adddate(last_day(curdate()), 1)) = curdate()";
    $r = mysqli_query($ms, $q);

    if (!$r) {
        die;
    }

    $reports = array();

    while ($report = mysqli_fetch_array($r)) {
        // check if user day passed depending on set timezone
        $dt = convUserIDTimezone($report['user_id'], gmdate("Y-m-d H:i:s"));
        if (strtotime($dt) < strtotime(gmdate('Y-m-d'))) {
            //				continue;
        }

        $previous_week = strtotime("1 MONTH");

        // get prev week monday
        $start_week = strtotime("-2 month", $previous_week);

        // get next week monday
        $end_week = strtotime("next month", $start_week);

        $report['dtf'] = gmdate("Y-m-d", $start_week) . ' 00:00:00';
        $report['dtt'] = gmdate("Y-m-d", $end_week) . ' 00:00:00';

        $dt_schedule_m = gmdate('Y-m-d', strtotime('next month')) . ' 00:00:00';

        $q2 = 'UPDATE gs_user_reports SET `dt_schedule_m` = (select adddate(last_day(curdate()), 1)) WHERE report_id="' . $report['report_id'] . '"';
        $r2 = mysqli_query($ms, $q2);

        if ($r2) {
            $reports[] = $report;
        }

        // generate 5 reports at once
        if (count($reports) > 4) {
            if ($gsValues['CURL'] == true) {
                serviceSendReportsCURL($reports);
            } else {
                serviceSendReports($reports);
            }

            // reset previous reports
            $reports = array();
        }
    }

    // generate left reports
    if (count($reports) > 0) {
        if ($gsValues['CURL'] == true) {
            serviceSendReportsCURL($reports);
        } else {
            serviceSendReports($reports);
        }

        // reset previous reports
        $reports = array();
    }
}







function serviceSendReportDaily()
{
    global $ms, $gsValues;
    //var_dump($ms);
    // get daily reports
    $q = "SELECT * FROM `gs_user_reports` WHERE schedule_period LIKE '%d%' AND dt_schedule_d < UTC_DATE()";

    $r = mysqli_query($ms, $q);

    if (!$r) {
        die;
    }

    $reports = array();
    //var_dump($reports);
    while ($report = mysqli_fetch_array($r)) {
        //var_dump($report);
        // check if user day passed depending on set timezone
        $dt = convUserIDTimezone($report['user_id'], gmdate("Y-m-d H:i:s"));
        //echo ($dt);
        if (strtotime($dt) < strtotime(gmdate('Y-m-d'))) {
            //			echo "termino";
            //				continue;
        }
        //echo "paso";
        $report['dtf'] = gmdate('Y-m-d', strtotime("-1 days")) . ' 00:00:00'; // yesterday
        $report['dtt'] = gmdate('Y-m-d') . ' 00:00:00'; // today

        $dt_schedule_d = gmdate("Y-m-d H:i:s");

        $q2 = 'UPDATE gs_user_reports SET `dt_schedule_d` = "' . $dt_schedule_d . '" WHERE report_id="' . $report['report_id'] . '"';
        //echo ($q2);
        $r2 = mysqli_query($ms, $q2);
        //	var_dump($r2);
        if ($r2) {
            $reports[] = $report;
        }

        // generate 5 reports at once
        if (count($reports) > 4) {
            if ($gsValues['CURL'] == true) {
                serviceSendReportsCURL($reports);
            } else {
                serviceSendReports($reports);
                //echo "entra";
            }

            // reset previous reports
            $reports = array();
        }
    }

    // generate left reports
    if (count($reports) > 0) {
        if ($gsValues['CURL'] == true) {
            serviceSendReportsCURL($reports);
        } else {
            //echo "entra";
            serviceSendReports($reports);
        }

        // reset previous reports
        $reports = array();
    }
}

 //Rerporte diario por horas.
 function serviceSendReportDailyH()
 {

     var_dump("HORAS");
     global $ms, $gsValues;
     //var_dump($ms);
     // get daily reports
     $q = "SELECT * FROM `gs_user_reports` WHERE schedule_period LIKE '%h%'";
     // var_dump($q);
     $r = mysqli_query($ms, $q);

     if (!$r) {
         die;
     }

     $reports = array();

     // var_dump(mysqli_fetch_array($r));
     while ($report = mysqli_fetch_array($r)) {

         $dt_schedule_d = gmdate("Y-m-d H:i:s");


         $horactual =  gmdate("H");
         $horaenvio = $report['fecha_envio'];
        //  $horaenvio = strtotime ($horaenvio);
        //  $horaenvio   = $horaenvio + 4;
        $horaenvio = gmdate("H:i:s",strtotime("+".$horaenvio." hour",0));
        //$horaenvio = gmdate("H:i:s",$horaenvio, 0);

        //  $horaenvio   = strtotime ( "+4 hour" , $horaenvio);
         $NuevaFecha = strtotime ( '+3 hour' , strtotime ($horaenvio) ) ;
         $horaenvio = date ( 'H' , $NuevaFecha);  
        //  $horaenvio = gmdate("H",$horaenvio);

         var_dump($horactual);
         var_dump($horaenvio);

         if($horactual==$horaenvio){
            var_dump("soy igual");   

              
             $q2 = 'UPDATE gs_user_reports SET `dt_schedule_d` = "'.$dt_schedule_d.'" WHERE report_id="'.$report['report_id'].'"';
             //echo ($q2);
             $r2 = mysqli_query($ms, $q2);
          
             $reports[] = $report;
         } 
      }

       //    generate left reports
       if (count($reports) > 0) {
            if ($gsValues['CURL'] == true) {
                var_dump("hola curl");
                serviceSendReportsCURL($reports);
            } else {
                var_dump("hola normal k");
                serviceSendReports($reports);
            }

        //  reset previous reports
            $reports = array();
        }

 }


function serviceSendReports($reports)
{

     
    global $ms, $gsValues;

    //$url = $gsValues['URL_ROOT'].'/func/fn_reports.gen.php';
    $url = 'http://10.128.0.11:8080/track/func/fn_reports.gen.php';
    $reports_count = count($reports);
    for ($i = 0; $i < $reports_count; $i++) {
        // var_dump("dentro de for");
        var_dump($reports[$i]['cantidad_horas']);
        var_dump($reports[$i]['fecha_envio']);
        $postdata = http_build_query(
            array(
                            'cmd' => 'report',
                            'schedule' => true,
                            'user_id' => $reports[$i]['user_id'],
                            'email' => $reports[$i]['schedule_email_address'],
                            'name' => $reports[$i]['name'],
                            'type' => $reports[$i]['type'],
                            'format' => $reports[$i]['format'],
                            'show_coordinates' => $reports[$i]['show_coordinates'],
                            'show_addresses' => $reports[$i]['show_addresses'],
                            'zones_addresses' => $reports[$i]['zones_addresses'],
                            'stop_duration' => $reports[$i]['stop_duration'],
                            'speed_limit' => $reports[$i]['speed_limit'],
                            'imei' => $reports[$i]['imei'],
                            'zone_ids' => $reports[$i]['zone_ids'],
                            'sensor_names' => $reports[$i]['sensor_names'],
                            'data_items' => $reports[$i]['data_items'],
                            'dtf' => $reports[$i]['dtf'],
                            'dtt' => $reports[$i]['dtt'],
                            'menor_a' => $reports[$i]['menor_a'],
                            'mayor_a' => $reports[$i]['mayor_a'],
                            'cantidad_horas' => $reports[$i]['cantidad_horas'],
                            'fecha_envio' => $reports[$i]['fecha_envio']
                        )
        );

        $opts = array('http' =>
                array(
                    'method'  => 'POST',
                    'header'  => 'Content-type: application/x-www-form-urlencoded',
                    'content' => $postdata
                )
        );

        $context  = stream_context_create($opts);

        $result = file_get_contents($url, false, $context);

        var_dump($result);

        $result = null;
        unset($result);
    }
}
// function serviceSendReports($reports)
// {
//     global $ms, $gsValues;

//     //$url = $gsValues['URL_ROOT'].'/func/fn_reports.gen.php';
//     $url = 'http://10.128.0.11:8080/track/func/fn_reports.gen.php';
//     $reports_count = count($reports);
//     for ($i = 0; $i < $reports_count; $i++) {
//         $postdata = http_build_query(
//             array(
//                 'cmd' => 'report',
//                 'schedule' => true,
//                 'user_id' => $reports[$i]['user_id'],
//                 'email' => $reports[$i]['schedule_email_address'],
//                 'name' => $reports[$i]['name'],
//                 'type' => $reports[$i]['type'],
//                 'format' => $reports[$i]['format'],
//                 'show_coordinates' => $reports[$i]['show_coordinates'],
//                 'show_addresses' => $reports[$i]['show_addresses'],
//                 'zones_addresses' => $reports[$i]['zones_addresses'],
//                 'stop_duration' => $reports[$i]['stop_duration'],
//                 'speed_limit' => $reports[$i]['speed_limit'],
//                 'imei' => $reports[$i]['imei'],
//                 'zone_ids' => $reports[$i]['zone_ids'],
//                 'sensor_names' => $reports[$i]['sensor_names'],
//                 'data_items' => $reports[$i]['data_items'],
//                 'dtf' => $reports[$i]['dtf'],
//                 'dtt' => $reports[$i]['dtt']
//             )
//         );

//         $opts = array(
//             'http' =>
//             array(
//                 'method'  => 'POST',
//                 'header'  => 'Content-type: application/x-www-form-urlencoded',
//                 'content' => $postdata
//             )
//         );

//         $context  = stream_context_create($opts);

//         $result = file_get_contents($url, false, $context);

//         $result = null;
//         unset($result);
//     }
// }

function serviceSendReportsCURL($reports)
{
    global $ms, $gsValues;

    //$url = $gsValues['URL_ROOT'].'/func/fn_reports.gen.php';
    $url = 'http://10.128.0.11:8080/track/func/fn_reports.gen.php';

    $reports_count = count($reports);

    $curl_arr = array();
    $master = curl_multi_init();

    for ($i = 0; $i < $reports_count; $i++) {
        $postdata = http_build_query(
            array(
                'cmd' => 'report',
                'schedule' => true,
                'user_id' => $reports[$i]['user_id'],
                'email' => $reports[$i]['schedule_email_address'],
                'name' => $reports[$i]['name'],
                'type' => $reports[$i]['type'],
                'format' => $reports[$i]['format'],
                'show_coordinates' => $reports[$i]['show_coordinates'],
                'show_addresses' => $reports[$i]['show_addresses'],
                'zones_addresses' => $reports[$i]['zones_addresses'],
                'stop_duration' => $reports[$i]['stop_duration'],
                'speed_limit' => $reports[$i]['speed_limit'],
                'imei' => $reports[$i]['imei'],
                'zone_ids' => $reports[$i]['zone_ids'],
                'sensor_names' => $reports[$i]['sensor_names'],
                'data_items' => $reports[$i]['data_items'],
                'dtf' => $reports[$i]['dtf'],
                'dtt' => $reports[$i]['dtt'],
                'cantidad_horas' => $reports[$i]['cantidad_horas'],
                'fecha_envio' => $reports[$i]['fecha_envio']
            )
        );

        $curl_arr[$i] = curl_init($url);
        curl_setopt($curl_arr[$i], CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_arr[$i], CURLOPT_POST, 1);
        curl_setopt($curl_arr[$i], CURLOPT_POSTFIELDS, $postdata);
        curl_multi_add_handle($master, $curl_arr[$i]);
    }

    do {
        curl_multi_exec($master, $running);
    } while ($running > 0);

    for ($i = 0; $i < $reports_count; $i++) {
        $result = curl_multi_getcontent($curl_arr[$i]);
    }

    unset($curl_arr);
}

// service 5min
function serviceCMDSchedule()
{
    global $ms;

    $q = "SELECT * FROM `gs_user_cmd_schedule`";
    $r = mysqli_query($ms, $q);

    while ($row = mysqli_fetch_array($r)) {
        if ($row['active'] == 'true') {
            if ($row['exact_time'] == 'true') {
                $curr_dt = convUserIDTimezone($row['user_id'], gmdate("Y-m-d H:i:s"));

                if ((strtotime($row['dt_schedule_e']) < strtotime($row['exact_time_dt'])) && (strtotime($row['exact_time_dt']) <= strtotime($curr_dt))) {
                    $imeis = explode(",", $row['imei']);

                    for ($i = 0; $i < count($imeis); ++$i) {
                        $imei = $imeis[$i];

                        if ($row['gateway'] == 'gprs') {
                            sendObjectGPRSCommand($row['user_id'], $imei, $row['name'], $row['type'], $row['cmd']);
                        } elseif ($row['gateway'] == 'sms') {
                            sendObjectSMSCommand($row['user_id'], $imei, $row['name'], $row['cmd']);
                        }
                    }

                    $q2 = 'UPDATE gs_user_cmd_schedule SET `dt_schedule_e` = "' . $curr_dt . '" WHERE cmd_id="' . $row['cmd_id'] . '"';
                    $r2 = mysqli_query($ms, $q2);
                }
            } else {
                $curr_dt = convUserIDTimezone($row['user_id'], gmdate("Y-m-d H:i:s"));

                $day_of_week = gmdate('w', strtotime($curr_dt));
                $day_time = json_decode($row['day_time'], true);

                if ($day_time != null) {
                    if (($day_time['sun'] == true) && ($day_of_week == 0)) {
                        $time = $day_time['sun_time'];
                    } elseif (($day_time['mon'] == true) && ($day_of_week == 1)) {
                        $time = $day_time['mon_time'];
                    } elseif (($day_time['tue'] == true) && ($day_of_week == 2)) {
                        $time = $day_time['tue_time'];
                    } elseif (($day_time['wed'] == true) && ($day_of_week == 3)) {
                        $time = $day_time['wed_time'];
                    } elseif (($day_time['thu'] == true) && ($day_of_week == 4)) {
                        $time = $day_time['thu_time'];
                    } elseif (($day_time['fri'] == true) && ($day_of_week == 5)) {
                        $time = $day_time['fri_time'];
                    } elseif (($day_time['sat'] == true) && ($day_of_week == 6)) {
                        $time = $day_time['sat_time'];
                    } else {
                        //							continue;
                    }

                    if (isset($time)) {
                        if ((strtotime($row['dt_schedule_d']) == '') || ((gmdate('w', strtotime($row['dt_schedule_d'])) != gmdate('w', strtotime($curr_dt))))) {
                            $time = strtotime($time);
                            $curr_time = strtotime(date("H:i", strtotime($curr_dt)));

                            if ($time <= $curr_time) {
                                $imeis = explode(",", $row['imei']);

                                for ($i = 0; $i < count($imeis); ++$i) {
                                    $imei = $imeis[$i];

                                    if ($row['gateway'] == 'gprs') {
                                        sendObjectGPRSCommand($row['user_id'], $imei, $row['name'], $row['type'], $row['cmd']);
                                    } elseif ($row['gateway'] == 'sms') {
                                        sendObjectSMSCommand($row['user_id'], $imei, $row['name'], $row['cmd']);
                                    }
                                }

                                $q2 = 'UPDATE gs_user_cmd_schedule SET `dt_schedule_d` = "' . $curr_dt . '" WHERE cmd_id="' . $row['cmd_id'] . '"';
                                $r2 = mysqli_query($ms, $q2);
                            }
                        }
                    }
                }
            }
        }
    }
}

function serviceEventService()
{
    global $ms;
    var_dump('entra');
    $q = "SELECT * FROM `gs_user_events` WHERE `type`='service'";
    $r = mysqli_query($ms, $q);

    while ($ed = mysqli_fetch_array($r)) {
        
        if ($ed['active'] == 'true') {
            // get user data
            $q2 = "SELECT * FROM `gs_users` WHERE `id`='" . $ed['user_id'] . "'";
            $r2 = mysqli_query($ms, $q2);
            $ud = mysqli_fetch_array($r2);

            // get object details
            $q2 = "SELECT gs_objects.*, gs_user_objects.*
					FROM gs_objects
					INNER JOIN gs_user_objects ON gs_objects.imei = gs_user_objects.imei
					WHERE gs_user_objects.user_id='" . $ed['user_id'] . "'";
            $r2 = mysqli_query($ms, $q2);

            $imeis = explode(",", $ed['imei']);

            while ($od = mysqli_fetch_array($r2)) {
                
                if (!in_array($od['imei'], $imeis)) {
                     continue; 
                }

                $q3 = "SELECT * FROM `gs_object_services` WHERE `imei`='" . $od['imei'] . "'";
                $r3 = mysqli_query($ms, $q3);

                while ($sd = mysqli_fetch_array($r3)) {
                   
                    $event = false;

                    // check if odo is expired
                    if (($sd['odo'] == 'true') && ($sd['odo_left'] == 'true')) {
                       
                        $odometer = getObjectOdometer($od['imei']);

                        $odo_diff = $odometer - $sd['odo_last'];
                        $odo_diff = $sd['odo_interval'] - $odo_diff;

                        if ($odo_diff <= $sd['odo_left_num']) {
                          
                            $event = true;

                            if ($sd['update_last'] == 'true') {
                                $q4 = "UPDATE gs_object_services SET `odo_last` = odo_last + " . $sd['odo_interval'] . " WHERE `service_id`='" . $sd['service_id'] . "'";
                                $r4 = mysqli_query($ms, $q4);
                            }
                        }
                    }

                    // check if engh is expired
                    if (($sd['engh'] == 'true') && ($sd['engh_left'] == 'true')) {
                        $engine_hours = getObjectEngineHours($od['imei'], false);

                        $engh_diff = $engine_hours - $sd['engh_last'];
                        $engh_diff = $sd['engh_interval'] - $engh_diff;

                        if ($engh_diff <= $sd['engh_left_num']) {
                            $event = true;

                            if ($sd['update_last'] == 'true') {
                                $q4 = "UPDATE gs_object_services SET `engh_last` = engh_last + " . $sd['engh_interval'] . " WHERE `service_id`='" . $sd['service_id'] . "'";
                                $r4 = mysqli_query($ms, $q4);
                            }
                        }
                    }

                    // check if days are expired
                    if (($sd['days'] == 'true') && ($sd['days_left'] == 'true')) {
                        $days_diff = strtotime(gmdate("Y-m-d")) - (strtotime($sd['days_last']));
                        $days_diff = floor($days_diff / 3600 / 24);
                        $days_diff = $sd['days_interval'] - $days_diff;

                        if ($days_diff <= $sd['days_left_num']) {
                            $event = true;

                            if ($sd['update_last'] == 'true') {
                                $days_last = gmdate('Y-m-d', strtotime($sd['days_last'] . ' + ' . $sd['days_interval'] . ' days'));

                                $q4 = "UPDATE gs_object_services SET `days_last` = '" . $days_last . "' WHERE `service_id`='" . $sd['service_id'] . "'";
                                $r4 = mysqli_query($ms, $q4);
                            }
                        }
                    }

                    if ($event == true) {
                        //var_dump('entra a event');
                        
                        if (($sd['notify_service_expire'] != 'true') || ($sd['update_last'] == 'true')) {
                            var_dump($od['imei']);
                            var_dump('entra a if');
                            if ($sd['update_last'] != 'true') {
                                $q4 = "UPDATE gs_object_services SET `notify_service_expire` = 'true' WHERE `service_id`='" . $sd['service_id'] . "'";
                                $r4 = mysqli_query($ms, $q4);
                            }
                            //var_dump('pasa a if');
                            // get object last location
                            $q4 = "SELECT * FROM `gs_objects` WHERE `imei`='" . $od['imei'] . "'";
                            $r4 = mysqli_query($ms, $q4);
                            $loc = mysqli_fetch_array($r4);

                            // set dt_server and dt_tracker to show exact time
                            $loc['dt_server'] = gmdate("Y-m-d H:i:s");
                            $loc['dt_tracker'] = $loc['dt_server'];

                            $loc['params'] = json_decode($loc['params'], true);

                            // add event desc to event data array
                            $ed['event_desc'] = $sd['name'];
                            // var_dump('Aqui va ED');
                            // var_dump($ed);
                            //  var_dump('Aqui va UD');
                            //  var_dump($ud);
                            //  var_dump('Aqui va OD');
                            //  var_dump($od);
                            //  var_dump('Aqui va LOC');
                            //  var_dump($loc);
                           event_notify($ed, $ud, $od, $loc);
                        }
                    } else {
                        $q4 = "UPDATE gs_object_services SET `notify_service_expire` = 'false' WHERE `service_id`='" . $sd['service_id'] . "'";
                        $r4 = mysqli_query($ms, $q4);
                    }
                }
            }
        }
    }
}

// service 1 minute
function serviceClearCounters()
{
    global $ms;

    $q = "SELECT * FROM `gs_users` WHERE dt_usage_d < UTC_DATE()";
    $r = mysqli_query($ms, $q);

    while ($row = mysqli_fetch_array($r)) {
        $user_id = $row['id'];

        $q2 = "UPDATE gs_users SET 	usage_email_daily_cnt=0,
							usage_sms_daily_cnt=0,
							usage_api_daily_cnt=0,
							`dt_usage_d`='" . gmdate("Y-m-d") . "'
							WHERE id='" . $user_id . "'";
        $r2 = mysqli_query($ms, $q2);

        $q2 = "INSERT INTO `gs_user_usage`(`user_id`,
							`dt_usage`,
							`login`,
							`email`,
							`sms`,
							`api`)
							VALUES
							('" . $user_id . "',
							'" . gmdate("Y-m-d") . "',
							'0',
							'0',
							'0',
							'0')";
        $r2 = mysqli_query($ms, $q2);
    }
}
function servicioNotificacionMovil()
{

    $geocercas = llamarSPGeocercas();
    $notiGeo = filtrarGeocercas($geocercas);
    enviarNotificaciones($notiGeo);
    guardarNotificaciones($notiGeo);

    $notiVel = llamarSPVelocidad();
    enviarNotificaciones($notiVel);
    guardarNotificaciones($notiVel);
}

function conexion()
{
    $host = '10.118.144.7';
    $port = 3306;
    $socket = '';
    $user = 'oficina';
    $password = 'Stech@101225..,';
    $dbname = 'gpsimple';

    $conn = mysqli_connect($host, $user, $password, $dbname, $port, $socket)
        or die('Could not connect to the database server ' . mysqli_connect_error());

    return $conn;
}

function llamarSPVelocidad()
{
    $array=null;
    $conn = conexion();
    $query = "CALL appv2_servicio_alertas_velocidad";
    $result = mysqli_query($conn, $query);
    while ($row = $result->fetch_assoc()) {
        $idUsuario = $row['id_usuario'];
        $imei = $row['imei'];
        $patente = $row['plate_number'];
        $velocidad = $row['speed'];
        $titulo = "Alerta velocidad: vehículo " . strtoupper($patente);
        $array = array(
            'id_usuario' => $idUsuario,
            'imei' => $imei,
            'patente' => $patente,
            'velocidad' => $velocidad,
            'tipo' => 'alerta_velocidad',
            'titulo' => $titulo,
            'cuerpo' => 'El vehículo se encuentra en movimiento a ' . $velocidad . 'km/h',
        );
    }
    return $array;
}

/**
 * Llama a todas las geocercas activas creadas en la aplicacacion, y sus correspondientes marcadores.
 */
function llamarSPGeocercas()
{
    $conn = conexion();
    $query = "CALL appv2_servicio_geocercas"; //query que llama a geocercas activas
    $result = mysqli_query($conn, $query);
    while ($row = $result->fetch_assoc()) {
        $array[] = $row; //Datos Guardados en array
    }

    return $array;
}

/**
 * Recorre las geocercas, compara las coordenadas del GPS con las del centro del geocerca y devuelve los que hayan salido del radio de 50mts(0.00045045)
 * @param    array $array El array de vehiculos a los que se envia la notificacion, 
 * @return   array $arrayNoti Vehiculos que salieron del radio de 50mts del geocerca
 */
function filtrarGeocercas($geocercas)
{
    $notificaciones = array();
    foreach ($geocercas as $row) {
        $imei = $row['imei'];
        $patente = $row['plate_number'];
        //Se separan la latitud y longitud del geocerca, separadas por una ",(coma)" en la BD.
        $geocerca = explode(",", $row['zone_vertices']);
        //lat y lng del centro de la geocerca
        $latGeocerca = (float) $geocerca[0];
        $lngGeocerca = (float) $geocerca[1];
        //lat y lng del Vehiculo(GPS)
        $latGps = (float) $row['lat'];
        $lngGps = (float) $row['lng'];
        //diferencia entre lat y lng de geocerca y gps, transformada a valor absoluta para eliminar negativos 
        $latDiferencia = abs($latGeocerca - $latGps);
        $lngDiferencia = abs($lngGeocerca - $lngGps);
        // echo ("IMEI y  Patente: " . $imei . " " . $patente . "</br>");
        // echo ("Coordenadas GPS(lat,lng): " . $latGps . " " . $lngGps . "</br>");
        // echo ("Diferencia LAT: " . $latDiferencia . "</br>");
        // echo ("Diferencia LNG: " . $lngDiferencia . "</br>");
        if ($latDiferencia >= 0.00045045 || $lngDiferencia >= 0.00045045) {
            $notificaciones[] = array(
                'id_usuario' => $row['user_id'],
                'imei' => $imei,
                'patente' => $patente,
                'velocidad' => $row['velocidad']||0,
                'tipo' => 'alerta_geocerca',
                'id_tipo' => $row['identificador_activacion'],
                'titulo' => "Alerta geocerca! Vehículo patente N° " . strtoupper($patente),
                'cuerpo' => 'El vehículo ha salido de la geocerca.',
            );
        }
    }
    return $notificaciones;
}

/**
 * Envia las notificaciones a los vehiculos que salieron del radio de su geocerca, 
 * 
 * Codigo requiere 'user_id', 'plate_number', 'imei', en las instancias del array
 * @param    array $alertas El array de vehiculos a los que se envia la notificacion, 
 * @param    string $tipo Tipo de notificacion que se va a enviar
 */
function enviarNotificaciones($alertas)
{
    if(empty($alertas)!=1){
        $url = 'https://fcm.googleapis.com/fcm/send';

        if (!defined("GOOGLE_API_KEY")) {
            //API KEY del servidor de Firebase de la cuenta de Google
            define("GOOGLE_API_KEY", "AAAA8bn4A8c:APA91bEvlO-JCh3Wg__ewLolKuJ-xIH4VA5gyeWlsGuYyrPZiNr4nGLaX5sxe3ivB02OBYcuAG6ZdFYwCua466BWsNeIY7DOwwV2GNR7DR0N87qQroL-F2_hdx3twfaD8ePEX3Ol8XTT");

        }
        
        //Envio de notificacion a Servidor Firebase
        $headers = array(
            'Authorization: key=' . GOOGLE_API_KEY,
            'Content-Type: application/json'
        );
        //CURL Codigo
        $ch = curl_init();
        //Se crea la consulta que se usara dentro del foreach para llamar a lost tokens de cada elemento del array $alertas
        $conn = conexion();
        $stmt = $conn->prepare("SELECT token FROM `gs_user_tokens` WHERE id_usuario=?");
        $stmt->bind_param("i", $idUsuario);
        $stmt->bind_result($token);
        
        foreach ($alertas as $row) {
            if(isset($row['id_usuario'])){
                $idUsuario = (int) $row['id_usuario'];
                $stmt->execute();
                $tokens = array(); //Se inicializa el array para resetearlo en cada ejecucion
                while ($stmt->fetch()) {
                    $tokens[] = $token;
                }
                $notificacion = array(
                    'registration_ids' => $tokens,
                    'priority' => 'high',
                    'data' => array('click_action' => "FLUTTER_NOTIFICATION_CLICK", "patente" => $row['patente'], "imei" => $row['imei'], "tipo" => $row['tipo']),
                    'notification' => array('body' => $row['cuerpo'], 'title' => $row['titulo'], 'vibrate' => 1, 'sound' => 1)
                );
                $fields = (array) $notificacion;

                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
                $result = curl_exec($ch);
                $tokens = null;
            }
        }
        curl_close($ch);//Cierre conexion CURL
    } 
}

/**
 * Se guarda el registro del envio de notificacion
 * 
 * 
 * @param    array $listaFilas El array de vehiculos a los que se envia la notificacion, 
 * @param   String $tipo de la notificacion enviada (EJ: bateria).
 */
function guardarNotificaciones($notificaciones)
{
    if(empty($notificaciones)!=1){
        $conn = conexion();
        $stmt = $conn->prepare("CALL appv2_servicio_notificacion(?, ?, ?, ?, ?)");
        $stmt->bind_param("sssis", $imei,  $tipo, $idTipo, $idUsuario, $titulo);
        foreach ($notificaciones as $row) {
            if(isset($row['id_usuario'])){
                $imei = $row['imei'];
                $tipo = $row['tipo'];
                $idTipo = $row['id_tipo'] ?? '0';
                $idUsuario = (int) $row['id_usuario'];
                $titulo = $row['titulo'];
                $stmt->execute();
            }
        }
    }
}


// service 1 minute : App Movil Seguimiento

function serviceEvents()
{
    global $ms;

    // get all imeis which sent data during last 24 hours
    $q = "SELECT * FROM `gs_objects` WHERE dt_server > DATE_SUB(UTC_DATE(), INTERVAL 1 DAY)";
    $r = mysqli_query($ms, $q);

    while ($loc = mysqli_fetch_array($r)) {
        $loc['params'] = json_decode($loc['params'], true);

        check_events($loc, false, false, true,false);
    }
}

function actualizarApagado()
{
    global $ms;
    $q = "SELECT * FROM gs_objects;";
    $stm = mysqli_query($ms, $q);

    while ($row = mysqli_fetch_array($stm)) {
        $dt_last_move = strtotime($row['dt_last_move']);
        $dt_last_stop = strtotime($row['dt_last_stop']);
        $diferencia = $dt_last_move - $dt_last_stop;
        if ($diferencia > 108000) {
            $q1 = "SELECT * FROM gs_object_data_" . $row['imei'] . " ORDER BY dt_server DESC LIMIT 1;";
            $stm1 = mysqli_query($ms, $q1);
            $row1 = mysqli_fetch_array($stm1);
            $parametros = json_decode($row1['params'], true);
            $parametros['acc'] = '0';
            $parametros['di5'] = '0';
            $params = json_encode($parametros);
            $q2 = "UPDATE gs_object_data_" . $row['imei'] . " SET speed = 0, dt_tracker = (date_add('" . $row1['dt_tracker'] . "',interval +1 second)), params = '" . $params . "' ORDER BY dt_server DESC LIMIT 1;";
            $stm2 = mysqli_query($ms, $q2);
            $q3 = "UPDATE gs_objects SET speed = 0, params = '" . $params . "' WHERE imei = '" . $row['imei'] . "';";
            $stm3 = mysqli_query($ms, $q3);
        }
    }
}