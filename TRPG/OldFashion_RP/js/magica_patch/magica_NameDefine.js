function buildSkillTable(field, color, skill_list, soul){
	var str = "";
	var bar = [0,0];
	
	//魂之特技
	
	if(soul!=""){
		str += "<table border=0 class='White_T' width=100%>";
		str += "<tr><th class='TD_B' width=80px>魂之特技";
		str += "<td>"+soul;
		str += "</table>";
	}
	
	//特技表
	for(var i=0;i<6;i++){
		if(SkillDefine.field[i] == field) bar[0]=i;
	}
	bar[1] = (bar[0]==5)? 0: bar[0]+1;
	bar[0] = (bar[0]==0)? 5: bar[0];
	
	
	str += "<table border=0>";
	str += "<tr><th colspan=12 class='TD_B'>特技"
	
	str += "<tr>";
	for(var i=0;i<6;i++){
		str += "<td rowspan=12 "+ ((bar[0]==i || bar[1]==i)? "bgcolor=#000": "") + ">";
		str += "<th class='TD_SB'>"+SkillDefine.field[i];
	}
	
	for(var i=0;i<11;i++){
		str += "<tr>";
		for(var j=0;j<6;j++){
			if(matchSkill(SkillDefine.skill[j][i],skill_list)) 	str += "<td bgcolor="+color+" style='border-radius:5px;'>";
			else								str += "<td>";
			str += SkillDefine.skill[j][i];
		}
	}
	
	str += "</table>";
	
	return str;
}

function matchSkill(skill,skill_list){
	for(var i=0;i<skill_list.length;i++){
		if(skill_list[i]==skill) return true;
	}
	return false;
}

function SkillDefine(){
}

SkillDefine.field = new Array("星","獸","力","歌","夢","闇");
SkillDefine.skill = new Array(6);
    SkillDefine.skill[0] = new Array("黃金","大地","森","道路","海","寂靜","雨","嵐","太陽","天空","異界");
    SkillDefine.skill[1] = new Array("肉","蟲","花","血","鱗","混沌","牙","喊叫","憤怒","翼","情色");
    SkillDefine.skill[2] = new Array("重力","風","流動","水","波","自由","衝擊","雷","炎","光","圓環");
    SkillDefine.skill[3] = new Array("物語","旋律","淚","別離","微笑","思念","勝利","戀","熱情","療癒","時間");
    SkillDefine.skill[4] = new Array("追憶","謎","說謊","不安","睡眠","偶然","幻","狂氣","祈禱","希望","未來");
    SkillDefine.skill[5] = new Array("深淵","腐敗","背叛","迷失","怠惰","歪曲","不幸","愚笨","惡意","絕望","死");

