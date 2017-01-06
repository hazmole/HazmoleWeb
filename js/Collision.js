//  Last Modify: 2015/01/17 18:49
/*	=================================================/
	Include Class:	Vector, Ball, Collision
	==================================================*/
/*	==================================================
	To Use Collision.
	You should create a Collision Object C for handle the collision.
	then, Create Ball Objects , then add them into the Collision Object C, by using "C.addBall(ball)" or "C.setBalls(ball_array)"
	Otherwise, Create a public function F, which calling "C.Move()".
	
	After Website loaded its HTML Code, Calling "C.startMove(F)" to start the Collision.
	*/
/*	==================================================
	To Create Ball.
		B = new Ball(ball_id, x, y, radius, speed, color);
	"ball_id" will be use by Collision Object, to create <div> object.
	"speed" is a Vector Object.
	"color" is a String which format is "rgba(R, G, B, Opacity)"
	*/
/*	==================================================
	To Create Vector.(just support 2-d Vector)
		V = new Vector(x, y);
	*/


/*====================
	Class::Collision
====================*/
function Collision(id, h, w, period, cl_flag, mv_flag){
	if(typeof(id)==='undefined')id="move_block";
	if(typeof(h)==='undefined')	h=100;
	if(typeof(w)==='undefined')	w=100;
	if(typeof(perod)==='undefined')	period=40;
	if(typeof(cl_flag)==='undefined')	cl_flag=true;
	if(typeof(mv_flag)==='undefined')	mv_flag=true;

	var colsn = this;
	//Constant Setting	
	var BLOCK_ID = id;	//Collision Block's Object-Id in HTML
	var HEIGHT = h;		//Collision Block's Height
	var WIDTH  = w;		//Collision Block's Width
	var PERIOD = period;	//Period Time per Move
	colsn.ableCollision = cl_flag;	//Enable Collision or not
	colsn.ableMovement  = mv_flag;	//Enable Moving Or not
	//Variables
	var Ball_Array = Array();	//Balls in the Collision Event
	
	//==============================
	// ** Public Function
	//==============================
	// :: Test function
		colsn.test = function(){
			isBlockAble();
		}
	//==============
	// ::Set Balls Array
		colsn.setBalls = function(balls){	//typeof(balls) = Class::Array of Class::Ball
			Ball_Array = balls;
		}
		colsn.addBall = function(ball){		//typeof(ball) = Class::Ball
			Ball_Array.push(ball);
		}
	//==============
	// ::Start Function, after Calling this, the Collision Event Start
		colsn.startMove = function(func){	//typeof(func) = String, which is the Main Function's Name
			if(!isBlockAble()) return;
			
			setBoundry();
			buildBalls();
			for(var i=0;i<Ball_Array.length;i++){
				Ball_Array[i].show();
			}
			setTimeout(func, PERIOD);
		}
	// ::Moving function
	
		colsn.Move = function(func){	//typeof(func) = String, which is the Main Function's Name
			// Counting Collision
			if(colsn.ableCollision){
				for(var i=0;i<Ball_Array.length;i++){
					for(var j=i+1;j<Ball_Array.length;j++){
						if(Ball_Array[i].isCollision(Ball_Array[j])){
							Ball_Array[i].collision(Ball_Array[j]);
						}
					}
				}
			}
			// Moving Balls
			for(var i=0;i<Ball_Array.length;i++){
				Ball_Array[i].move(WIDTH,HEIGHT);
				Ball_Array[i].show();
			}
			if(colsn.ableMovement)
				setTimeout(func, PERIOD);
		}
	
	//==============================
	// ** Private Function
	//==============================
	// ::Tight HTML Block
		function isBlockAble(){
			if(null==document.getElementById(BLOCK_ID)){
				alert("You have no Object name '"+BLOCK_ID+"' in your HTML Code. Maybe your Website hadn't Load it yet.");
				return false;
			}
			return true;
		}
		function setBoundry(){
			var obj = document.getElementById(BLOCK_ID);
			WIDTH  = parseInt(obj.style.width );
			HEIGHT = parseInt(obj.style.height);
		}
		function buildBalls(){
			var obj = document.getElementById(BLOCK_ID);
			var len = Ball_Array.length;
			var str = "";
			
			for(var i=0;i<len;i++){
				str += "<div id='"+(Ball_Array[i].id)+"' class='onMouse'></div>";
			}
			obj.innerHTML += str;
		}
	
}


/*====================
	Class::Ball
====================*/
function Ball(id, x, y, r, speed, color){
	if(typeof(x)==='undefined')	x=0;
	if(typeof(y)==='undefined')	y=0;
	if(typeof(r)==='undefined')	r=1;
	if(typeof(speed)==='undefined')	speed=new Vector(0,0);
	if(typeof(color)==='undefined')	color="Red";
	
	var ball = this;
	ball.id = id;
	
	ball.x = x;
	ball.y = y;
	ball.r = r;
	
	ball.color = color;
	ball.text  = "";
	ball.speed = speed;
	
	{
		var obj = document.getElementById(ball.id);
			}
	
	ball.move  = function(w,h){
		if((ball.x+ball.r>= w && ball.speed.x>0) || (ball.x-ball.r<=0 && ball.speed.x<0))	ball.speed.x *= -1;
		if((ball.y+ball.r>= h && ball.speed.y>0) || (ball.y-ball.r<=0 && ball.speed.y<0))	ball.speed.y *= -1;
		
		//ball.speed = ball.speed.mult(0.99);
		
		ball.x += ball.speed.x;
		ball.y += ball.speed.y;
	}
	ball.collision = function(b){
		//alert("Hit!");
		
		var link = ball.getLink(b);
		var norm = link.getNorm();
		
		var v1 = ball.speed.project(link);
		var v2 =    b.speed.project(link);
		
		if(link.dot(v1)<0 && link.dot(v2)>0) return ;
		
		var v = ball.oneDimCollision(ball.r, v1, b.r, v2);
		
		ball.speed = v[0].plus(ball.speed.project(norm));
		b.speed    = v[1].plus(   b.speed.project(norm));
	}
	
	ball.isCollision = function(b){
		//alert(ball.getLink(b).length);
		if(ball.getLink(b).length <= ball.r+b.r)	return true;
		else										return false;
	}
	ball.oneDimCollision = function(m1, v1, m2, v2){
		// work only when v1 // v2
		//if(v1.dot(v2)<0) return [v1,v2]
		var Vc = v2.mult(m2).plus(v1.mult(m1)).mult((1/(m1+m2)));
		
		var new_v1 = Vc.mult(2).plus(v1.mult(-1));
		var new_v2 = Vc.mult(2).plus(v2.mult(-1));
		return [new_v1, new_v2];
	}
	
	ball.getLink = function(b){
		return new Vector(b.x-ball.x, b.y-ball.y);
	}
	
	//======================
	//	Show Function
	ball.show  = function(){
		var obj = document.getElementById(ball.id);
		
		if(ball.text == ""){
			obj.style.position = "absolute";
			obj.style.background = ball.color;
			obj.innerHTML  = "<table style='width:100%;height:100%;vertical-align:middle;text-align:center;'><tr><td id='"+ball.id+"-text'></td></table>";
			
			
			ball.text = "check";
		}
		
		obj.style.left = ball.x;
		obj.style.top  = ball.y;
		obj.style.marginLeft = 0-ball.r;
		obj.style.marginTop  = 0-ball.r;
		
		
		obj.style.width  = ball.r*2;
		obj.style.height = ball.r*2;
		obj.style.borderRadius = ball.r + "px";
		obj.style.MozBorderRadius = ball.r + "px"; // Mozilla
		obj.style.WebkitBorderRadius = ball.r + "px"; // WebKit
	}
}

/*====================
	Class::Vector
====================*/
function Vector(x, y){
	if(typeof(x)==='undefined')	x=0;
	if(typeof(y)==='undefined')	y=0;
	
	var v = this;
	v.x = x;
	v.y = y;
	v.length = Math.sqrt(v.x*v.x + v.y*v.y);
	
	//alert("("+x+","+y+") = "+v.length);
	
	//function
	v.plus = function(vector){
		return new Vector(v.x+vector.x, v.y+vector.y);
	}
	v.mult = function(pure){
		return new Vector(v.x*pure, v.y*pure);
	}
	v.dot  = function(vector){
		return (v.x*vector.x + v.y*vector.y);
	}
	v.project= function(vector){
		//alert(v.length);
		//alert(vector.length);
		
		return vector.mult( v.dot(vector)/(vector.length*vector.length) );
	}
	v.getNorm = function(){
		return new Vector(v.y, v.x*(-1)).mult(1/v.length);
	}
	
	v.toString = function(){
		return "("+v.x+","+v.y+") = "+v.length;
	}
	
}