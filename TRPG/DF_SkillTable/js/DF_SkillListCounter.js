//  Last Modify: 2015/01/17 22:16
/*	==================================================
	Include Class:	SkillCounter (it's a public class)
					SkillPosition
	==================================================*/
function SkillCounter(){
}

//==============================
// ** Public Variable
//==============================
	SkillCounter.enableHorizon = false;
	SkillCounter.enableVertical = false;
//==============================
// ** Public Function
//==============================
	SkillCounter.getDifficultyMap = function(select_point, field_map){
		// variables
		var map = [];
			for(var i=0;i<6;i++)	map[i] = new Array(11);
		var ready_queue = [];
		
		// set Start Point
		if(select_point!=null){
			for(var i=0; i<select_point.length; i++){
				var obj=select_point[i];
				
				if(map[obj.f][obj.c]==null){
					map[obj.f][obj.c] = 5;
					ready_queue.push(obj);
				}
			}
		}
		
		// Loop
		while(ready_queue.length != 0){
			var obj = ready_queue.shift();
			
			for(var i=0;i<4;i++){
				var d_f=0, d_c=0;
				switch(i){
					case 0:	d_f = -1;break;
					case 1:	d_f = +1;break;
					case 2:	d_c = -1;break;
					case 3:	d_c = +1;break;
				}
				// Boundary Protect
				if( (obj.f+d_f<0 || obj.f+d_f>5)  && !SkillCounter.enableHorizon)	continue;
				if( (obj.c+d_c<0 || obj.c+d_c>10) && !SkillCounter.enableVertical)	continue;
				var new_f = (obj.f+d_f<0)? 5: ((obj.f+d_f> 5)? 0: (obj.f+d_f));
				var new_c = (obj.c+d_c<0)?10: ((obj.c+d_c>10)? 0: (obj.c+d_c));
				// set step
				var step;
				if(d_c!=0) step=1;
				else if(d_f<0 && field_map[obj.f]==1 ) step=1;
				else if(d_f>0 && field_map[new_f]==1 ) step=1;
				else		step=2;
				// replace
				var value = map[obj.f][obj.c]+step;
				if(map[new_f][new_c]==null ||  map[new_f][new_c]>value){
					map[new_f][new_c] = value;
					ready_queue.push(new SkillPosition(new_f, new_c));
				}
			}
			
		}
		
		return map;
	}


/*====================
	Class::SkillPosition
====================*/
function SkillPosition(field, count){
	var p = this;
	p.f = field;	//0~5
	p.c = count; //0~10
	p.toString = function(){
		return "("+p.f+","+p.c+")";
	}
}