

document.addEventListener('DOMContentLoaded', function () {
    let apikeyztm = '0fa53ab8-a1ab-49e8-9ecc-efa5c9c5fdee';
    let apikeyggogle= 'AIzaSyAAPCxh-TBdt4nQBQs9WA3zaKSE-1JgjvI';
    let map, markerBus, markerStop, numberLine;
    let arrayNumberLine = [];
    markerBus = 0;
    const line = document.querySelector('.line');
    const btn = document.querySelector('.btn');
    const apiZTM = 'https://api.um.warszawa.pl/api/action/busestrams_get/?resource_id=f2e5503e-927d-4ad3-9500-4ab9e55deb59&apikey=0fa53ab8-a1ab-49e8-9ecc-efa5c9c5fdee&type=1&line=';
    const showLi = document.querySelector('.dropDownList');
    const list = document.querySelector('.listPanel');
    let childList = list.children;
    let lngPos = 21.012229;
    let latPos = 52.229676;


    //getting bus stops from object
    busStops.map(element => {
        var option = document.createElement('li');
        option.innerText = element.name;
        option.dataset.latPos = element.lat;
        option.dataset.lngPos = element.lng;
        option.dataset.name = element.name;
        list.appendChild(option);
    });

    //showing list
    showLi.addEventListener('click', function () {
        if (list.classList.contains('showList')) {
            list.classList.remove("showList");
        } else {
            list.classList.add("showList");
        };
    });

    //function that create a bus stop marker
    function markerBusStop(element) {
         lngPos = parseFloat(element.dataset.lngPos);
         latPos = parseFloat(element.dataset.latPos);

        if (markerStop && markerStop.setMap) {
            markerStop.setMap(null);
        }
        // positioning marker on map
        markerStop = new google.maps.Marker({
            position: {lat: latPos, lng: lngPos},
            map: map,
            label: {
                text: element.innerText,
                color: "#000",
                fontSize: "12px",
                fontWeight: "bold"
            }
        });

        //centering the map with bus stop marker position
         const lngLat = new google.maps.LatLng(latPos, lngPos);
         map.setCenter(lngLat);

         return markerStop;
    }

    //adding event on change bus stop marker
    for (let i = 0; i < childList.length; i++) {
        childList[i].addEventListener('click', function () {
            markerBusStop(this);
        });
    }

    //putting markers from bus line on map
    function getBusPosition() {

        //removing old position markers from map
        deleteMarkers();

        //getting new data(bus positions)
        fetch(apiZTM + numberLine)
            .then( res => res.json())
            .then( items => {

                //transmission data to function
                createMarkers(items.result);
            })
    }

    //intiating map
    function initMap() {
        map = new google.maps.Map(document.getElementById('mainmap'),  {
            zoom: 13,
            center: {lat: latPos, lng: lngPos},
            styles: [{"featureType": "all", "elementType": "labels.text.fill", "stylers": [{"saturation": 36 }, {"color": "#000000"}, {"lightness": 80 } ] }, {"featureType": "all", "elementType": "labels.text.stroke", "stylers": [{"visibility": "on"}, {"color": "#000000"}, {"lightness": 16 } ] }, {"featureType": "all", "elementType": "labels.icon", "stylers": [{"visibility": "off"} ] }, {"featureType": "administrative", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 20 } ] }, {"featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"}, {"lightness": 17 }, {"weight": 1.2 } ] }, {"featureType": "landscape", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 20 } ] }, {"featureType": "poi", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 21 } ] }, {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#000000"}, {"lightness": 17 } ] }, {"featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"color": "#000000"}, {"lightness": 29 }, {"weight": 0.2 } ] }, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 18 } ] }, {"featureType": "road.local", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 16 } ] }, {"featureType": "transit", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 19 } ] }, {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#000000"}, {"lightness": 17 } ] } ]
        });

        //
        getBusPosition();
    }
    function deleteMarkers() {
        //Loop through all the bus markers and remove
        for (var i = 0; i < markerBus.length; i++) {
            markerBus[i].setMap(null);
        }
        markerBus = [];
    };

    //function is drawing markers on map with bus position
    function createMarkers(locations) {
        markerBus = locations.map(location => {
            return new google.maps.Marker({
                position: {lat: location.Lat, lng: location.Lon},
                map: map,
                label: {
                    text: location.Lines,
                    color: "#000",
                    fontSize: "16px",
                    fontWeight: "bold"
                }
            });
        });

        return markerBus;
    }

    // getting an dedicated bus line
    function getLine() {
        numberLine = line.value;
        getBusPosition();
        let intervalID ;
        clearInterval(intervalID);
        intervalID = setInterval(getBusPosition, 10000);
    }


    btn.addEventListener('click', getLine);

    //initiating map in browser
    window.initMap = initMap;
});
