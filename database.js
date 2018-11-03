firebase.database().ref('/Hospital').on('value', function (snapshot) {
    console.log(snapshot.val());
    app.loading = false;
    app.hospitals = snapshot.val();
    app.snapshot = snapshot
    app.loadMarker()    
})