// Global Variables
var MAIN_SCREEN = {}; // member: obj, width, height
var PC = {};		// member: obj, x, y, move_dir, is_jump, is_jumping, g
var LIGHT = {};		// member: obj, x, y, lantern

var SCENE_ID = 0;
var IS_IN_GAME = false;


var CONFIG = {
	fps : 20
}


/*=====================
	Interact Function
=====================*/
function Initialize(){
	// get screen object
	MAIN_SCREEN.obj    = document.getElementById("main");
	MAIN_SCREEN.width  = parseInt(MAIN_SCREEN.obj.style.width.split("px")[0]);
	MAIN_SCREEN.height = parseInt(MAIN_SCREEN.obj.style.height.split("px")[0]);

	// Set Scene
	buildScene(0);

	// set interact panel
	document.onkeydown = handleKeyDown;
	document.onkeyup   = handleKeyUp;
	
	MAIN_SCREEN.obj.onmousemove = handleMouseMove;
	MAIN_SCREEN.obj.onclick = handleMouseClick;
}




function handleKeyDown(event){
	var key = event.keyCode;
	console.log("down:",key);
	switch(key){
		case 87: //up
			PC.is_jump = true;break;
		case 68: //right
			PC.move_dir = 1; break;
		case 65: //left
			PC.move_dir =-1; break;
		case 32: //space
		default:
			break ;
	}

}
function handleKeyUp(event){
	var key = event.keyCode;
	console.log("up:",key);
	switch(key){
		case 87: //up
			break;
		case 68: //right
			if(PC.move_dir== 1) PC.move_dir = 0; break;
		case 65: //left
			if(PC.move_dir==-1) PC.move_dir = 0; break;
		case 32: //space
		default:
			break ;
	}
	
}

function handleMouseMove(event){
	// update Light position
	LIGHT.x = event.screenX;
	LIGHT.y = event.screenY;
	updateLightPosition();
	updateLanternPosition();

}
function handleMouseClick(){
	switch(SCENE_ID){
		case 0:  buildScene(1);	break;
		case 1:  buildScene(10);break;
	}
}

function updateGame(){
	if(!IS_IN_GAME){ return ;}

	// Handle Player
	if(PC.is_jump){
		player_jump();
	}
	if(player_is_on_ground()){
		PC.is_jumping = false;
		PC.g = 0;
	}
	else{
		PC.y += PC.g;
		if(PC.y >= 420) PC.y = 420;
		PC.g = (PC.g==5)? 10: (PC.g==10)? 20: (PC.g==20)? 40: 60;
	}

	player_horizon_move( PC.move_dir );

	
	updatePlayerPosition();

	setTimeout("updateGame()", (1000/CONFIG.fps));
}

/*=====================
	Player Action
=====================*/
function player_horizon_move(dir){
	PC.x += dir * 16;
}
function player_jump(){
	if(!PC.is_jump) return ;
	PC.is_jump = false;

	if(PC.is_jumping) return ;
	PC.is_jumping = true;
	PC.y -= 160;
	PC.g = 5;
}

function player_is_on_ground(){
	return PC.y >= 420;
}

/*=====================
	Building Define
=====================*/
function buildScene(scene_id){
	// Initialize
	$(MAIN_SCREEN.obj).empty();

	SCENE_ID = scene_id;
	switch(SCENE_ID){
		case 0: 	buildScene_Title();		break;
		case 1: 	buildScene_Intro();		break;
		case 10: 	buildScene_Level(0);	break;
	}
}

// ==============
// ID = 0, Title
function buildScene_Title(){
	createLightObject();
	$(MAIN_SCREEN.obj).append("<div id=\"subscreen\"></div>");
	$("#subscreen").append("<div id=\"scene_intro_text\" style=\"margin-top:100px;\">歡迎來到終焉之地。</div>");
	$("#subscreen").append("<div id=\"scene_intro_text\" style=\"font-size:16px;margin-top:120px;\">--點擊滑鼠開始--</div>");
}
// ==============
// ID = 1, Introduction
function buildScene_Intro(){
	$(MAIN_SCREEN.obj).css("background", "#000");
	$(MAIN_SCREEN.obj).append("<div id=\"subscreen\"></div>");
	$("#subscreen").append("<table id=\"scene_intro_table\"><tr><td><div id=\"b1\"></div></td><td><div id=\"b2\"></div></td></tr></table>");
	$("#subscreen #b1").append("<div id=\"scene_intro_text\">[A][D]: 角色左右移動<br>[W]: 角色跳躍</div>");
	$("#subscreen #b1").append("<div class=\"player\"> </div>");

	$("#subscreen #b2").append("<div class=\"lantern light\"></div>");
	$("#subscreen #b2").append("<div id=\"scene_intro_text\" style=\"margin-top:120px;\">使用[滑鼠]移動燈籠<br>[滑鼠左鍵]: 攻擊</div>");

	$("#subscreen").append("<div id=\"scene_intro_text\" style=\"font-size:16px;margin-top:40px;\">--點擊滑鼠繼續--</div>");
}
// ==============
// ID = 10, level-0
function buildScene_Level(lv){
	// Initial
	//createLightObject();
	$(MAIN_SCREEN.obj).css("background", "url(\"./img/level.jpg\")");
	$(MAIN_SCREEN.obj).append("<div id=\"map\"></div>");
	createLantern();
	createPlayer();

	if(lv==0){
		createBlock(1000, 60, 0, 420);
	}


	IS_IN_GAME = true;
	updateGame();
}

// ==============
// Block
function createBlock(w, h, x, y){
	$("#map").append("<div class=\"block\" style=\"width:"+w+"px;height:"+h+"px;left:"+x+"px;top:"+y+"px;\"></div>");
}


// ==============
// Player Object
function createPlayer(){
	$("#map").append("<div class=\"player\"></div>");
	PC.obj = $(".player")[0];
	
	// Initial position
	var screen_rect  = MAIN_SCREEN.obj.getBoundingClientRect();
	PC.x = PC.obj.style.left= 120;
	PC.y = PC.obj.style.top = 420;
	PC.move_dir = 0;
	PC.is_jumping = false;
	PC.is_jump = false;
	PC.g = 0;
}
function updatePlayerPosition(){
	if(PC.obj){
		PC.obj.style.left=PC.x;
		PC.obj.style.top =PC.y;
	}
}


// ==============
// Lantern Object
function createLantern(){
	$("#map").append("<div class=\"lantern\"></div>");
	LIGHT.lantern= $(".lantern")[0];
	updateLanternPosition();
}
function updateLanternPosition(){
	if(LIGHT.lantern){
		var screen_rect = MAIN_SCREEN.obj.getBoundingClientRect();
		LIGHT.lantern.style.left=LIGHT.x - screen_rect.x;
		LIGHT.lantern.style.top =LIGHT.y - screen_rect.y - 100;
	}
}

// ==============
// Light Effect
function createLightObject(){
	$(MAIN_SCREEN.obj).append("<div id=\"hollow\"></div>");
	LIGHT.obj= $("#hollow")[0];
	updateLightPosition();
}
function updateLightPosition(){
	if(LIGHT.obj){
		var screen_rect = MAIN_SCREEN.obj.getBoundingClientRect();
		LIGHT.obj.style.left=LIGHT.x - screen_rect.x;
		LIGHT.obj.style.top =LIGHT.y - screen_rect.y - 100;
	}
}

/*=====================
	Support Define
=====================*/
function switchDisplay(obj, force){
	if(typeof force == 'undefined')
        obj.style.display = (obj.style.display=="block")? "none": "block";
	else
		obj.style.display = force;
}
function randInt(num){
	return Math.floor(Math.random()*(num+1));
}
