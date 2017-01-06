<?php
	session_start();
	include("MySQL.php");
	
	$PicList = array('bmp', 'gif', 'jpg', 'png');
	
	if($_SESSION['account']==null){ //if has Log out, goto Login
		echo "<meta http-equiv=REFRESH CONTENT=0;url=Login.php>";
	}
	
	if($_GET['id']==null)
		echo "<center><h3>無效的網址</h3></center><noframes><noframes>";
	else{
		//get account % nickname
		$id = $_GET['id'];
		$nn = GetNickName($id);
		
		if($_POST['new_friend']!=null){
			$temp = $_SESSION['account'];
			mysql_query("INSERT INTO Friends (A, B) VALUES ('$temp','$id')");
		}
		
		$fd_n = GetFriendsTotal($id);
		$fd   = GetFriends($id);
			
		//refresh friends
		for($i=0;$i<$fd_n;$i++){
			if($_POST[ $fd[$i] ]!=null){
				mysql_query("DELETE FROM Friends WHERE (A='$fd[$i]' AND B='$id') OR (B='$fd[$i]' AND A='$id')");
			}
		}
		
		$fd_n = GetFriendsTotal($id);
		$fd   = GetFriends($id);
		
		//==================================	
		//  Comment
		//==================================
		$sql_result = mysql_query("SELECT * FROM Comment where owner='$id'");
		while($result=mysql_fetch_array($sql_result)){
			$temp = $result['id'];
			if($_POST[$temp]!=null){
				$pic = "./UploadFile/".$result['document'];
				echo $pic;
				unlink($pic);
				
				mysql_query("DELETE FROM Comment WHERE id='$temp'");
				mysql_query("DELETE FROM Reply WHERE article='$temp'");
			}
			//==============
			//Reply
			if($_POST['re_'.$result['id']]!=null){
				//get comment total
				$sub_result = mysql_fetch_array(mysql_query("SELECT * FROM Reply ORDER BY id DESC"));
				$no = ($sub_result==null)? 1 : $sub_result['id']+1;
				$poster = $_SESSION['account'];
				$msg = mysql_real_escape_string($_POST['re_'.$result['id']]);
				
				mysql_query("INSERT INTO Reply (id, article, poster, date, Content) VALUES ('$no' ,'$temp' ,'$poster' ,CURRENT_TIMESTAMP ,'$msg')");
			}
		}
		//============
		//Delete Reply
		$temp = $_SESSION['account'];
		$sql_result = mysql_query("SELECT * FROM Reply where poster='$temp'");
		while($result=mysql_fetch_array($sql_result)){
			if($_POST['de_re_'.$result['id']]!=null){
				$temp = $result['id'];
				mysql_query("DELETE FROM Reply WHERE id='$temp'");
			}
		}
		
		if($_POST['msg_content']!=null){
			//get comment total
				$result = mysql_fetch_array(mysql_query("SELECT COUNT(*) FROM Comment"));
			if($result['COUNT(*)']==0){
				$no = 1;
			}
			else{
				$result = mysql_fetch_array(mysql_query("SELECT * FROM Comment ORDER BY id DESC"));
				$no = $result['id']+1;
			}
			//UploadFile
			$temp_name = null;
			if($_FILES["upload_file"]["name"]!=NULL){
					$BlackList = array('php', 'exe', 'jsp', 'asp', 'htaccess');
					$extension = strtolower(end(explode(".", $_FILES["upload_file"]["name"])));
					$temp_name = time().".".$extension;
					
					if( !in_array($extension, $BlackList) && $_FILES["upload_file"]["size"]<=1024*1024){
				    	move_uploaded_file($_FILES["upload_file"]["tmp_name"], "./UploadFile/".$temp_name);
				    }
				    else{
				    	$temp_name = null;
				    }
				}
			
			
			$poster = $_SESSION['account'];
			$owner = $id;
			$msg = mysql_real_escape_string($_POST['msg_content']);
			$public = $_POST['public_check'];
			mysql_query("INSERT INTO Comment (id, poster, owner, date, content, document, public) VALUES ('$no' ,'$poster' ,'$owner' ,CURRENT_TIMESTAMP ,'$msg' ,'$temp_name' ,'$public')");
		}
		
	}
//==================================	
//  Function
//==================================
	function GetNickName($id){
		$sql_result = mysql_query("SELECT nickname FROM Account where account = '$id'");
		$result = mysql_fetch_array($sql_result);
		return $result['nickname'];
	}
	function GetFriendsTotal($id){
		//get friends total
			$sql_result = mysql_query("SELECT COUNT(*) FROM Friends where A='$id' OR B='$id'");
			$result = mysql_fetch_array($sql_result);
		$fd_n = $result['COUNT(*)'];
		
		return $fd_n;
	}
	function GetFriends($id){
		$fd_n = GetFriendsTotal($id);
		
		//get friends
		$sql_result = mysql_query("SELECT * FROM Friends where A='$id' OR B='$id'");
		
		for($i=0;$i<$fd_n;$i++){
				$result = mysql_fetch_array($sql_result);
			$fd[$i] = ($result['A']==$id) ? $result['B']:$result['A'];
		}
		return $fd;
	}
	function IsFriend($A,$B){
		$sql_result = mysql_query("SELECT COUNT(*) FROM Friends where (A='$A' AND B='$B') OR (B='$A' AND A='$B')");
		$result = mysql_fetch_array($sql_result);
		if($result['COUNT(*)']>=1 || $A==$B)	return true;
		else									return false;
	}
?>

<html>
<head>
	<title>HW7：塗鴉牆</title>
</head>
<body>
	<?php
		$temp = $_SESSION['account'];
		echo "<a href=index.php?id=$temp>回到我的塗鴉牆</a>│";
	?>
	<a href=EditAc.php>修改資料</a>│
	<a href=Account.php>登出</a>│
	
	<center>
	<?php
		echo "<H3>".$nn."的塗鴉牆</H3>";
	
		$temp = $_SESSION['account'];
		if(IsFriend($temp,$id)==false){
			echo "<form action='index.php?id=$id' method='post'>";
			echo "<input type=submit value='新增好友' name='new_friend'></form>";
		}
		echo "<p>";
	?>
<hr>
	</center>

	<table width=200 style="position:absolute;top:100;left:10;">
		<tr><td>
			<?php
				$result = mysql_fetch_array(mysql_query("SELECT * FROM Account where account = '$id'"));
				$head_pic = $result['headpic'];
				echo "<center>";
				echo ($head_pic==null)?"<img src=./UploadFile/nopic.png height=100 width=100>":"<img src=".$head_pic." height=100 width=100>";
			?>
		
		<tr><td bgcolor=#ccf>
		<h2>好友</h2><p>
		
		
		<?php
			echo "<form action='index.php?id=$id' method='post'>";
		?>
		<table width=100%>
			<?php
				
				for($i=0;$i<$fd_n;$i++){
					$temp = GetNickName($fd[$i]);
					echo "<tr><td width=120 bgcolor=#aaf>$temp($fd[$i])";
					if($_SESSION['account']==$id)
						echo "<td><input type=submit value='怒刪好友啦！' name='$fd[$i]'>";
				}
			?>
		</table>
		</form>
	</table>
	
	<table style="position:absolute;top:100;left:250;">
		<tr><td>
		<h2>塗鴉牆</h2><p>
		
		<?php
			echo "<form action='index.php?id=$id' method='post' enctype='multipart/form-data'>";
		?>
			<textarea style="width:480;height:100;" name="msg_content"></textarea><br>
			
			上傳檔案：<input type="file" name="upload_file">
			<input type="radio" name="public_check" value=1  id="c" checked>	<label for="c">公開</label>
			<input type="radio" name="public_check" value=0  id="d">				<label for="d">限定好友</label>
			<input type=submit value="發佈動態">
		</form>
		<p>
		<table border=0>
			<?php
				$temp = $_SESSION['account'];
				if(IsFriend($temp,$id)==true)
					$sql = "SELECT * FROM Comment where owner='$id' ORDER BY date DESC";
				else
					$sql = "SELECT * FROM Comment where owner='$id' AND public=1 ORDER BY date DESC";
				$sql_result = mysql_query($sql);
				
				//Create Article
				while($result=mysql_fetch_array($sql_result)){
					$temp = $result['id'];
					
					echo "<tr><th width=60 bgcolor=#6c6 rowspan=2>#".$temp;
					if($result['poster']==$_SESSION['account'] || $result['owner']==$_SESSION['account']){
						echo "<form action='index.php?id=$id' method='post'>";
						echo "<input type=submit value='刪除' name='$temp'>";
						echo "</form>";
					}
					echo "<th width=300 bgcolor=#9d9>發布者：".$result['poster']."<th width=300 bgcolor=#9d9>時間：".$result['date'];
					$msg = preg_replace("/\n/","<br>",$result['content']);
					$msg = preg_replace("/ /","&nbsp",$msg);
					echo "<tr><td colspan=2 bgcolor=#cfc>".$msg;
					$document = $result['document'];
					if($document!=null){
						echo "<tr><td bgcolor=#6c6><b>　</b><td colspan=2 bgcolor=#ddf>";
						echo "<form action='Download.php' method='post' target='new'>";
						echo "<input hidden name='docu_name' value='$document'>";
						echo "<input type=submit value='下載附檔：".$document."'>";
							$extension = strtolower(end(explode(".", $document)));
							if(in_array($extension,$PicList)){
								echo "<br><img src=./UploadFile/".$document." style='max-width:300;height:auto;'>";
							}
						echo "</form>";
					}
					//===============
					//Reply
					$sub_sql_result = mysql_query("SELECT * FROM Reply where article='$temp' ORDER BY date ASC");
					while($sub_result=mysql_fetch_array($sub_sql_result)){
						echo "<tr><td bgcolor=#6c6>";
						if($sub_result['poster']==$_SESSION['account']){
							echo "<form action='index.php?id=$id' method='post'>";
							echo "<input type=submit value='刪除' name='de_re_".$sub_result['id']."'>";
							echo "</form>";
						}
						echo "<td colspan=2 bgcolor=#d4ff94>".$sub_result['poster']."&lt;".$sub_result['Content'];
					}
					
					//Reply action
					echo "<form action='index.php?id=$id' method='post'>";
					echo "<tr><td colspan=3 bgcolor=#fea>回覆：<input type=text style='width:400' name='re_".$temp."'><input type=submit value='Reply'>";
					echo "</form>";
				}
			?>
		</table>
	</table>
	
	<p>
	<?php
		include("RemoveAd.php");
	?>
</body>
</html>