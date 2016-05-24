var host = "http://"+window.location.host;

// wypisuje liste miejsc
function Stash($scope, $http) {
//    $http.get(host+'/display').
//        success(function(data) {
//            $scope.stashes = data;
//        });
}

var mapPop, map;

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

    allPlacesButton.addEventListener("click", function(event) {
    	// wyswietl wszystkie miejsca
    	loadData();
	});
	
	// zaznacz miejsce i zachowaj dane w bazie
	drawMark();
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
			var url = "http://localhost:8080/store";
			xhr.open("POST", url, true);
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

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
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

function loadData() {
	var req = new XMLHttpRequest();
	req.open('GET', host+'/display', true); // asynchronicznie
	req.onreadystatechange = function (aEvt) {
	  	if (req.readyState == 4) {
	     	if(req.status == 200)
	    	{
	    		var markerList = JSON.parse(req.responseText);
	    		showMarkers(markerList);
	    	} else 
	    	{
	      		// Error
	  		}
		}
	};
	req.send(null);
}