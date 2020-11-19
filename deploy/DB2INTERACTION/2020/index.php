<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>デザインベーシックⅡインタラクション 第4課題「操作する映像」</title>
	<link rel="icon" href="img/favicon.ico">
	<link rel="shortcut icon" href="img/favicon.ico">
	<link rel="stylesheet" href="libs/reset/reset.min.css">
	<link rel="stylesheet" href="index/css/style.min.css">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="mobile-web-app-capable" content="yes">
</head>
<body>
<h1 class="title">デザインベーシックⅡインタラクション 第4課題「操作する映像」</h1>
<div class="qr">
	<div class="image"><img src="img/qr.svg"></div>
	<div class="description">スマートフォンで読み取って再生</div>
</div>
<div class="class-container">
	<?php
	function scanDirectory($dir, $level) {
		$list = scandir($dir);
		$results = array();
		foreach ($list as $record) {
			// ignore . and ..
			if (in_array($record, array('.', '..'))) {
				continue;
			}
			// create path
			$path = rtrim($dir, '/').'/'.$record;
			// check type
			if (is_file($path)) {
				// is file
				//$results[] = $path;
			} else if (is_dir($path)) {
				// is directory
				if ($level == 1) {
					$results[] = $path;
				}
				// search recursively
				$results = array_merge($results, scanDirectory($path, $level + 1));
			}
		}
		return $results;
	}
	$paths = scanDirectory('user/', 0);
	$prevClass = '';
	foreach ($paths as $path) {
		$names = explode('/', $path);
		$class = strtoupper($names[1]);
		$number = $names[2];
		if ($class != $prevClass) {
			if ($prevClass != '') {
				echo "\t\t</ul>\n";
				echo "\t</section>\n";
			}
			echo "\t<section class=\"class-item\">\n";
			echo "\t\t<h2 class=\"class-name\">$class</h2>\n";
			echo "\t\t<ul class=\"member-container\">\n";
		}
		$url = $path; //$path.'?c='.$class.'&n='.$number;
		echo "\t\t\t<li class=\"member-item\"><a href=\"$url\">$number</a></li>\n";
		$prevClass = $class;
	}
	if ($prevClass != '') {
		echo "\t\t</ul>\n";
		echo "\t</section>\n";
	}
	?>
</div>
<script src="index/js/script.min.js"></script>
</body>
</html>
