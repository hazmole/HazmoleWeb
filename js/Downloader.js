//  Last Modify: 2015/01/17 18:53
/*	==================================================
	Include Class:	Downloader (it's a public class)
	==================================================*/
function Downloader(){
}

//==============================
// ** Public Function
//==============================
// :: Download
	Downloader.downloadFile = function(title, url){
		var aLink = document.createElement('a');
		var evt = document.createEvent("HTMLEvents");
		
		evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
		
		aLink.download = title;
		aLink.href = url;
		aLink.dispatchEvent(evt);
	}
	
//==============================
// :: Transform Context(String) into URL
	Downloader.transStringToURL = function(string, type){
		var data="", charset="";
		switch(type){	//Decide Content-type
			case "html":	data="text/html";	charset="UTF-8";	break;
			case "java":	data="java/*";		break;
			case "pdf":		data="application/pdf";		break;
			case "jpg":		data="image/jpeg";	break;
			case "gif":		data="image/gif";	break;
			case "png":		data="image/png";	break;
			case "mp3":		data="audio/mp3";	break;
			default:
				data="text/plain";	charset="UTF-8";	break;
			}
		
		return "data:"+data+";charset="+charset+"," + string;
	}

