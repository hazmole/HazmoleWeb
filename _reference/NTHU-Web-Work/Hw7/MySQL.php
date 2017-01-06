﻿<?php
	$db_server = "sql309.summerhost.info";
	$db_user = "sum_14739878";
	$db_passwd = "html945";
	$db_name = "sum_14739878_Hw7";
	
	if(!@mysql_connect($db_server, $db_user, $db_passwd)){
		die("無法對資料庫連線");
	}
	
	mysql_query("SET NAMES utf8");
	
	if(!@mysql_select_db($db_name)){
		die("無法使用資料庫");
	}
?>
