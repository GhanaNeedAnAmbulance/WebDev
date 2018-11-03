firebase.database().ref('/Hospital').on('value', function (snapshot) {
    console.log(snapshot.val());
    app.loading = false;
    app.hospitals = snapshot.val();
    app.snapshot = snapshot
    if (app.markers.length == 0) // if markers already loaded, don't do again
        app.loadMarker()
})