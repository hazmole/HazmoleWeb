//  Last Modify: 2015/02/14
/*	=================================================/
	Include Class:	Battle, Message, Map, MapBlock
	==================================================*/
/*=====================
	Class :: Battle
=====================*/
function Battle(player){
	if(typeof(player)==='undefined') player = new Character();
	
	//CONSTANT CONFIG
	var CURE_BASE = 0.02;	//   = CURE_HP/MAX_HP
	
	// Public Variables
	var bat = this;
	bat.type = "BATTLE";
	bat.player = player;
	bat.enemy  = null;
	bat.level = player.level;
	bat.map = new Map();
	bat.message = new Messages(10);
	// Private Variables
	var enemy_power_prob = [1,1,1,1,1];
	var end_flag = false;
	
	//=================
	//  Public Function
	//=================
	// :: Control
	bat.InputHandle = function(key){
		if(bat.isBattleEnd()){
			if(key=="ACT")	end_flag = true;
			return ;
		}
		
		switch(key){
			case "LEFT": //left
			case "RIGHT": //right
			case "UP": //up
				if(!bat.map.move(key)) return;
				Move();
				break;
			case "ACT": //space
				if(!Attack()) return ;
				update();
				return ;
			default:
				return ;
		}
		EnemyPhase();
		update();
	}
	// :: Control
	bat.isBattleEnd = function(){
		if(bat.player.hp<=0 || bat.enemy.hp<=0)	return true;
		return false;
	}
	bat.isEnd = function(){
		return end_flag;
	}
	bat.isWin = function(){
		return (bat.enemy.hp<=0);
	}
	
	//=================
	//  Private Function
	//=================
	function Move(){
		var new_power = bat.map.getNowBlock().value;
		var new_boost = bat.map.getNowBlock().boost;
		if(new_power==6)	bat.player.addHp(CURE_BASE*new_boost*bat.player.max_hp);
		else{				
			for(var i=0;i<new_boost;i++)	bat.player.addPower( bat.map.getNowBlock().value );
		}
		bat.map.getNowBlock().status = 1;
	}
	function Attack(){
		if(bat.player.power.length==0) return false;
		bat.player.Attack(bat.enemy);
		return true;
	}
	function EnemyPhase(){
		var attack_flag = bat.enemy.countdownCD();
		if(attack_flag)		bat.enemy.Attack(bat.player);
		else				bat.enemy.addPower( randPick(enemy_power_prob)+1 );
	}
	
	function update(){
		if(bat.isBattleEnd()){
			var text = (bat.player.hp<=0)? "你輸了……": "你贏了！";
			bat.message.add("<center>--"+text+"--</center>");
		}
	}
	
	//===========
	// :: set Enemy Status
	function setEnemy(level){
		var lv = (level>4)? 4: level;
		var power_type = randInt(5)+1;
		
		var name = getEnemyName(lv, power_type);
		var hp   = getEnemyHp(lv, power_type);
		var dmg  = getEnemyDmgBase(lv, power_type)
		var para = getEnemyPara(lv, power_type);
		
		bat.enemy = new Character(name, hp, dmg, para);
		bat.enemy.pic_name = "enemy_"+power_type+"_"+lv+".jpg";
		bat.enemy.symbo_power = power_type;
		bat.enemy.setPowerTendency(power_type, Math.floor(lv*(4/3)));
		enemy_power_prob[power_type-1] += (lv*3);
		
		//bat.enemy.setPreferPower(good);
		//bat.enemy.setPoorPower(poor);
	}
	function getEnemyName(level, symbo_power){
		var text_arr = [];	//RED, BLUE, GREEN, YELLOW, PURPLE
		text_arr[0] = ["大紅怪鳥","熾熱石","地獄巨噬","煉燄魔"];
		text_arr[1] = ["深潛者","磷牙巨鯊","盤古海獸","魔海主宰"];
		text_arr[2] = ["大葉鳥","狂木獸","深森龍靈","地母神的守衛"];
		text_arr[3] = ["光輝使","聖城衛士","白靈龍","神座之獸"];
		text_arr[4] = ["影人","黯蠻蜥","狂夜","外神的僕役"];
		return text_arr[symbo_power-1][level-1];
	}
	function getEnemyHp(level, symbo_power){
		var HP = [1250,2500,5000,10000,20000];
		return HP[level];
	}
	function getEnemyDmgBase(level, symbo_power){
		
		
		//return 0.95 ;//+ 0.1*((level-1)*(7/5) );
		//var DMG_BASE = [0.95,0.95,0.95,0.95,1.2];
		//return DMG_BASE[level];
		return 0.95+(level==4? 0.2: 0);
	}
	function getEnemyPara(level, symbo_power){
		var cooldown_time = 9 - Math.floor(level/2);
		var power_max = 6 + Math.floor(level/2);
		return [cooldown_time, power_max];
	}
	
	
	// Initialize
	{
		setEnemy(bat.level);
		bat.player.ready();
		bat.player.setMsg(bat.message);
		bat.enemy.setMsg(bat.message);
	}
}

/*=====================
	Class :: Message
=====================*/
function Messages(max){
	if(typeof(max) ==='undefined') max=10;
	//CONSTANT CONFIG
	var MAX = max;
	var COLOR = ["c32f33","2e74ea","1ba341","f8ed54","9b07f1","f487ca","ffffff"];
	// Public Variables
	var msg = this;
	msg.massages = new Array();
	//=================
	//  Public Function
	//=================
	msg.add = function(str, color){
		if(typeof(color) ==='undefined') color=7;
		msg.massages.push([str, COLOR[color-1]]);
		if(msg.massages.length > MAX) msg.massages.shift();
	}
	msg.getText = function(idx){
		return "<font color=#"+msg.massages[idx][1]+">"+msg.massages[idx][0]+"</font>";
	}
}

/*=====================
	Class :: Map
=====================*/
function Map(init_x){
	if(typeof(init_x)==='undefined') init_x =2;
	
	//CONSTANT CONFIG
	var WIDTH = 5;
	var HEIGHT = 8;
	var BOOST_PROB = 4;
	// Public Variables
	var mp = this;
	mp.map = [];
	// Private Variables
	var player_x = init_x;
	var player_y = HEIGHT-2;
	
	//=================
	//  Public Function
	//=================
	// :: Refresh/New Map
		mp.SetNewMap = function(){
			mp.map = Array(HEIGHT);
			for(var i=0; i+1<HEIGHT; i++)	mp.map[i] = getNewLine();
			mp.map[i] = getNewLine(false);
			mp.getNowBlock().status = 1;
		}
		mp.setNewLine = function(){
			mp.map.pop();
			mp.map.unshift( getNewLine() );
		}
	// :: player_tag
		mp.isPlayer = function(x,y){return (x==player_x && y==player_y)};
		mp.getNowBlock = function(){
			return mp.map[player_y][player_x];
		}
		mp.canLeft  = function(){return (player_x>0		  && mp.map[player_y][player_x-1].status!=1);}
		mp.canRight = function(){return (player_x<WIDTH-1 && mp.map[player_y][player_x+1].status!=1);}
	// :: Move
		mp.move = function(key){
			switch(key){
				case "LEFT":
					if(!mp.canLeft()) return false;
					player_x -= 1;break;
				case "RIGHT":
					if(!mp.canRight()) return false;
					player_x += 1;break;
				case "UP":
					mp.setNewLine();break;
			}
			return true;
		}
	//=========
	// :: toHTML
		mp.toHTML = function(){
			var str = "<center>";
			str += "<table border=0 bgcolor=black>";
			for(var i=0;i<HEIGHT;i++){
				str += "<tr>";
				for(var j=0;j<WIDTH;j++){
					str += "<td>" + mp.map[i][j].toHTML(mp.isPlayer(j,i)) + "</td>";
				}
			}
			str += "</table>";
			return str;
		}
	
	
	//=================
	//  Private Function
	//=================
	function getNewLine(enable){
		if(typeof(enable)==='undefined') enable=true;
		var new_line = [];
		for(var i=0;i<WIDTH;i++){
			var value = randInt(5+1)+1;
			var status = (enable)? 0: 1;
			var boost = (randInt(100)<BOOST_PROB)? 2: 1;
			new_line.push(new MapBlock(value, status, boost));
		}
		return new_line;
	}
	

	
	
	// Initialize
	{
		mp.SetNewMap();
	}
}

function MapBlock(value, status, boost){
	if(typeof(value) ==='undefined') value=0;	//Power_Kind
	if(typeof(status)==='undefined') status=0;	//has_been_Steped
	if(typeof(boost)==='undefined') boost=1;	//multi
	
	var COLOR = ["c32f33","2e74ea","1ba341","f8ed54","9b07f1","f487ca"];
	
	var block = this;
	block.status = status;
	block.value  = value;
	block.boost  = boost;
	
	//=================
	//  Public Function
	//=================
		block.toHTML = function(isPlayer){
			var color = (block.status==1)? "000000": COLOR[block.value-1];
			var str = "<div style='width:60px;height:60px;text-align:center;padding:2px; background:#"+color+";'>";
			//Icon
			if(isPlayer)					str += gStrPlayer();
			else if(block.boost==2 && block.status!=1)	str += gStrBoost(2);
			str += "</div>";
			return str;
		}
	//=================
	//  Private Function
	//=================
	function gStrPlayer(){		return "<img width=60 height=60 src='pic/char_s.png'>";}
	function gStrHeart(){		return "<img width=60 height=60 src='pic/heart.png'>";}
	function gStrBoost(boost){	return "<img width=60 height=60 src='pic/X"+boost+".png'>";}
	
}

function randInt(num){
	return Math.floor(Math.random()*(num));
}
function randPick(weight_arr){
	var accum_weight_arr = [];
	accum_weight_arr[0] = weight_arr[0];
	for(var i=1;weight_arr[i]!=null;i++)
		accum_weight_arr[i] = accum_weight_arr[i-1] + weight_arr[i];
	for(var i=0;accum_weight_arr[i]!=null;i++)
		accum_weight_arr[i] /= accum_weight_arr[accum_weight_arr.length-1];
	
	var rand = Math.random();
	for(var i=0;;i++)
		if(rand<accum_weight_arr[i]) return i;
}