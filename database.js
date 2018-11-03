firebase.database().ref('/Hospital').once('value', function (snapshot) {
    app.loading = false;
    app.setCurrentPosition()
    app.hospitals = snapshot.val();
    app.snapshot = snapshot
    app.loadMarker();

    addBedListeners(snapshot.val());
    console.log(app.destinations)
});

function addBedListeners (data) {
    Object.keys(data).forEach(function (hospital) {
        firebase.database().ref('/Hospital/' + hospital + '/emptyBeds').on('value', function (snapshot) {
            app.hospitals[hospital].emptyBeds = snapshot.val();
        })
        currHosp = app.hospitals[hospital]
        var id = currHosp.id
        tempObj = [currHosp.lat, currHosp.lng]
        app.destinations[id] = tempObj
    })
}