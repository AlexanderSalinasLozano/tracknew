<div id="page_objects" class="page">
	<form role="form">
		<div class="input-group form-group btn-group">
			<input id="page_object_search" class="form-control" type="search" placeholder="<? echo $la['SEARCH']; ?>..." onkeyup="objectLoadList();"/>
			<span id="page_object_search_clear" class="input-group-addon">
				<span class="glyphicon glyphicon-remove"></span>
			</span>
		</div>
		<div id="page_object_list" class="list-group"></div>
	</form>
	<a href="#" class="btn btn-default btn-blue show-menu pull-right back-btn" onclick="switchPage('menu');">
		<i class="glyphicon glyphicon-menu-left"></i>
		<? echo $la['BACK']; ?>
	</a>
</div>

<div id="page_object_details" class="page">
	<div id="page_object_detail_list" class="panel panel-default"></div>
	<a href="#" class="btn btn-default btn-blue show-menu pull-right back-btn" onclick="switchPage('objects');">
		<i class="glyphicon glyphicon-menu-left"></i>
		<? echo $la['BACK']; ?>
	</a>
</div>