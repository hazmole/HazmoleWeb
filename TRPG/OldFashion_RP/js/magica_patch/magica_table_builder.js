//魔道書大戰專用，建立表格用的函式

//============================
// 建立NPC角色表格
//============================
function buildNpcTable(place){
	var number = CharInfo.length;
	var obj = null;
	var str = "";
	
	for(var i=0;i<number;i++){
		if(i!=0) str += "<hr style='width:100%;'>";
		
		obj = CharInfo[i];
		if(obj==null) continue;
		
		str += "<table border=0>";
		str += "<tr><td rowspan=5>";
			if(obj[0][2]==1) str += "<img src=image/npc_head_0"+(i+1)+".png>";
		str += "<tr><td width=80px><td width=160px><td width=60px><td width=80px><td width=100px>";
		str += "<tr><th class='TD_GG'>名稱	<td>"+obj[0][0];
		str += "	<th class='TD_GG'>類型	<td>"+obj[0][1];
		str += "	<td colspan=4><input style='width:100%;' type=button value='展開秘密' onclick=switchDisplay('"+("info-"+i)+"')>";
		str += "<tr><th class='TD_GG'>描述	<td colspan=4><div style='overflow:auto;width:540px;height:50px;font-size:15;padding:3px;'>"+obj[1]+"</div>";
			if(obj[2].length!=0){
				str += "<tr><th class='TD_GG'>描述備註	<td colspan=4 style='font-size:12px;'>";
				for(var j=0;j<obj[2].length;j++) str += "<li>"+obj[2][j]+"</li>";
			}
		str += "</table>";
		
		str += "<div id='info-"+i+"' style='display:none;'>";
			str += buildSecretIndex(i);
		str += "</div>";
	}
	
	document.getElementById(place).innerHTML = str;
}

function buildSecretIndex(id){
	var str = "";
	var obj = CharInfo[id];
	
	if(obj[3]==0) return "<li>秘密尚未開啟";
	
	str += "<table border=0><tr>";
	str += "<td width=520px style='vertical-align:top;'>";
		str += buildSecretTable(id);
		str += buildMagicTable(id);
	str += "<td width=320px style='vertical-align:top;'>";
		if(obj[6]==0)	str += "<li>非魔法相關人士";
		else 			str += buildSkillTable(obj[8][0], "#808080", obj[8][1], obj[7][8]);
	str += "</table>";
	
	//持有斷章
	if(obj[10]!=null){
		for(var i=0;i<obj[10];i++){
			var base = i*3+11;
			str += buildFragTable(id,base);
		}
	}
	
	return str;
}
function buildSecretTable(id){
	var str = "";
	var obj = CharInfo[id];
	
	str += "<table border=0 class='Border_T'>";
	str += "<tr><th class='TD_BB' colspan=2>" +obj[0][0]+"&nbsp的秘密";
	str += "<tr><th class='TD_BB'>秘密	<td width=420px><div style='overflow:auto;height:70px;font-size:13;padding:3px;'>"+obj[4]+"</div>";
			if(obj[5].length!=0){
				str += "<tr><th class='TD_BB'>秘密備註	<td width=420px style='font-size:12px;'>";
				for(var j=0;j<obj[5].length;j++) str += "<li>"+obj[5][j]+"</li>";
			}
	str += "</table>";
	
	return str;
}
function buildMagicTable(id){
	var str = "";
	var obj = CharInfo[id];
	
	if(obj[6]==0) return "";
	
	str += "<table border=0>";
	str += "<tr><td width=70px><td width=60px><td width=60px><td width=80px><td width=60px><td width=60px><td>";
	str += "<tr><th class='TD_GB' colspan=4>魔法相關："+obj[7][0];
	str += "	<td colspan=3 rowspan=10 style='vertical-align:top;'>"+ buildSpellTable(obj[9]);
	str += "<tr><th class='TD_GB'>名稱	<td colspan=3>"+obj[7][1][0];
		if(obj[6]==2)	str += "<tr><th class='TD_GB'>魔法名	<td colspan=3>"+obj[7][1][1];
		if(obj[6]==1)	str += "<tr><th class='TD_GB'>憑依深度	<td colspan=3>"+obj[7][7];
	str += "<tr><th class='TD_GB'>魔力	<td>"+obj[7][2];
	str += "	<th class='TD_GB'>階梯	<td>"+obj[7][3];
	str += "<tr><th class='TD_GB'>攻擊	<td>"+obj[7][4];
	str += "<tr><th class='TD_GB'>防禦	<td>"+obj[7][5];
	str += "<tr><th class='TD_GB'>根源	<td>"+obj[7][6];
	
	if(obj[7][9]!="")	str += "<tr><th class='TD_GB'>真實<br>姿態	<td colspan=3>"+obj[7][9];
	str += "</table>";
	
	return str;
}
function buildFragTable(id, base){
	var str = "";
	var obj = CharInfo[id];
	
	str += "<table border=0>";
	str += "<tr><td width=70px><td width=60px><td width=60px><td width=80px><td width=60px><td width=60px><td>";
	str += "<tr><th class='TD_P' colspan=7>持有斷章";
	str += "<tr><th class='TD_P'>名稱	<td colspan=3>"+obj[base][1][0];
		str += "	<td colspan=3 rowspan=10 style='vertical-align:top;'>"+ buildSpellTable(obj[base+2],1);
	str += "<tr><th class='TD_P'>特技	<td colspan>"+obj[base+1][1];
	str += "	<th class='TD_P'>領域	<td>"+obj[base+1][0];
	str += "<tr><th class='TD_P'>魔力	<td>"+obj[base][2];
	str += "	<th class='TD_P'>階梯	<td>"+obj[base][3];
	str += "<tr><th class='TD_P'>攻擊	<td>"+obj[base][4];
	str += "<tr><th class='TD_P'>防禦	<td>"+obj[base][5];
	str += "<tr><th class='TD_P'>根源	<td>"+obj[base][6];
	str += "</table>";
	
	return str;
}
//============================
// 建立玩家角色表格
//============================
function buildCharTable(place){
	var number = CharInfo.length;
	var obj = null;
	var str = "";
	
	for(var i=0;i<number;i++){
		if(i!=0) str += "<hr style='width:100%;'>";
		
		obj = CharInfo[i];
		if(obj==null) continue;
		
		str += "<table border=0>";
		str += "<tr><td rowspan=7 width=100px><img src=image/"+((obj[0][4]==1)? ("head_0"+(i+1)+".png"): ("no_image.png"))+">";
		str += "<tr><td width=60px>	<td width=80px><td width=60px><td width=80px><td width=80px><td width=60px><td width=60px><td width=60px><td>";
		str += "<tr><th class='TD_GG'>角色名	<td colspan=3 width=260><font color=#"+obj[0][3]+">■</font>"+obj[0][0];
				str += "<th class='TD_GG'>階梯	<td align=center>"+obj[1][2]+"	<th class='TD_GG'>領域	<td align=center>"+obj[2][2];
		str += "<tr><th class='TD_GG'>魔法名	<td colspan=3 width=260>"+obj[0][1];
				str += "<th class='TD_GG'>真實姿態	<td colspan=4>"+obj[2][4];
		str += "<tr><th class='TD_GG'>玩家		<td colspan=3 width=260>"+obj[0][2];
				str += "<th class='TD_GG' rowspan=2>表之顏	<td colspan=4 rowspan=2>"+obj[6];
		str += "<tr><th class='TD_GG'>性別	<td>"+obj[1][0];
		str += "	<th class='TD_GG'>年齡	<td width=90>"+obj[1][1];
		str += "<tr><th class='TD_GG'>經歷	<td>"+obj[2][0];
		str += "	<th class='TD_GG'>機關	<td width=90>"+obj[2][1];
		str += "	<td colspan=4 style='text-align:center;'><input type=button value='展開詳細資訊' onclick=switchDisplay('"+("info-"+i)+"')>";
		str += "</table>";
		
		str += "<div id='info-"+i+"' style='display:none;'>";
			str += buildDetailTable(i);
		str += "</div>";
	}

	document.getElementById(place).innerHTML = str;
}

function buildDetailTable(id){
	var str = "";
	var obj = CharInfo[id];
	
	str += "<table border=0><tr>";
	str += "<td width=330px style='vertical-align:top;'>";
		str += buildOtherInfo(id);
	str += "<td width=190px style='vertical-align:top;'>";
		str += buildAbilityTable(id);
		str += buildSpellTable(obj[4]);
	str += "<td width=330px style='vertical-align:top;' rowspan=2>";
		str += buildSkillTable(obj[2][2] ,"#"+obj[0][3], obj[3], obj[2][3]);
	str += "<tr><td colspan=2>";
		str += buildAnchorTable(id);
	str += "</table>";
	return str;
}

function buildAbilityTable(id){
	var str = "";
	var obj = CharInfo[id];
	
	str += "<table border=0 class='White_T'>";
		str += "<tr><th class='TD_GB' width=60px>攻擊	<th class='TD_GB' width=60px>防禦	<th class='TD_GB' width=60px>根源";
		str += "<tr><td align=center>"+obj[1][3]+"<td align=center>"+obj[1][4]+"<td align=center>"+obj[1][5];
	str += "</table>";
	
	return str;
}

function buildSpellTable(spell_list, color){
	var str = "";
	
	
	
	str += "<table border=0 class='White_T'>";
		if(color==null)	str += "<tr><th class='TD_GB'>藏書";
		else			str += "<tr><th class='TD_P'>藏書";
		for(var i=0;i<spell_list.length;i++){
			str += "<tr><td width=180px align=left>　"+spell_list[i];
		}
	str += "</table>";
	
	return str;
}

function buildOtherInfo(id){
	var str = "";
	var obj = CharInfo[id];
	
	str += "<table border=0 width=100% class='Border_T'>";
		str += "<tr><th class='TD_Y'>外貌"
		str += "<tr><td><div style='overflow:auto;height:50px;font-size:12;'>"+obj[7]+"</div>";
		str += "<tr><th class='TD_Y'>個性"
		str += "<tr><td><div style='overflow:auto;height:60px;font-size:12;'>"+obj[8]+"</div>";
		str += "<tr><th class='TD_Y'>簡述"
		str += "<tr><td><div style='overflow:auto;height:120px;font-size:13;'>"+obj[9]+"</div>";
	str += "</table>";
	
	return str;
}

function buildAnchorTable(id){
	var str = "";
	var obj = CharInfo[id];
	
	str += "<table border=0 class='White_T' width=100%>";
		str += "<tr><th class='TD_P' width=40 rowspan="+obj[5].length+">錨點"
		for(var i=0;i<obj[5].length;i++){
			var title = "《命運"+obj[5][i][1]+"》《"+obj[5][i][2]+"》";
			
			if(i!=0) str += "<tr>";
			str += "<th class='TD_SP' width=80 title="+title+">"+obj[5][i][0];
			str += "<td title="+title+" style='overflow:auto;font-size:13;'>"+obj[5][i][3];
		}
	str += "</table>";
	
	return str;
}