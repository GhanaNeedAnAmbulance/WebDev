window.addEventListener('load', function () {
    var app = new Vue({
        el: '#app',
        data: {
            hospitalData: {
                hospitalName: 'Hospital Name!',
                address: '123 Sesame St.',
                phone: '123-456-7890',
            },
            mapName: 'My map'
        }
    });
});