//  Last Modify: 2015/01/27
/*	=================================================/
	Include Class:	Main
	==================================================
	Needed Class:	Builder, Scene, Battle, Character
			Builder:		build(scene), update(scene)
			Battle/Scene:	InputHandle(key), isEnd()
			Character:		isDead(), getLevel();
	==================================================*/
/*=====================
	Class :: Main
=====================*/
function Main(id){
	if(typeof(id)==='undefined')		id="main_block";
	
	//CONSTANT CONFIG
	var MAIN_ID = id;
	var MAX_LEVEL = 4;	//開放關卡
	// Public Variables
	var main = this;
	// Private Variables
	var Player		= new Character();
	var MainScene   = null;
	var MainBuilder = new Builder(MAIN_ID);
	
	//=================
	//  Public Function
	//=================
	// :: Start Game
	main.start = function(){	newScene("START");}
	main.restart = function(){	newScene("CREATE");}
	
	//=================
	//  Private Function
	//=================
	// :: New Scene
	function newScene(scene_type){
		var depth;
		if(scene_type=="BATTLE")	MainScene = new Battle(Player);
		else						MainScene = new Scene(scene_type, Player);
		setScreen();
		setControl();
	}
	//=========
	// :: Screen
	function setScreen(){
		MainBuilder.build(MainScene);
	}
	function updateScreen(){
		MainBuilder.update(MainScene);
	}
	//=========
	// :: Controller
	function setControl(){	document.onkeydown = InputHandle;}
	function delControl(){	document.onkeydown = null;}
	
	function InputHandle(){
		var key = event.keyCode;
		console.log(key);
		switch(key){
			case 37:
			case 65:
				key = "LEFT";break;
			case 39:
			case 68:
				key = "RIGHT";break;
			case 38:
			case 87:
				key = "UP";break;
			case 40:
			case 83:
				key = "DOWN";break;
			case 32:
			case 69:
				key = "ACT";break;
			default:
				key = "NONE";break;
		}
		MainScene.InputHandle(key);
		Update();
	}
	
	function Update(){
		// Update Graph
		updateScreen();
		console.log(MainScene.isEnd())
		// Switch Case
		if(MainScene.isEnd()){
			delControl();
			SwitchScene();
		}
	}
	function SwitchScene(){
		switch(MainScene.type){
			case "START":
				newScene("CREATE");	break;
			case "CREATE":
				//newScene("UPGRADE");	break;
				newScene("BATTLE");	break;
			case "BATTLE":
				var flag = (Player.isDead() || Player.getLevel() >= MAX_LEVEL);
				if(flag)	newScene("GAME_OVER");
				else		newScene("UPGRADE");
				break;
			case "UPGRADE":
				newScene("BATTLE");	break;
			case "GAME_OVER":
				newScene("CREATE");	break;
		}
	}
	
}


