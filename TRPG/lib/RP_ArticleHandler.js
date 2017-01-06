//  Last Modify: 2015/01/20 18:46
/*	==================================================
	Include Class:	ArticleHandle
	==================================================*/
/*	==================================================
	We have following TAG that can specify the format:
	X	-[roll="user"] content [/roll]
	X	-[hide="display content"] content [/hide]
	X	-[block="user"] content [/block]
	Following TAG can effect only One Line
		-[split]
	X	-[size="n"] content [/size]
	X	-[color="color"] content [/color]
	X	-[b] content [/b]
	X	-[i] content [/i]
	X	-[s] content [/s]
	*/

function ArticleHandle(width, color_map, css_class){
	if(typeof(width)==='undefined')			width = 600;
	if(typeof(color_map)==='undefined') 	color_map=[];
	if(typeof(css_class)==='undefined') 	css_class="";
	
	var BLOCK_TAG_TYPES = ["roll","hide","block"];
	
	var AH = this;
	var WIDTH = width;
	var COLORMAP = color_map;
	var CSS = css_class;
	
	var MAX_NAME_LENGTH = 0;
	var NAME_WIDTH = 0;
	
	var TEMP_LINES = [];
	var isBLOCKING = false;
	var BLOCKING_TAG = [];
	var BLOCK_COUNT = 0;
	
	//==============================
	// ** Public Function
	//==============================
	// :: getFormatedTable
		AH.doFormat = function(article){
			setMaxLengthFromColorGroup();
			article = formatUglySymbo(article);
			
			return formatArticle(article);
		}
	//==============================
	// ** Private Function
	//==============================
	// FORMAT
	//================
	// :: Replace Symbo
		function formatUglySymbo(article){
			article = article.replace(/[\t]/g,"");		//移除 tab
			article = article.replace(/\r\n/g,'\n');	//統一 換行
			article = article.replace(/[\<]/g,"&lt;");	//無效化<HTML>標籤
			article = article.replace(/[\>]/g,"&gt;");
			return article;
		}
	// :: format: Slice to Blocks
		function formatArticle(article){
			var result = "";
			var blocks_array = article.split(gReg_SplitLine());
			
			for(var i=0;blocks_array[i]!=null;i++){
				result += gStrContentBlock("block-"+i, formatBlock(blocks_array[i]) )+"<p>";
			}
			
			return result;
		}
	// :: format: Slice to Lines
		function formatBlock(block){
			var result = "";
			var lines_array = block.split("\n");
			
			for(var i=0;lines_array[i]!=null;i++){
				if(i!=0) result += "<br>";
				result += formatLine(lines_array[i], i==0);
			}
			
			return result;
		}
		
		
	// :: format Slice to WordPieces
		function formatLine(line, isHead){
			var contents_arr = line.split(gReg_generalTag());
			var tags_arr = line.match(gReg_generalTag());
				tags_arr = (tags_arr==null)? []: tags_arr;
			
			var result="";
			
			result += isNeedLineFeed(isHead, contents_arr[0], tags_arr[0])? "<br>": "";
			
			
			//for(var i=0;words_pieces[i]!=null;i++){
			//	result += formatWord(words_pieces[i], i==0);
			//}
			return result;
		}
	//==============================
	// USER:TALK Format
	//================
		function isUserTalk(line){
			var colon  = getColonPos(line);
			var common = getCommonPos(line);
			if(colon>=0 && colon<MAX_NAME_LENGTH && (common==-1 || common>colon))	return true;
			return false;
		}
		function getUserTalk(line){
			var name = "", content = "";
			if( isUserTalk(line) )	content = line;
			else{
				var colon = getColonPos(line);
				name = line.slice(0,colon);
				content = line.slice(colon+1);
			}
			return [name, content];
		}
		function gStrUserTalk(name, content){
			var color = getColorByName(name);
			var result = "";
			result += gStrTableNameBlock(name, color);
			result += gStrTableContentBlock(content, color);
			return HtmlTag("tr", "", result);
		}
	
	// format Word Handle
		function formatWord(word, isHead){
			var result="";
			
			if( isHead && isUserTalk(word) && !isBLOCKING)
				result += getUserTalkFormat(word);
			else if( isTag(word) )
				result += TagHandler(word);
			else
				result += ContentHandler(word);
			
			return result;
		}
	//=====================
	// :: get [User:cont.]fromat content
		function getUserTalkFormat(line){
			var colon = getColonPos(line);
			var name    = line.slice(0,colon);
			var content = line.slice(colon+1);
			
			return result;
		}
		function TagHandler(tag){
			return "";
		}
		function ContentHandler(cont){
			
		}
	
	//================
	// TRUE/FALSE FUNCTION
	//================
	// :: is User:cont. fromat
		function isUserTalk(line){
			var colon  = getColonPos(line);
			var common = getCommonPos(line);
			if(colon>=0 && colon<MAX_NAME_LENGTH && (common==-1 || common>colon))	return true;
			return false;
		}
	// :: is [XXX] tag format
		function isTag(tag){
			if(tag.match(gReg_Tag())!=null)	return true;
			return false;
		}
	// :: is [XXX] Block tag format
		function isTag(tag){
			if(tag.match(gReg_Tag())!=null)	return true;
		
	
	// :: is This Line need a line_feed on its head
		function isNeedLineFeed(isHeadLine, cont_head, tag_head){
			if(isHeadLine) return false;
			if(isUserTalk(cont_head)) return false;
			if(cont_head=="" && isBlockTag(tag_head)) return false;
			return true;
		}
	

	//==============
	// :: is block tag format
		function isBlockTag(line){
			return (line.search(getBlockTagReg(2))==0);
		}
	// :: handle block
		function getBlockHandle(line){
			var tag = getTagFromLine(line);
			var type = getTagType(tag);
			var para = getTagParas(tag);
			var str;
			if(type[0]!='\/'){	//block start
				str = getBlockFormat(type, para); //line = [tag=a,b,c...]
				BLOCKING_TAG.push(type);
				isBLOCKING = true;
			}
			else{
				BLOCKING_TAG.pop();
				isBLOCKING = (BLOCKING_TAG.length==0)? false: true;
				str = "</div></center>";
			}
			return str;
		}
	// :: get block Table format
		function getBlockFormat(type, para){
			var str="";
			var pre_text = "";
			
			var style="width:80%;text-align:left;";
			var color="#eeeeee";
			var display="block";
			
			if(para!=null){
				switch(type){
					case "roll":
					case "block":
						color = getRGBAform256(getColorByName(para[0]), 0.4);
						break;
					case "hide":
						var code = "document.getElementById(\"block-"+BLOCK_COUNT+"\").style.display=(this.checked)? \"block\": \"none\"";
						pre_text = "<input id='sw-"+BLOCK_COUNT+"' type=checkbox onclick='"+code+"'>";
						pre_text+= "<label for='sw-"+BLOCK_COUNT+"'>"+para[0]+"</label>";
						display  = "none";
						break;
				}
			}
			//style
			style += "background:"+color+";";
			style += "display:"+display+";";
			
			str += pre_text;			
			if(!isBLOCKING) str += "<tr><td colspan=2 >";
			str += "<center><div id='block-"+BLOCK_COUNT+"' class='"+CSS+"' style='"+style+"'>" + "("+type+","+para+")";
			
			BLOCK_COUNT++;
			
			return str;
		}
		
	//==============
	// :: normal Handle
		function getNormalLine(line){
			return line+"<br>";
		}
	//==============
	// :: Split line
	//split BlockTag expression, left to TEMP_LINES
		function getUsefulLine(line){
			var tag_position = getFirstBlockTagPos(line)
			if(tag_position > 0){
				TEMP_LINES.push( line.slice(tag_position) );
				line = line.slice(0,tag_position);
			}
			else if(tag_position==0){
				var reg = getBlockTagReg(2);
				var tag = line.match(reg);
				TEMP_LINES.push( line.replace(tag[0], "") );
				line = tag[0];
			}
			return line;
		}
	//==============
	// :: Tag Search
		function isTag(line){
			return (line.search(/\[.*\]/g)!=-1);
		}
		function getTagType(tag){
			return tag.split('=')[0];
		}
		function getTagParas(tag){
			var para = tag.split('=')[1];
			return (para==null)? null: para.split(',');
		}
		function getTagFromLine(line){
			return tag = line.match(/[^\[\]]*/g)[1];
		}
		function getFirstBlockTagPos(line){
			return line.search(getBlockTagReg(2));
		}
	// :: Block Tag regular expression
		function getBlockTagReg(method){	//0-start, 1-end, else-both
			var core="";
			var symbo = (method==0)? "": (method==1)? "\/": "\/?";
			for(var i=0;BLOCK_TAG_TYPES[i]!=null;i++)	core+=( ((i!=0)?"|":"") + ("("+BLOCK_TAG_TYPES[i]+")") );
			return RegExp("\\["+symbo+"("+core+").*?\\]", 'g');
		}
	
	
	//==============
	// :: 標點符號 position
		function getColonPos(line){	return line.search(/[:：]/);}
		function getCommonPos(line){return line.search(/[,.?!，。！？]/);}
	//==============
	// ::get Color
		function getColorByName(name){
			for(i=0;i<COLORMAP.length;i++)
				if(COLORMAP[i][0]==name) return COLORMAP[i][1];
			return "#000000"; //預設為黑色
		}
		function getRGBAform256(color, opac){
			var str="rgba(";
			str += (parseInt(color[1],16)*16 + parseInt(color[2],16)) + ",";
			str += (parseInt(color[3],16)*16 + parseInt(color[4],16)) + ",";
			str += (parseInt(color[5],16)*16 + parseInt(color[6],16)) + ",";
			str += opac+")"
			return str;
		}
	//==============
	// ::get Max Name Length
		function setMaxLengthFromColorGroup(){
			MAX_NAME_LENGTH = 0;
			for(var i=0;COLORMAP[i]!=null;i++){
				if(MAX_NAME_LENGTH < COLORMAP[i][0].length) MAX_NAME_LENGTH = COLORMAP[i][0].length;
			}
			NAME_WIDTH = (MAX_NAME_LENGTH+1)*20;
			return MAX_NAME_LENGTH;
		}
	//======================
	// :: REGULAR EXPRESSION
	//======================
		function gReg_SplitLine(){	return new RegExp("\\[split\\]\\n?",   "g"); // => [split]
		}
		function gReg_generalTag(){	return new RegExp("\\[[^\\]]*\\]", "g"); // => [(something)]
		}
		function gReg_Tag(){		return new RegExp("^\\[[^\\]]*\\]$", "g"); // => [(something)]
		}
	
	//======================
	// :: BLOCK BUILDER
	//======================
		function gStrContentBlock(id, content){
			var inner_block = HtmlTag("div", "id='"+id+"' class='"+CSS+"'", content);
			return HtmlTag("div", "class='"+CSS+"_out'", inner_block);
		}
		function gStrTitleBlock(title, color, target_id){
			return HtmlTag("div", "class='"+CSS+"' style='background:"+color+";' onclick='switchDisplay("+target_id+", null)'", title);
		}
		function gStrTableNameBlock(name, color){
			return HtmlTag("td", "style='width:"+NAME_WIDTH+"px;color:"+color+"; text-align:right;vertical-align:top;font-weight: bold;'", name);
		}
		function gStrTableContentBlock(content, color){
			return HtmlTag("td", "style='color:"+color+"; vertical-align:top;'", content);
		}
	// HTML BASIC HANDLER
		function HtmlTag(tag, attribute, content){
			return "<"+tag+" "+attribute+">"+content+"</"+tag+">\n";
		}
	//==============
	// Initial
	{
		setMaxLengthFromColorGroup();
	}
}
