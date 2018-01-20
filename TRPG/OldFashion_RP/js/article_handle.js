//update:2014/6/28s
//=========================================
//此js是為了一般的團錄而設定的函式庫
//=========================================
// ##roll##  ：被以此記號框起的文字，將被當成判定的相關資訊。且接在開始標記後的同一行文字將代表擲骰者的名稱。
// ##outer## ：被以此記號框起的文字，將被當成場外的相關資訊。

var special_word = ["##roll##","##outer##"];
var RollDice_Switch = false;
var Outer_Switch = false;

//======================
//將團錄文字轉成表格並上色
//======================
function editArticle(id, color_arr){
	var article = document.getElementById(id).innerHTML;
	var new_article = "";
	var arr_line;
	
	article = article.replace(/[\t]/g,"");
	
	new_article = "<table width=880px border=0 style='line-height:1.4;'>"
	
	arr_line = article.split(/[\r\n]/g);
	for(var i=1;arr_line[i]!=null;i++){
		new_article += SingleLineEdit(arr_line[i],color_arr)
	}
	
	new_article += "</table>"
	
	document.getElementById(id).innerHTML = new_article;
	}
//======================
//單行處理
//======================
function SingleLineEdit(line, color_arr){
	var temp = line.search("：");
	var quote_place = findCommentPlace(line);
	temp = (temp==-1)? line.search(":"): temp;
	quote_place = (temp==-1 || temp>30 || quote_place<temp)? 0: temp;	//引號位置
	
	var name = line.slice(0,quote_place);	//說話者
	var content = line.slice(quote_place+1);//說話內容
	var color=findColor(name, color_arr);	//角色代表色
	
	var str = "";
	
	if(getSpecial(line)){
		str += SpecialHandler(line,getSpecial(line), color_arr);
	}
	else if(!check_div() && name!="" && content!=null){
		str += "<tr><td style='width:160;vertical-align:top;text-align:right;font-weight:bold;color:"+color+";'>";
		str += name+"：";
		str += "<td style='text-align:left;color:"+color+";'>" + content;
	}
	else if(line==""){
		str += "<br>&nbsp";
	}
	else{
		str += (Outer_Switch)? "&#10;": "<br>";
		str += line;
	}
	return str;
}
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//    處理特殊標記
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

function SpecialHandler(line, word, color_arr){
	var str="";
	var flag = true;
	var width = "80%";
	var color = "#D3D3D3";
	var align = "left";
	var addition = "";
	var tail = "";
	
	if(word=="##roll##"){
		RollDice_Switch = !RollDice_Switch;
		flag = RollDice_Switch;
		
		color=findColor(line.split(word)[1], color_arr);
		color = TranstoRgba(color,"0.4");
		addition = " 的判定";
	}
	if(word=="##outer##"){
		Outer_Switch = !Outer_Switch;
		flag = Outer_Switch;
		color = "rgba(0,0,0,0)";
		width = "90%";
		align = "right";
		
		tail = NewOuterInfo(line);
		if(flag==false) line=NewOuterInfo(line);
	}
	if(flag){
		str += setBlockInfo(width, color, align);
		str += "<b>"+ line.split(word)[1]+addition +"</b>"+tail;
	}
	else 
		str += line.split(word)[0] +"</div>";
	
	return str;
}

//======================
//產生區塊
//======================
function setBlockInfo(width,color,align){
	var str="";
	width = (width==null)? "80%": width;
	color = (color==null)? "#d0d0d0": color;
	align = (align==null)? "left": align;
	
	str += "<tr><td colspan=2'><center>";
	str += "<div style='width:"+width+";background-color:"+color+";border-radius:8px;padding:5 10 5 10;text-align:"+align+";'>";
	
	return str;
}
//======================
//識別特殊文字
//======================
function getSpecial(line){
	for(var i=0;i<special_word.length;i++){
		var temp = special_word[i];
		if(line.search(temp)!=-1) return temp;
	}
	
	return false;
}

//======================
//新建場外區塊
//======================
function NewOuterInfo(line){
	var str="";
	
	if(Outer_Switch){
		str += "<div title='";
	}
	else{
		str += "'>場外■</div>";
		}
	
	return str;
}



//======================
//是否正在進行特殊標記
//======================
function check_div(){
	return (RollDice_Switch || Outer_Switch);
}

//======================
//產生下集預告
//======================
function editNextEpisode(id){
	var article = document.getElementById(id).innerHTML;
	var new_article = "";
	var arr_line;
	
	article = article.replace(/[\t]/g,"");
	
	arr_line = article.split(/[\r\n]/g);
	for(var i=1;arr_line[i]!=null;i++){
			if(arr_line[i][0]=="「")	new_article += "<font size=2>"+arr_line[i]+"</font>";
			else						new_article += arr_line[i];
			
			new_article += "<br>";
	}
	
	//自動產生相關連結
	var name = document.URL.split("/");
	name.splice(0,name.length-1);
	name = name[0].split(".")[0];
	var num = parseInt(name.split("_")[1]);
	name = name.split("_")[0]+"_";
	
	var prev_URL = name+(num-1)+".html";
	var next_URL = name+(num+1)+".html";
	
	new_article += "<table border=0><tr>";
	new_article += "<td width=80>";
		if(num-1 >= 0) new_article += "<a href="+prev_URL+"><div class='White_Square'>前回</div></a>";
	new_article += "<td width=80>";
		new_article += "<a href="+next_URL+"><div class='White_Square'>次回</div></a>";
	
	document.getElementById(id).innerHTML = new_article;
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//    其它雜項
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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
//回傳名字的對應顏色
//======================
function findColor(name, color_arr){
	if(name=="") return "#000000";
	
	for(i=0;i<color_arr.length;i++){
		if(color_arr[i][0].match(name)!=null) return color_arr[i][1];
	}
	
	return "#000000";
}
//======================
//回傳通常標點的位置
//======================
function findCommentPlace(str){
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
function TranstoRgba(color,opacity){
	var str="rgba(";
	
	str += (parseInt(color[1],16)*16 + parseInt(color[2],16)) + ",";
	str += (parseInt(color[3],16)*16 + parseInt(color[4],16)) + ",";
	str += (parseInt(color[5],16)*16 + parseInt(color[6],16)) + ",";
	str += opacity+")"
	
	return str;
}