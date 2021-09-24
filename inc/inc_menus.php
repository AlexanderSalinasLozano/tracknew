<ul id="map_action_menu" class="menu">
    <li><a class="icon-street first-item" href="#" tag="street_view_new"><?php echo $la['STREET_VIEW_NEW_WINDOW'];?></a>
    </li>
    <li><a class="icon-marker" href="#" tag="show_point"><?php echo $la['SHOW_POINT'];?></a></li>
    <li><a class="icon-follow" href="#" tag="route_to_point"><?php echo $la['ROUTE_TO_POINT'];?></a></li>
    <li <?php if ($_SESSION["privileges"] == 'admin' || $_SESSION["privileges"] == 'super_admin') {
}else{
    echo  'style="visibility: hidden;"';
} ?>><a class="icon-zones" href="#" tag="add_zone"><?php echo $la['NEW_ZONE'];?></a></li>
    <li <?php if ($_SESSION["privileges"] != 'super_admin') {
    echo  'style="visibility: hidden;"';
} ?>><a class="icon-markers" href="#" tag="add_marker"><?php echo $la['NEW_MARKER'];?></a></li>
    <li <?php if ($_SESSION["privileges"] != 'super_admin') {
    echo  'style="visibility: hidden;"';
} ?>><a class="icon-routes" href="#" tag="add_route"><?php echo $la['NEW_ROUTE'];?></a></li>
</ul>

<ul id="side_panel_objects_action_menu" class="menu">
    <?php if ($_SESSION["privileges"] != 'viewer') {
    ?>
    <li>
        <a class="icon-time first-item" href="#"><?php echo $la['SHOW_HISTORY']; ?></a>
        <ul class="child">
            <li><a class="first-item" href="#" tag="shlh"><?php echo $la['LAST_HOUR']; ?></a></li>
            <li><a href="#" tag="sht"><?php echo $la['TODAY']; ?></a></li>
            <li><a href="#" tag="shy"><?php echo $la['YESTERDAY']; ?></a></li>
            <li><a href="#" tag="shb2"><?php echo $la['BEFORE_2_DAYS']; ?></a></li>
            <li><a href="#" tag="shb3"><?php echo $la['BEFORE_3_DAYS']; ?></a></li>
            <li><a href="#" tag="shtw"><?php echo $la['THIS_WEEK']; ?></a></li>
            <li><a href="#" tag="shlw"><?php echo $la['LAST_WEEK']; ?></a></li>
            <li><a href="#" tag="shtm"><?php echo $la['THIS_MONTH']; ?></a></li>
            <li><a href="#" tag="shlm"><?php echo $la['LAST_MONTH']; ?></a></li>
        </ul>
    </li>
    <?php
} ?>
    <li><a class="icon-follow" href="#" tag="follow"><?php echo $la['FOLLOW'];?></a></li>
    <li><a class="icon-follow" href="#" tag="follow_new"><?php echo $la['FOLLOW_NEW_WINDOW'];?></a></li>
    <li><a class="icon-street" href="#" tag="street_view_new"><?php echo $la['STREET_VIEW_NEW_WINDOW'];?></a></li>
    <?php if ($_SESSION["privileges"] == 'super_admin') {
        ?>
    <li><a class="icon-create" href="#" tag="cmd"><?php echo $la['SEND_COMMAND']; ?></a></li>
    <?php
    } ?>
    <?php if ($_SESSION["privileges"] == 'admin' || $_SESSION["privileges"] == 'super_admin') {
        ?>
    <li><a class="icon-edit" href="#" tag="edit"><?php echo $la['EDIT']; ?></a></li>
    <?php
    } ?>
    <!--        <li><a class="icon-edit" href="#?5=1" tag=""><?php echo "Certificado" ?></a></li>
-->
</ul>

<ul id="report_action_menu" class="menu">
    <li><a class="icon-arrow-right first-item" href="#" tag="grlh"><?php echo $la['LAST_HOUR'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grt"><?php echo $la['TODAY'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="gry"><?php echo $la['YESTERDAY'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grb2"><?php echo $la['BEFORE_2_DAYS'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grb3"><?php echo $la['BEFORE_3_DAYS'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grtw"><?php echo $la['THIS_WEEK'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grlw"><?php echo $la['LAST_WEEK'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grtm"><?php echo $la['THIS_MONTH'];?></a></li>
    <li><a class="icon-arrow-right" href="#" tag="grlm"><?php echo $la['LAST_MONTH'];?></a></li>
</ul>

<ul id="side_panel_history_import_export_action_menu" class="menu">
    <li><a class="icon-save first-item" href="#" onclick="historySaveAsRoute();"><?php echo $la['SAVE_AS_ROUTE'];?></a>
    </li>
    <li><a class="icon-import" href="#" onclick="historyLoadGSR();"><?php echo $la['LOAD_GSR'];?></a></li>
    <li><a class="icon-export" href="#" onclick="historyExportGSR();"><?php echo $la['EXPORT_GSR'];?></a></li>
    <li><a class="icon-export" href="#" onclick="historyExportKML();"><?php echo $la['EXPORT_KML'];?></a></li>
    <li><a class="icon-export" href="#" onclick="historyExportGPX();"><?php echo $la['EXPORT_GPX'];?></a></li>
    <li><a class="icon-export" href="#" onclick="historyExportCSV();"><?php echo $la['EXPORT_CSV'];?></a></li>
</ul>

<ul id="settings_main_object_list_grid_action_menu" class="menu">
    <li><a class="icon-erase first-item" href="#"
            onclick="settingsObjectClearHistorySelected();"><?php echo $la['CLEAR_HISTORY'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="settingsObjectDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="settings_object_service_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectServiceImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectServiceExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#"
            onclick="settingsObjectServiceDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="settings_object_sensor_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectSensorImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectSensorExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="settingsObjectSensorDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="settings_object_custom_fields_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectCustomFieldImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectCustomFieldExport();"><?php echo $la['EXPORT'];?></a>
    </li>
    <li><a class="icon-remove3" href="#"
            onclick="settingsObjectCustomFieldDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="settings_main_object_group_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectGroupImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectGroupExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="settingsObjectGroupDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="settings_main_object_driver_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectDriverImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectDriverExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="settingsObjectDriverDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="settings_main_object_passenger_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectPassengerImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectPassengerExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#"
            onclick="settingsObjectPassengerDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="settings_main_object_trailer_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#"
            onclick="settingsObjectTrailerImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="settingsObjectTrailerExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#"
            onclick="settingsObjectTrailerDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="settings_main_events_event_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#"
            onclick="settingsEventDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="settings_main_templates_template_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#" onclick="settingsTemplateImport();"><?php echo $la['IMPORT'];?></a>
    </li>
    <li><a class="icon-export" href="#" onclick="settingsTemplateExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="settingsTemplateDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="settings_main_subaccount_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#"
            onclick="settingsSubaccountDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="places_group_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#" onclick="placesGroupImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="placesGroupExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="placesGroupDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="bottom_panel_msg_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#"
            onclick="historyRouteMsgDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="cmd_schedule_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#"
            onclick="cmdScheduleDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="cmd_template_list_grid_action_menu" class="menu">
    <li><a class="icon-import first-item" href="#" onclick="cmdTemplateImport();"><?php echo $la['IMPORT'];?></a></li>
    <li><a class="icon-export" href="#" onclick="cmdTemplateExport();"><?php echo $la['EXPORT'];?></a></li>
    <li><a class="icon-remove3" href="#" onclick="cmdTemplateDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="cmd_status_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#" onclick="cmdExecDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="report_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#" onclick="reportsDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="reports_generated_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#"
            onclick="reportsGeneratedDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="rilogbook_logbook_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#" onclick="rilogbookDeleteSelected();"><?php echo $la['DELETE'];?></a>
    </li>
</ul>

<ul id="dtc_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#" onclick="dtcDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>

<ul id="image_gallery_list_grid_action_menu" class="menu">
    <li><a class="icon-remove3 first-item" href="#" onclick="imgDeleteSelected();"><?php echo $la['DELETE'];?></a></li>
</ul>