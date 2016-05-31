﻿﻿var host = "http://"+window.location.host;

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
var markers = [];
var infoWindows = [];

function initWithNearest() {
	loadData( function(markerList) {
		var mark = findClosest(markerList);
		initMap(mark.latitude, mark.longitude);
	} )
}

function initMap(lat, lon) {
	var location = new google.maps.LatLng(lat, lon);
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
	var hideButton = document.getElementsByClassName("hide-button")[0];

	allPlacesButton.addEventListener("click", function(event) {
		// wyswietl wszystkie miejsca
		loadData(showMarkers);
	});

	routeButton.addEventListener("click", function(event) {
		// pokaż ścieżkę do najbliższego miejsca
		loadData(showRoute);
	});

	hideButton.addEventListener("click", function(event) {
		//ukryj wszystkie miejsca
		clearMarkers();
	})

	// zaznacz miejsce i zachowaj dane w bazie
	drawMark();
}

function addDescriptionToMarker(description, marker, map, visited) {
	var contentString = '<div class="info-window">' +
		'<h3>Opis</h3>' +
		'<div class="description">' +
		'<p>' + description + '</p>' +
		'</div>' +
		'<div class="modal-footer">';

	var pos = marker.getPosition();

	if(visited)
		contentString += '<p>Już odwiedzony</p>';
	else
		contentString += '<input type="button" onclick="makeVisited(\'' + description + '\',' + pos.lat() + ',' + pos.lng() + ')" value="Oznacz odwiedzony" />';

	contentString = contentString +
		'<input type="button" onclick="navigateToChosen(' + pos.lat() + ',' + pos.lng() + ')" value="Nawiguj" />' +
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

	infoWindows.push(infowindow);
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
					"description": description,
					"visited" : 0
				});
			xhr.send(data);
			$('#description-text').val("");

			markers.push(marker);
			addDescriptionToMarker(description, marker, map);
		});

		$('#cancel').unbind('click').click(function() {
			marker.setMap(null);
			$('#description-text').val("");
		});
	});
	drawingManager.setMap(map);
}

function putMarker(latitude, longitude, description, visited) {
	var location = new google.maps.LatLng(latitude, longitude);
	var markerImage = 'marker.png';

	var marker = new google.maps.Marker({
		position: location,
		map: map,
		icon: markerImage
	});

	markers.push(marker);

	addDescriptionToMarker(description, marker, map, visited);
}

/*
 [
 {
 "id" : 1,
 "marker": {
 "latitude": 1.05,
 "longitude": 2.05
 },
 "description": "Opis, co znajduje się w kryjowce",
 "visited": 1
 }
 ]
 */

function showMarkers(data) {
	for(var i in data) {
		putMarker(data[i].marker.latitude, data[i].marker.longitude, data[i].description, data[i].visited);
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

// Usuwa znaczniki z mapy wraz z przypisanymi do nich infoWindow
function clearMarkers() {
	setMapOnAll(null);
	markers = [];
	infoWindows = [];
}

// Ustawia wartość mapa dla wszystkich znaczników
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Funkcja, która zmienia wartość visited w bazie dla wybranego znacznika
function makeVisited(description, lat, lon) {
	xhr = new XMLHttpRequest();
	xhr.open("POST", host+'/edit', true);
	xhr.setRequestHeader("Content-type", "application/json");
	var data = JSON.stringify(
		{
			"marker": {
				"latitude": lat,
				"longitude": lon
			},
			"description": description,
			"visited" : 1
		});
	xhr.send(data);
	
	for (var i = 0; i < markers.length; i++) {
		var latLng1 = markers[i].getPosition();

		if(latLng1.lat() === lat
			&& latLng1.lng() === lon) {
			infoWindows[i].setContent('<div class="info-window">' +
				'<h3>Opis</h3>' +
				'<div class="description">' +
				'<p>' + description + '</p>' +
				'</div>' +
				'<div class="modal-footer">' +
				'<p>Już odwiedzony</p>');
		}

	}
}

//nawiguje do wybranego punktu określonego współrzędnymi lat i lon
function navigateToChosen(lat, lon) {
	navigator.geolocation.getCurrentPosition(function(position) {
		startLatitude  = position.coords.latitude;
		startLongitude = position.coords.longitude;
	});
	directionsDisplay.setMap(map);

	var start = new google.maps.LatLng(startLatitude, startLongitude);
	var end = new google.maps.LatLng(lat, lon);

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

function findClosest (data) {
	var latitude = 53, longitude = 21;

	/*navigator.geolocation.getCurrentPosition(function(position) {
		latitude  = position.coords.latitude;
		longitude = position.coords.longitude;
	});*/

	var chosenMarker = data[0];
	var latitudeDiff = Math.abs(data[0].marker.latitude - latitude);
	var longitudeDiff = Math.abs(data[0].marker.longitude - longitude);
	for(var i in data) {
		var tempLatDiff = Math.abs(data[i].marker.latitude - latitude);
		var tempLonDiff = Math.abs(data[i].marker.longitude - longitude);
		if( (latitudeDiff + longitudeDiff) >  tempLatDiff + tempLonDiff
			&& data[i].visited === true ) {
			chosenMarker = data[i];
			latitudeDiff = tempLatDiff;
			longitudeDiff = tempLonDiff;
		}

	}
	return chosenMarker.marker;
}