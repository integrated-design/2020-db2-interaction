<?php
$uri = $_SERVER['REQUEST_URI'];
$uri_array = explode('/', $uri);
$class = strtoupper($uri_array[4]);
$number = $uri_array[5];

// user's video directory from app/html
$dir = '../../user/'.$class.'/'.$number;

// result
$asset_infos = array();

function combine_path($dir, $file_name) {
	return rtrim($dir, '/').'/'.$file_name;
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
				array_push($asset_infos, array('fileName' => $file_info['basename'], 'startTime' => (float)$file_name_array[1]));
			} else {
				array_push($asset_infos, array('fileName' => $file_info['basename'], 'startTime' => 0));
			}
		}
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

	<!-- <link rel="apple-touch-icon" sizes="180x180" href="/image/apple-touch-icon.png"> -->

	<!-- styles -->
	<link rel="stylesheet" href="../../../libs/reset/reset.min.css">
	<link rel="stylesheet" href="../../../app/css/style.min.css?<?php echo time(); ?>">

	<!-- fullscreen -->
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

<!-- scripts -->
<script>
	var type = 1;
	var assetInfos = <?php echo json_encode($asset_infos); ?>;
</script>
<script src="../../../libs/jquery/jquery-3.4.1.min.js"></script>
<script src="../../../libs/screenfull/screenfull.min.js"></script>
<script src="../../../libs/alumican/index.min.js?<?php echo time(); ?>"></script>
<script src="../../../app/js/script.min.js?<?php echo time(); ?>"></script>

</body>
</html>
