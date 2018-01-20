//PreDoc_Index.js

	//document.write("<script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js'></script>");

function switchDisplay(id,force){
	var display = document.getElementById(id).style.display;
	if(force!=null) 
		document.getElementById(id).style.display = force;
	else
		document.getElementById(id).style.display = (display=="none")? "block": "none";
}

function buildLeftBlock(){
	var str = "";
	
	str += "<div class='RP_div' style='width:260px;background:rgba(255,255,255,0.3);'>";
		str += "<table border=0 width=260px>";
			for(var i=0;i<Index_info.length;i++){
				var temp = Index_info[i];
				var name = "detail-"+i;
				
				str += "<tr><td";
				str += " onmouseover=switchDisplay('"+name+"','block')";
				str += " onmouseout=switchDisplay('"+name+"','none')>";
				
					str += "<table width=255px>";
					str += "<tr><td style='background:rgba(255,255,255,0.7);padding:5 5 5 5;border-radius:5px;'>"
						if(temp[0][1]!="")	str += "<a href="+temp[0][1]+">"+temp[0][0]+"</a>";
						else						str += temp[0][0];
					str += "<tr><td style='display:none;' id='"+name+"'>";
					str += buildInnerTable(temp);
					str += "</table>";
					
				str += "</td>";
			}
		str += "</table>";
	str += "</div>";
	
	document.getElementById("left_block").innerHTML = str;
}

function buildInnerTable(obj){
	var str = "";
	
	if(obj[1]==null) return str;
	
	str += "<table border=0 width=100%>";
	for(var i=0;i<obj[1].length;i++){
		str += "<tr><td class='White_Square'>";
		str += "<a href="+obj[1][i][1]+">"+obj[1][i][0]+"</a>";
	}
	str += "</table>";
	
	return str;
}
