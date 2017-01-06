function Hw3(){
}

Hw3.user = "";
Hw3.gender = 0;
Hw3.cate =-1;
Hw3.detail = "";

Hw3.NoodleName 	= new Array("牛肉麵","義大利麵","餛飩麵","拉麵","酢醬麵","大蒜麵包","包子","燒賣");
Hw3.RiceName 	= new Array("炒飯","咖哩飯","魯肉飯","排骨飯","控肉飯","雞絲飯","蔬菜燴飯");

Hw3.loadCookie = function(){
	var ck_arr = document.cookie.split('; ');
	
	if(ck_arr.length==0) return;
	for(var i=0;i<ck_arr.length;i++){
		var thisCk = ck_arr[i].split('=');
		if(thisCk[0]=="user") 			Hw3.user 	= thisCk[1];
		else if(thisCk[0]=="gender") 	Hw3.gender 	= thisCk[1];		
		else if(thisCk[0]=="cate") 		Hw3.cate 	= thisCk[1];
		else if(thisCk[0]=="detail") 	Hw3.detail 	= thisCk[1];
	}
	
	var form = document.getElementById("form01");
	form.user.value = Hw3.user;
	if(Hw3.gender!=0)	form.gender.options[Hw3.gender-1].selected = true
	if(Hw3.cate!=-1)	form.cate[Hw3.cate].checked = true
	Hw3.buildDetail();
	var dl = Hw3.detail.split(',');
	for(var i=0;i<dl.length;i++){
		form.detail[parseInt(dl[i])].checked = true;
	}
	
}

Hw3.setStatus = function(form){
	Hw3.user = form.user.value;
	Hw3.gender = form.gender.value;
	Hw3.cate = (form.cate[0].checked)?0:(form.cate[1].checked)?1:-1;
	
	Hw3.detail="";
	if(Hw3.cate==-1) return ;
	for(var i=0;i<form.detail.length;i++){
		if(form.detail[i].checked){
			if(Hw3.detail.length!=0) Hw3.detail += ",";
			Hw3.detail += i;
		}
	}
	
	Hw3.writeCookie();
}

Hw3.writeCookie = function(){
	document.cookie = ("user=" + Hw3.user);
	document.cookie = ("gender=" + Hw3.gender);
	document.cookie = ("cate=" + Hw3.cate);
	document.cookie = ("detail=" + Hw3.detail);
}

Hw3.setCate = function(cate){
	Hw3.cate = cate;
	Hw3.buildDetail();
}

Hw3.buildDetail = function(){
	if(Hw3.cate==-1) return ;
	
	var str ="";	
	var name_cate = (Hw3.cate==0)?Hw3.NoodleName : Hw3.RiceName;
	
	for(var i=0;i<name_cate.length;i++)
		str += "<input type=checkbox name='detail' value=" +i+ " id='dl-"+i+"'><label for='dl-"+i+"'>"+name_cate[i]+"</label><br>"
	
	document.getElementById("detail_td").innerHTML = str;
}