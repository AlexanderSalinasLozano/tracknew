<div id="page_settings" class="page">
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['MAP_STARTUP_POSITION']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_map_startup_possition" class="form-control">
					<option value="default"><? echo $la['DEFAULT'];?></option>
					<option value="last"><? echo $la['REMEMBER_LAST'];?></option>
					<option value="fit"><? echo $la['FIT_OBJECTS'];?></option>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['MAP_ICON_SIZE']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_map_icon_size" class="form-control">
					<option value="1">100%</option>
					<option value="1.25">125%</option>
					<option value="1.5">150%</option>
					<option value="1.75">175%</option>
					<option value="2">200%</option>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['LANGUAGE']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_language" class="form-control">
					<? echo getLanguageList(); ?>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['UNIT_OF_DISTANCE']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_distance_unit" class="form-control">
					<option value="km"><? echo $la['KILOMETER'];?></option>
					<option value="mi"><? echo $la['MILE'];?></option>
					<option value="nm"><? echo $la['NAUTICAL_MILE'];?></option>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['UNIT_OF_CAPACITY']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_capacity_unit" class="form-control">
					<option value="l"><? echo $la['LITER'];?></option>
					<option value="g"><? echo $la['GALLON'];?></option>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['UNIT_OF_TEMPERATURE']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_temperature_unit" class="form-control">
					<option value="c"><? echo $la['CELSIUS'];?></option>
					<option value="f"><? echo $la['FAHRENHEIT'];?></option>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-6">
				<? echo $la['TIMEZONE']; ?>
			</div>
			<div class="col-xs-6">
				<select id="page_settings_timezone" class="form-control">
					<? include ("../inc/inc_timezones.php"); ?>
				</select>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<div class="row vertical-align">
			<div class="col-xs-12">
				<button type="button" class="btn btn-default dropdown-toggle" aria-haspopup="true" aria-expanded="false" onclick="settingsSave();">
					<? echo $la['SAVE']; ?>
				</button>
			</div>
		</div>
	</div>
	
	<a href="#" class="btn btn-default btn-blue show-menu pull-right back-btn" onclick="switchPage('menu');">
		<i class="glyphicon glyphicon-menu-left"></i>
		<? echo $la['BACK']; ?>
	</a>
</div>