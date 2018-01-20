//update:2014/11/29
// COLOR_ARR  =  統一「姓名：顏色」常數
// ##roll##  ：被以此記號框起的文字，將被當成判定的相關資訊。且接在開始標記後的同一行文字將代表擲骰者的名稱。
// ##hide##  ：被以此記號框起的文字將被隱藏，點擊後可展開。

function ArticleHandle(){}

ArticleHandle.SpecialHandleFlag = false;
ArticleHandle.Roll_Switch = false;
ArticleHandle.Hide_Switch = false;
ArticleHandle.Hide_Counter = 0;

//======================
//修改編輯內容
//======================
function MainEdit(id, trailer){
	var obj = document.getElementById(id);
	var str = obj.innerHTML;
	obj.innerHTML = (trailer)? ArticleHandle.EditNextEpisode(str) :ArticleHandle.editArticle(str);
}

function CreateLink(id, prev, next){
	var obj = document.getElementById(id);
	var str = obj.innerHTML;
	obj.innerHTML = ArticleHandle.NewLinkBlock(prev, next);
}


//======================
//將檔案依照換行切割，分別處理
//======================
ArticleHandle.editArticle = function(article){
	var new_article = "";
	var arr_line;
	
	//刪去tab、依照換行分段
	article = article.replace(/[\t]/g,"");
	article = article.replace(/\r\n/g,"\n");
	arr_line = article.split(/\n/g);
	
	
	//區塊頭設定
	var head_frame = "<table width=880px border=0 style='line-height:1.4;'>";
	//區塊尾設定
	var tail_frame = "</table>";
	
	//開始編輯文檔
	new_article += head_frame;
	for(var i=0;arr_line[i]!=null;i++){
		//切新區塊
		if(arr_line[i]=="##split##"){
			new_article += (tail_frame + "<hr>" + head_frame);
			continue;
		}
		
		//一般處理
		new_article += ArticleHandle.SingleLineEdit(arr_line[i]);
	}
	new_article += tail_frame;
	
	return new_article;
}

//======================
//各行分別處理
//======================
ArticleHandle.SingleLineEdit = function(line){
	//獲得第一個冒號的位置
	var temp = line.search("：");
	temp = (temp==-1)? line.search(":"): temp;
	//獲得第一個常見標點的位置
	var comment_place = ArticleHandle.findCommonComment(line);
	//肯定「人名：對話」中的冒號位置
	var quote_place = (temp==-1 || temp>30 || comment_place<temp)? 0: temp;
	//獲得人名與對話
	var name = line.slice(0,quote_place);
	var content = line.slice(quote_place+1);
	
	var str = "";
	
	if(line.search(/##[a-zA-Z]*##/g)!=-1){
		//特殊處理
		str += ArticleHandle.SpecialHandle(line);
	}
	else if(!check_div() && name!="" && content!=null){
		//一般「人名：對話」敘述
		var color = ArticleHandle.findColor(name);
		
		str += "<tr><td style='width:160;vertical-align:top;text-align:right;font-weight:bold;color:"+color+";'>";
		str += name+"：";
		str += "<td style='text-align:left;color:"+color+";'>" + content;
	}
	else if(line==""){
		//純換行
		str += "<br>&nbsp";
	}
	else{
		//一般處理
		str += "<br>";
		str += line;
	}
	return str;
}

//======================
//特殊區塊處理
//======================
ArticleHandle.SpecialHandle = function(line){
	if(line.search("##roll##")!=-1)		return ArticleHandle.NewRollInfo(line, "##roll##");
	if(line.search("##hide##")!=-1)		return ArticleHandle.NewHideInfo(line, "##hide##");
	
}

//======================
//是否正在進行特殊標記
//======================
function check_div(){
	return ArticleHandle.SpecialHandleFlag;
}

//======================
//處理隱藏區塊
//======================
ArticleHandle.NewHideInfo = function(line, word){
	var str="";
	
	if(!ArticleHandle.Hide_Switch){
		var title = line.split(word)[1];
		var id = ArticleHandle.Hide_Counter++;
		
		str += ArticleHandle.setBlockInfo("70%", "#ddd", "left");
		str += "<div style='width:200px;background-color:#999;border-radius:5px;padding:5 10 5 10; text-align:center;'";
		str += " onclick=switchDisplay('hide-"+id+"',null)>"+title+"</div>";
		str += "<div id='hide-"+id+"' style='display:none;'>";
		}
	else{
		str += line.split(word)[0];
		str += "</div>";
		str += "</div>";
		}
	ArticleHandle.Hide_Switch		= !ArticleHandle.Hide_Switch;
	ArticleHandle.SpecialHandleFlag = !ArticleHandle.SpecialHandleFlag;
	
	return str;
}

//======================
//處理擲骰區塊
//======================
ArticleHandle.NewRollInfo = function(line, word){
	var str="";
	
	if(!ArticleHandle.Roll_Switch){
		var color = ArticleHandle.findColor(line.split(word)[1]);
		color = ArticleHandle.TranstoRgba(color,"0.5");
		
		str += ArticleHandle.setBlockInfo("70%", color, "left");
		str += "<b>"+line.split(word)[1]+"&nbsp的判定："+"</b>";
	}
	else{
		str += line.split(word)[0];
		str += "</div>";
		}
	ArticleHandle.Roll_Switch		= !ArticleHandle.Roll_Switch;
	ArticleHandle.SpecialHandleFlag = !ArticleHandle.SpecialHandleFlag;
	
	return str;
}

ArticleHandle.setBlockInfo = function(width,color,align){
	var str="";	
	str += "<tr><td colspan=2'><center>";
	str += "<div style='width:"+width+";background-color:"+color+";border-radius:8px;padding:5 10 5 10;text-align:"+align+";'>";
	return str;
}

//======================
//生成連結區塊
//======================
ArticleHandle.NewLinkBlock = function(prev, next){
	var str="";
	str += "<table border=0><tr>";
	str += "<td width=250>";
		if(prev)	str += "<a href="+ArticleHandle.getRefLink(-1)+"><div class='White_Square' style='padding:10 0 10 0;'>前回</div></a>";
	//str += "<td width=400>";
	str += "<td width=250>";
		if(next)	str += "<a href="+ArticleHandle.getRefLink( 1)+"><div class='White_Square' style='padding:10 0 10 0;'>次回</div></a>";
	str += "</table>";
	return str;
}

//======================
//生成關係連結
//======================
ArticleHandle.getRefLink = function(offset){
	//自動產生相關連結
	var name = document.URL.split("/");
	name.splice(0,name.length-1);
	name = name[0].split(".")[0];
	var num = parseInt(name.split("_")[1]);
	name = name.split("_")[0]+"_";
	
	var URL = name+(num+offset)+".html";
	return URL;
}

//======================
//回傳名字的對應顏色
//======================
ArticleHandle.findColor = function(name){
	var color = COLOR_ARR;
	
	for(i=0;i<color.length;i++){
		if(color[i][0].match(name)!=null) return color[i][1];
	}
	return "#000000"; //預設為黑色
}

//======================
//回傳通常標點的位置
//======================
ArticleHandle.findCommonComment = function(str){
	var arr=["，","。"];
	var place=100;
	
	for(var i=0;i<arr.length;i++){
		var comm = str.search(arr[i]);
		if(comm!=-1 && place>comm) place=comm;
	}
	
	return place;
}

//======================
//轉換色碼為rgba形式
//======================
ArticleHandle.TranstoRgba = function(color,opacity){
	var str="rgba(";
	
	str += (parseInt(color[1],16)*16 + parseInt(color[2],16)) + ",";
	str += (parseInt(color[3],16)*16 + parseInt(color[4],16)) + ",";
	str += (parseInt(color[5],16)*16 + parseInt(color[6],16)) + ",";
	str += opacity+")"
	
	return str;
}

//======================
//改變顯示
//======================
function switchDisplay(id,force){
	var display = document.getElementById(id).style.display;
	if(force!=null) 
		document.getElementById(id).style.display = force;
	else
		document.getElementById(id).style.display = (display=="none")? "block": "none";	
}

//======================
//產生下集預告
//======================
ArticleHandle.EditNextEpisode = function(article){
	var new_article = "";
	var arr_line;
	
	if(article=="") return "";
	
	new_article += ArticleHandle.newTrailButton();
	
	new_article += "<div style='padding:5 5 5 5;background:rgba(255,255,255,0.7);border-radius:10px;width:900px;'>";
	new_article += "<div id='next_eps_inner' class='RP_div'>";
	
	article = article.replace(/[\t]/g,"");
	arr_line = article.split(/[\r\n]/g);
	for(var i=1;arr_line[i]!=null;i++){
			if(arr_line[i][0]=="「")	new_article += "<font size=2>"+arr_line[i]+"</font>";
			else						new_article += arr_line[i];
			new_article += "<br>";
	}
	
	new_article += "</div></div>";
	
	return new_article;
}
ArticleHandle.newTrailButton = function(){
	var str="";
	str += "<div class='RP_title' style='background:#A9A9A9;' onclick='switchDisplay("+"next_eps_inner"+");'>";
	str += "下集預告";
	str += "</div>";
	return str;
}