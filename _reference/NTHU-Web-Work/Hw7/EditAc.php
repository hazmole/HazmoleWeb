<?php
	session_start();
	include("MySQL.php");
	
	if($_SESSION['account']==null){ //if has Log out, goto Login
		echo "<meta http-equiv=REFRESH CONTENT=0;url=Login.php>";
	}
	
	$id = $_SESSION['account'];
		$sql_result = mysql_query("SELECT * FROM Account where account = '$id'");
	$result = mysql_fetch_array($sql_result);
	$head_pic = $result['headpic'];
	
	if($_POST['old_password']!=null){
		if($_SESSION['password']==$_POST['old_password']){
			$nn = $_POST['new_nickname'];
			$pw = $_POST['new_password'];
			
			if($pw==$_POST['double_password']){
				if($pw!=null){
					mysql_query("UPDATE Account SET password='$pw' WHERE account='$id'");
					$_SESSION['password'] = $pw;
				}
				if($nn!=null){
					mysql_query("UPDATE Account SET nickname='$nn' WHERE account='$id'");
				}
				if($_FILES["upload_headpic"]["name"]!=NULL){
					$whiteList = array('bmp', 'gif', 'jpg', 'png');
					$extension = strtolower(end(explode(".", $_FILES["upload_headpic"]["name"])));
					$temp_name = "./UploadFile/".time().".".$extension;
					
					if( in_array($extension, $whiteList) && $_FILES["upload_headpic"]["size"]<=1024*512){
				            move_uploaded_file($_FILES["upload_headpic"]["tmp_name"], $temp_name);
				            mysql_query("UPDATE Account SET headpic='$temp_name' WHERE account='$id'");
				            unlink($head_pic);
				            $head_pic = $temp_name;
				    }
				    else {
				        echo "<center>大頭貼上傳失敗</center>";
				    }
				}
				
				echo "<center>更新成功</center>";
			}
			else
				echo "<center>新密碼不符</center>";
		}
		else
			echo "<center>密碼錯誤</center>";
	}
	
		$sql_result = mysql_query("SELECT * FROM Account where account = '$id'");
	$result = mysql_fetch_array($sql_result);
	$nn = $result['nickname'];
	$head_pic = $result['headpic'];
?>

<html>
<head>
	<title>HW7：修改帳號</title>
</head>
<body>
	<center>
	
	<?php
		echo "<H3>".$nn."　修改資料</H3><p>";
		echo "<a href=index.php?id=$id>回到塗鴉牆</a>";
	?>
<hr>
	<?php
		echo ($head_pic==null)?"<img src=./UploadFile/nopic.png height=100 width=100>":"<img src=".$head_pic." height=100 width=100>";
		?>
	<br>
		<div id="Register" style="width:350;height:200;background-color:#ddf;">
			<form action="EditAc.php" method="post" enctype="multipart/form-data">
			<table>
			<tr><td>
					上傳大頭貼：<input type="file" name="upload_headpic"><br>
					
			<tr><td>
					　　暱稱　：<input type="text" name="new_nickname" ><br>
					　舊密碼　：<input type="password" name="old_password" ><br>
					　新密碼　：<input type="password" name="new_password" ><br>
					確認新密碼：<input type="password" name="double_password" ><br>
				<td>
					<input type="submit" value="修改">
			</table>
			</form>
		</div>
	
	<?php
		include("RemoveAd.php");
	?>
	
	
</body>
</html>
