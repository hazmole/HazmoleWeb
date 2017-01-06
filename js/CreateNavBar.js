//  Last Modify: 2015/07/27 18:49

/*==================
	SETTING
==================*/
var NAVBAR_SETTING = {
	root: "https://hazmole.github.io/HazmoleWeb/",
	main: new Navbar_obj("Hazattomole",	"Index.html"),
	tree: [
		new Navbar_obj("TRPG規則",	[
			//new Navbar_obj("As Insecta Singing", "/TRPG/")
			]),
		new Navbar_obj("TRPG團錄",	[
/*
			new Navbar_obj("[魔道書]魔偶之館", "/TRPG/ReplayReader/ReplayReader.html#Magica-DH0"),
			new Navbar_obj("[忍神]鐵鼠之檻", "/TRPG/ReplayReader/ReplayReader.html#Shinobi-TN0"),
			//new Navbar_obj("[COC]", "/TRPG/"),
			//new Navbar_obj("[DND]", "/TRPG/"),
*/
			]),
		new Navbar_obj("TRPG工具",	[
			new Navbar_obj("DF技能跳格表", "TRPG/DF_SkillTable/SkillTable.html"),
			//new Navbar_obj("團錄上色器", "/TRPG/"),
			new Navbar_obj("請問骰神", "/TRPG/AskDicedess.html"),
		]),
		new Navbar_obj("小遊戲",	[
			new Navbar_obj("虹色狂走", "/Game/RunForPower/RunForPower.html"),
			new Navbar_obj("打蒼蠅", "Game/SmashFly/SmashFly.html"),
			new Navbar_obj("米卡追蹤(仿)", "Game/MikaTrace/MikaTrace.html"),
			new Navbar_obj("連連看", "Game/LinkingGame/LinkingGame.html"),

		]),
		new Navbar_obj("其他",	[
			new Navbar_obj("無題《開車》", "Other/haz_driving.html", "target='_blank'"),
		]),
	]
};
//console.log(NAVBAR_SETTING);

/*==================
	CLASS
==================*/
function Navbar_obj(name, url, attr){
	this.name = name;
	this.url  = url;
	this.attr = (attr)? attr: "";

	this.render = function(){
		if(typeof(this.url)=="string")	return "<li><a name='page-click' href='"+NAVBAR_SETTING.root + this.url+"' "+this.attr+">"+this.name+"</a></li>";
		else{
			var children = "";
			$.each(this.url, function(idx, obj){	children += obj.render();	})
			
			return ("<li class='dropdown'>"
						+"<a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false' href='#'>"+this.name+"<span class='caret'></span></a>"
						+"<ul class='dropdown-menu'>"
							+ children
						+"</ul>"
					+"</li>");
		}
	}.bind(this);
}


/*==================
	Initial
==================*/
$(document).ready(function(){
	var navbar_head = "";
	navbar_head = "<div class='navbar-header>"
					+"<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1'>"
						+"<span class='sr-only'>Toggle navigation</span>"
						+"<span class='icon-bar'></span>"
						+"<span class='icon-bar'></span>"
						+"<span class='icon-bar'></span>"
					+"</button>"
					+"<a class='navbar-brand' name='page-click' href='"+NAVBAR_SETTING.root + NAVBAR_SETTING.main.url+"'>"+NAVBAR_SETTING.main.name+"</a>"
				+"</div>";
	
	var navbar_body = "";
	$.each(NAVBAR_SETTING.tree, function(idx, obj){
		navbar_body += obj.render();
	});
	navbar_body = "<div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'><ul class='nav navbar-nav'>"
						+navbar_body
					+"</ul></div>";
	
	var navbar = "<div class='navbar navbar-inverse'><div class='container-fluid>" + navbar_head + navbar_body + "</div></div>";
	$("body").prepend(navbar);
});

