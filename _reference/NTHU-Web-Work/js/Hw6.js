/*===========================
Declare Global Variables
=============================*/
var MyMap;
var mapOptions;
var MainCircle=null;
var marker_arr = [];
var info_arr = [];
var My_marker_arr=[];
var My_info_arr=[];

var status_adding = false;
var status_scan = true;

/*===========================
Declare GoogleMap Object
=============================*/
var geoCoder = new google.maps.Geocoder();
var geoDir = new google.maps.DirectionsService();
var dirDisplay = new google.maps.DirectionsRenderer();
var placeInfo;
var mapOptions = {
		center: new google.maps.LatLng(23, 120),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

/*===========================
Marker 
=============================*/
function NewMarker(local,name,mode){
	var pic = (mode==0)? null : (mode==1)?"img/Labelpic.png":"img/headpic.png";
	var anima = (mode!=1)? google.maps.Animation.BOUNCE : google.maps.Animation.DROP;
	var draggable = (mode==0)? true : false;
	
	var mark = 	new google.maps.Marker({
					position: local,
					map: MyMap,
					draggable: draggable,
					animation: anima, 
					icon: pic, 
					title: name});
	
	if(mode==2){
		My_marker_arr.push(mark);
	}
	else{
		var target = marker_arr.length;
		marker_arr.push(mark);
		if(mode==1){
			google.maps.event.addListener(marker_arr[target],"click",function(e){
				info_arr[target-1].open(MyMap,marker_arr[target]);
				Routing(target);
			});
		}
		else{
			google.maps.event.addListener(marker_arr[0],"dragend",function(e){getLocalInfo();drawCircle();});
		}
	}
}

function ClearAllMarker(){
	for(var i=marker_arr.length-1;i>0;i--){
		marker_arr[i].setMap(null);
		marker_arr.pop();
	}
}
/*===========================
Draw Circle
=============================*/
function drawCircle(){
	var option = {
      strokeColor: "#cc00cc",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#cc00cc",
      fillOpacity: 0.35,
      map: MyMap,
      center: marker_arr[0].position,
      radius: 60000
    };
	
	if(MainCircle==null){
		MainCircle = new google.maps.Circle(option);
	}
	else{
		MainCircle.setMap(null);
		if(status_scan)
			MainCircle = new google.maps.Circle(option);
	}
	
}
/*===========================
Searching
=============================*/
function Search(){
	var address = document.getElementById("SearchName").value;
	geoCoder.geocode({
		"address": address,
		},
		function(result,status){
			if(status == google.maps.GeocoderStatus.OK) {
				marker_arr[0].position = result[0].geometry.location;
				drawCircle();
				getLocalInfo();
				document.getElementById("SearchResult").innerHTML = result[0].formatted_address;
				MyMap.setCenter(result[0].geometry.location);
			}
			else
				document.getElementById("SearchResult").innerHTML = "找不到搜尋結果。";
		}
	);
}
/*===========================
Routing
=============================*/
/**/
function Routing(target){
	var request = {
		origin: marker_arr[0].getPosition(),
		destination: marker_arr[target].getPosition(),
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	geoDir.route(request,
		function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				dirDisplay.setDirections(response);
			}
			else{
				alert(status);
			}
		}
	);
}
/*===========================
Library
=============================*/
function getLocalInfo(){
	placeInfo = new google.maps.places.PlacesService(MyMap);
	
	ClearAllMarker();
	ClearAllInfo();
	var request = {
	    location: marker_arr[0].position,
	    radius: "50000",
	    types: ["library"]
	};
	placeInfo.nearbySearch(request,callbackPlace);
}

function callbackPlace(results,status){
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for(var i=0;i<results.length;i++){
			var cont = "<b>"+results[i].name+"</b><br>"+"地址：" + results[i].vicinity;
			
			NewInfo(cont);
			NewMarker(results[i].geometry.location , results[i].name ,1);
		}
	}
	else{
		alert(status);
	}
}

/*===========================
Info Window
=============================*/
function NewInfo(content){
	var info = new google.maps.InfoWindow({
		content: content,
		maxWidth: 200
	});
	info_arr.push(info);
}

function ClearAllInfo(){
	for(var i=info_arr.length-1;i>0;i--){
		info_arr[i].setMap(null);
		info_arr.pop();
	}
}

function CloseAllInfo(){
	for(var i=0;i<info_arr.length;i++){
		info_arr[i].close();
	}
}
/*===========================
Initialize
=============================*/
function initialize(){
	getUserLocal();
	
	/*===========================
	Set Trigger Function
	=============================*/
	document.getElementById("NewMarker").onclick = function(){
		status_adding = !status_adding;
	};
	document.getElementById("SearchButton").onclick = function(){
		Search();
	};
	document.getElementById("ScanButton").onclick = function(){
		status_scan = !status_scan;
		drawCircle();
	};
	document.getElementById("HomeButton").onclick = function(){
		navigator.geolocation.getCurrentPosition(function(pos) {
			var loc = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
			MyMap.setCenter(loc);
			marker_arr[0].position = loc;
			getLocalInfo();
			drawCircle();
		});
	};
	
}

// Get User Location
function getUserLocal(){
	navigator.geolocation.getCurrentPosition(function(pos) {
		var loc = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
		
		mapOptions.zoom = 8;
		mapOptions.center = loc;
		
		builgMap();
		
		NewMarker(loc,"You Are HERE.",0);
		
		getLocalInfo();
		drawCircle();
	});
}

function builgMap(){
	MyMap = new google.maps.Map(document.getElementById("Map_Canvas"), mapOptions);
	dirDisplay.setMap(MyMap);
	/*===========================
	Set Listener
	=============================*/
	google.maps.event.addListener(MyMap,"click",
		function(e){
			if(status_adding){
				NewMarker(e.latLng , document.getElementById("NewMarkerName").value , 2);
				status_adding=false;
			}
			else
				CloseAllInfo();
		}
	);
}
