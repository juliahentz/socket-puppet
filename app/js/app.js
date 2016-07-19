/*
var socket = io();

var deviceOrientationMessage = null;
var deviceOrientationChange = false;

window.addEventListener("deviceorientation", function(event) {
    // process event.alpha, event.beta and event.gamma

    deviceOrientationMessage = `Alpha: ${event.alpha},
            Beta: ${event.beta},
            Gamma: ${event.gamma}`;


    document.write("Hello world: " + deviceOrientationMessage);
}, true);


socket.on('connect', function(){

    console.log("socket connection is on");

    var promise = new Promise (function(resolve, reject) {


        console.log(`listening to device orientation change: ${deviceOrientationChange}`);
        resolve();

    })
    .then(function(){

        console.log('promise is happening');

        //writeValue();

        socket.emit('message', deviceOrientationMessage);

        socket.on('message', function(data){
            console.log(data);
        });
    })
    .catch(function(onReject){
        console.log(onReject);
    });

});


*/
