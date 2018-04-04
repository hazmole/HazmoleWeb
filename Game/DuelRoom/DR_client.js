
function startScene(){
	loadGoogle();
	
}

//=================
// Build
function build_LoginScene(){
	var html="";
	html += "<banner></banner>";
	html += '<block style="top:100px;left:350px;width:800px;"><block id="user_message"></block></block>';
	html += '<block style="top:180px;left:350px;">';
	html += '<block id="deck_panel" class="func_panel" style="top:0px;left:0px;  "><btitle>建構你的牌組</btitle><br></block>';
	html += '<block id="duel_panel" class="func_panel" style="top:0px;left:270px;"><btitle>進入對戰房間</btitle><br></block>';
	html += '<block id="view_panel" class="func_panel" style="top:0px;left:540px;"><btitle>觀看戰局</btitle><br></block>';
	html += "</block>";
	setMainPanel(html);

	update_LoginScene();
}
function update_LoginScene(){
	if(isLogin())	$("#user_message").append("歡迎，<b>"+getGoogleUserName()+'</b>　　<a href="#" onclick="signOut();">Sign out</a>');
	else		{	$("#user_message").append('喔喔！你還沒有登入呢！<br><div id="g_mysignin" data-onsuccess="onSignIn"></div>');
					render_google_login_button("g_mysignin");}
	$("#deck_panel").addClass(isLogin()?"blue_panel":"gray_panel");
	$("#duel_panel").addClass(isLogin()?"red_panel" :"gray_panel");
	$("#view_panel").addClass("green_panel");
	if(isLogin()){
		$("#deck_panel").append('<button class="big_button" style="margin-top:60px;">開始構築</button>');
		$("#duel_panel").append('<div style="margin-top:10px;"><b>請輸入房間名</b>：<input type="text"/></div>');
		$("#duel_panel").append('<div style="margin-top:00px;"><b>密碼</b>：<input type="password"/></div>');
		$("#duel_panel").append('<button class="big_button" style="margin-top:10px;">進入</button>');
	}
	else{
		$("#deck_panel").append('<invalidPanel>抱歉，你必須先登入才能使用此功能</invalidPanel>');
		$("#duel_panel").append('<invalidPanel>抱歉，你必須先登入才能使用此功能</invalidPanel>');
	}
	$("#view_panel").append('<div style="margin-top:10px;"><b>請輸入房間名</b>：<input type="text"/></div>');
	$("#view_panel").append('<button class="big_button" style="margin-top:60px;">進入</button>');
}


//=================
// Scene Setting
var MAIN_PANEL;
function defineMainPanel(block_id){
	MAIN_PANEL = document.getElementById(block_id);
}
function setMainPanel(html){
	MAIN_PANEL.innerHTML = html;
}
function setScene(scene_type){
	switch(scene_type){
		case "login":	build_LoginScene(); 	break;
		case "deck":	build_DeckScene();		break;
		case "room":	build_DualRoomScene();	break;
	}
}

//=================
// Google Login
function loadGoogle(){
	console.log("start load google");
	gapi.load('auth2', function(){
		gapi.auth2.init({
			client_id: '535690683952-ee1b89i0c954efmvilbc1rgomvhth0kb.apps.googleusercontent.com',
			cookiepolicy: 'single_host_origin',
		}).then(function(auth2){
			setScene("login");
		});
	});
}
function onSignIn(googleUser) {
	var id_token = googleUser.getAuthResponse().id_token;
	build_LoginScene();
}
function signOut(){
	gapi.auth2.getAuthInstance().signOut().then(build_LoginScene);
}
function isLogin(){
	if(gapi.auth2.getAuthInstance()==null) return false;
	return gapi.auth2.getAuthInstance().isSignedIn.get();
}
function getGoogleIdToken(){
	if(isLogin())	return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
	else			return null;
}
function getGoogleUserName(){
	if(isLogin())	return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
	else			return "遊客";
}
function render_google_login_button(id){
	if(!document.getElementById(id)) return;
	
	$("#"+id).empty();
	$("#"+id).append('<div id="customBtn" class="customGPlusSignIn"><span class="icon"></span><span class="buttonText">Google</span></div>');
	var element = document.getElementById(id);
	gapi.auth2.getAuthInstance().attachClickHandler(element, {},	onSignIn, function(error) {
    	alert(JSON.stringify(error, undefined, 2));
    });
}