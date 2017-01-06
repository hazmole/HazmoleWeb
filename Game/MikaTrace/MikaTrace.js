var BOUNDRY = [300,300];
var START_POSITION = [100, 250];
var HEAD_POSITION = [0,0];

var BODY_SIZE  = 16;
var PERIOD= 50;
var DELAY_FRAME  = 2;
var SPEED = 16;

var SENSE_PRIZE = 1.5;
var SENSE_BODY  = 1.1;
var SENSE_OBS   = 1.1;
var OBST_PROB = 100;


// HTML DOM Objects
var OBJ_MAIN, OBJ_SCORE, OBJ_BTN;
var DOBJ_HEAD, DOBJ_PRIZE, DOBJ_BODY_ARRAY = [], DOBJ_OBSTACLE_ARRAY = [];
var BODY_INFO_ARRAY = [];


// Global Variables
var GAME_STATUS = 0;
var DIRECT;
var SCORE;


/*=====================
	Interact Function
=====================*/
function startGame(){
	if(GAME_STATUS) return;
	
	//Disable
	OBJ_BTN.disabled = "disabled";

	//Set Head
	setPosition(DOBJ_HEAD, START_POSITION[0], START_POSITION[1]);
	switchDisplay(DOBJ_HEAD, "block");
	DIRECT = 4;
	//Set Body
	clearBody();

	//Clear Obstacle
	clearObstacle();

	//Set Prize
	setPrize();
	switchDisplay(DOBJ_PRIZE, "block");

	// Init Score
	SCORE = 0;
	printScore();

	// Start
	GAME_STATUS = 1;

	setTimeout("Move()", PERIOD);
}

function InputHandle(event){
	var key = event.keyCode;
	switch(key){
		case 38: //up
			if(DIRECT==8) break;
			DIRECT = 2; break;
		case 40: //down
			if(DIRECT==2) break;
			DIRECT = 8; break;
		case 37: //left
			if(DIRECT==4) break;
			DIRECT = 6; break;
		case 39: //right
			if(DIRECT==6) break;
			DIRECT = 4; break;
		case 32: //space
			console.log(BODY_INFO_ARRAY);
			startGame();
		default:
			break ;
	}
	
	if(BODY_INFO_ARRAY.length>0){
		BODY_INFO_ARRAY[0][1].push({"delay":DELAY_FRAME, "n_dir":DIRECT});
	}

}

function Initialize(){
	OBJ_MAIN = document.getElementById("main");
	OBJ_SCORE= document.getElementById("score");
	OBJ_BTN  = document.getElementById("btn");
	DOBJ_HEAD  = document.getElementById("head");
	DOBJ_PRIZE = document.getElementById("prize");

	setBoundry(OBJ_MAIN);

	document.onkeydown = InputHandle;
}


/*=====================
	Time Function
=====================*/
function Move(){
	if(!GAME_STATUS) return;
	var movement;

	//Move Head
	movement = getMovement(DIRECT);
	moveObject(DOBJ_HEAD, movement[0], movement[1]);
	
	//Move Bodys
	for(var i=0;i<DOBJ_BODY_ARRAY.length;i++){
		if(BODY_INFO_ARRAY[i][1].length>0){ //have waiting queue
			for(var j=0;j<BODY_INFO_ARRAY[i][1].length;j++){
				BODY_INFO_ARRAY[i][1][j].delay -= 1;
				if(BODY_INFO_ARRAY[i][1][j].delay<0){ //pass dir
					//console.log(i, BODY_INFO_ARRAY[i][0]+"=>"+BODY_INFO_ARRAY[i][1][j].n_dir)
					BODY_INFO_ARRAY[i][0] = BODY_INFO_ARRAY[i][1][j].n_dir;
					if(i+1<DOBJ_BODY_ARRAY.length){
						BODY_INFO_ARRAY[i+1][1].push({"delay":DELAY_FRAME, "n_dir":BODY_INFO_ARRAY[i][0]});
					}
				}
			}
			while(BODY_INFO_ARRAY[i][1].length>0 && BODY_INFO_ARRAY[i][1][0].delay<0){
				BODY_INFO_ARRAY[i][1].shift();
			}
		}

		// move
		movement = getMovement(BODY_INFO_ARRAY[i][0]);
		moveObject(DOBJ_BODY_ARRAY[i], movement[0], movement[1]);
	}


	Detect();	

    	setTimeout("Move()", PERIOD);
}
/*=====================*/
function setPrize(){
	var pos = getRandPosInBoundry();
	setPosition(DOBJ_PRIZE, pos.x, pos.y);
}
/*=====================*/
function addObstacle(){
	var len = DOBJ_OBSTACLE_ARRAY.length;
	var id = "obst_"+(len);
	var obst = document.createElement('div');

	obst.id = id;
	obst.className = "block obstacle";

	var pos = getRandPosInBoundry();
	setPosition(obst, pos.x, pos.y);

	OBJ_MAIN.appendChild(obst);

	DOBJ_OBSTACLE_ARRAY.push(obst);
}
function clearObstacle(){
	for(var i=0;i<DOBJ_OBSTACLE_ARRAY.length;i++)
		OBJ_MAIN.removeChild(DOBJ_OBSTACLE_ARRAY[i]);
	DOBJ_OBSTACLE_ARRAY = [];
}
/*=====================*/
function addBody(){
	var len = DOBJ_BODY_ARRAY.length;
	var id = "body_"+(len);
	var body = document.createElement('div');

	body.id = id;
	body.className = "block body";

	var pos = getLastBodyPosition();
	setPosition(body, pos.x, pos.y);

	var next_direct = (len==0)? DIRECT: BODY_INFO_ARRAY[len-1][0];
	OBJ_MAIN.appendChild(body);
	DOBJ_BODY_ARRAY.push(body);
	BODY_INFO_ARRAY.push([0, [{"delay":DELAY_FRAME, "n_dir":next_direct}] ]);
}
function clearBody(){
	for(var i=0;i<DOBJ_BODY_ARRAY.length;i++)
		OBJ_MAIN.removeChild(DOBJ_BODY_ARRAY[i]);
	DOBJ_BODY_ARRAY = [];
	BODY_INFO_ARRAY = [];
}
/*=====================*/
function Detect(){
	if(DetectPrize()){
		addScore(8);
		addBody();
		setPrize();
		var prob = randInt(100);
		if(prob<OBST_PROB)
			addObstacle();
	}
	if(DetectBoundry() || DetectBody() || DetectObstacle())
		Dead();


}

function DetectPrize(){
	var dist = getObjDistanceOfHead(DOBJ_PRIZE);
	if(dist<=BODY_SIZE * SENSE_PRIZE)	return 1;
	return 0;
}

function DetectBoundry(){
	//console.log(HEAD_POSITION, BOUNDRY);
	if(	HEAD_POSITION[0]<=BODY_SIZE/2 || HEAD_POSITION[0]>=(BOUNDRY[0]-BODY_SIZE/2) ||
		HEAD_POSITION[1]<=BODY_SIZE/2 || HEAD_POSITION[1]>=(BOUNDRY[1]-BODY_SIZE/2))
		return 1;
	return 0;
}
function DetectBody(){
	for(var i=0;i<DOBJ_BODY_ARRAY.length;i++){
		if(BODY_INFO_ARRAY[i][0]==0) continue;
		var dist = getObjDistanceOfHead(DOBJ_BODY_ARRAY[i]);
		if(dist<=BODY_SIZE * SENSE_BODY)	return 1;
	}
	return 0;
}
function DetectObstacle(){
	for(var i=0;i<DOBJ_OBSTACLE_ARRAY.length;i++){
		var dist = getObjDistanceOfHead(DOBJ_OBSTACLE_ARRAY[i]);
		if(dist<=BODY_SIZE * SENSE_OBS)	return 1;
	}
	return 0;
}
/*=====================*/
function addScore(point){
	SCORE += point;
	printScore();
}
function printScore(){
	OBJ_SCORE.innerHTML = (SCORE);
}
/*=====================*/
function Dead(){
	GAME_STATUS = 0;
	OBJ_BTN.disabled = false;
}

/*=====================
	Initialize Function
=====================*/
function setBoundry(obj){
	var w = parseInt(obj.style.width.split("px")[0]);
	var h = parseInt(obj.style.height.split("px")[0]);
	
	BOUNDRY = [w, h];
}
/*=====================*/
function moveObject(obj, vx, vy){
	var x = parseInt(obj.style.left.split("px")[0]);
	var y = parseInt(obj.style.top.split("px")[0]);

	setPosition(obj,x+vx,y+vy);
}
/*=====================*/
function setPosition(obj,x,y){
	obj.style.left = x+"px";
	obj.style.top  = y+"px";

	if(obj==DOBJ_HEAD)  HEAD_POSITION = [x, y];
}



function getLastBodyPosition(){
	var len = DOBJ_BODY_ARRAY.length;
	if(len==0){	
		return {"x":HEAD_POSITION[0], "y":HEAD_POSITION[1]};
	}
	else{
		var obj = DOBJ_BODY_ARRAY[len-1];
		var x = parseInt(obj.style.left.split("px")[0]);
		var y = parseInt(obj.style.top.split("px")[0]);
		return {"x":x, "y":y};
	}
}

function getMovement(dir){
	var x_move = 0, y_move = 0;
	switch(dir){
		case 2: y_move = 0-SPEED;break;
		case 4: x_move = SPEED;break;
		case 6: x_move = 0-SPEED;break;
		case 8:	y_move = SPEED;break;
		default:
			break;
	}
	return [x_move, y_move];
}

function getObjDistanceOfHead(obj){
	var x = parseInt(obj.style.left.split("px")[0]);
	var y = parseInt(obj.style.top.split("px")[0]);

	var x_dist = Math.abs(x-HEAD_POSITION[0]);
	var y_dist = Math.abs(y-HEAD_POSITION[1]);

	//return x_dist+y_dist;
	return (Math.sqrt(x_dist*x_dist + y_dist*y_dist));
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

function getRandPosInBoundry(){
	var x = randInt(BOUNDRY[0]-20)+10;
	var y = randInt(BOUNDRY[1]-20)+10;
	return {"x":x, "y":y};
}
function randInt(num){
	return Math.floor(Math.random()*(num+1));
}
