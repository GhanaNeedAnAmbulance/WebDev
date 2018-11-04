firebase.database().ref('/Hospital').once('value', function (snapshot) {
    app.setCurrentPosition();
    app.snapshot = snapshot.val();
    app.bounds = new google.maps.LatLngBounds();

    if (snapshot.val() !== null) {
        app.loading = false;

        Object.keys(snapshot.val()).forEach(processHospital);

        app.map.fitBounds(app.bounds);
    }
});

function processHospital (hospital) {
    var hospitalObj = app.snapshot[hospital];

    app.destinations[hospitalObj.id] = [hospitalObj.lat, hospitalObj.lng];
    app.addMarker(hospitalObj);

    firebase.database().ref('/Hospital/' + hospital + '/emptyBeds').on('value', function (snapshot) {
        hospitalObj.emptyBeds = snapshot.val();
    });

    app.hospitals.push(hospitalObj);
}
