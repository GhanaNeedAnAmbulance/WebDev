firebase.database().ref('/Hospital').once('value', function (snapshot) {
    app.loading = false;
    app.setCurrentPosition()
    app.hospitals = snapshot.val();
    app.snapshot = snapshot
    app.loadMarker();

    addBedListeners(snapshot.val());
});

function addBedListeners (data) {
    Object.keys(data).forEach(function (hospital) {
        firebase.database().ref('/Hospital/' + hospital + '/emptyBeds').on('value', function (snapshot) {
            app.hospitals[hospital].emptyBeds = snapshot.val();
            app.hospitals[hospital].distance = '0'
            app.hospitals[hospital].time = 0
        })
    })
}
