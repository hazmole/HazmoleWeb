//  Last Modify: 2015/02/14
/*	=================================================/
	Include Class:	Builder
	==================================================*/
/*=====================
	Class :: Builder
=====================*/
function Builder(main_ID){
	if(typeof(main_ID)==='undefined')		main_ID="Main";
	
	//CONSTANT CONFIG
	var COLOR = ["#c32f33","#2e74ea","#1ba341","#f8ed54","#9b07f1","#f487ca","#ffffff"];
	var TEXT_COLOR = "#d6eba4";
	
	var TARGET_ID = main_ID;
	var MAIN_ID = "GAME_SCREEN";
	var PANEL_ID= "PANEL";
	var BATTLE_PARTIAL_ID = ["ENEMY_STATS","PLAYER_STATS"];
	var MSG_BOX_ID = "MSG_BOX";
	
	// Public Variables
	var bdr = this;
	bdr.player_pic = "";
	//=================
	//  Public Function
	//=================
	// :: MAIN BUILD
	bdr.build = function(scene){
		buildScene(scene, true);
	}
	bdr.update = function(scene){
		buildScene(scene, false);
	}
	
	//=================
	//  Private Function
	//=================
	// :: Scene Master Handle
	function buildScene(scene, first_flag){
		switch(scene.type){
			case "START":		buildSceneOfStart(   scene, first_flag);	break;
			case "CREATE":		buildSceneOfCreate(  scene, first_flag);	break;
			case "UPGRADE":		buildSceneOfUpgrade( scene, first_flag);	break;
			case "GAME_OVER":	buildSceneOfGameover(scene, first_flag);	break;
			case "BATTLE":		buildSceneOfBattle(  scene, first_flag);	break;
		}
	}
	// :: 開始畫面
	function buildSceneOfStart(scene, first_flag){	
		if(first_flag){
			var Bs=[], c=0;
			Bs[c++] = gBlock_Size( gObj_Title("虹色狂走"),  "100%", 430, "");
			Bs[c++] = gBlock_Size( gObj_Bar_SpaceToStart(), "100%", 300, "");
			document.getElementById(MAIN_ID).innerHTML = gStructure(Bs, false);
		}
	}
	// :: 結束畫面
	function buildSceneOfGameover(scene, first_flag){	// :: 結束畫面(分兩種)
		if(first_flag){
			var Bs=[], c=0;
			var title_text = (scene.player.hp<=0)? "遊戲結束": "恭喜過關！";
			var text       = (scene.player.hp<=0)? "真遺憾……你下次一定行的。":
												   "太神啦！要再試一次嗎？";
			
			Bs[c++] = gBlock_Size( ""					 ,  "100%", 180, "");
			Bs[c++] = gBlock_Size( gObj_Title(title_text),  "100%",  80, "");
			Bs[c++] = gBlock_Size( gObj_SupportText(text),  "100%", 100, "");
			Bs[c++] = gBlock_Size( gObj_Bar_SpaceToRestart(), "100%", 300, ""); 
			document.getElementById(MAIN_ID).innerHTML = gStructure(Bs, false);
		}
	}
	// :: 新建角色畫面
	function buildSceneOfCreate(scene, first_flag){	
		if(first_flag){
			var Bs = [], c=0;
			Bs[c++] = gBlock_Size( gObj_Bar_TipsOfSelect(),  	 "100%", 25, "");
			Bs[c++] = gBlock_Size( gObj_SubTitle("設定你的角色"),"100%", 60, "");
			Bs[c++] = [	gBlock_Size( gBlock_EmptyPanel( "SELECT_CHAR", ""), 400, 100, "margin-left:50px;"),
						gBlock_Size( gBlock_EmptyPanel( "AFFINITY",    ""), 200, 100, "margin-right:50px;")];
			Bs[c++] = gBlock_Size( gBlock_EmptyPanel( "SELECT_SKILL", ""), 450, 200, "");
			Bs[c++] = gBlock_Size( gBlock_EmptyPanel( "SPACE", ""), 600, 30, "");
			Bs[c++] = gBlock_Size( gObj_MessageOfCreate()		  , 600,150, "");
			document.getElementById(MAIN_ID).innerHTML = gStructure(Bs, false);
		}
		var depth = scene.getDepth();
		var index = scene.getIndex();
		var para  = scene.para;
		document.getElementById("SELECT_CHAR").innerHTML  = gPanel_SelectChar(para[0], para[2], index[2], (depth==3));
		document.getElementById("AFFINITY").innerHTML     = gObj_Char_PowerAffinity(scene.player);
		document.getElementById("SELECT_SKILL").innerHTML = gPanel_SelectPrize(para[1][index[2]-1], index[1], (depth==2));
		document.getElementById("SPACE").innerHTML = gPanel_SpaceToCont((depth==1));
		bdr.player_pic = para[0][index[2]-1];
	}
	
	function buildSceneOfUpgrade(scene, first_flag){	// :: 升級畫面
		if(first_flag){
			var Bs = [], c=0;
			Bs[c++] = gBlock_Size( gObj_Bar_TipsOfSelect(),  	 "100%", 25, "");
			Bs[c++] = gBlock_Size( gObj_SubTitle("升級"),		 "100%", 60, "");
			Bs[c++] = gBlock_Size( gBObj_Upgrade_Character(scene.player), 600, 220, "");
			Bs[c++] = gBlock_Size( gBlock_EmptyPanel( "SELECT_SKILL", ""), 700, 220, "");
			Bs[c++] = gBlock_Size( gBlock_EmptyPanel( "SPACE", ""), 600, 30, "");
			document.getElementById(MAIN_ID).innerHTML = gStructure(Bs, false);
		}
		var depth = scene.getDepth();
		var index = scene.getIndex();
		var para  = scene.para;
		document.getElementById("SELECT_SKILL").innerHTML = gPanel_SelectPrize(para[1], index[1], (depth==2));
		document.getElementById("SPACE").innerHTML = gPanel_SpaceToCont((depth==1));
	}

	function buildSceneOfBattle(scene, first_flag){		// :: 戰鬥畫面
		var player = scene.player;
		var enemy  = scene.enemy;
		if(first_flag){
			var Bs = [], c=0;
			Bs[c++] = gBlock_Size( gObj_Bar_TipsOfBattle(),  	 "100%", 25, gStyle_Margin("0 0 10 0"));
			Bs[c++] = [	[ gBlock_Size( gBObj_Battle_CharBaseBlock(enemy , "ENEMY_HP"), 200, 150, ""),
						  gBlock_Size( gObj_Char_PowerAffinity(enemy),     200, 80, ""),
						  gBlock_Size( gBlock_EmptyPanel( "ENEMY_INFO", ""), 200, 40, ""),
						  gBlock_Size( gBlock_EmptyPanel( "MESSAGE", ""),  200, 450, "")
						],
						gBlock_Size( gBlock_EmptyPanel( "MAP", ""), 340, 680, ""),
						[ gBlock_Size( gBObj_Battle_CharBaseBlock(player, "PLAYER_HP"), 200, 150, ""),
						  gBlock_Size( gBlock_EmptyPanel( "PLAYER_EN", ""), 200, 40, ""),
						  gBlock_Size( gObj_Char_PowerAffinity(player),     200, 80, ""),
						  gBlock_Size( gBObj_CharSkills(player), 200, 245, "")
						]
					  ];
			document.getElementById(MAIN_ID).innerHTML = gStructure(Bs, false);
		}
		document.getElementById("MAP").innerHTML = gBObj_Map(scene);
		document.getElementById("ENEMY_HP").innerHTML = gBObj_HPBar(enemy.hp, enemy.max_hp, "#fff");
		document.getElementById("ENEMY_INFO").innerHTML = gObj_CD_Info(enemy);
		document.getElementById("MESSAGE").innerHTML = gBObj_MessageBox(scene.message);
		document.getElementById("PLAYER_HP").innerHTML = gBObj_HPBar(player.hp, player.max_hp, "#f487ca");
		document.getElementById("PLAYER_EN").innerHTML =  gBObj_PowerBar(player.power);
	}
	//=======================
	// :: 《架構函式》
		function gStructure(text_arr, isHorizon){
			var text  = (isHorizon)? "<tr>": "";
			var perfix= ((isHorizon)? "": "<tr>")+"<td style='"+gStyleVAlgTop()+gStyle_Padding(0)+"'><center>";
			for(var i=0;text_arr[i]!=null;i++){
				if(getClassName(text_arr[i])=="Array")	text += perfix+gStructure(text_arr[i], !isHorizon);
				else									text += perfix+text_arr[i];
			}
			return "<table border=0 cellspacing=0 width=100%>"+text+"</table>";
		}

	//===============
	// :: Panel
		function gPanel_SpaceToCont(triger_flag){
			return (triger_flag)? gObj_Bar_SpaceToCont(): "";
		}
		function gPanel_SelectPrize(prize_list, index, triger_flag){
			var text_list = [];
			for(var i=0;prize_list[i]!=null;i++){
				var obj = prize_list[i];
				text_list[i] = ("Skill"==getClassName(obj))? gBObj_Prize_Skill(obj): gBObj_Prize_HpPack(obj);
			}
			var text = gFrame_Select(text_list, index, triger_flag);
			return (  gBlock_Size( gBlock_Text("==選擇獲得絕招/獎勵==", 14, 1, gStyleColor(null, TEXT_COLOR)),"100%", 20, "") 
					+ gFrame_Selected_Back(text, triger_flag));
		}
		function gPanel_SelectChar(char_img_list, char_name_list, index, triger_flag){
			var text_list = [];
			for(var i=0;char_img_list[i]!=null;i++){
				text_list[i] = gObj_Pic_Small(char_img_list[i], gStyleColor("#555")+gStyle_Padding(2));
			}
			var text = gFrame_Select(text_list, index, triger_flag);
			return (  gBlock_Size( gBlock_Text("==選擇角色："+char_name_list[index-1]+"==", 14, 1, gStyleColor(null, TEXT_COLOR)),"100%", 20, "") 
					+ gFrame_Selected_Back(text, triger_flag));
		}

	//=======================
	// :: 《格式Frame》
		function gFrame_Select(obj_arr, index, back_select_flag){
			var text_arr = [];
			for(var i=0;obj_arr[i]!=null;i++){
				text_arr[i] = gFrame_Selected_Block(obj_arr[i], (index==(i+1)), back_select_flag)
			}
			return gStructure(text_arr, true);
		}
		
		function gFrame_Selected_Back(text, select_flag){
			var color = (select_flag)? "#777": null
			return gDiv_Block  (text, gStyleColor(color)+gStyle_Padding("5px 20px 5px 20px"));
		}
		function gFrame_Selected_Block(text, select_flag, back_select_flag){
			var color = (select_flag)? ( (back_select_flag)? "#fff": "#aaa" ): null;
			return gDiv_Block  (text, gStyleColor(color)+gStyle_Padding("2px"));
		}
	//=======================
	// :: 《大物件Big Object》有多個小物件的大物件
		function gBObj_Battle_CharBaseBlock(character, HP_PANEL){
			var arr = [];
			arr.push( gBlock_Size( gBObj_CharPic(character.pic_name, character.name), 100, 140, gStyle_Padding("10 0 0 0")) );
			arr.push( gBlock_Size( gBlock_EmptyPanel( HP_PANEL, ""), 60, 140, ""));
			var text = gStructure(arr, true);
			return gBlock_Size(text, 165, 140, gStyleColor("#555", "black")+ gStyle_Padding(3));
		}
		
		function gBObj_Upgrade_Character(character){
			var arr = [], c=0;
				arr[c++] = gBObj_CharPic(character.pic_name, character.name)
						+ gBlock_Text("最大生命值："  +character.hp+"↑", 16, 2, gStyleColor(null, "white"))
						+ gBlock_Text("基本攻擊倍率："+character.dmg_base.toFixed(2)+"↑", 16, 2, gStyleColor(null, "white"));
				arr[c++] = gBObj_CharSkills(character);
				
			var text = gBlock_Text("角色的能力值上升了！", 14, 2, gStyleColor(null, TEXT_COLOR)+gStyle_Padding(5));
				text+= gStructure(arr, true);
			return gBlock_Size(text, 400, 200, "");
		}
		
		function gBObj_Prize_HpPack(value){
			var arr = [], c=0;
				arr[c++] = gBlock_Text("增加", 16, 10, "");
				arr[c++] = gBlock_Text( value, 48, 10, "");
				arr[c++] = gBlock_Text("最大生命", 16, 10, "");
			var text = gStructure(arr, false);
			return gBlock_Size(text, 120, 160, gStyleColor(COLOR[5], "black")+ gStyleAlgCent());
		}
		function gBObj_Prize_Skill(skill){
			var arr = [], c=0;
				arr[c++] = gBlock_Text(skill.name, 16, 2, gStyleColor(COLOR[skill.power_type-1], "black"));
				arr[c++] = [ gBlock_Text("Lv."+skill.level,   14, 0, gStyleSize(35, 20)+ gStyleColor("#e0e9c6", "black")+ gStyle_Margin(1)+ gStyleTextWtBold()),
							 gBlock_Text(skill.getTypeText(), 14, 0, gStyleSize(80, 20)+ gStyleColor("#e0e9c6", "black")+ gStyle_Margin(1)) ]
				arr[c++] = gBlock_Size(gObj_Skill_Condition(skill, 10, 10), null, null, gStyle_Padding(1));
				arr[c++] = gObj_Skill_Description(skill, 105, 85);
			return gBlock_Size( gStructure(arr, false) , 120, 160, gStyleColor("#333", "black")+ gStyleAlgCent());
		}
		function gBObj_CharSkills(character){
			var arr = [], c=0;
				arr[c++] = gBlock_Text("絕招", 16, 2, gStyleColor("#e0e9c6", "black")+ gStyleTextWtBold());
			for(var i=0;character.skills[i]!=null;i++)
				arr[c++] = gBObj_Simple_Skill(character.skills[i]);
			return gBlock_Size( gStructure(arr, false) ,190, 250, gStyleColor("#333", "white")+ gStyle_Padding(5)+ gStyleAlgCent());
		}
		
		
		function gBObj_Simple_Skill(skill){
			var arr = [], c=0;
				arr[c++] = gBlock_Text(skill.name, 14, 2, gStyleColor("#bfd189", "black")+ gStyleSize(80, 20));
				arr[c++] = gBlock_Text("A", 14, 2, gStyleColor("white" , "black")+ gStyleSize(20, 20));
				arr[c++] = gObj_Skill_Condition(skill, 5, 24);
				
			return gBlock_Size( gStructure(arr, true) , 180, 26, gStyleColor("black", "white")+ gStyle_Padding(2)+ gStyle_Margin("0 0 1 0")+ gStyleAlgCent());
		}
		
		function gBObj_Map(scene){
			var map = scene.map.map;
			var text_arr = [];
			for(var i=0;map[i]!=null;i++){
				text_arr[i] = [];
				for(var j=0;map[i][j]!=null;j++){
					text_arr[i][j] = gObj_MapBlock(map[i][j], scene.map.isPlayer(j,i));
				}
			}
			return gBlock_Size( gStructure(text_arr, false) , 320, 600, gStyleAlgCent());
		}
		function gBObj_CharPic(img_src, name){
			var text    = "";
			text+= gBlock_Size( gObj_Pic_Medium(img_src, gStyle_Margin(1)), 100, 100, "");
			text+= gBlock_Text(name, 14, 2, gStyleSize (90, 20)+ gStyleColor("#e0e9c6")+ gStyleTextWtBold());
			return text;
		}
		
		function gBObj_HPBar(hp, max_hp, color){
			var MAX_NUM = 16;
			var SIZE    = gStyleSize (50, 5);
			var true_blocks_num = Math.floor((hp/max_hp)*MAX_NUM);
			var text_arr = [];
			for(var i=0;   i<true_blocks_num;i++)
				text_arr.push   (gDiv_Block  ("", SIZE+ gStyleColor(color  )+ gStyle_Margin(1)));
			for(var i=true_blocks_num;i<MAX_NUM;i++)
				text_arr.unshift(gDiv_Block  ("", SIZE+ gStyleColor("black")+ gStyle_Margin(1)));
			text_arr.push   (gDiv_Block  (hp, gStyleSize (50, null)+ gStyleColor("#fde4f3","black")+ gStyle_Margin(1)));
			
			return gBlock_Size( gStructure(text_arr, false) , 60, 150, gStyleAlgCent());
		}
		function gBObj_PowerBar(bar){
			var MAX_NUM = 10;
			var title= gBlock_Text("能量", 14, 2, gStyleSize (50, null)+ gStyleColor("#fde4f3","black")+ gStyleAlgCent()+ gStyleTextWtBold());
			var text_arr = [];
			for(var i=0; i<bar.length; i++)
				text_arr[i] = gObj_Power_Block("", bar[i], 9, 24, "");
			for(var i=bar.length; i<MAX_NUM; i++)
				text_arr[i] = gObj_Power_Block("", 0     , 9, 24, "");
			text_arr.unshift(title);
			
			return gBlock_Size( gStructure(text_arr, true) , 160, null, gStyleColor("#333")+ gStyleAlgCent()+ gStyle_Padding(5));
		}
		
		function gBObj_MessageBox(msg_obj){
			var text_arr = [];
			var length   = msg_obj.massages.length;
			for(var i=0; i<length; i++){
				var opacity = 0.4+0.6*(i+1)/length;
				text_arr[i] = gBlock_Text(msg_obj.getText(i), 12, 1, gStyle_opacity(opacity)+gStyleAlgLeft())
			}
			return gDiv_Block( gStructure(text_arr, false) , gStyleColor("#333","white")+ gStyleSize (190, 230)+ gStyle_Padding(5)+ gStyle_Margin(5)+ gStyleAlgCent());
		}
		
	//=======================
	// :: 《物件Object》寫定部分參數的物件
		function gObj_Title(text)   {return gDiv_Block("<h1>"+text+"</h1>", gStyleColor(null, TEXT_COLOR)+gStyleAlgCent());}
		function gObj_SubTitle(text){return gDiv_Block("<h2>"+text+"</h2>", gStyleColor(null, TEXT_COLOR)+gStyleAlgCent());}
		function gObj_Bar_SpaceToStart(){return gBlock_Bar("---按下[E]開始---", 250, gStyleColor("black", "#fff")+gStyleAlgCent()+gStyle_Margin(2));}
		function gObj_Bar_SpaceToCont(){ return gBlock_Bar("---按下[E]繼續---", 250, gStyleColor("#aaa", "black")+gStyleAlgCent()+gStyle_Margin(2));}
		function gObj_Bar_SpaceToRestart(){ return gBlock_Bar("---按下[E]重新開始遊戲---", 250, gStyleColor("#aaa", "black")+gStyleAlgCent()+gStyle_Margin(2));}
		
		function gObj_SupportText(text){return gDiv_Block(text, gStyleColor(null, TEXT_COLOR)+gStyleAlgCent()+gStyle_TextSize(14));}
		
		function gObj_Bar_TipsOfSelect(){return gBlock_Bar("[A][D]選擇、[E]確定、[W]取消", null, gStyleColor("#555", "#d6eba4")+gStyleAlgCent());}
		function gObj_Bar_TipsOfBattle(){return gBlock_Bar("[A][D][W]移動、[E]攻擊", null, gStyleColor("#555", "#d6eba4")+gStyleAlgCent());}
		function gObj_MessageOfCreate(){ return gBlock_Message(gText_MessageOfCreate(), 500, 120, gStyleColor("black", "#fff")+gStyle_TextSize(12)+gStyle_Margin(2));}
		
		function gObj_Pic_Small (src, style){return gBlock_Picture( addSuffixOfPic(src, ""), gStyleSize(60,60), style);}
		function gObj_Pic_Medium(src, style){return gBlock_Picture( addSuffixOfPic(src, "")  , gStyleSize(90,90), style);}
		function gObj_Pic_Large (src, style){return gBlock_Picture( addSuffixOfPic(src, "_l"), gStyleSize(120,120), style);}
		
		function gObj_Power_Block(text, power_type, w, h, style){return gBlock_ColorBlock(text, w, h, (power_type==0)? "black": COLOR[power_type-1], style);}
		function gObj_MapBlock(map_block, isPlayer){
			var value = (map_block.status==1)? 0: map_block.value;
			var img   = (isPlayer)? gObj_MapBlock_Player(): (map_block.boost>=2 && value!=0)? gObj_MapBlock_Boost(map_block.boost): "";
			return gObj_Power_Block(img, value, 60, 60, gStyle_Margin(2));
		}
		function gObj_MapBlock_Player(){return gObj_Pic_Small(bdr.player_pic, gStyleColor("#555")+gStyle_Padding(0));}
		function gObj_MapBlock_Boost (boost){return gBlock_Picture("X"+boost+".png", gStyleSize(60,60), gStyle_Padding(0));}
		
		function gObj_Skill_Description(skill, w, h){return gBlock_Text( getInfo_Skill_Descript(skill), 14, 2, gStyleSize(w, h)+ gStyleColor("#222", "white")+ gStyle_Margin(1)+ gStyleAlgLeft());}
		function gObj_Skill_Condition(skill, w, h){
			var text_arr = [];
			var power_arr = getInfo_Skill_Condition(skill, 7);
			for(var i=0;power_arr[i]!=null;i++)	text_arr[i] = gObj_Power_Block("", power_arr[i], w, h, gStyle_Margin(1));
			return gStructure(text_arr, true);
			}
		function gObj_Char_PowerAffinity(character){
			var good = gBlock_Text("擅長屬性："+gText_Power(character.good_power, false), 16, 2, "");
			var weak = gBlock_Text("弱點屬性："+gText_Power(character.weak_power, false), 16, 2, "");
			return gDiv_Block(good+weak, gStyleSize(150, null)+ gStyleColor("#333","white")+ gStyle_Padding(10));
		}
		function gObj_CD_Info(character){
			return gBlock_Text("剩餘回合："+character.cd_counter, 16, 2, gStyleSize (160, null)+ gStyleColor("#444", "white")+ gStyleAlgCent());
		}
	//=======================
	// :: 《區塊BLOCK》簡化呼叫基礎DIV函式時所要填入的Style
		
		function gBlock_Bar(text, width, style){	return gBlock_Text(text, 16, 2, gStyleSize(width, null)+ style);}
		function gBlock_Text(text, size, pad, style){	 return gDiv_Block(text, gStyle_TextSize(size)+ gStyle_Padding(pad)+ style);}
		function gBlock_Message(text, width, height, style){return gDiv_Block(text, gStyleSize(width, height)+ gStyleMsg()+ style);}
		function gBlock_ColorBlock(text, width, height, color, style){return gDiv_Block(text, gStyleSize(width, height)+ gStyleColor(color)+ style);}
		
		function gBlock_Picture(src, size, style){return gDiv_Block("<img src='pic/"+src+"' style='"+size+"'>", style);}
		
		function gBlock_EmptyPanel( id, style)	{	return gDiv_IdBlock("", id, gStyleSize()+ style);}
		
		
		//*****《gBlock_Size》決定主架構大小的重要參數*****
		function gBlock_Size(text, width, height, style){return gDiv_Block(text, gStyleSize(width, height)+ style);}
		//*************************************************
		//function gBlock_
	//=======================
	// :: 《基礎DIV函式》<DIV>標籤只能由這裡Access
		function gDiv_Block  (text, style)    {	return "<div style='"+style+"overflow:hidden;'>"+text+"</div>";	}
		function gDiv_IdBlock(text, id, style){	return "<div id='"+id+"' style='"+style+"overflow:hidden;'>"+text+"</div>";}
	//=======================
	// :: 《樣式Style》除非必要，否則一切Style的文字由這裡寫入
		// Style Set/ Fixed Style
		function gStyleColor(bgcolor, color){return gStyle_Background(bgcolor)+ gStyle_TextColor(color); 	}
		function gStyleSize (width, height)	{return gStyle_Width(width)+ gStyle_Height(height); }
		function gStyleMsg(){return gStyleMsgBorder()+gStyleAlgLeft()+gStyle_Padding(5);}
		
		function gStyleAbsPos(){return gStyle_Position("absolute");}
		function gStyleAlgCent(){return gStyle_Align("center");}
		function gStyleAlgLeft(){return gStyle_Align("left");}
		function gStyleVAlgTop(){return gStyle_VAlign("top");}
		function gStyleVAlgBottom(){return gStyle_VAlign("bottom");}
		function gStyleMsgBorder()	{return gStyle_Border("double #fff 3px");}
		function gStyleTextWtBold(){return gStyle_TextWeight("bold");}
		
		
		// Basic/Single Style
		function gStyle_Width(width){	return isDefine(width)?  ("width:" +width +";"): "";}
		function gStyle_Height(height){	return isDefine(height)? ("height:"+height+";"): "";}
		function gStyle_Background(bgcolor){return isDefine(bgcolor)? ("background:"+bgcolor+";"): "";}
		function gStyle_TextColor(color){	return isDefine(color)?   ("color:"+color+";"): "";}
		function gStyle_TextSize(size){	return isDefine(size)?   ("font-size:"+size+";"): "";}
		function gStyle_TextWeight(weight){ return isDefine(weight)? ("font-weight:"+weight+";"): "";}
		function gStyle_Position(position){	return isDefine(position)? ("position:"+position+";"): "";}
		function gStyle_Padding(padding){	return isDefine(padding)? ("padding:"+padding+";"): "";}
		function gStyle_Margin(margin)	{	return isDefine(margin)? ("margin:"+margin+";"): "";}
		function gStyle_Align(align)	{	return isDefine(align)? ("text-align:"+align+";"): "";}
		function gStyle_VAlign(v_align)	{	return isDefine(v_align)? ("vertical-align:"+v_align+";"): "";}
		function gStyle_Border(border)	{	return isDefine(border)? ("border:"+border+";"): "";}
		function gStyle_opacity(opacity){	return isDefine(opacity)? ("filter:alpha(opacity="+(opacity*100)+");-moz-opacity:"+opacity+";opacity:"+opacity+";"): "";}
		//function gStyle_ ( ){	return isDefine( )? (" :"+ +";"): "";}
	//===============
	// :: Text
		function gText_MessageOfCreate(){
			var str = "";
			str += "遊戲規則：";
				str += "<li>透過《移動》收集五種不同的能量，並使用收集的能量《攻擊》敵人</li>";
				str += "<li>　收集的能量越多，造成的傷害越多</li>";
				str += "<li>　收集的能量種類越少，造成的傷害越多</li>";
				str += "<li>藉由組合能量，在攻擊的時候觸發《絕招》</li>";
				str += "<li>在被擊倒之前，先一步擊倒敵人吧！</li>";
			return str;
		}

	//=======================
	// :: 輔助函式
		// :: 簡化判斷
		function isDefine(obj){	return !(typeof(obj)==='undefined');	}
		// :: 獲得資訊
		function getClassName(obj){
			if(obj==null)	return "undefined";
			else			return obj.constructor.name;
		}
		function getWeakPowerType(power_type){
			switch(power_type){
				case 1:	return 2;
				case 2:	return 3;
				case 3:	return 1;
				case 4:	return 5;
				case 5:	return 4;
				default:return power_type;
			}
		}
		// :: 文字處理
		function addSuffixOfPic(pic_name, suffix){
			return pic_name.replace(".",suffix+".");
		}
		// :: 從各類別獲取資訊
		
		function getInfo_Skill_Descript(skill){
			var para = skill.getPara();
			var type = skill.type;
			var power= skill.power_type;
			switch(type){
				case "BUFF": 	return "瞬間提高自己"+(para[1]*100-100).toFixed(0)+"%"+gText_Power(para[0], true)+"的傷害";
				case "DAMAGE":	return "對敵人造成"+para[1]+"點基本"+gText_Power(para[0], false)+"傷害";
				case "CURE":	return "回復自己"+para[0]+"點生命值";
				case "EXTRA":	return "增加自己"+para[1]+"格"+gText_Power(para[0], false)+"屬性能量";
			}
		}
		function getInfo_Skill_Condition(skill, max){	//[0,3,2,0,1] => [2,2,2,3,3,5]
			var condition = skill.getCondition();
			var arr = [];
			for(var i=0;i<5;i++){
				for(var j=0;j<condition[i];j++)
					arr.push(i+1);
			}
			for(;arr.length<max;arr.push(0));
			for(;arr.length>max;arr.shift());
			return arr;
		}
		
		
		function gText_Power(power_type, flag){
			var POWER_TEXT = ["火","水","自然","光","闇","",((flag)?"全":"無")];
			return "<font color="+COLOR[power_type-1]+">"+POWER_TEXT[power_type-1]+"</font>";
		}
		/*
		function gText_BoostPicName(boost){
			return "X"+boost+".png";
		}*/
		// :: BASIC
		function buildGameScreen(){
			var size  = gStyleSize(770, 560);
			var color = gStyleColor("black", "#d6eba4");
			var style = "text-align:center;";
			document.getElementById(TARGET_ID).innerHTML = gDiv_IdBlock("", MAIN_ID, size+ color+ style);
		}
	//=========================
	//Initialize
	{
		buildGameScreen();
	}
}

