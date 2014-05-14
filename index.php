<?php  
	include("header.php");
?>
<html>
<head>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"></meta>
	<title>user's Dreeem</title>
</head>
<style type="text/css">
	body {
		background-color: rgb(30, 30, 30);
		font-family: "微軟正黑體";	
	}
	#page {
		position: absolute;
		left: 910px;
		top: 100px;
	}
	#mode {
		position: absolute;
		top: 600px;
	}
	td {
		border: 2px solid white;
		width: 100px;
		color: white;
		cursor: pointer;
		background-color: rgb(30, 30, 30);
	}
</style>
<link rel="stylesheet" type="text/css" href="header.css">
<link rel="stylesheet" type="text/css" href="canvas.css">
<link rel="stylesheet" type="text/css" href="editnote.css">
<script type="text/javascript">
	var bgColor = 'haha';
	function login() {
		var form = document.forms["loginForm"];
		form.submit();
	}
</script>
<script type="text/javascript" src='classes.js'></script>
<script type="text/javascript" src='editnote.js'></script>
<script type="text/javascript" src='canvas.js'></script>
<body onload='init()'>
	<?php echoHeader(); ?>
	<div id='edit' class='shield'>
		<canvas id='note'></canvas>
		<div id='textareaDiv'></div>
		<div id='parDiv'></div>
		<table id='tool'>
			<tr><td onclick='setTool(0)'>文字方塊</td></tr>
			<tr><td onclick='setTool(1)'>畫筆</td></tr>
			<tr><td onclick='setTool(2)'>橡皮擦</td></tr>
			<tr><td>
				<input type='range' onchange='setThick(this.value)' min='0' max='1' value='0.25' step='0.05'/>
			</td></tr>
			<tr><td onclick='closeNote()'>放棄</td></tr>
			<tr><td onclick='saveNote()'>儲存</td></tr>
		</table>
		<canvas id='mini'></canvas>
	</div>

	<canvas id='background'></canvas>
	

	<table id='page'>
		<tr><td id='p0' onclick='show(0)'>背景</td></tr>
		<tr><td id='p1' onclick='show(1)'>1</td></tr>
	</table>
	<br/>
	<table id='mode'>
		<td onclick='setMode(0)'>看便條</td>
		<td onclick='setMode(1)'>貼便條</td>
		<td onclick='setMode(2)'>貼照片<input type="file" onchange='loadImg(this)' id='fileIn'/></td>
		<td onclick='setMode(3)'>手手</td>
		<td onclick='setMode(4)'>跨版移動</td>
	</table>
</body>
</html>