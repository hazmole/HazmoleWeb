var _hold_state = false;
function mholdstart(func){
	_hold_state = true;
	onhold(func);
}
function mholdend(){
	_hold_state = false;
}
function onhold(func){
	if(_hold_state){
		func();
		setTimeout(onhold.bind(this,func),10);
	}
}