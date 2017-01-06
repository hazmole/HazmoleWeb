var canvas;
var ctx;
var drawMode, mx, my;
var color = "#000";
var line_width = 1;
var eraser=0;

function changeEraser(obj){
	if(eraser==0){
		obj.style.backgroungImage = "url(ing/clicked.png)";
		obj.innerHTML = "啟用橡皮擦";
		eraser = 1;
	}
	else{
		obj.style.backgroungImage = "url(ing/unclicked.png)";
		obj.innerHTML = "未啟用橡皮擦";
		eraser = 0;
	}
	
}

function changeColor(c){
	color = c;
	document.getElementById("now_color").style.backgroundColor = color;
}

function changeZindex(n){
	document.getElementById("now_space").innerHTML = n;
	
	document.getElementById("Paint-1").style.zIndex = (n==1)?10:8;
	document.getElementById("Paint-2").style.zIndex = (n==1)?8:10;
	changeSpace();
}

function changeSpace(){
	var str = "Paint-";
	var temp_z = 0 ,top;
	
	for(var i=1;i<=2;i++){	//決定最高圖層
		if(parseInt(temp_z) < parseInt(document.getElementById(str+i).style.zIndex)){
			temp_z = document.getElementById(str+i).style.zIndex;
			top = i;
		}
	}
	
	canvas = document.getElementById(str+top); // 取得物件
	ctx = canvas.getContext("2d"); // 取得繪圖環境
	
	canvas.onmousedown = function(event){
	    if(eraser==0){
	    	ctx.beginPath();
		    ctx.strokeStyle = color;
		    ctx.lineWidth = line_width;
		    ctx.lineCap = "round";
		    ctx.lineJoin = "bevel"
		    mx = event.clientX - parseInt(canvas.style.left);
		    my = event.clientY - parseInt(canvas.style.top);
		    ctx.moveTo(mx, my);
	    	}
	    else{
	    	mx = event.clientX - parseInt(canvas.style.left);
		    my = event.clientY - parseInt(canvas.style.top);
	    	ctx.clearRect(mx, my, line_width, line_width);
	    }
	    
	    drawMode = true;
	}
	 
	canvas.onmousemove = function(event){
	    if(drawMode){
	    	if(eraser==0){
	    		mx = event.clientX - parseInt(canvas.style.left);
	       		my = event.clientY - parseInt(canvas.style.top);
	        	ctx.lineTo(mx, my);
	        	ctx.stroke();
	    	}
	    	else{
	    		mx = event.clientX - parseInt(canvas.style.left);
	       		my = event.clientY - parseInt(canvas.style.top);
	       		ctx.clearRect(mx, my, line_width, line_width);
	    	}
	    }
	}
	 
	canvas.onmouseup = function(){
	    drawMode = false;
	}
	
}

