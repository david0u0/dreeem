<?php
	session_start();
	function echoHeader() {
		echo "<div id='header'>";
		echo "<a href='index.php'><img src='dreeem.png' height='50px'/></a>";
		if($_SESSION['userId'] != NULL) {
			$userId = $_SESSION['userId'];
			echo "<a class='headerLink' href=''>$userId</a>";
			echo "<a class='headerLink' href=''>好碰友</a>";
		}
		else {
			echo "<form id='loginForm' method='post' action='login.php'>";
			echo "<input type='text' name='userId'/>";
			echo "<input type='password' name='psswd'/>";
			echo "<a class='headerLink' href='javascript:login(this.form)'>GO~</a>";
			echo "</form>";
		}
		echo "</div>";
	}
?>