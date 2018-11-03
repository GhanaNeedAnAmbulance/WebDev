var app = new Vue({
    el: '#app',
    data: {
        loading: true,
        hospitals: {},
        markers: []
    },
    mounted: function () { // initialize map after component loaded

        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 61.180059, lng: -149.822075 },
            scrollwheel: false,
            zoom: 4
        })
    },
    
});
