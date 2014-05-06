var xhr;
var scheduleData;

var map;
var mapOptions;

var myLine;
var myColor;

var Markers;
var InfoBoxes;

var pos;
var posMarker;
var image;

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function init () {
	// Handle internet explorer
	try {
	  xhr = new XMLHttpRequest();
	}
	catch (ms1) {
	  try {
	    xhr = new ActiveXObject("Msxml2.XMLHTTP");
	  }
	  catch (ms2) {
	    try {
	      xhr = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	    catch (ex) {
	      xhr = null;
	    }
	  }
	}
	if (xhr == null) {
  		alert("Error creating request object --Ajax not supported?");
	}
	image = {
		url : 'icon.png',
		scaledSize : new google.maps.Size(25, 50)
	};
	// Grab Data
	xhr.open("get","http://mbtamap.herokuapp.com/mapper/rodeo.json",true);
	xhr.onreadystatechange = dataReady;
	// GOGOGO
	xhr.send(null);

};

function initializeMap() {
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(setPos){
			pos = new google.maps.LatLng(setPos.coords.latitude,setPos.coords.longitude);
			mapOptions = {
	      		center: pos,
	      		zoom: 11
    		};	
			map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
			run();
		});
	}else{
		scheduleDom = document.getElementById("text");
		scheduleDom.innerHTML = "<p>No Geolocation Found, putting you at default coordinates</p>";
		pos = new google.maps.LatLng(42.39674,-71.25);
		mapOptions = {
      		center: pos,
      		zoom: 11
		};	
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		run();
	}



};
      
function dataReady() {
	if(xhr.readyState == 4 && xhr.status == 200){
		scheduleData = JSON.parse(xhr.responseText);
		scheduleData["line"] = scheduleData["line"].charAt(0).toUpperCase() + scheduleData["line"].slice(1);
		scheduleDom = document.getElementById("text");
		scheduleDom.innerHTML = scheduleData["line"] + " Line Stations Near You";
		initializeMap();
		
	}else if(xhr.readyState == 4 && xhr.status == 500){
		scheduleDom = document.getElementById("text");
		scheduleDom.innerHTML = '<p>OH NO YOU BROKE THE INTERNET</p><img src = "Ming.png"><p>What is wrong with you?</p>';
		scheduleDom.style.backgroundColor = "rgb(255,200,200)";
		document.body.style.backgroundColor = "rgb(255,200,200)";

	}
};

function run () {
	display(scheduleData["line"]);
	posMarker.InfoWindow.content += "<br> Closest Station: " + closestStation();	

	directionsDisplay = new google.maps.DirectionsRenderer({
		map: map,
		suppressMarkers: true,
		preserveViewport: false
	});
    directionsDisplay.setMap(map);
}

function closestStation (){
	var close = Infinity;
	var temp;
	var closeStation = "";
	var iter;
	for (var i = 0; i < myLine.length; i++) {
		temp = haversine(pos.lat(),pos.lng(),myLine[i].lat, myLine[i].lng);
		if(temp < close){
			close = temp;
			closeStation = myLine[i].station;
			iter = i;
		}
	};
	closeStation += " (" + close.toFixed(2) + " mi away)";
	iWantToGoToThere(new google.maps.LatLng(myLine[iter].lat,myLine[iter].lng), false);
	return closeStation;
}

function display (line) {
	poly = Array();
	Markers = Array();
	InfoBoxes = Array();

	var userInfo = new google.maps.InfoWindow({content: 'Your Location'});

	posMarker = new google.maps.Marker({
		position: pos,
		map: map,
		title: 'Your Location',
		InfoWindow: userInfo
	});
	posMarker.InfoWindow.open(map,posMarker);
	InfoBoxes.push(userInfo);
	google.maps.event.addListener(posMarker,'click',function(){
		closeBoxes();
		posMarker.InfoWindow.open(map,posMarker);
	});


	initLineData(line);


	if(line == "Red"){
		// Draw first branch
		for (var i = 0; i < 18; i++) {
			mark(i);
		};
		drawLine();
		// Draw second Branch
		poly = Array();
		poly.push(new google.maps.LatLng(myLine[12].lat,myLine[12].lng));
		for (var i = 18; i < myLine.length; i++) {
			mark(i);
		};
		drawLine();
	} else {
		for (var i = 0; i < myLine.length; i++) {
			mark(i);
		};
		drawLine();
	}
};

function mark (i) {
	// Add point to polyline
	poly.push(new google.maps.LatLng(myLine[i].lat,myLine[i].lng));
	
	// Add info window
	var newInfo = new google.maps.InfoWindow({
			content: stationInfo(myLine[i].station)
	});
	InfoBoxes.push(newInfo);

	// Make a marker
	Markers.push(new google.maps.Marker({
		position: new google.maps.LatLng(myLine[i].lat,myLine[i].lng),
		map: map,
		title: myLine[i].station,
		InfoWindow: newInfo,
		icon: image
	}));

	// Add listener
	google.maps.event.addListener(Markers[i],'click',function(){
		closeBoxes();
		this.InfoWindow.open(map,this);
		iWantToGoToThere(Markers[i].position,true);
		
	});
}
function closeBoxes () {
	for (var i = 0; i < InfoBoxes.length; i++) {
		InfoBoxes[i].close();
	};	
}

function stationInfo(location){
	var time = 0;
	var temp = new google.maps.LatLng();
	for(var i = 0; i < myLine.length;i++){
		if(myLine[i].station == location){
			temp = myLine[i];
		}
	}
	var OutString = "<p>" + location + " (" + haversine(pos.lat(),pos.lng(),temp.lat, temp.lng).toFixed(2) + " mi away)</p>";
	OutString += "<table>";
	OutString += 
		"<tr>" + 
			"<td>Line</td>" +
			"<td>Trip ID</td>" +
			"<td>Destination</td>" +
			"<td>Time Till Arrival</td>" +
		"</tr>"
	;
	for (var i = 0; i < scheduleData["schedule"].length; i++) {
		for (var j = 0; j < scheduleData["schedule"][i]["Predictions"].length; j++) {
			if(scheduleData["schedule"][i]["Predictions"][j]["Stop"] == location){
				time = scheduleData["schedule"][i]["Predictions"][j]["Seconds"];
				if(time > 0){
					OutString +=
						"<tr>" +
							"<td>" + scheduleData["line"] + "</td>" +
							"<td>" + scheduleData["schedule"][i]["TripID"] + "</td>" +
							"<td>" + scheduleData["schedule"][i]["Destination"] + "</td>" +
							"<td>" + formatTime(time) + "</td>" +
						"</tr>"
					;
				}
			}
		};
	};
	OutString += "</table>";
	return OutString;
}

function formatTime (time) {
	var newTime = "";
	var mins = Math.floor(time / 60);
	if(mins == 0){
		return time + " sec";
	}else{
		var seconds = Math.floor(time % 60);
		if(seconds == 0){
			return mins + " min";
		}else{
			if(seconds < 10 && seconds != 0){
				seconds = seconds + "0";
			}
			return newTime + mins + " min " + seconds + " sec";
		}
	}
}

function drawLine () {
	new google.maps.Polyline({
		path: poly,
		geodesic: true,
		strokeColor: myColor,
		strokeOpacity: 1.0,
		strokeWeight:6,
		map: map
	});
}


function toRad(x) {
   	return x * Math.PI / 180;
}

function haversine (lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	
	var dLat = toRad((lat2 - lat1));
	var dLon = toRad((lon2 - lon1));
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	
	return d * 0.621371; // now in miles
}

function initLineData(line){
	if(line == "Red"){
		myColor = '#FF0000';
		myLine = Array();
		myLine = [
			{"station":"Alewife","lat": 42.395428, "lng":-71.142483},
			{"station":"Davis","lat": 42.39674, "lng":-71.121815},
			{"station":"Porter Square","lat": 42.3884, "lng":-71.119149},
			{"station":"Harvard Square","lat": 42.373362, "lng":-71.118956},
			{"station":"Central Square","lat": 42.365486, "lng":-71.103802},
			{"station":"Kendall/MIT","lat": 42.36249079, "lng":-71.08617653},
			{"station":"Charles/MGH","lat": 42.361166, "lng":-71.070628},
			{"station":"Park Street","lat": 42.35639457, "lng":-71.0624242},
			{"station":"Downtown Crossing","lat": 42.355518, "lng":-71.060225},
			{"station":"South Station","lat": 42.352271, "lng":-71.055242},
			{"station":"Broadway","lat": 42.342622, "lng":-71.056967},
			{"station":"Andrew","lat": 42.330154, "lng":-71.057655},
			{"station":"JFK/UMass","lat": 42.320685, "lng":-71.052391},
			
			{"station":"North Quincy","lat": 42.275275, "lng":-71.029583},
			{"station":"Wollaston","lat": 42.2665139, "lng":-71.0203369},
			{"station":"Quincy Center","lat": 42.251809, "lng":-71.005409},
			{"station":"Quincy Adams","lat": 42.233391, "lng":-71.007153},
			{"station":"Braintree","lat": 42.2078543, "lng":-71.0011385},
			
			{"station":"Savin Hill","lat": 42.31129, "lng":-71.053331},
			{"station":"Fields Corner","lat": 42.300093, "lng":-71.061667},
			{"station":"Shawmut","lat": 42.29312583, "lng":-71.06573796},
			{"station":"Ashmont","lat": 42.284652, "lng":-71.064489}
		];
	}else if(line == "Orange"){
		myLine = Array();
		myColor = '#FFCF00';
		myLine = [
			{"station":"Oak Grove","lat": 42.43668,"lng":-71.071097},
			{"station":"Malden Center","lat": 42.426632,"lng":-71.07411},
			{"station":"Wellington","lat": 42.40237,"lng":-71.077082},
			{"station":"Sullivan","lat": 42.383975,"lng":-71.076994},
			{"station":"Community College","lat": 42.373622,"lng":-71.069533},
			{"station":"North Station","lat": 42.365577,"lng":-71.06129},
			{"station":"Haymarket","lat": 42.363021,"lng":-71.05829},
			{"station":"State Street","lat": 42.358978,"lng":-71.057598},
			{"station":"Downtown Crossing","lat": 42.355518,"lng":-71.060225},
			{"station":"Chinatown","lat": 42.352547,"lng":-71.062752},
			{"station":"Tufts Medical","lat": 42.349662,"lng":-71.063917},
			{"station":"Back Bay","lat": 42.34735,"lng":-71.075727},
			{"station":"Mass Ave","lat": 42.341512,"lng":-71.083423},
			{"station":"Ruggles","lat": 42.336377,"lng":-71.088961},
			{"station":"Roxbury Crossing","lat": 42.331397,"lng":-71.095451},
			{"station":"Jackson Square","lat": 42.323132,"lng":-71.099592},
			{"station":"Stony Brook","lat": 42.317062,"lng":-71.104248},
			{"station":"Green Street","lat": 42.310525,"lng":-71.107414},
			{"station":"Forest Hills","lat": 42.300523,"lng":-71.113686}
		];
	}else if(line == "Blue"){
		myLine = Array();
		myColor = '#0000FF';
		myLine = [
			{"station":"Wonderland","lat": 42.41342, "lng":-70.991648},
			{"station":"Revere Beach","lat": 42.40784254, "lng":-70.99253321},
			{"station":"Beachmont","lat": 42.39754234, "lng":-70.99231944},
			{"station":"Suffolk Downs","lat": 42.39050067, "lng":-70.99712259},
			{"station":"Orient Heights","lat": 42.386867, "lng":-71.004736},
			{"station":"Wood Island","lat": 42.3796403, "lng":-71.02286539},
			{"station":"Airport","lat": 42.374262, "lng":-71.030395},
			{"station":"Maverick","lat": 42.36911856, "lng":-71.03952958},
			{"station":"Aquarium","lat": 42.359784, "lng":-71.051652},
			{"station":"State Street","lat": 42.358978, "lng":-71.057598},
			{"station":"Government Center","lat": 42.359705, "lng":-71.059215},
			{"station":"Bowdoin","lat": 42.361365, "lng":-71.062037}
		];
	}
};

function iWantToGoToThere (thatPlace, andLook) {
	var request = {
		origin: pos,
		destination: thatPlace,
		travelMode: google.maps.TravelMode.WALKING,
	};
	
	//directionsDisplay.setMap(map);
	directionsService.route(request,function(result,status){
		if(status == google.maps.DirectionsStatus.OK){
			directionsDisplay.setOptions({preserveViewport : andLook});
			directionsDisplay.setDirections(result);
		}
	});

}

