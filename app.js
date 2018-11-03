var app = new Vue({
    el: '#app',
    data: {
        loading: true,
        hospitals: {},
        snapshot: {},
        markers: [],
        highlighted: '',
        map: null,
        mapCenter: { lat: 41.7056, lng: 86.2353 },
        circle: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
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
                })
            })
        },
        setCurrentPosition: function() {
            navigator.geolocation.getCurrentPosition(function(location) {
                console.log('map center set')
                this.mapCenter = { lat: location.coords.latitude, lng: location.coords.longitude }
                this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude))
                
                // current location icon
                var marker = new google.maps.Marker({
                    position: { lat: location.coords.latitude, lng: location.coords.longitude },
                    map: this.map,
                    icon: './bluecircle.png'
                })
            }),
            function fail() {
                alert('Geolocation failed, may not be supported')
            }
        }
    }
});
