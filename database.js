firebase.database().ref('/Hospital').once('value', function (snapshot) {
    app.setCurrentPosition();
    app.hospitals = snapshot.val();
    app.snapshot = snapshot;

    if (app.hospitals !== null) {
        app.loading = false;

        Object.keys(snapshot.val()).forEach(processHospital);
    }
});

function processHospital (hospital) {
    var hospitalObj = app.hospitals[hospital];

    app.destinations[hospitalObj.id] = [hospitalObj.lat, hospitalObj.lng];
    app.addMarker(hospitalObj);

    firebase.database().ref('/Hospital/' + hospital + '/emptyBeds').on('value', function (snapshot) {
        app.hospitals[hospital].emptyBeds = snapshot.val();
    });
}
