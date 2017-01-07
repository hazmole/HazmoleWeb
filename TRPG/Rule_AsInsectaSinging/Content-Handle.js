function RuleContentAgent(){
}

// Basic
RuleContentAgent.FRAME = "main";
RuleContentAgent.HANDLER = new myJadeCompiler();
RuleContentAgent.setFrameName = function(name){	RuleContentAgent.FRAME = name;}
RuleContentAgent.putContent   = function(content){
	var frame = $('#'+RuleContentAgent.FRAME).get(0);
	frame.innerHTML = content;
}
RuleContentAgent.setPage	  = function(page_id){
	if($('#'+page_id).size()==0){
		RuleContentAgent.putContent("");
		return ;
	}
	var page_cont = $('#'+page_id).get(0).innerHTML;
	var output = RuleContentAgent.HANDLER.compile(page_cont);
	RuleContentAgent.putContent(output);
}

// Class: myJadeCompiler
function myJadeCompiler(){
	var mJade = this;
	
	// Public
	mJade.compile = function(content){
		var line_set = content.split(/[\r\n]/g);
		var text = "";
		var tag_stack = [], tag_stack_ptr=0;
		
		for(var i=0;line_set[i]!=null;i++){
			var tag_part, text_part;
			var tab_num = getTabCount(line_set[i]);
			var line    = line_set[i].substring(tab_num);
			
			while(tag_stack_ptr>0 && tag_stack[tag_stack_ptr-1][0] >= tab_num){
				var tag = tag_stack.pop()[1];
				tag_stack_ptr--;
				text += getEndTagFormat(tag);
			}
			
			while(( tag_part=getUnformTag(line) )!=""){
				tag_stack.push([tab_num, getTag(tag_part)]);
				tag_stack_ptr++;
				
				text += getStartTagFormat(tag_part);
				if(!isLastTag(tag_part)){
					line  = line.substring(tag_part.length);
				}
				else{
					text_part= line.substring(tag_part.length);
					text += text_part;
					break;
				}
			}
		}
		
		while(tag_stack_ptr>0 && tag_stack[tag_stack_ptr-1][0] >= tab_num){
			var tag = tag_stack.pop()[1];
			tag_stack_ptr--;
			text += getEndTagFormat(tag);
		}
		return text;
	}
	
	// Private
	function getTabCount(line){
		var i=0;
		while(i<line.length && line.charAt(i)=='\t') i++;
		return i;
	}
	function getTag(tag_part){
		var i;
		for(i=0; i<tag_part.length; i++){
			var ch = tag_part.charAt(i);
			if(ch==' ' || ch==':' || ch=='(')	break;
		}
		return tag_part.substring(0, i);
	}
	function getTagAttr(tag_part){
		var i, start, end, flag;
		for(i=start=end=flag=0; i<tag_part.length; i++){
			var ch = tag_part.charAt(i);
			if(flag==0 && ch=='('){ start=i;}
			if(ch=='('){ flag++;}
			if(ch==')'){ flag--;}
			if(flag==0 && ch==')'){ end=i;}
		}
		if(start >= end)	return "";
		else				return tag_part.substring(start+1, end);
	}
	
	function getUnformTag(line){
		var i, flag;
		
		for(i=0,flag=0; i<line.length; i++){
			var ch = line.charAt(i);
			if(flag==0 && ch==' ')	break;	// p [content]
			if(flag==0 && ch=='('){			// a(attr) [content]
				flag=1;continue;
			}
			if(flag> 0 && ch=='('){flag++;continue;}
			if(flag> 0 && ch==')'){flag--;continue;}
		}
		
		return line.substring(0, i+1);
	}
	function isLastTag(tag){
		if(tag.match(/: ?$/)!=null)	return false;
		return true;
	}
	
	function getStartTagFormat(tag_part){
		var tag  = getTag(tag_part);
		var attr = getTagAttr(tag_part);
		if(tag=='t')	return "　　";
		return "<"+tag+" "+attr+">";
	}
	function getEndTagFormat(tag){
		if(tag=='br')	return "";
		if(tag=='t')	return "";
		return "</"+tag+">";
	}
}



