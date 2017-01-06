
function Initialbuilder(){
	buildLeftBar();
	buildTopBar();
}


function buildLeftBar(){
	var str = "";
	
	var name_arr = ["回主頁","角色","任務","商店","自由市場","戰鬥測試"];
	var link_arr = ["index.php","characterIndex.php","","market.php?type=mar","market.php?type=free","Battle.php"];
	
	
	str += "<div id='left_bar'></div>";
	
	for(var i=0;i<name_arr.length;i++){
		str += ("<a href=" + link_arr[i] + ">");
		str += ("<div class='left_bar_button' style='top:"+(60*i+100)+"px;'>");
		str += name_arr[i];
		str += "</div></a>";
		}
	
	document.getElementById("left").innerHTML = str;
}

function buildTopBar(){
	var str = "";
	var Logout = "http://wheelofdusk.summerhost.info/logout.php";
	
	if(window.ActiveXObject){
	    xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}else if(window.XMLHttpRequest){
	    xhr = new XMLHttpRequest();
	}
	
	xhr.open("GET", "../Tools/SessionHandler.php");
	xhr.send();
	
	xhr.onreadystatechange = function(){
	    if(xhr.readyState==4){
	        if(xhr.status>=200 && xhr.status<300){
	            var result = xhr.responseText;
	            var arr = result.split(",");
	            
	            str += ("歡迎，"+arr[1]+"　│　金錢："+arr[2]+"　│　");
	            str += ("<a href="+Logout+">登出</a>");
	            
	            document.getElementById("top_bar").innerHTML = str;
	        }
	        else {
	            document.getElementById("top_bar").innerHTML = "Fail Connect!";
	        }
	     
	    }
	}
	
}