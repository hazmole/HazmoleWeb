function s_toggleDisplay(obj, link, before_text, after_text){
	var showed_flag = !(obj.style.display=="none");
	obj.style.display = (showed_flag)? "none": "";
	link.innerHTML = (showed_flag)? before_text: after_text;
}