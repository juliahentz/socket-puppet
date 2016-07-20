var socket = io();

socket.on('connect', function(){

    console.log("socket connection is on");

    deviceOrientationListener();

    /*socket.on('message', function(data){
        console.log(data);
    });*/

});

deviceOrientationListener = function(){

    window.addEventListener("deviceorientation", function(event) {
        // event.alpha - left-to-right movement
        // event.beta - front-to-back movement
        // event.gamma - compass degree

        var tiltLR = Math.round(event.alpha);
        var tiltFB = Math.round(event.beta);
        var compDEG = Math.round(event.gamma);

        deviceOrientationMessage = `Alpha: ${tiltLR},
            Beta: ${tiltFB},
            Gamma: ${compDEG}`;

        document.getElementById("data-export").innerHTML = "Data export: " + deviceOrientationMessage;

        socket.emit('message', deviceOrientationMessage);
        
    }, true);

};

