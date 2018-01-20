//蟲鳴之時專用，建立細節表格用的函式

function buildDetailTable(id){
	var str = "";
	var obj = CharInfo[parseInt(id.split("-")[1])-1];
	
	str += "<table border=0>";
	//角色描述
	str += "<tr><td width='300px' style='vertical-align:top;'>";
		str += "<table border=0 width=100% class='Border_T'>";
			str += "<tr><th class='TD_Y'>外貌"
			str += "<tr><td><div style='overflow:auto;height:80px;font-size:12;'>"+obj[0]+"</div>";
			str += "<tr><th class='TD_Y'>經歷"
			str += "<tr><td><div style='overflow:auto;height:120px;font-size:12;'>"+obj[1]+"</div>";
		str += "</table>";
	
	str += "<td width='600px' style='vertical-align:top;'>";
	//角色資料
		str += "<table border=0 class='White_T'>";
			str += "<tr><th width=60><th width=50><th width=100><th width=300>";
			str += "<tr><th class='TD_B' colspan=2>角色能力值"									+ "<th class='TD_B' colspan=2>角色特技";
			str += "<tr><th class='TD_B'>生命力	<td align=center>"+obj[2][0]+"/"+obj[2][1]		+ "<th class='TD_B'>特技名稱	<th class='TD_B'>描述";
			str += "<tr><th class='TD_B'>精神力	<td align=center>"+obj[2][2]+"/"+obj[2][3]		+ getSkillTd(obj[3][0],"TD_SB",1);
			str += "<tr><th class='TD_B'>力量	<td align=center>"+obj[2][4];
			str += "<tr><th class='TD_B'>靈敏	<td align=center>"+obj[2][5]					+ getSkillTd(obj[3][1],"TD_SB",1);
			str += "<tr><th class='TD_B'>慧黠	<td align=center>"+obj[2][6];
			str += "<tr><th class='TD_B'>穩重	<td align=center>"+obj[2][7]					+ getSkillTd(obj[3][2],"TD_SB",1);
			str += "<tr><th class='TD_B'>魅力	<td align=center>"+obj[2][8];
		str += "</table>";
	str += "</table>";
	
	str += "<table border=0>";
	str += "<tr><td width='600px' style='vertical-align:top;'>";
	//蟲資料
		str += "<table border=0 class='White_T'>";
			str += "<tr><th width=60><th width=50><th width=80><th width=50><th width=250>";
			str += "<tr><th class='TD_P' colspan=5>「蟲」";
			str += "<tr><th class='TD_P'>蟲種	<td align=center>"+obj[4][0];
				str += "<th class='TD_P'>體型	<td align=center>"+obj[4][1];
				str += "<td rowspan=2><div style='overflow:auto;height:50px;font-size:13;'>"+obj[4][4]+"</div>";
			str += "<tr><th class='TD_P'>類型	<td align=center>"+obj[4][2];
				str += "<th class='TD_P'>寄宿時間<td align=center>"+obj[4][3]+"年";
			str += "<tr><th class='TD_P'>生命力	<td align=center>"+obj[5][0]+"/"+obj[5][1]		+ getSkillTd(obj[6][0],"TD_SP",2);;
			str += "<tr><th class='TD_P'>戰鬥力	<td align=center>"+obj[5][2];
			str += "<tr><th class='TD_P'>靈敏度	<td align=center>"+obj[5][3]					+ getSkillTd(obj[6][1],"TD_SP",2);;
			str += "<tr><th class='TD_P'>護甲	<td align=center>"+obj[5][4];
		str += "</table>";
	//特殊備註
	str += "<td width='300px' style='vertical-align:top;'>";
		str += "<table border=0 width=100% class='Border_T'>";
			str += "<tr><th class='TD_G'>特殊備註"
			str += "<tr><td><div style='overflow:auto;height:160px;font-size:12;'>";
				for(var i=0;i<obj[7].length;i++){
					str += "<li>"+obj[7][i];
				}
			str += "</div>";
		str += "</table>";

	str += "</table>";
	
	
	
	document.getElementById(id).innerHTML = str;
}

function getSkillTd(obj,cls,width){
	var str = "";
	if(obj != null)
		str += "<th class="+cls+" rowspan=2 title="+obj[2]+">"+obj[0]+"<td colspan="+width+" rowspan=2 title="+obj[2]+"><div style='overflow-y:auto;width:350px;height:50px;font-size:13;'>"+obj[1]+"</div>";
	return str;
}

//===============================
//角色資訊 文本
//===============================
var CharInfo = Array();
//=============吳織羽============
CharInfo[0] = Array();
temp = CharInfo[0];
temp[0] = "　";
temp[1] = "　　五年前成為「附蟲者」，因為在案發現場被發現，與弟弟吳鐵一同被認為是重大事件的犯人，而遭特管追殺。"
		+"<br>　　後為叔叔吳奇所救，雖然仍為蟲所苦，但基本生活已不成問題。"
		+"<br>　　現於「天線」打工，並在叔叔的支援下在大學就讀機械系。"
		+"<p>　　個性精明幹練，在「天線」中兼職會計。"
		+"<br>　　習慣將責任往自己身上擔，但因為上面還有個更自虐的叔叔，所以很少會因此被壓垮。";

temp[2] = [7,7,30,30,0,1,1,0,1];
temp[3] = Array();
	temp[3][0] = ["會計學(2)","管帳、掌握金錢流通的知識。"
						,"效果：可加進經濟、利益談判相關的判定中。"];
	temp[3][1] = ["機械修理(2)","修理簡單機械的基本技巧。"
						,"效果：可加進機械修理相關的判定中。"];
	temp[3][2] = ["察言觀色(1)","從外貌表情、舉止，察覺其感情的技巧。"
						,"效果：可加進「慧黠」對人相關的判定中。"];
temp[4] = ["草蛉","小","特殊型","5",""];
temp[5] = [30,30,"x","x","x"];
temp[6] = Array();
	temp[6][0] = ["共振(4)","使用超音波進行偵測。"
						,"效果：搜索距離為50公尺之內，可加進「慧黠」相關的判定中。"];
	temp[6][1] = ["音頻(4)","使用高頻噪音進行干擾。"
						,"效果：影響距離為30公尺之內，判定成功後，給予目標行動 -3的負面加權。"];
temp[7] = ["【共振】的使用不需另外判定技能，而是直接加入「慧黠」的相關檢定中。",
					"【共振】若加入「慧黠」的相關檢定，仍須進行穩重檢定以減少精神力。",
					"【音頻】的攻擊目標為範圍內全體，抵抗難度為(【音頻】的判定骰)。",
					"【音頻】的影響效果，隨著距離越遠而越弱，每遠離10公尺，給予的行動減值-1。",
					"【音頻】的配點，可在發動前挪至「負面加值」上。",
					"【音頻】的配點，可在發動前挪至「影響距離」上，每單位10公尺。"];
//=============吳鐵============
CharInfo[1] = Array();
temp = CharInfo[1];
temp[0] = "　";
temp[1] = "　　五年前成為「附蟲者」，因為在案發現場被發現，與姐姐吳織羽一同被認為是重大事件的犯人，而遭特管追殺。"
		+"<br>　　後為叔叔吳奇所救，由於神經大條，反倒沒把蟲的問題掛在心上。"
		+"<br>　　偶爾會到「天線」打工，搬些雜物什麼的，但多半時間都在偷懶喝茶。"
		+"<p>　　因為姊姊的個性緣故，性格較為隨和，為人大方，沒什麼煩惱。"
		+"<br>　　體能方面是強項，在姊姊受到欺負或承擔不注的時候會挺身而出。不過由於現在上面有個自虐性格的叔叔，這種事情很少發生。";

temp[2] = [13,13,32,32,2,2,0,-1,0];
temp[3] = Array();
	temp[3][0] = ["長跑(2)","可以持續奔跑而不會耗竭的技巧。"
						,"效果：可加進「靈敏」逃脫相關的判定中。"];
	temp[3][1] = ["空手道(2)","武術。"
						,"效果：近距離攻擊，判定成功後，對目標造成１Ｄ３點傷害。"];
	temp[3][2] = ["察言觀色(1)","從外貌表情、舉止，察覺其感情的技巧。"
						,"效果：可加進「慧黠」對人相關的判定中。"];
temp[4] = ["虎甲蟲","中","分離型","5",""];
temp[5] = [32,32,"5","-1","3"];
temp[6] = Array();
	temp[6][0] = ["啃咬(5)","使用利齒啃咬。"
						,"效果：近距離攻擊，判定成功後，對目標造成２Ｄ６傷害。"];
	temp[6][1] = ["硬化鎧甲(1)","短時間強化外甲。"
						,"效果：《昇華》判定成功後，自己的護甲等級+2，持續時間1回合(1分鐘)"];
temp[7] = ["【空手道】的配點可加進對人攻擊的判定中，但無法發動【空手道】的能力。",
					"【空手道】的配點，可在發動前挪至「傷害」上。",
					"【啃咬】的配點，可在發動前挪至「傷害」上。",
					"【硬化鎧甲】的《昇華》只能加至「護甲等級」中。",
					"【硬化鎧甲】的效果不可疊加、持續時間不會刷新。"];
//=============吳奇============
CharInfo[2] = Array();

//=============蔡政哲============
CharInfo[3] = Array();
temp = CharInfo[3];
temp[0] = "　";
temp[1] = "";//"　　方樂高中的校友之一，與黃祖為過去的同窗。"
		//+"<br>　　個性火爆，臉上帶傷，常常被發現遊蕩於街道四周，被附近的居民視為不良混混。"
		//+"<br>　　在「六足」擔任地區的幹部，權利說大不小，倒是能混口飯吃的程度。"
		//+"<br>　　由於是實力堅強的戰鬥組，在「六足」中時常被用於談判或護衛的工作。"
		//+"<p>　　雖與黃祖為同班同學，但彼此並不太熟。事實上，會想起黃祖這個人也只是因為某次在咖啡廳遇上。"
		//+"<br>　　對於黃祖的印象僅止於：帶著眼鏡的書呆子，偶爾會有怪異的舉動。";

temp[2] = [17,17,22,22,3,2,0,-1,-1];
temp[3] = Array();
	temp[3][0] = ["泰拳(2)","重攻擊的武術。"
						,"效果：近距離攻擊，判定成功後，對目標造成１Ｄ３＋１點傷害。"];
	temp[3][1] = ["威嚇(3)","恐嚇勒索的必要技能，但因為外貌的緣故似乎有常駐發動的傾向。"
						,"效果："];
temp[4] = ["螽斯","小","同化型","6",""];
temp[5] = [17,17,"8","9","2"];
temp[6] = Array();
	temp[6][0] = ["獠牙拳(3)","以生滿倒鉤的凶暴雙拳進行攻擊。"
						,"效果：近戰攻擊。減半護甲的２Ｄ６傷害，附加每回合１Ｄ３，持續三回合的流血傷害。"];
temp[7] = [""];
//=============方達============
CharInfo[4] = Array();

//=============林蘭============
CharInfo[5] = Array();

//=============水哥============
CharInfo[6] = Array();

//=============白玲雅============
CharInfo[7] = Array();
temp = CharInfo[7];
temp[0] = "　綁著一股麻花辮，個性開朗，在學校有著很好的人際關係。";
temp[1] = "　　水目餐廳員工的女兒，在水目餐廳尚存的時候常在水目餐廳幫忙"
		+"<br>　　很受當時的店長與員工們喜愛，視水目餐廳為第二個家。"
		+"<p>　　在水目餐廳爆炸事件發生的時候，正巧不在十三汐鄉，是以當得知水目餐廳被毀，店長及當天值班的店員無一倖免時，幾近崩潰。"
		+"<br>　　在那之後，常常遊蕩至遺址懷念逝去的人們。並在此時被蟲附身。"
		+"<br>　　當得知水目餐廳舊址要被廠商買下，改建成毫不相干的店家時，便決心阻止。";

temp[2] = [10,10,20,20,0,0,2,0,1];
temp[3] = Array();
	temp[3][0] = ["謊言(2)","不被人識破謊言的技巧。"
						,"效果：當對方進行慧黠判定時，可使用此特技的加值進行對抗判定。"];
	temp[3][1] = ["料理(3)","作出美味料理的技能。"
						,"效果：無特殊效果。"];
temp[4] = ["豆娘","大","特殊型","5",""];
temp[5] = [20,20,"x","x","x"];
temp[6] = Array();
	temp[6][0] = ["幻聽(3)","在目標腦內植入僅目標能聽見的幻聽。"
						,"效果：。"];
	temp[6][1] = ["靈騷(5)","移動使用者附近五公尺以內的中小型物體。"
						,"效果：。"];
temp[7] = [""];


//=============孫萱妤============
CharInfo[8] = Array();

//=============謝仁傑============
CharInfo[9] = Array();

//=============周兆泰============
CharInfo[10] = Array();

//=============黃祖============
CharInfo[11] = Array();