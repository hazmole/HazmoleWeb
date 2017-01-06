var SIZE = [10, 7];
var PRE_SIZE = [10, 7];
var CATE_NUM = 64;
var USE_CATE_NUM = 39;
var SELECTED = null;
var MAP;

var COLOR_NS = "#f5f6da";
var COLOR_SD = "#254984";
var BLOCK_SIZE = 50;

var MODE = 0; // 1=NAKA MODE

/*=====================
	Interact Function
=====================*/
function restartGame(){
	SIZE = PRE_SIZE;
	
	//Initialize MAP
	MAP = Array(SIZE[1]);
	for(var i=0;i<SIZE[1];i++){
		MAP[i] = Array();
		for(var j=0;j<SIZE[0];j++){
			MAP[i].push(new Element());
		}
	}
	
	var obj = document.getElementById("main_block");
	setValue(obj);
}

function selectElement(x,y){
	var now_obj = getElement(x,y);
	
	//First Selected
	if(SELECTED==null){
		now_obj.style.background = COLOR_SD;
		SELECTED = [x,y];
		return ;
	}
	//Same Selected
	if(SELECTED[0]==x && SELECTED[1]==y){
		now_obj.style.background = COLOR_NS;
		SELECTED = null;
		return ;
	}
	
	//Normal Work
	var obj = getElement(SELECTED[0],SELECTED[1]);
	now_obj.style.background = COLOR_SD;
	
	//Eliminate Element Pair
	var flag = (MAP[y][x].value==MAP[SELECTED[1]][SELECTED[0]].value) && checkLinking(SELECTED,[x,y]);
	if(flag){
		MAP[SELECTED[1]][SELECTED[0]].status = 0;
		MAP[y][x].status = 0;
		now_obj.style.display = "none";
		obj.style.display = "none";
		
		playSound(getSound(MAP[y][x].value));
		
		if(isWin()){
			alert("YOU WIN!");
		}
		
		//setValue();
	}
	else{
		now_obj.style.background = COLOR_NS;
		obj.style.background = COLOR_NS;
	}
	
	SELECTED = null;
	
}

function resize(){
	var width = document.getElementById("in_W").value;
	var height= document.getElementById("in_H").value;
	
	PRE_SIZE = [width, height];
	
	document.getElementById("W").innerHTML = width ;
	document.getElementById("H").innerHTML = height;
}

function playSound(sound){
	if(sound==null) return ;
	
	var str = "<embed src='" + sound + "' hidden=true autostart=true loop=false>";
	document.getElementById("sound").innerHTML = str;
}

/*=====================
	Checking Function
=====================*/
function checkLinking(A,B){
	var queue = Array();
	var head = 0;
	var tail = 1;
	var x,y, tx,ty;
	var step;

	queue.push([A[0],A[1],0,0]);	//[x, y, dir, step]
	while(head<tail){
		for(var i=1;i<=4;i++){
			if(queue[head][2]!=0 && queue[head][2]%2 == i%2) continue;
			switch(i){
			case 1:	tx = 0; ty = 1; break;
			case 2:	tx =-1; ty = 0; break;
			case 3:	tx = 0; ty =-1; break;
			case 4:	tx = 1; ty = 0; break;
			}
			x = queue[head][0]+tx;
			y = queue[head][1]+ty;
			step = queue[head][3];
			
			while(isBoundry(x,y)){
				if(step < 2){
					queue.push([x,y,i,step+1]);
					tail++;
				}
				
				x += tx; y += ty;
			}
			if(x==B[0] && y==B[1]) return true;
		}
		head++;
	}
	
	
	return false;
}

/*=====================
	Giving Value Function
=====================*/
function setValue(obj){
	var total = 0;
	
	// Counting Total
	for(var i=0;i<SIZE[1];i++){
		for(var j=0;j<SIZE[0];j++){
			total += MAP[i][j].status;
		}
	}
	
	
	// set Array
	var arr = Array(total);
	var num_arr = Array(USE_CATE_NUM);
	var U_set = Array(CATE_NUM);
	var U_count = CATE_NUM;
	
	for(var i=0; i<CATE_NUM; i++){
		U_set[i] = i+1;
	}
	
	for(var i=0; i<USE_CATE_NUM; i++){
		var value = randInt(U_count-1);
		num_arr[i] = U_set[value--];
	}
	
	for(var i=0; i<Math.floor(total/2); i++){
		var value = randInt(USE_CATE_NUM-1);
		arr[i] = arr[i+Math.floor(total/2)] = num_arr[value];
	}
	
	//Write in Map
	var count = 0;
	for(var i=0;i<SIZE[1];i++){
		for(var j=0;j<SIZE[0];j++){
			if(MAP[i][j].status==0) continue;
			if(MODE==1){
				MAP[i][j].value = 36;
				continue;
				}
			var index = randInt(--total);
			MAP[i][j].value = arr[index];
			arr[index] = arr[total];
		}
	}
	
	//Create HTML Code
	obj.style.width  = SIZE[0]*60 + 20;
	obj.style.height = SIZE[1]*60 + 20;
	obj.innerHTML = createTable();
	
	SELECTED = null;
	
	return ;
}

// rand a integer
function randInt(num){
	return Math.floor(Math.random()*(num+1));
}
/*=====================
	Building Function
=====================*/
function createTable(){
	var str = "<table style='margin:10 10 10 10;'>";
	
	for(var i=0;i<SIZE[1];i++){
		str += "<tr>";
		for(var j=0;j<SIZE[0];j++){
			str += "<td width='"+(BLOCK_SIZE+7)+"px' height='"+(BLOCK_SIZE+7)+"px'>"
			str += createElement(j,i);
			str += "</td>"
		}
	}
	
	str += "</table>";
	
	return str;
}

function createElement(x,y){
	var str = "";
	var status = (MAP[y][x].status==1)? "block": "none";
	var value = MAP[y][x].value;
	
	str += "<div id='"+x+"-"+y+"' class='block' style='background-color: "+COLOR_NS+"; display:"+status+";'";
	str += " onclick='selectElement("+x+","+y+");'>";
	str += getPicture(value);
	str += "</div>";
	
	return str;
}

/*=====================
	Support Define
=====================*/
function getElement(x,y){
	return document.getElementById(x+"-"+y);
}

function getPicture(num){
	var path = "pic/";
	var name = ((num<10)? "0"+num: num)+".png";
	var url = path+name;
	
	return "<img src="+url+" width="+BLOCK_SIZE+"px height="+BLOCK_SIZE+"px>";
}

function getSound(num){
	
	var path = "se/";
	var name = ((num<10)? "0"+num: num)+".mp3";
	var url = path+name;
	
	return url;
}

function isBoundry(x,y){
	if((x< -1 || y< -1 || x> SIZE[0] || y> SIZE[1])) return false;
	if((x==-1 || y==-1 || x==SIZE[0] || y==SIZE[1])) return true;
	
	return (MAP[y][x].status==0);
}

function isWin(){
	for(var i=0;i<SIZE[1];i++){
		for(var j=0;j<SIZE[0];j++){
			if(MAP[i][j].status==1) return false;
		}
	}
	
	return true;
}

/*=====================
	Class Define
=====================*/
function Element(value){
	if(typeof(value)==='undefined') value=0;
	
	this.status = 1;
	this.value  = value;
}
