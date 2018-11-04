var app = new Vue({
    el: '#app',
    data: {
        loading: true,
        hideFull: false,
        hospitals: {},
        snapshot: {},
        markers: [],
        highlighted: '',
        map: null,
        mapCenter: { lat: 41.7056, lng: -86.2353 },
        destinations: {},
        destIDs: []
    },
    mounted: function () { // initialize map after component loaded
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.mapCenter,
            mapTypeControl: false,
            scrollwheel: false,
            zoom: 4
        });
    },
    methods: {
        getMapsUrl: function (hospital) {
            return 'https://www.google.com/maps/dir/?api=1' +
                '&origin=' + this.mapCenter.lat + ',' + this.mapCenter.lng +
                '&destination=' + hospital.lat + ',' + hospital.lng;
        },
        addMarker: function (hospital) {
            console.log(hospital)
            var marker = new google.maps.Marker({
                position: { lat: hospital.lat, lng: hospital.lng },
                map: this.map,
                title: hospital.hospitalName
            });
            marker.addListener('click', function () {
                location.hash = hospital.id;
                this.highlighted = hospital.id;
            });
        },
        setCurrentPosition: function () {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function (location) {
                    console.log('map center set')
                    this.mapCenter = { lat: location.coords.latitude, lng: location.coords.longitude }
                    app.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude))

                    // current location icon
                    var marker = new google.maps.Marker({
                        position: { lat: location.coords.latitude, lng: location.coords.longitude },
                        map: app.map,
                        icon: './bluecircle.png'
                    })

                    formatRequest()
                }),
                    function showError() {
                        alert('Geolocation failed, may not be supported')
                    }
            }
        }
    }
});

function callback(response, status) {

    if (status == 'OK') {
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var duration = element.duration.text;
                var to = destinations[j];

                for (hospital in app.hospitals) {
                    if (app.destIDs[j] == app.hospitals[hospital].id) {
                        Vue.set(app.hospitals[hospital], 'travelDistance', distance)
                        Vue.set(app.hospitals[hospital], 'travelTime', duration)
                    }
                }
            }
        }
    }

}
var formatRequest = function () {
    // use mapCenter as origins
    // app.destination as destinations

    var origin = new google.maps.LatLng(mapCenter.lat, mapCenter.lng)
    var destinations = []
    for (var id in app.destinations) {
        app.destIDs.push(id)
        destinations.push({ lat: app.destinations[id][0], lng: app.destinations[id][1] })
    }

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: destinations,
            travelMode: 'DRIVING'
        }, callback)
}
