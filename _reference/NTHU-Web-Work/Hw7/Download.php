<?php
	echo "下載中";
	
	if($_POST['docu_name']!=null){
	    $file = "./UploadFile/".$_POST['docu_name'];
	    if (file_exists($file)) {
	        header('Content-Type: application/octet-stream');
	        header("Content-Transfer-Encoding: Binary"); 
	        header('Content-Disposition: attachment; filename='.basename($file));
	        ob_clean();
	        flush();
	        readfile($file);
	    }
	}
?>