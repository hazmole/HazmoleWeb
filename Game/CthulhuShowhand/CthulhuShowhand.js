var MAIN_PANEL;

//===================
// Global Variables
var Opponent_Id;

var Deck = [];
var Hands = [];

var Player_Point;
var Opponent_Point;
var Pool;

var VERSION = 1;
var Die_Times = 0;
var Achievements = [0,0,0,0,0,0,0];

//====================
// Connect to Webpage
function setMainPanel(id){
	MAIN_PANEL = document.getElementById(id);
}
function save(){
	localStorage.setItem("VERSION", VERSION);
	localStorage.setItem("Player_Point", Player_Point);
	localStorage.setItem("Die_Times", Die_Times);
	localStorage.setItem("Achievements", Achievements);
}
function load(){
	Player_Point = localStorage.getItem("Player_Point");
	Die_Times    = localStorage.getItem("Die_Times");
	Achievements = localStorage.getItem("Achievements");
	if(Player_Point==null) 	Player_Point = 200;
	if(Die_Times   ==null) 	Die_Times = 0;
	if(Achievements==null) 	Achievements = [0,0,0,0,0,0,0];
	else					Achievements = (Achievements.split(","));

	var version = VERSION;
	if(version>localStorage.getItem("VERSION"))		Achievements[5]=0;
}

//====================
// Scene
function Scene_Start(){ 
	load();
	buildPage_Start();
}
function Scene_Select(){
	if(Player_Point<=0){
		Player_Point = 200; 
		Die_Times ++;
		save();
		buildPage_Lost();
	}
	else{
		Opponent_Point = 50;
		bulidPage_OpponentSelect();
	}
}
function Scene_Game(){
	// Decks
	Hands = [];
	Hands[0] = [];
	Hands[1] = [];
	// General Deck
	Deck = [];
	for(var i=0;i<52;i++){
		if(i%13>=7)	Deck.push(i+1);
	}
	// Pool Reset
	Pool = 0;
	// build
	buildPage_MainGame();
	game_point_update();
	dealCards_first_hidden();
	// Move
	first_bet();
}

//======================
// Interact
function selectOpponent(id){
	if(id!=null)			Opponent_Id = id;
	if(Opponent_Id==null)	Opponent_Id = 0;
	Scene_Game();
}
function first_bet(){
	changePlayerBet(5);
	changeOpponentBet(5);
	game_point_update();

	game_log("雙方各拿出了5個籌碼放在桌子上。");
	game_panel_update("<button class=\"btn btn-default\" onClick=\"deal()\">繼續</button>");
}
function deal(){
	// Deal
	dealCards(4);
	game_log("牌已發出！<br/>");

	// Opponent Bet
	var max_bet = Math.min(Player_Point,Opponent_Point,10);
	if(max_bet>0){
		changeOpponentBet(max_bet);
		game_point_update();
		game_log_append("<b>"+OPPONENTS[Opponent_Id].name+"</b> 追加了"+max_bet+"個籌碼。");
		game_panel_update(
			"<button class=\"btn btn-default\" onClick=\"follow("+max_bet+")\">跟注！</button>\
			 <button class=\"btn btn-default\" onClick=\"discard()\" style=\"background:#e99e9e;\">放棄……</button>");
	}
	else{
		game_panel_update("<button class=\"btn btn-default\" onClick=\"cast()\">繼續</button>");
	}
}
function follow(val){
	// Follow
	var bet = changePlayerBet(val);
	game_point_update();
	game_log("你跟著拿出了"+bet+"個籌碼。<br/>");
	
	// Player Bet
	var max_bet = Math.min(Player_Point,Opponent_Point);
	if(max_bet>0){
		game_log_append("你是否要加注呢？");
		game_panel_update( 
			 ((max_bet>=5)? "<button class=\"btn btn-default\" onClick=\"bet(5)\">加5注！</button>":"")+
			 ((max_bet>=10)?"<button class=\"btn btn-default\" onClick=\"bet(10)\">加10注！</button>":"")+
			 ((max_bet>=20)?"<button class=\"btn btn-default\" onClick=\"bet(20)\">加20注！</button>":"")+
			 "<button class=\"btn btn-default\" onClick=\"cast()\" style=\"background:#e99e9e;\">這樣就好</button>");
	}
	else{
		game_panel_update("<button class=\"btn btn-default\" onClick=\"cast()\" style=\"background:#e99e9e;\">這樣就好</button>");
	}
}
function bet(val){
	// Handle Bet
	changePlayerBet(val);
	game_point_update();
	game_log("你追加了"+val+"個籌碼。<br/><b>"+OPPONENTS[Opponent_Id].name+"</b> 正在思考……");
	game_panel_update("<button class=\"btn btn-default\" onClick=\"opponent_decision("+val+")\">繼續</button>");
}
function opponent_decision(val){
	// Opponent decision
	var is_discard = false;
	if(Opponent_Id==0){
		is_discard = (randInt(2)>0);
	}
	else{
		;
	}

	if(is_discard){	// 	if Opponent discard this game, show hidden card
		Player_Point += Pool;
		Pool = 0;
		game_point_update();
		game_log("邪神認輸了……欸？真的假的啊？<br/>");

		if(Opponent_Point<=0)	defeatOpponent();

		buildFinishButton();
		save();
	}
	else{		// 	if Opponent follow, show result
		Opponent_Point -= val;
		Pool += val;
		game_point_update();
		game_log("<b>"+OPPONENTS[Opponent_Id].name+"</b>決定跟注！並拿出"+val+"個籌碼。");
		game_panel_update("<button class=\"btn btn-default\" onClick=\"cast()\">繼續</button>");
	}	
}
function cast(){
	var is_cast = 1;
	switch(Opponent_Id){
		case 0: is_cast = Cast_Azatoth(); 	break;
		case 1: Cast_Nyarlathotep();break;
		case 2: Cast_Yog();			break;
		case 3: Cast_Shub();		break;
		case 4: Cast_Cthulhu();		break;
		case 5: Cast_Hastur();		break;
		case 6: Cast_Cthugha(); 	break; 
	}
	if(is_cast)	game_log("邪神似乎使用了某種無以名狀的權能……");
	else		game_log("邪神似乎在發呆……");
	game_panel_update("<button class=\"btn btn-default\" onClick=\"show_result()\">開牌！</button>");
}
function show_result(){
	// show hidden card
	game_show_opponent_hidden_card();
	// show game result
	var is_win = judge(Hands[0], Hands[1]);
	if(is_win){
		Player_Point += Pool;
		game_log("勝利！獲得了 <b>"+Pool+"</b>個籌碼。");
		if(Opponent_Point<=0)	defeatOpponent();
	}
	else{
		Opponent_Point += Pool;
		game_log("唉呀，你失敗了……<br/>桌上的籌碼全部都被拿走了。");
	}
	Pool = 0;
	game_point_update();
	buildFinishButton();
	save();
}
function discard(){
	Opponent_Point += Pool;
	Pool = 0;
	game_point_update();
	game_log("你輸了……嘛，反正損失還不大吧？");
	buildFinishButton();
	save();
}

//=======================
// Move
function dealCards_first_hidden(){
	buildCard("opponent", dealCardFromDeck(), true);
	buildCard("player",   dealCardFromDeck(), false);
}
function dealCards(num){
	for(var i=0;i<2;i++){
		for(var j=0;j<num;j++){
			buildCard( ((i==0)? "opponent": "player"), dealCardFromDeck());
		}
	}
}
function changePlayerBet(val){
	if(Player_Point<val) val = Player_Point;
	Player_Point -= val;
	Pool += val;
	return val;
}
function changeOpponentBet(val){
	if(Opponent_Point<val) val = Opponent_Point;
	Opponent_Point -= val;
	Pool += val;
	return val;
}
function defeatOpponent(){
	game_log_append("<h4>恭喜！你徹底擊敗了 <b>"+OPPONENTS[Opponent_Id].name+"</b>！</h4>");
	Achievements[Opponent_Id]++;
	save();
}

function buildFinishButton(){
	var btn_html = "";
	btn_html += "<button class=\"btn btn-default\" "+((Player_Point>0 && Opponent_Point>0)? 
				"onClick=\"Scene_Game()\"": "disabled")+">再來一次</button>";
	btn_html += "<button class=\"btn btn-default\" onClick=\"Scene_Select()\">回到選單</button>";
	game_panel_update(btn_html);
}

//======================
// Judge
function judge(a_hands, b_hands){
	var a = getCardsCost(a_hands);
	var b = getCardsCost(b_hands);
	console.log("opponent: cost",a);
	console.log("player:   cost",b);

	return (a<b);
}

function guessCardsCost(ori_cards){	// 不知道底牌
	var cards = ori_cards.slice(0);
	var cost = getCardsCost(cards)*5;

	for(var i=0;i<Deck.length;i++){
		cards[0] = getInfoFromCard( Deck[i] );
		cost += getCardsCost(cards);
	}
	return cost/(Deck.length+5);
}
function getCardsCost(ori_cards){
	// 烏龍0、對子1、二對2、三條3、順子4、同花5、葫蘆6、鐵支7、同花順8
	var cost = 0, tb = 0;
	// sort
	var len   = ori_cards.length;
	var cards = ori_cards.slice(0);
	cards.sort(function(a,b){return a.number*10-a.symbo-b.number*10+b.symbo});
	// check combination
	var symbo_count = [0,0,0,0,0];
	var same_symbo_count = 0, symbo_tb = 0;
	var snake_count = 0, snake_tb = 0;
	var qua_count = 0,   qua_tb = 0;
	var tri_count = 0,   tri_tb = 0;
	var twi_count = 0,   twi_tb = 0;
	symbo_count[cards[0].symbo]++;
	for(var i=1;i<len;i++){
		symbo_count[cards[i].symbo]++;
		if(cards[i].symbo == symbo_count.indexOf(Math.max(...symbo_count)) ) symbo_tb = i;
		if(cards[i].number-cards[i-1].number==1){	snake_count++; snake_tb=Math.max(snake_tb, getTiebreaker( cards[i] ) ); }
		else if(cards[i].number-cards[i-1].number>1 && snake_count<4){snake_count=0;snake_tb=0;}

		if(i<=len-1 && cards[i-1].number==cards[i  ].number){ twi_count++; twi_tb=Math.max(twi_tb, getTiebreaker( cards[i  ] ) ); }
		if(i<=len-2 && cards[i-1].number==cards[i+1].number){ tri_count++; tri_tb=Math.max(tri_tb, getTiebreaker( cards[i+1] ) ); }
		if(i<=len-3 && cards[i-1].number==cards[i+2].number){ qua_count++; qua_tb=Math.max(qua_tb, getTiebreaker( cards[i+2] ) ); }
	}
	same_symbo_count = Math.max(...symbo_count);
	symbo_tb = getTiebreaker(cards[symbo_tb]);
	//console.log(cards);
	//console.log(Math.max(...symbo_count), snake_count, qua_count, tri_count, twi_count);

	if(cards[0].number==cards[4].number)	{ cost=9;} //五行
	else if(snake_count>=4 && same_symbo_count>=5) 		{ cost=8; tb=snake_tb;}	//同花順
	else if(qua_count>=1) 					{ cost=7; tb=qua_tb;} //鐵支
	else if(tri_count>=1 && twi_count>=3)	{ cost=6; tb=tri_tb;} //葫蘆
	else if(same_symbo_count>=5)			{ cost=5; tb=symbo_tb;} //同花
	else if(snake_count>=4)					{ cost=4; tb=snake_tb;} //順子
	else if(tri_count>=1)					{ cost=3; tb=tri_tb;} //三條
	else if(twi_count>=2)					{ cost=2; tb=twi_tb;} //雙對
	else if(twi_count>=1)					{ cost=1; tb=twi_tb;} //單對
	else									{ cost=0; tb=getTiebreaker( cards[len-1] );}
	//console.log("cost:",cost, ",tb:", tb);

	return cost+tb;
}
function getTiebreaker(card){
	return card.number*0.01-card.symbo*0.001;
}
//======================
// Deal Card
function dealCardFromDeck(){
	var idx = Math.floor( Math.random() * Deck.length );
	var selected_card = Deck[idx];
	// draw out
	Deck[idx] = Deck[Deck.length-1];
	Deck.pop();
	// return
	return selected_card;
}
function buildCard(user, card_num, is_hidden){
	var u = (user=="player")? 1: 0;
	var symbo = Math.floor((card_num-1)/13)+1;
	var number = ((card_num-1)%13)+1;

	var card_id = (user+"-"+Hands[u].length);
	var card_class   = (is_hidden)? ("card_back "): "";
		card_class  += (symbo==2 || symbo==3)? "red": "";
	var card_content = (is_hidden)? "<img style=\"width:100%;height:100%;\" src=\"./pic/Card-Back.png\">": (POKER_SYMBO[symbo-1]+POKER_NUM[number-1]);
	var card_x = (Hands[u].length*85) + ((Hands[u].length!=0)? 10: 0);
	var card = "<card id=\""+card_id+"\" class=\""+card_class+"\" style=\"left:"+(card_x)+"\">"+card_content+"</card>";
	Hands[u].push( getInfoFromCard(card_num) );

	var hand_obj = (u)? document.getElementById("player_deck"): document.getElementById("opponent_deck");
	hand_obj.innerHTML += card;
}
function getInfoFromCard(card_num){
	var symbo = Math.floor((card_num-1)/13)+1;
	var number = ((card_num-1)%13)+1;	
	return {"symbo":symbo, "number":number};
}

//======================
// Dynamic Update Function
function game_log(text){		document.getElementById("interact_log").innerHTML  = text;}
function game_log_append(text){	document.getElementById("interact_log").innerHTML += text;}
function game_panel_update(panel_html){
	document.getElementById("interact_panel").innerHTML = panel_html;
}
function game_point_update(){
	document.getElementById("play_points").innerHTML = Player_Point;
	document.getElementById("opponent_points").innerHTML = "籌碼<br/>"+Opponent_Point;
	document.getElementById("pool").innerHTML = Pool;
}
function game_show_opponent_hidden_card(){
	var card = Hands[0][0];
	var card_obj = document.getElementById("opponent-0");
	card_obj.classList.remove('card_back');	
	card_obj.innerHTML = (POKER_SYMBO[card.symbo-1]+POKER_NUM[card.number-1]);
}
function game_change_card(user, idx, new_card){
	var u = (user=="player")? 1: 0;
	var card_obj = document.getElementById(user+"-"+idx);
	
	Hands[u][idx] = new_card;
	if(new_card.symbo==2 || new_card.symbo==3)	card_obj.classList.add('red');
	else										card_obj.classList.remove('red');

	if(new_card.number==0)	{	card_obj.innerHTML = "X"; card_obj.style.background="black";card_obj.style.color="red";}
	else if(u!=0 || idx!=0) 	card_obj.innerHTML = (POKER_SYMBO[new_card.symbo-1]+POKER_NUM[new_card.number-1]);
}
//======================
// build Page
function buildPage_Start(){
	var html = [], i=0;
	html[i++] = "<button id=\"button_start\" class=\"btn btn-default\" style=\"top:260px;\" onClick=\"Scene_Select();\">開始遊戲</button>";
	html[i++] = "<div id=\"description\" class=\"abs CenterRow\" \
					style=\"top:40px;height:200px;background:black;color:white;padding:5px;font-size:18px;\">\
						<p>妄圖挑戰不朽的凡人啊……<br/>你是否能靠著機運與膽魄、戰勝那無以名狀的偉大邪神呢？</p>\
						<p>不同於傳統的梭哈，邪神將使役各種不同的強大權能，<br/>準備將你那渺小的自尊心摧殘殆盡。</p><br/>\
						<p>準備好……迎向絕望的深淵吧！</p>\
				</div>";
	buildPage(html);
}
function bulidPage_OpponentSelect(){
	var html = [], j=0;
	html[j++] = "<div class=\"abs CenterRow\" style=\"font-size:20px;top:20px;\"><b>請選擇你的對手</b></div>";
	html[j++] = "<div id=\"description\" class=\"abs CenterRow\" style=\"top:300px;height:120px;background:black;color:white;padding:5px;\"></div>";
	var temp = "";
	for(var i=0;i<OPPONENTS.length;i++){
		if(i==4) continue;
		if(i==3) temp += "<br/>";

		temp += "<span>";
		if(Achievements[i]>=1)
			temp += "<img src=\"./pic/check.png\" class=\"abs\" style=\"width:20px;height:20px;\">";
		temp += "<img class=\"mouseOn\" style=\"width:100px;height:100px;margin:5px;\" src=\"./pic/"+OPPONENTS[i].url+"\" \
								onMouseover=\"displayOpponentContent("+i+")\" \
								onClick=\"selectOpponent("+i+")\" >";
		temp += "</span>";

	}
	html[j++] = "<div class=\"abs CenterRow\" style=\"top:60px;\">\
					<center><div style=\"width:500px;height:220px;background:#aaa;\">"+temp+"<div></center>\
				</div>";
	html[j++] = "<div class=\"abs\"\ style=\"width:100px;height:120px;background:#fff;top:160px;left:20px;\">\
					<div class=\"abs\"\ style=\"background:#a95050;width:100px;text-align:center;\"><h4>死亡次數</h4></div>\
					<div class=\"abs\"\ style=\"width:100px;margin-left:-50px;left:50%;top:50px;font-size:28px;text-align:center;\">"+Die_Times+"</div>\
				</div>";
	html[j++] = "<div class=\"abs\"\ style=\"width:100px;height:120px;background:#fff;top:160px;right:20px;\">\
					<div class=\"abs\"\ style=\"background:#abc8ed;width:100px;text-align:center;\"><h4>持有籌碼</h4></div>\
					<div class=\"abs\"\ style=\"width:100px;margin-left:-50px;left:50%;top:50px;font-size:28px;text-align:center;\">"+Player_Point+"</div>\
				</div>";
	buildPage(html);
}
function buildPage_MainGame(){
	var html = [], j=0;

	html[j++] = "<div class=\"abs\" style=\"height:160px;width:760px;;background:#aaa;\">\
					<img class=\"abs\" style=\"width:100px;height:100px;margin:5px;left:20px;top:10px;\" src=\"./pic/"+OPPONENTS[Opponent_Id].url+"\"\
					onMouseenter=\"showOpponentPoint()\">\
					<div id=\"opponent_point_block\" class=\"abs\" onMouseleave=\"hideOpponentPoint()\"\
					 style=\"display:none;opacity:0.5;width:100px;height:100px;margin:5px;left:20px;top:10px;background:black;color:white;\">\
					 		<div id=\"opponent_points\" class=\"abs\" style=\"width:100px;margin-left:-50px;left:50%;top:5px;font-size:28px;text-align:center;\"></div>\
					 </div>\
					<div class=\"abs\" style=\"width:120px;margin-left:-60px;left:75px;top:120px;text-align:center;\"><b>"+OPPONENTS[Opponent_Id].name+"</b></div>\
					<div class=\"abs\" style=\"width:100px;height:130px;top:15px;left:140px;background:black;\"></div>\
					<div id=\"opponent_deck\" class=\"abs\" style=\"width:600px;height:130px;top:15px;left:140px;border:1px solid black;\"></div>\
				</div>";
	html[j++] = "<div class=\"abs\" style=\"height:160px;width:760px;;background:#000;top:280px;\">\
					<div class=\"abs\"\ style=\"width:100px;height:120px;background:#fff;top:20px;left:20px;\">\
						<div id=\"play_points\" class=\"abs\"\ style=\"width:100px;margin-left:-50px;left:50%;top:50px;font-size:28px;text-align:center;\"></div>\
					</div>\
					<div class=\"abs\"\ style=\"background:#abc8ed;width:100px;top:20px;left:20px;text-align:center;\"><h4>你的籌碼</h4></div>\
					<div class=\"abs\" style=\"width:100px;height:130px;top:15px;left:140px;background:white;\"></div>\
					<div id=\"player_deck\" class=\"abs\" style=\"width:600px;height:130px;top:15px;left:140px;border:1px solid white;\"></div>\
				</div>";
	html[j++] = "<div class=\"abs\"\ style=\"width:100px;height:100px;background:#fff;top:170px;left:20px;border:1px solid black;\">\
					<div id=\"pool\" class=\"abs\"\ style=\"width:100px;margin-left:-50px;left:50%;top:45px;font-size:32px;text-align:center;\">0</div>\
					<div class=\"abs\"\ style=\"background:#d87474;width:100px;left:-1px;text-align:center;border:1px solid black;\"><h4>籌碼</h4></div>\
				</div>";
	html[j++] = "<div id=\"interact_log\"   class=\"abs CenterRow\" style=\"top:170px;width:500px;margin-left:-250px;height:60px;background:#fff;border:1px inset black;padding:5px;\">OOO</div>";
	html[j++] = "<div id=\"interact_panel\" class=\"abs CenterRow\" style=\"top:240px;\">XXX</div>";
	buildPage(html);
}
function buildPage_Lost(){
	var html = [],j=0;

	html[j++] = "<button id=\"button_start\" class=\"btn btn-default\" style=\"top:260px;\" onClick=\"Scene_Select();\">重新開始遊戲</button>";
	html[j++] = "<div id=\"description\" class=\"abs CenterRow\" \
					style=\"top:40px;height:200px;background:black;color:white;padding:5px;font-size:18px;\">\
						你徹底的輸了……<br/>在邪神的權能下，凡人終究只能無力的倒下……<br/><br/>不，真的是這樣嗎？\
				</div>";

	buildPage(html);
}
function buildPage(html_arr){
	MAIN_PANEL.innerHTML = "";
	for(var i=0;i<html_arr.length;i++){
		MAIN_PANEL.innerHTML += html_arr[i];
	}
}

function showOpponentPoint(){	document.getElementById("opponent_point_block").style.display = "block";}
function hideOpponentPoint(){	document.getElementById("opponent_point_block").style.display = "none";}
function displayOpponentContent(id){
	var obj = OPPONENTS[id];
	var text = "";
	text += "<p><h4>"+obj.name+"</h4></p>";
	text += "<div>"+obj.disc+"</div>";
	document.getElementById("description").innerHTML = text;
}


//===========================
// AI Cast
function Cast_Azatoth(){	// 必定獲勝
	if(randInt(20)==0)	return 0;

	for(var i=0;i<5;i++)
		game_change_card("opponent", i, {"symbo":5, "number":13});
	return 1;
}
function Cast_Yog(){		// 任意變更一張表牌
	var best_choice = {"target_idx":0, "new_card":null, "cost":getCardsCost(Hands[0])};
	// Predict & Simulation
	for(var i=1;i<=4;i++){
		var temp_hands = Hands[0].slice(0);
		for(var deck_idx=0;deck_idx<Deck.length;deck_idx++){
			var new_card = getInfoFromCard(Deck[deck_idx]);
			temp_hands[i] = new_card;
			var cost = getCardsCost(temp_hands);
			if(cost>=best_choice.cost){
				best_choice.target_idx = i;
				best_choice.new_card   = new_card;
				best_choice.cost       = cost;
			}
		}
	}
	if(best_choice.target_idx!=0){
		game_change_card("opponent", best_choice.target_idx, best_choice.new_card);
		return 1;
	}
	return 0;
}
function Cast_Nyarlathotep(){	// 跟玩家交換一張牌
	var best_choice = {"target_idx":0, "self_idx":0, "cost": getCardsCost(Hands[0])-getCardsCost(Hands[1]) };
	// Predict & Simulation
	for(var self_idx=1;self_idx<=4;self_idx++){
		for(var target_idx=1;target_idx<=4;target_idx++){
			var temp_self_hands = Hands[0].slice(0);
			var temp_target_hands = Hands[1].slice(0);

			var temp_card = temp_self_hands[self_idx];
			temp_self_hands[self_idx] = temp_target_hands[target_idx];
			temp_target_hands[target_idx] = temp_card;

			var cost = getCardsCost(temp_self_hands)-getCardsCost(temp_target_hands);
			if(cost>=best_choice.cost){
				best_choice.target_idx = target_idx;
				best_choice.self_idx   = self_idx;
				best_choice.cost       = cost;
			}
		}
	}
	if(best_choice.target_idx!=0){
		var temp_card = Hands[0][best_choice.self_idx];
		game_change_card("opponent", best_choice.self_idx, 	 Hands[1][best_choice.target_idx]);
		game_change_card("player",   best_choice.target_idx, temp_card);
		return 1;
	}
	return 0;
}
function Cast_Shub(){		// 多抽２張牌
	buildCard( "opponent", dealCardFromDeck());
	buildCard( "opponent", dealCardFromDeck());
	return 1;
}
function Cast_Cthulhu(){	// ４張即成順子


	return 1;
}
function Cast_Hastur(){		// 選擇玩家一張牌並降低其數字２點
	var best_choice = {"target_idx":0, "target_idx_2":0, "cost": guessCardsCost(Hands[1]) };
	// Predict & Simulation
	for(var i=1;i<=4;i++){
		for(var j=1;j<=4;j++){
			var temp_hands = Hands[1].slice(0);
			temp_hands[i] = {"symbo":Hands[1][i].symbo, "number":Hands[1][i].number-1};
			temp_hands[j] = {"symbo":Hands[1][j].symbo, "number":Hands[1][j].number-1};

			var cost = guessCardsCost(temp_hands);
			if(cost<=best_choice.cost){
				best_choice.target_idx   = i;
				best_choice.target_idx_2 = j;
				best_choice.cost       = cost;
			}
		}
	}
	if(best_choice.target_idx!=0){
		var new_card;
		new_card = Hands[1][best_choice.target_idx];
		new_card.number-=1;
		game_change_card("player", best_choice.target_idx, new_card);

		new_card = Hands[1][best_choice.target_idx_2];
		new_card.number-=1;
		game_change_card("player", best_choice.target_idx_2, new_card);
		
		return 1;
	}
	return 0;
}
function Cast_Cthugha(){	// 隨機燒毀玩家一張牌
	var target_idx = randInt(4)+1;
	game_change_card("player", target_idx, {"symbo":5, "number":0});
	return 1;
}



function randInt(n){return Math.floor( Math.random() * n );}


var OPPONENTS = [
{id:0, url:"Azatoth.png", name:"阿薩拖斯(Azatoth)", disc:"神中之神，擁有無窮強大的力量……但卻是個白癡。"},
{id:1, url:"Nyarlathotep.png", name:"奈亞拉托提普(Nyarlathotep)", disc:"千變萬化的無貌之神，狡猾邪惡、熱衷於玩弄凡人。"},
{id:2, url:"Yog-Sothoth.png", name:"猶格．索托斯(Yog-Sothoth)", disc:"超越時空的億萬光輝球體、門之鑰，通曉過去、現在以及未來的全知者。"},
{id:3, url:"Shub-Niggurath.png", name:"莎布．尼古拉斯(Shub-Niggurath)", disc:"千萬子嗣的黑山羊之母，是豐饒的地母神、孕育一切的母親。"},
{id:4, url:"Cthulhu.png", name:"克蘇魯(Cthulhu)", disc:"沉眠於拉萊耶的深海邪神，遠古地球的統治者，在星辰正位之時將重新復甦。(未完成)"},
{id:5, url:"Hastur.png", name:"哈斯塔(Hastur)", disc:"無以名狀的黃衣之王，毀滅之風已然吹起"},
{id:6, url:"Cthugha.png", name:"克圖格亞(Cthugha)", disc:"北落師門上的烈焰之神，一旦現身，便會將一切燃燒殆盡。"}
]

var POKER_SYMBO = ["♠","♥","♦","♣","※"];
var POKER_NUM   = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];