var host = "https://"+window.location.host;

// wypisuje liste miejsc
function Stash($scope, $http) {
//    $http.get(host+'/display').
//        success(function(data) {
//            $scope.stashes = data;
//        });
}

var mapPop, map;
var startLatitude, startLongitude;
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();


function initMap() {
	
	
    
	var location = new google.maps.LatLng(52.2191075, 21.0094183);
    var mapCanvas = document.getElementById('map');
    mapPop = {
        center: location,
        zoom: 14,
        panControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
	
    map = new google.maps.Map(document.getElementById("map"), mapPop);
    var allPlacesButton = document.getElementsByClassName("all-button")[0];
	var routeButton = document.getElementsByClassName("route-button")[0];
	

	
    allPlacesButton.addEventListener("click", function(event) {
    	// wyswietl wszystkie miejsca
    	loadData(showMarkers);
	});
	
	   routeButton.addEventListener("click", function(event) {
    	// wyswietl wszystkie miejsca
    	loadData(showRoute);
	});
	
	// zaznacz miejsce i zachowaj dane w bazie
	drawMark();
}

function addDescriptionToMarker(description, marker, map) {
	var contentString = '<div class="info-window">' +
            '<h3>Opis</h3>' +
            '<div class="description">' +
            '<p>' + description + '</p>' +
            '</div>' +
            '</div>';
	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 400
	});
	// po kliknieciu na marker pojawia sie informacja - opis kryjowki
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
}

// zaznaczanie miejsc na mapie i zapisywanie w bazie
function drawMark() {
	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_RIGHT,
			drawingModes: [
				google.maps.drawing.OverlayType.MARKER,
			]
		},
		markerOptions: {icon: 'marker.png'}
    });

	google.maps.event.addListener(drawingManager, 'markercomplete', function (marker) {
		var lat = marker.getPosition().lat();
		var lng = marker.getPosition().lng();
		
		// wyswietl okno do wpisania opisu kryjowki
		$("#myModal").modal('show');
		// po kliknieciu "Zapisz" wyslij JSONa z danymi do bazy
		$('#submit').unbind('click').click(function() {
			// pobierz tresc wpisana w okienku - opis schowka
			var description = $('#description-text').val();
			
			xhr = new XMLHttpRequest();
			xhr.open("POST", host+'/store', true);
			xhr.setRequestHeader("Content-type", "application/json");
			var data = JSON.stringify(
			{
				"marker": {
					"latitude": lat,
					"longitude": lng
				},
				"description": description
			});
			xhr.send(data);
			$('#description-text').val("");
			
			addDescriptionToMarker(description, marker, map);
		});
		
		$('#cancel').unbind('click').click(function() {
			marker.setMap(null);		
			$('#description-text').val("");
		});
	});
    drawingManager.setMap(map);
}

function putMarker(latitude, longitude, description) {
    var location = new google.maps.LatLng(latitude, longitude);
    var markerImage = 'marker.png';

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: markerImage
    });

	addDescriptionToMarker(description, marker, map);
}

/* 
[
	{
    	"marker": {
        	"latitude": 1.05,
        	"longitude": 2.05
    	},
    	"description": "Opis, co znajduje się w kryjowce"
	}
]
*/

function showMarkers(data) {
	for(var i in data) {
		putMarker(data[i].marker.latitude, data[i].marker.longitude, data[i].description);
	}
}

function loadData(onLoad) {
	var req = new XMLHttpRequest();
	req.open('GET', host+'/display', true); // asynchronicznie
	req.onreadystatechange = function (aEvt) {
	  	if (req.readyState == 4) {
	     	if(req.status == 200)
	    	{
	    		var markerList = JSON.parse(req.responseText);
	    		onLoad(markerList);
	    	} else 
	    	{
	      		// Error
	  		}
		}
	};
	req.send(null);
}


function showRoute(data) {
 	
  navigator.geolocation.getCurrentPosition(function(position) {
   startLatitude  = position.coords.latitude;
   startLongitude = position.coords.longitude;
});
	directionsDisplay.setMap(map);
 
  var start = new google.maps.LatLng(startLatitude, startLongitude);
	
  var myData = calculateDistance(startLatitude, startLongitude, data)
  var end = new google.maps.LatLng(myData.marker.latitude, myData.marker.longitude);
  
 
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}

function calculateDistance (latitude, longitude, data) {
	var chosenMarker = data[0];
	var latitudeDiff = Math.abs(data[0].marker.latitude - latitude);
	var longitudeDiff = Math.abs(data[0].marker.longitude - longitude);
	for(var i in data) {
	if( (latitudeDiff + longitudeDiff) >  (Math.abs(data[i].marker.latitude - latitude) + Math.abs(data[i].marker.longitude - longitude))  )
		chosenMarker = data[i]
	}
	return chosenMarker;
}
