firebase.database().ref('/Hospital').once('value', function (snapshot) {
    console.log(Object.keys(snapshot.val()));
    app.loading = false;
    app.hospitals = snapshot.val();
    app.snapshot = snapshot
    if (app.markers.length == 0) // if markers already loaded, don't do again
        app.loadMarker();

    addBedListeners(snapshot.val());
});

function addBedListeners (data) {
    Object.keys(data).forEach(function (hospital) {
        firebase.database().ref('/Hospital/' + hospital + '/emptyBeds').on('value', function (snapshot) {
            app.hospitals[hospital].emptyBeds = snapshot.val();
        })
    })
}
