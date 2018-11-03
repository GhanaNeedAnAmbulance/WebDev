var app = new Vue({
    el: '#app',
    data: {
        loading: true,
        hospitals: {},
        snapshot: {},
        markers: [],
        map: null
    },
    mounted: function () { // initialize map after component loaded

        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 41.7056, lng: -86.2353 },
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
                    map: this.map
                })
            })
        }
    }
});
