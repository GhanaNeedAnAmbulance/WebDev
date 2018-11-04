var app = new Vue({
    el: '#app',
    data: {
        loading: true,
        hideFull: false,
        hospitals: [],
        snapshot: {},
        markers: [],
        highlighted: '',
        map: null,
        userLocation: { lat: 41.7056, lng: -86.2353 },
        destinations: {},
        destIDs: []
    },
    mounted: function () { // initialize map after component loaded
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.userLocation,
            mapTypeControl: false,
            scrollwheel: false,
            zoom: 8
        });
    },
    methods: {
        getMapsUrl: function (hospital) {
            return 'https://www.google.com/maps/dir/?api=1' +
                '&origin=' + this.userLocation.lat + ',' + this.userLocation.lng +
                '&destination=' + hospital.lat + ',' + hospital.lng;
        },
        addMarker: function (hospital) {
            var position = { lat: hospital.lat, lng: hospital.lng };
            var marker = new google.maps.Marker({
                position: position,
                map: this.map,
                title: hospital.hospitalName
            });

            marker.addListener('click', function () {
                location.hash = hospital.id;
                this.highlighted = hospital.id;
            });

            app.bounds.extend(position);
        },
        setCurrentPosition: function () {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function (location) {
                    this.userLocation = { lat: location.coords.latitude, lng: location.coords.longitude };

                    // current location icon
                    new google.maps.Marker({
                        position: this.userLocation,
                        map: app.map,
                        icon: './bluecircle.png',
                        zIndex: 999
                    })
                    //Add the circle
                    var currCircle = new google.maps.Circle({
                        strokeColor: '#002',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#aa9f',
                        fillOpacity: 0.35,
                        map: app.map,
                        center: this.userLocation,
                        radius: 10000
                    });

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
    console.log(response)
    if (status == 'OK') {
        var origins = response.originAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var duration = element.duration.text;
                var durationRaw = element.duration.value;

                Vue.set(app.hospitals[j], 'travelDistance', distance);
                Vue.set(app.hospitals[j], 'travelTime', duration);
                Vue.set(app.hospitals[j], 'travelTimeRaw', durationRaw);
            }
        }

        app.hospitals.sort(function (a, b) {
            return a.travelTimeRaw - b.travelTimeRaw;
        });
    }

}
var formatRequest = function () {
    // use userLocation as origins
    // app.destination as destinations

    var origin = new google.maps.LatLng(userLocation.lat, userLocation.lng)
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
