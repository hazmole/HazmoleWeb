var MAIN_PANEL;
function setMainPanel(block_id){
	MAIN_PANEL = document.getElementById(block_id);
}
function setScene(scene_type){
	switch(scene_type){
		case "login":	MAIN_PANEL.innerHTML = build_LoginScene();
		case "deck":	MAIN_PANEL.innerHTML = build_DeckScene();
		case "room":	MAIN_PANEL.innerHTML = build_DualRoomScene();	
	}
}


function build_LoginScene(){
	var html="";



	return html;
}



//=================
// Cookies
function login(user){
	localStorage.setItem("USER", user);
}
function logout(){
	localStorage.removeItem("USER");
}