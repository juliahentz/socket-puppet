var socket = io();

var ax = null;

socket.on('connect', function(){

    socket.on('message', function(data){
        console.log(data);
    });

    socket.emit('message', xPosition);

});

var x = [0,0],
    y = [0,0],
    segLength = 50;

function setup() {
    createCanvas(710, 400);
    strokeWeight(20.0);
    stroke(255, 100);
}

function draw() {
    background(0);
    dragSegment(0, xPosition, yPosition);
    dragSegment(1, x[0], y[0]);
}

function dragSegment(i, xin, yin) {
    var dx = xin - x[i];
    var dy = yin - y[i];
    var angle = atan2(dy, dx);
    x[i] = xin - cos(angle) * segLength;
    y[i] = yin - sin(angle) * segLength;
    segment(x[i], y[i], angle);
}

function segment(x, y, a) {
    push();
    translate(x, y);
    rotate(a);
    line(0, 0, segLength, 0);
    pop();
}

if (window.DeviceMotionEvent == undefined) {
    //No accelerometer is present. Use buttons.
    console.log("no accelerometer");
}
else {
    window.addEventListener("devicemotion", accelerometerUpdate, true);
}

function accelerometerUpdate(e) {
    var aX = event.accelerationIncludingGravity.x*1;
    var aY = event.accelerationIncludingGravity.y*1;
    var aZ = event.accelerationIncludingGravity.z*1;
    //The following two lines are just to calculate a
    // tilt. Not really needed.
    xPosition = Math.atan2(aY, aZ);
    yPosition = Math.atan2(aX, aZ);
}