<?php
	session_start();
	include("MySQL.php");
	
	if($_SESSION['account']!=null){ //if has logged in, Log out
		session_destroy();
		echo "已成功登出。<br><a href=Login.php>繼續</a>";
	}
	else{
	    $ac = $_POST['account'];
	    $pw = $_POST['password'];
	    $ac = preg_replace("/[^A-Za-z0-9]/","",$ac);
	    $pw = preg_replace("/[^A-Za-z0-9]/","",$pw);
	    
	    if($ac!=NULL && $pw!=NULL){
	     	$sql = "SELECT account, password, nickname FROM Account where account = '$ac'";
	    	$sql_result = mysql_query($sql);
	    	$result = mysql_fetch_array($sql_result);
	    	
	    	if($result['password'] == $pw){
				$_SESSION['account'] = $result['account'];
				$_SESSION['password'] = $result['password'];
				echo "<meta http-equiv=REFRESH CONTENT=0;url=index.php?id=$ac>";
	    	}
	    	else{
	    		echo "<script>alert('帳號或密碼錯誤。');</script><meta http-equiv=REFRESH CONTENT=0;url=Login.php>";
	    	}
		}
		else{
			echo "<meta http-equiv=REFRESH CONTENT=0;url=Login.php>";
		}
	}
?>