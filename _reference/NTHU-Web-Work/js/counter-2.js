var in_value = "";
var f_equ = 0;
var f_opa = 0;

function initial(){

    for(var i=0;i<=9;i++){
        document.getElementById(i).innerHTML = "<input type=button value="+i+" onclick=input("+i+") style='width:50;height:50;background-color:#aaa'>";
    }
    document.getElementById("plus").innerHTML   = "<input type=button value=+ onclick=operator(this) style='width:50;height:50;background-color:#55f'>";
    document.getElementById("minus").innerHTML  = "<input type=button value=- onclick=operator(this) style='width:50;height:50;background-color:#55f'>";    
    document.getElementById("multi").innerHTML  = "<input type=button value=* onclick=operator(this) style='width:50;height:50;background-color:#55f'>";
    document.getElementById("devide").innerHTML = "<input type=button value=/ onclick=operator(this) style='width:50;height:50;background-color:#55f'>";
    document.getElementById("equa").innerHTML   = "<input type=button value== onclick=equal(1) style='width:100;height:50;'>";

    document.getElementById("CC").innerHTML     = "<input type=button value=C onclick=zero() style='width:50;height:50;background-color:#f55'>";
    document.getElementById("BK").innerHTML     = "<input type=button value=← onclick=back() style='width:50;height:50;background-color:#f55'>";

    show();
}

function input(n){
    if(f_equ==1) zero();
    in_value += n;
    show(); 

    f_opa = 0;
}

function operator(n){
    if(f_opa==1) return;
    f_equ = 0;
    in_value += n.value;
    show(); 

    f_opa = 1;
}

function equal(n){
    in_value = eval(in_value).toString();
  
    show(); 
    f_equ = 1;
    f_opa = 0;
}

function zero(){
    in_value="";
    f_equ = 0;
    f_opa = 0;

    show(); 
}

function back(){
    if(in_value.length==0) return;

    in_value=in_value.slice(0,-1);
    show();
}

function show(){
    document.getElementById("output").value = in_value;
}

