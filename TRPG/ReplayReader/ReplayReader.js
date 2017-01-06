function Reader(sel_contentBottom){
	var rd = this;

	rd.bottomTag = sel_contentBottom;

	var rawData = "";
	var type = "raw";
	var colorScheme = {};


	rd.getType = function(){return type;}
	rd.getRawData = function(){return rawData;}
	rd.readFile = function(url, setting){
		colorScheme = setting.ColorScheme;
		$.get(url)
			.done(handleData)
			.fail(printPara.bind(null,"Fail Loading"));
	}

	function handleData(data){
		var head = data.match(/^#([^#]*?)#/);

		// type
		type = (head!=null && head[1]!="")? (head[1]): "raw";
		// rawData handle
		rawData = data.replace(/^#([^#]*?)#([\n\r]*)/, "");
		
		switch(type){
			case "replay":
				var modData = rawData.replace(/</g, "&lt;").replace(/>/g, "&gt;")
										.replace(/\[(\/)?([buis])\]/g, "<$1$2>");

				var paragraphs = splitData(modData);
				for(var i=0;i<paragraphs.length;i++){
					printPara(paragraphs[i].toHtml());
				}
				break;
			case "index":
				var intro = rawData;


				printPara("<div class=\"block content\">"+intro+"</div>");
				break;
			case "html":
			default:
				printPara(rawData);
				break;
		}
		
		//
	}

	function printPara(para){
		$(rd.bottomTag).before(para);
	}

	function splitData(data){
		var para_arr = data.split(/[\r\n]*(\[split\]|\[title=.*?\]|\[nextEp\])[\r\n]*/g);
		
		var paras = [];
		var next  = "";
		for(var i=0,len=0; i<para_arr.length; i++){
			var para = para_arr[i];
			var key = para.match(/^\[(title)(=(.*?))?\]/);

			if(para=="" || para=="[split]")	continue;
			else if(para=="[nextEp]")		next="nextEp";
			else if(next!=""){	paras.push(new Paragraph( next,		para,  colorScheme));	next="";}
			else if(key!=null){	paras.push(new Paragraph( key[1],	key[3],colorScheme));}
			else{				paras.push(new Paragraph("replay",	para,  colorScheme));}
			
		}
		//console.log(paras);

		return paras;
	}
}

function Paragraph(type, rawData, c_scheme){
	var P = this;
	P.type = type;	//replay, title
	P.attr = {
		raw: rawData,
		c_scheme: c_scheme,
	};
	P.blockFlag = "";

	this.toHtml = function(){
		

		P.attr.parameters = P.attr.raw.split(",");
		switch(P.type){
			case "replay":	return renderReplay();
			case "title":	return renderTitle();
			case "nextEp": 	return renderNextEp(); 
		}
		return "-Error-";
	}


	// Render
	function renderReplay(){
		// rough split
		var lines = (P.attr.raw).split("\n");
		var lines_arr = [];
		for(var i=0,len=0;i<lines.length; i++){
			var chat_format = lines[i].match(/^([^:：]*)[:：](.*)/);
			var tag_format  = lines[i].match(/^\[(\/?)([^=]*)(=([^\/]*))?\]/);
			
			//if(P.blockFlag=="" && chat_format!=null){
			//	lines_arr[len++] = new chatFormat("chat",chat_format[1], chat_format[2]);
			//}
			if(tag_format!=null){
				if(tag_format[1]=="" && (tag_format[2]=="roll"||tag_format[2]=="block")){
					//start
					P.blockFlag = tag_format[2];
					lines_arr[len++] = new chatFormat(tag_format[2],tag_format[4], "");
				}
				else if(tag_format[1]=="/" && tag_format[2]==P.blockFlag){
					//end
					P.blockFlag = "";
				}
				else{
					lines_arr[len++] = new chatFormat(tag_format[2],tag_format[4], "");
				}
			}
			else if(P.blockFlag=="" && chat_format!=null){
				lines_arr[len++] = new chatFormat("chat",chat_format[1], chat_format[2]);
			}

			else{
				lines_arr[len-1].content += "\n"+lines[i];
			}
		}

		// render
		var tbody="";
		for(var i=0; i<lines_arr.length;i++){
			tbody += lines_arr[i].toHtml(P.attr.c_scheme);
		}

		return "<div class=\"block content\"><table class=\"replayTable\"><tbody>"+tbody+"</tbody></table></div>";
	}

	function renderTitle(){
		var parameters = P.attr.raw.split(",");
		var title = parameters[0];
		var c_user= parameters[1];
		var color = getUserColor(c_user);
		var style = ((color)? ("background:"+color): "")+";";

		return "<div class=\"block subTitle\" style=\""+style+"\">"+title+"</div><br/>";
	}
	function renderNextEp(){
		var title = "<div class=\"block subTitle\" >下集預告</div><br/>";
		var data  = P.attr.raw;

		data = data.replace(/\n/g, "<br/>");
		data = data.replace(/「/g, "<font style=\"font-size:12px;\">　　「");
		data = data.replace(/」/g, "」</font>");


		var block = "<div class=\"block content\" style=\"background:#C8C8C8;\">"+data+"</div>";

		return title + block;
	}

	// Support
	function getUserColor(user){
		return (user!=null && P.attr.c_scheme[user]!=null)? P.attr.c_scheme[user]: null;
	}
}


function chatFormat(type, attr, content){
	var F = this;
	F.type = type;
	F.attr = (attr)? attr: "";
	F.content = content;

	F.toHtml = function(c_scheme){
		F.content = F.content.replace(/^(\n)*/g, "");
		F.content = F.content.replace(/\n/g, "<br/>&nbsp;");
		switch(F.type){
			case "chat": 	return renderChat(c_scheme);
			case "roll": 	return renderRoll(c_scheme);
			case "block": 	return renderBlock(c_scheme);
			case "subtitle":return renderSubTitle(c_scheme);
		}
	}

	function renderSubTitle(c_scheme){
		var block = "<td colspan=2><center><div class=\"block innerTitle\">"+F.attr+"</div></center></td>";
		return "<tr>"+block+"</tr>";
	}
	function renderRoll(c_scheme){
		var color = getUserColor(c_scheme, F.attr, "#000000");
		var b_style = "background:"+colorChange(color, 10)+";";
		var c_style = "color:"+color+";";
		var username = "<td class=\"replayUserTd\" style=\""+c_style+"\">"+F.attr+(F.attr==""? "&nbsp;": "：")+"</td>";
		var block = "<td><div class=\"block innerBlock\" style=\""+b_style+"\">"+F.content+"</div></td>";

		return "<tr>"+username+block+"</tr>";
	}
	function renderBlock(c_scheme){
		var color = getUserColor(c_scheme, F.attr, "#5a5a5a");
		var b_style = "background:"+colorChange(color, 10)+";width:80%;";
		var block = "<td colspan=2><center><div class=\"block innerBlock\" style=\""+b_style+"\">"+F.content+"</div></center></td>";

		return "<tr>"+block+"</tr>";
	}
	function renderChat(c_scheme){
		var color = getUserColor(c_scheme, F.attr, "#000000");
		var style = "color:"+color+";";
		var username = "<td class=\"replayUserTd\" style=\""+style+"\">"+F.attr+(F.attr==""? "&nbsp;": "：")+"</td>";
		var content  = "<td class=\"replayContTd\" style=\""+style+"\">"+F.content+"</td>";
		return "<tr>"+username+content+"</tr>";
	}

	function getUserColor(c_scheme, user, default_c){
		return (c_scheme!=null && c_scheme[user]!=null)? c_scheme[user]: default_c;
	}

}


function colorChange(color_code, step){
	step = (step)? parseInt(step): 0;
	var color_format = color_code.match(/#(\w\w)(\w\w)(\w\w)/);
	var R = parseInt(color_format[1], 16); 
	var G = parseInt(color_format[2], 16); 
	var B = parseInt(color_format[3], 16); 
	var gap = function(ori){
		return (step/20)*((step<0)? (ori): (256-ori));	
	}
	
	var arr = [R,G,B];
	var new_color = "#";
	for(var i=0;i<3;i++){
		arr[i] = parseInt(arr[i]+gap(arr[i])).toString(16);
		new_color += ((arr[i].length==1)? "0": "")+arr[i];
	}

	return new_color;
}

/*
$(document).ready(function(){
	var color = "#e132da";
	for(var i=-10; i<=10; i++){
		$("body").append("<div style=\"background:"+colorChange(color, i)+";\">A</div>")
	}
})
*/