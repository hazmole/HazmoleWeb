function HW4(){
	}
	
HW4.code_com = new RegExp('//[^\r\n]*|/\\*([^*]|[\r\n]|(\\*+([^*/]|[\r\n])))*\\*+/',"g");
HW4.code_define = new RegExp('#[^\r\n]*',"g");

HW4.getLCS = function(A,B){
	//initial table;
	var arr = new Array(A.length+1);
	for(var i=0;i<arr.length;i++)
		arr[i] = new Array(B.length+1);
	for(var i=0;i<arr.length;i++)
		for(var j=0;j<arr[i].length;j++)
			arr[i][j] = new Array(0,0);
	
	//build table
	//dir:  1<left-up>  2<left>  3<up>
	for(var i=1;i<arr.length;i++){
		for(var j=1;j<arr[i].length;j++){
			if(A.charAt(i-1)==B.charAt(j-1)){
				arr[i][j][0] = arr[i-1][j-1][0]+1;
				arr[i][j][1] = 1;
			}
			else{
				var dir = (arr[i][j-1][0]>arr[i-1][j][0]) ? 2 : 3;
				arr[i][j][0] = (dir==2)? arr[i][j-1][0] : arr[i-1][j][0];
				arr[i][j][1] = dir;
			}
		}
	}
	
	//trace table
	var x = A.length;y = B.length
	var num = arr[x][y][0]
	var LCS="";
	
	while(arr[x][y][0]!=0){
		if(arr[x][y][1]==1)	LCS = A.charAt(x-1).concat(LCS);
		
		if(arr[x][y][1]==1){x--;y--;}
		if(arr[x][y][1]==2){y--;}
		if(arr[x][y][1]==3){x--;}
	}
	
	return LCS;
}

function compareStringLength(arr){
	var index=0,num=arr[0].length;
	for(var i=1;i<arr.length;i++){
		if(num<arr[i].length){
			index=i;
			num=arr[i].length;
		}
	}
	return index;
}


HW4.transCodeTo = function(ID){
	var str = document.getElementById(ID).value;
	var other_ID = (ID=="Code_A")? "Code_B":"Code_A";
	
	//remove comment & define & include
	str = str.replace(HW4.code_com,"");
	str = str.replace(HW4.code_define,"");
	
	//remove declare
	str = HW4.replaceDeclare(str);
	
	//replace print & scan
	//str = str.replace(/print[^;]*;/g,"[P]");
	//str = str.replace(/scan[^;]*;/g,"[S]");
	
	str = str.replace(/ /g,"");
	
	//remove \r\n ;
	str = str.replace(/[;{}]/g,"");
	str = str.replace(/[\r\n]/g," ");
	str = str.replace(/[\t ]+/g," ");
	str = str.replace(/ /g,"\n");
	str = str.replace(/^\n/g,"");
	str = str.replace(/\n$/g,"");
		
	return str;
}

HW4.replaceDeclare = function(str){
	var arr = ["int ","short ","long ","float ","double ","char ","struct ","system"];
	
	for(var i=0;i<arr.length;i++){
		str = str.replace(HW4.buildDeclare(arr[i]),"");
	}
	
	return str;
}

HW4.buildDeclare = function(name){
	var str = "("+name+")" +"[^;{]*";
	var code_declr = new RegExp(str,"g");
	return code_declr;
}

