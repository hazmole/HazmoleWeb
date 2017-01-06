var in_value=0;
var out_value=0;
var memory=0;
var opera=0;
var f_equ=0;
var f_in=0;

function initial(){

    for(var i=0;i<=9;i++){
        document.getElementById(i).innerHTML = "<input type=button value="+i+" onclick=input("+i+") style='width:50;height:50;'>";
    }
    document.getElementById("plus").innerHTML   = "<input type=button value=+ onclick=operator(1) style='width:50;height:50;'>";
    document.getElementById("minus").innerHTML  = "<input type=button value=- onclick=operator(2) style='width:50;height:50;'>";    
    document.getElementById("multi").innerHTML  = "<input type=button value=* onclick=operator(3) style='width:50;height:50;'>";
    document.getElementById("devide").innerHTML = "<input type=button value=/ onclick=operator(4) style='width:50;height:50;'>";
    document.getElementById("equa").innerHTML   = "<input type=button value== onclick=equal(1) style='width:100;height:50;'>";
    document.getElementById("CC").innerHTML     = "<input type=button value=C onclick=zero() style='width:50;height:50;'>";

    show();
}

function input(n){
    in_value = in_value*10 + parseInt(n, 10);
    out_value = in_value;
    show();    

    f_in = 1;
}

function operator(n){
    if(f_equ==1){
        opera=0;
        in_value=0;
    }
    if(f_in==0){
        opera=0;
    }
    equal(0);
    
    opera = n;
    memory = out_value;
    in_value = 0;

    f_in=0;
}

function equal(n){
    if(opera==1) out_value = memory + in_value;
    if(opera==2) out_value = memory - in_value;
    if(opera==3) out_value = memory * in_value;
    if(opera==4) out_value = memory / in_value;
    
    show(); 

    if(n==1){
        memory = out_value;
        f_equ = 1;
    }
    else{
        f_equ = 0;
    }
}

function zero(){
    in_value=0;
    out_value=0;
    memory=0;
    opera=0;
    f_equ=0;
    f_in=0;

    show(); 
}

function show(){
    document.getElementById("output").value = out_value;
}

