
var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-game', {
    preload: preload,
    create: create,
    update: update,
    preRender: preRender,
    render: render });

var body;
var body2;
var line;
var line2;
var joint;
var joint2;
var mouseSpring;
var mouseSpring2;
var counter = 0;
var a = null;
var b = null;


var socket = io();
// establishing socket connection to the server
socket.on('connect', function(){

    // calling an eventListener on possible mobile devices
    // todo: authentication + set up different rout for mobile user for control
    deviceOrientationListener();

    // listening to message coming from server, message has been sent from the update function
    socket.on('message', function(data){

        // printing out angle data in browser
        // todo: delete line after testing
        document.getElementById("data-export").innerHTML = "Data export: " + data;

        // calling a function within Phaser's update function in order to pass in the angle sent from the server
        onUpdate(data);
    });
});

// Function is listening for device orientation changes
// todo: make it conditional to mobile devices, solve authentication
deviceOrientationListener = function(){

    window.addEventListener("deviceorientation", function(event) {

        // event.alpha is the left-to-right motion of the device, it is an angle between 180 and -180
        var current = Math.round((event.alpha));

        // "setTimeout" workaround in Phaser
        // the counter is increased by one in each 10 milliseconds
        // when the counter reaches a number that is divisible by 40, it emits the current angle to the server
        if(counter % 16 === 0) {
            socket.emit('message', current);
        }
    }, false);
};

function preload() {


}

function create() {

    game.stage.backgroundColor = '#000';

    // Game physics (P2JS)
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 150;
    game.physics.p2.restitution = 0.3; // bounce effect

    //  Create our Timer
    timer = game.time.create(false);

    //  Calling a TimerEvent, that sets off in each 10 millisecond in order to count relatively close to the frame rate
    timer.loop(1, updateCounter, this);
    timer.start();

    //  Creating two objects that are controlled by the moving joints
    body = game.add.sprite(200, 200, 'body');
    game.physics.p2.enable(body, true);
    body.body.setCircle(20);

    body2 = game.add.sprite(300, 200, 'body');
    game.physics.p2.enable(body2, true);
    body2.body.setCircle(20);

    //  Creating the joints controlled by the device angle
    joint = game.add.sprite(200, 100, 'cursor');
    game.physics.p2.enable(joint, true);
    joint.body.static = true;
    joint.body.setCircle(10);
    joint.body.data.shapes[0].sensor = true;

    joint2 = game.add.sprite(300, 100, 'cursor');
    game.physics.p2.enable(joint2, true);
    joint2.body.static = true;
    joint2.body.setCircle(10);
    joint2.body.data.shapes[0].sensor = true;

    // Adding springs between body and joints
    line = new Phaser.Line(body.x, body.y, joint.x, joint.y);
    line2 = new Phaser.Line(body2.x, body2.y, joint2.x, joint2.y);

    mouseSpring = game.physics.p2.createSpring(joint, body, 200, 5, 2);
    line.setTo(body.x, body.y, joint.x, joint.y);

    mouseSpring2 = game.physics.p2.createSpring(joint2, body2, 200, 5, 2);
    line2.setTo(body2.x, body2.y, joint2.x, joint2.y);

    // called in preload function, after a message from the server has been received, accepts data sent from server
    onUpdate = function(tiltLR){

        var distance = 0;

        // Conditions are testing if the angle has been saved already to a variable
        if(a === null) {
            a = tiltLR;
            // If a variable has already an assigned value, tests if it has angle saved to b variable also
        }else {
            if(b === null){
                b = tiltLR;
                // if both a and b variable have assigned values
            }else{
                // we calculate the distance between the two angles
                if (a != b){
                    distance = (b - a)/2;
                }
                // and assign the new angle to b variable
                b = tiltLR;
            }
        }

        // then using the distance calculated above, we tween to the specific position with the joints
        game.add.tween(joint.body).to( { y: 100+distance }, 2000, "Linear", true);

        game.add.tween(joint2.body).to( { y: 100-distance }, 2000, "Linear", true);
    };
}

function update() {

    line.setTo(body.x, body.y, joint.x, joint.y);
    line2.setTo(body2.x, body2.y, joint2.x, joint2.y)

}

function preRender() {

    line.setTo(body.x, body.y, joint.x, joint.y);
    line2.setTo(body2.x, body2.y, joint2.x, joint2.y);
}

function render() {

    game.debug.geom(line);
    game.debug.geom(line2);
}

function updateCounter() {

    counter++;
}
