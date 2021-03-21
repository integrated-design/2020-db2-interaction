<?php
$uri = $_SERVER['REQUEST_URI'];
$uri_array = explode('/', $uri);
$class = $uri_array[4];
$number = $uri_array[5];
// user's video directory from app/html
$dir = '../../user/'.$class.'/'.$number;
// result
$asset_infos = array();
$interaction_type = -1;
function combine_path($dir, $file_name) {
	return rtrim($dir, '/').'/'.$file_name;
}
function sort_by_key($key_name, $sort_order, $array) {
	foreach ($array as $key => $value) {
		$standard_key_array[$key] = $value[$key_name];
	}
	array_multisort($standard_key_array, $sort_order, $array);
	return $array;
}
$list = scandir($dir);
foreach ($list as $record) {
	// ignore . and ..
	if (in_array($record, array('.', '..'))) {
		continue;
	}
	// create path from filename
	$path = combine_path($dir, $record);
	// check type
	if (is_file($path)) {
		$file_info = pathinfo($path);
		$file_extension = $file_info['extension'];
		if (($file_extension == 'mp4') || ($file_extension == 'mov')) {
			$file_name_array = explode('_', $file_info['filename']);
			if (count($file_name_array) > 1) {
				array_push($asset_infos, array('name' => $file_info['filename'], 'extension' => $file_extension, 'startTime' => (float)$file_name_array[1]));
			} else {
				array_push($asset_infos, array('name' => $file_info['filename'], 'extension' => $file_extension, 'startTime' => 0));
			}
		}
	}
}
if (count($asset_infos) >= 2) {
	$asset_infos = sort_by_key('name', SORT_ASC, $asset_infos);
	$asset_infos = array_slice($asset_infos, 0, 2);
	$asset_info_0 = $asset_infos[0];
	$asset_info_1 = $asset_infos[1];
	if (($asset_info_0['name'] == 'a') && ($asset_info_1['name'] == 'b')) {
		$interaction_type = 1;
	} else if (($asset_info_0['name'] == 'c') && ($asset_info_1['name'] == 'd')) {
		$interaction_type = 2;
	} else {
		$asset_infos = array();
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
	<meta charset="utf-8">
	<title>DB2 インタラクション 2020</title>
	<link rel="stylesheet" href="../../../libs/reset/reset.min.css">
	<link rel="stylesheet" href="../../../app/css/style.min.css?<?php echo time(); ?>">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">
</head>
<body>
<div id="loading">
	<div id="type"></div>
	<div id="play-button"></div>
	<div id="log"></div>
</div>
<div id="video-container"></div>
<script>
	// 0: Touch Play / Release Stop
	// 1: Touch B / Release A / Rewind
	// 2: Touch B / Release A / Sync
	var interactionType = <?php echo json_encode($interaction_type); ?>;;
	var assetInfos = <?php echo json_encode($asset_infos); ?>;
</script>
<script src="../../../libs/jquery/jquery-3.4.1.min.js"></script>
<script src="../../../libs/screenfull/screenfull.min.js"></script>
<script src="../../../libs/alumican/index.min.js?<?php echo time(); ?>"></script>
<script src="../../../app/js/script.min.js?<?php echo time(); ?>"></script>
</body>
</html>
