//  Last Modify: 2015/04/03 00:26
/*	==================================================
	Include Class:	MyCookie (it's a public class)
	==================================================*/
function MyCookie(){
}

//==============================
// ** Public Function
//==============================
// :: save Array to Cookie
	 MyCookie.store = function(key, value_array, duration){
		if(!navigator.cookieEnabled){ // Detect
	        alert("Cookie 設定被關閉或者不支援，無法儲存:(");
	        return ;
	    }
		var content = "";	// trans Array to String (start with ",")
		for(var i=0; value_array[i]!=null; i++){
			content += ","+value_array[i];
		}
		var now = new Date(), expDate = new Date();	// Date
		expDate.setTime(now.getTime() + duration);
	 	
		document.cookie = key+"="+content+";expires="+expDate.toGMTString();
	}
	
//==============================
// :: load Cookie to array
	MyCookie.load = function(key){
		if(!navigator.cookieEnabled){ // Detect
	        alert("Cookie 設定被關閉或者不支援，無法讀取:(");
	        return [];
	    }
		var cookie = document.cookie;
		if(cookie=="") return [];
		
		var re = new RegExp(key+"=[^ ]+", "g");
		var value = cookie.match(re);
		if(value==null) return [];
		
		var value = value[0].split("=")[1];
		var array = value.split(","); array.shift();
		return array;
	}
//==============================
// :: clear Cookie
	MyCookie.clear = function(key){
		if(!navigator.cookieEnabled){ // Detect
	        alert("Cookie 設定被關閉或者不支援，無法刪除:(");
	        return ;
	    }
	    now = new Date();
		now.setTime(now.getTime() - 1);
		document.cookie = key+"=; expires="+now.toGMTString();
	}
