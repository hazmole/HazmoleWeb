<?php
	session_start();
	include("MySQL.php");
?>
<?php //if Logged in
	if($_SESSION['account']!=null){
		$id = $_SESSION['account'];
	    echo "<meta http-equiv=REFRESH CONTENT=0;url=index.php?id=$id>";
	}
?>

<?php //Register
	if($_POST['new_account']!=null && $_POST['new_password']!=null && $_POST['double_password']!=null){
		if($_POST['new_password']==$_POST['double_password']){
			$ac = $_POST['new_account'];
			$pw = $_POST['new_password'];
			$nn = ($_POST['new_nickname']!=null)? $_POST['new_nickname']:$ac;
			
			$sql = "INSERT INTO Account (account, password, nickname) VALUES ('$ac','$pw','$nn')";
			mysql_query($sql);
			
			echo "<center>註冊成功！<br>";
		}
		else{
			echo "<center>密碼不符！<br>";
		}
	}
?>


<html>
<head>
	<title>HW7：Login</title>
</head>
<body>
	<center>
	<H3>Hw7：登入</H3>
<hr>
	<form action="Account.php" method="post">
		<div style="width:350;height:60;background-color:#ddd;">
			<table>
			<tr><td>
					帳號：<input type="text" name="account"><br>
					密碼：<input type="password" name="password" ><br>
				<td>
					<input type="submit" value="Log in">
			</table>
		</div>
	</form>
		
	<input type=button value="註冊一個帳號" onclick="document.getElementById('Register').style.display='';"><br>
	
		<div id="Register" style="width:350;height:150;background-color:#ddf;display:none;">
			<form action="Login.php" method="post">
			<table>
			<tr><th colspan=2>註冊新帳號
			<tr><td>
					　帳號　：<input type="text" name="new_account"><br>
					　暱稱　：<input type="text" name="new_nickname" ><br>
					　密碼　：<input type="password" name="new_password" ><br>
					確認密碼：<input type="password" name="double_password" ><br>
				<td>
					<input type="submit" value="註冊">
			</table>
			</form>
		</div>
	
	
	<?php
		include("RemoveAd.php");
	?>

</body>
</html>