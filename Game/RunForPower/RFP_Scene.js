//  Last Modify: 2015/02/15
/*	=================================================/
	Include Class:	Scene
	==================================================*/
/*=====================
	Class :: Scene
=====================*/
function Scene(type, player){
	if(typeof(type)==='undefined') 	 type   = "START";
	if(typeof(player)==='undefined') player = null;
	
	//CONSTANT CONFIG
	TYPE = ["START", "CREATE", "UPGRADE", "GAME_OVER"];
	
	// Public Variables
	var scn = this;
	scn.type = type;
	scn.player = player;
	scn.para   = [];
	
	// Private Variables
	var index = [];
	var depth = 1;
	var end_flag = false;
	
	//=================
	//  Public Function
	//=================
	// :: Control
	scn.InputHandle = function(key){
		switch(key){
			case "UP": //w
				goUp();		break;
			case "DOWN": //s
				goDown(false);	break;
			case "ACT": //space
				goDown(true);	break;
			case "LEFT": //a
			case "RIGHT": //d
				InputHandleByType(key);
				break;
			default:
				return ;
		}
		updateCharByType();
	}
	scn.isEnd = function(){	return end_flag; }
	
	//========
	// :: Access
	scn.getIndex = function(){ return index; }
	scn.getDepth = function(){ return depth; }
	//=================
	//  Private Function
	//=================
	// :: 各場景處理
	function InitializeByType(){
		switch(scn.type){
			case "CREATE":	depth = 1+2; break;
			case "UPGRADE":	depth = 1+1; break;
			default:		depth = 1+0; break;
		}
		for(var i=0;i<depth;i++)	scn.para[i] = [];
		for(var i=0;i<depth;i++)	index.push(1);
		switch(scn.type){
			case "CREATE":	InitOfCreate();	break;
			case "UPGRADE":	InitOfUpgrade();break;
			default:		break;
		}
	}
	// (Just Handle Input:[<-][->])
	function InputHandleByType(key){
		switch(scn.type){
			case "CREATE":	InputOfCreate(key);	break;
			case "UPGRADE":	InputOfUpgrade(key);break;
			case "GAME_OVER":
		}
	}
	function updateCharByType(){
		switch(scn.type){
			case "CREATE":	UpdateOfCreate(); break;
			case "UPGRADE":	UpdateOfUpgrade();break;
			case "GAME_OVER":
		}
	}
	// :: 特別處理
	// :: Create
	function InitOfCreate(){
		var player = scn.player;
		var INIT_SKILL_TYPE = ["BUFF","DAMAGE","CURE"];
		var INIT_CHAR_NAME  = ["黃昏女使","雪風","塚本野乃香","Doge","哈絲默爾"];
		for(var i=0;i<5;i++)	scn.para[0].push("char_"+(i+1)+".png");
		for(var i=0;i<5;i++)	scn.para[2].push(INIT_CHAR_NAME[i]);
		for(var i=0;i<5;i++){
			var skills = scn.para[1][i] = [];
			for(var j=0;j<3;j++){
				skills.push(new Skill(1, INIT_SKILL_TYPE[j], i+1));
			}
		}
	}
	function InputOfCreate(key){
		if(depth==3)	selectIndexInBoundry(key, scn.para[0].length);
		if(depth==2)	selectIndexInBoundry(key, scn.para[1][index[2]-1].length);
		
	}
	function UpdateOfCreate(){
		var player = scn.player;
		player.setNewPlayer(scn.para[2][index[2]-1]);
		player.pic_name =   scn.para[0][index[2]-1];
		player.setPowerTendency(index[2], 3);
		if(depth!=0) return;
		var skill  = scn.para[1][index[2]-1][index[1]-1];
		player.learnSkill(skill);
	}
	// :: Upgrade
	function InitOfUpgrade(){
		var player= scn.player;
		player.upgrade();
		
		var level = scn.player.level;
		scn.para[1].push(level*200);	//HealthPack
		for(var i=0;i<4;i++){
			scn.para[1].push(new Skill(level));
		}
	}
	
	function InputOfUpgrade(key){
		if(depth==2)	selectIndexInBoundry(key, 5);
	}
	function UpdateOfUpgrade(){
		if(depth!=0) return;
		var player = scn.player;
		if(index[1]==1)	player.setMaxHp(player.max_hp + scn.para[1][0]);
		else			player.learnSkill(scn.para[1][index[1]-1]);
	}
	
		
		
		
	//===========
	// Common Move Control
	function goUp(){
		if(depth >= index.length) return;
		depth += 1;
	}
	function goDown(pass){
		if(!pass && depth <= 1) return;
		depth -= 1;
		end_flag = (depth <= 0);
	}
	function selectIndexInBoundry(key, limit){	//loop in 1~limit
		switch(key){
			case "LEFT":
				index[depth-1] += -1;break;
			case "RIGHT":
				index[depth-1] +=  1;break;
		}
		if(index[depth-1] <= 0) 	index[depth-1]=limit;
		if(index[depth-1] >  limit) index[depth-1]=1;
	}
	//===========
	
	// Initialize
	{
		scn.para = [];
		InitializeByType();
		updateCharByType();
	}
}

