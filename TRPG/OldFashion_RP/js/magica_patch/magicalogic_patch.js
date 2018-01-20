//update:2014/6/28
//=========================================
//此js是為了魔道書大戰的團錄而設定的函式庫
//=========================================
// ##char##  ：被以此記號框起的文字，將被當成NPC角色卡的資訊。且接在開始標記後的同一行文字將以粗體表示。
// ##secret##  ：被以此記號框起的文字，將被當成角色的秘密。且接在開始標記後的同一行文字將以粗體表示。
//				 且在secret中，*開頭的文字將以較小的文字大小顯示
// ##scene##  ：被以此記號框起的文字，將被當作場景的資訊。且接在開始標記後的同一行文字將以粗體表示。
// ##battle##  ：接在此記號框起後面的文字，視作戰鬥階段的分界文字。
ArticleHandle.MagicaInfo_Switch = false;

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//    處理特殊標記
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//=========================================
//OverWrite "SpecialHandler(line)"
//=========================================
ArticleHandle.SpecialHandle = function(line){
	if(line.search("##roll##")!=-1)		return ArticleHandle.NewRollInfo(line, "##roll##");
	if(line.search("##hide##")!=-1)		return ArticleHandle.NewHideInfo(line, "##hide##");
	// New 
	
	if(line.search("##char##")!=-1)		return ArticleHandle.NewMagicaInfo(line, "##char##",	null, "#A9A9A9"	, null);
	if(line.search("##secret##")!=-1)	return ArticleHandle.NewMagicaInfo(line, "##secret##",	null, null		, null);
	if(line.search("##scene##")!=-1)	return ArticleHandle.NewMagicaInfo(line, "##scene##",  "95%", null		, null);
	if(line.search("##battle##")!=-1)	return ArticleHandle.NewBattleInfo(line);
	if(line.search("##action##")!=-1)	return ArticleHandle.NewActionInfo(line);
}

//======================
//處理特殊區塊
//======================
ArticleHandle.NewMagicaInfo = function(line, word, width, color, align){
	//Common Config
	if(width==null)			width = "80%";
	if(color==null)			color = ArticleHandle.findColor(line.split(word)[1]);
	if(align==null)			align = "left";
	if(color=="#000000")	color = "#D3D3D3";
	
	
	var str="";
	if(!ArticleHandle.MagicaInfo_Switch){
		str += ArticleHandle.setBlockInfo(width, color, "left");
		str += "<b>"+ line.split(word)[1] +"</b>";
	}
	else{
		str += line.split(word)[0];
		str += "</div>";
		}
	ArticleHandle.MagicaInfo_Switch	= !ArticleHandle.MagicaInfo_Switch;
	ArticleHandle.SpecialHandleFlag = !ArticleHandle.SpecialHandleFlag;
	
	return str;
}

//======================
//處理戰鬥區塊
//======================
ArticleHandle.NewBattleInfo = function(line){
	var text = line.split("##battle##")[1];
	var ends  = (text=="戰鬥開始" || text=="戰鬥結束");
	var width = (ends)? "85%": "80%";
	var color = (ends)? "#aac4d5": "#ccdce6";
	
	var str  = "";
	str  = ArticleHandle.setBlockInfo(width, color, "center");
	str += "<b>"+ text +"</b>"+"</div>";
	return str;
}
ArticleHandle.NewActionInfo = function(line){
	line = line.split("##action##")[1];
	var name = line.split(",")[0];
	var text = line.split(",")[1];
	
	
	var color = ArticleHandle.findColor(name);
	color = ArticleHandle.TranstoRgba(color,"0.4");
	
	
	var str  = "";
	str  = ArticleHandle.setBlockInfo("80%", color, "left");
	str += "<table><tr><td width=160px align=right><b>"+name+"　<td><b>"+text+"</table></div>";
	return str;
}