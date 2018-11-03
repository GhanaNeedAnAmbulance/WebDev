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
        map = new google.maps.Map(document.getElementById('map'), {
            center: this.mapCenter,
            mapTypeControl: false,
            scrollwheel: false,
            zoom: 4
        })
    },
    methods: {

        loadMarker: function (markerData) {
            this.snapshot.forEach(function (child) {
                var childs = child.val()
                var marker = new google.maps.Marker({
                    position: { lat: childs.lat, lng: childs.lng },
                    map: this.map,
                    title: childs.hospitalName
                })
                marker.addListener('click', () => {
                    location.hash = childs.id
                    this.highlighted = childs.id
                    openMaps(childs.lat, childs.lng)
                })

            })
        },
        setCurrentPosition: function () {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function (location) {
                    console.log('map center set')
                    this.mapCenter = { lat: location.coords.latitude, lng: location.coords.longitude }
                    this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude))

                    // current location icon
                    var marker = new google.maps.Marker({
                        position: { lat: location.coords.latitude, lng: location.coords.longitude },
                        map: this.map,
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

var openMaps = function (clat, clng) {
    var url = "https://www.google.com/maps/dir/?api=1"
    var origin = "&origin=" + mapCenter.lat + "," + mapCenter.lng
    var destination = "&destination=" + clat + "," + clng
    var newUrl = new URL(url + origin + destination)

    var win = window.open(newUrl, '_blank')
    win.focus()
}

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
                    console.log(hospital)
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
        // temp.push(app.destinations[id])
        destinations.push({ lat: app.destinations[id][0], lng: app.destinations[id][1] })
    }
    // console.log?(temp)

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [origin],
            destinations: destinations,
            travelMode: 'DRIVING'
            // unitSystem: UnitSystem,
        }, callback)
}
