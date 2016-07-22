
var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-game', {
    preload: preload,
    create: create,
    update: update,
    preRender: preRender,
    render: render });

var body;
var body2;
var body3;
var body4;
var body5;
var body6;
var body7;
var body8;
var body9;
var body10;
var body11;
var body12;

var line;
var line2;
var shoulderLine;
var leftArmLine;
var rightArmLine;
var leftArmLine2;
var rightArmLine2;
var leftTorsoLine;
var rightTorsoLine;
var hipLine;
var leftLegLine;
var leftLegLine2;
var rightLegLine;
var rightLegLine2;

var joint;
var joint2;
var mouseSpring;
var mouseSpring2;
var shoulderSpring;
var leftArmSpring;
var rightArmSpring;
var leftArmSpring2;
var rightArmSpring2;
var leftTorsoSpring;
var rightTorsoSpring;
var hipSpring;
var leftLegSpring;
var leftLegSpring2;
var rightLegSpring;
var rightLegSpring2;

var counter = 0;
var a = null;
var b = null;
var lineColor = 'rgb(255,255,255)';


var socket = io();
// establishing socket connection to the server
socket.on('connect', function(){

    // calling an eventListener on possible mobile devices
    // todo: authentication + set up different rout for mobile user for control
    deviceOrientationListener();

    // listening to message coming from server, message has been sent from the update function
    socket.on('message', function(data){

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

    game.load.image('cityline1', '../assets/cityline1.png');
    game.load.image('cityline2', '../assets/cityline2.png');
    game.load.image('cityline3', '../assets/cityline3.png');

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

    var cityline1 = game.add.tileSprite(-500, -5, 5000, 308*0.7, 'cityline1');
    var cityline2 = game.add.tileSprite(-400, -5, 3500, 348*0.7, 'cityline2');
    var cityline3 = game.add.tileSprite(-300, -5, 2400, 410*0.7, 'cityline3');
    cityline2.alpha = 0.7;
    cityline3.alpha = 0.4;
    cityline1.scale.setTo(0.7,0.7);
    cityline2.scale.setTo(0.7,0.7);
    cityline3.scale.setTo(0.7,0.7);


    // Creating two objects that are controlled by the moving joints
    /**
     * body: left shoulder joint
     * body2: right shoulder joint
     * body3: left elbow joint
     * body4: right elbow joint
     * body5: left wrist joint
     * body5: right wrist joint
     * body7: left hip joint
     * body8: right hip joint
     * body9: left knee joint
     * body10: right knee joint
     * body11: left ankle joint
     * body12: right ankle joint
     *
     * joint: left spring anchor
     * joint2: right spring anchor
     */
    body = game.add.graphics(0, 0);
    body2 = game.add.graphics(0, 0);
    body3 = game.add.graphics(0, 0);
    body4 = game.add.graphics(0, 0);
    body5 = game.add.graphics(0, 0);
    body6 = game.add.graphics(0, 0);
    body7 = game.add.graphics(0, 0);
    body8 = game.add.graphics(0, 0);
    body9 = game.add.graphics(0, 0);
    body10 = game.add.graphics(0, 0);
    body11 = game.add.graphics(0, 0);
    body12 = game.add.graphics(0, 0);

    joint = game.add.graphics(0, 0);
    joint2 = game.add.graphics(0, 0);

    body.beginFill(0xFFFFFF, 0.7);
    body2.beginFill(0xFFFFFF, 0.7);
    body3.beginFill(0xFFFFFF, 0.7);
    body4.beginFill(0xFFFFFF, 0.7);
    body5.beginFill(0xFFFFFF, 0.7);
    body6.beginFill(0xFFFFFF, 0.7);
    body7.beginFill(0xFFFFFF, 0.7);
    body8.beginFill(0xFFFFFF, 0.7);
    body9.beginFill(0xFFFFFF, 0.7);
    body10.beginFill(0xFFFFFF, 0.7);
    body11.beginFill(0xFFFFFF, 0.7);
    body12.beginFill(0xFFFFFF, 0.7);

    joint.beginFill(0xFFFFFF, 1);
    joint2.beginFill(0xFFFFFF, 1);

    body.drawCircle(0, 0, 15);
    body2.drawCircle(0, 0, 15);
    body3.drawCircle(0, 0, 15);
    body4.drawCircle(0, 0, 15);
    body5.drawCircle(0, 0, 15);
    body6.drawCircle(0, 0, 15);
    body7.drawCircle(0, 0, 15);
    body8.drawCircle(0, 0, 15);
    body9.drawCircle(0, 0, 15);
    body10.drawCircle(0, 0, 15);
    body11.drawCircle(0, 0, 15);
    body12.drawCircle(0, 0, 15);

    joint.drawCircle(0, 0, 15);
    joint2.drawCircle(0, 0, 15);

    body.x  = 250; body.y  = 200;
    body2.x = 250; body2.y = 200;
    body3.x = 250; body3.y = 200;
    body4.x = 250; body4.y = 200;
    body5.x = 250; body5.y = 200;
    body6.x = 250; body6.y = 200;
    body7.x = 250; body6.y = 200;
    body8.x = 250; body6.y = 200;
    body9.x = 250; body6.y = 200;
    body10.x = 250; body6.y = 200;
    body11.x = 250; body6.y = 200;
    body12.x = 250; body6.y = 200;

    joint.x = 200; joint.y = 100;
    joint2.x = 300; joint2.y = 100;

    game.physics.p2.enable(body, false);
    game.physics.p2.enable(body2, false);
    game.physics.p2.enable(body3, false);
    game.physics.p2.enable(body4, false);
    game.physics.p2.enable(body5, false);
    game.physics.p2.enable(body6, false);
    game.physics.p2.enable(body7, false);
    game.physics.p2.enable(body8, false);
    game.physics.p2.enable(body9, false);
    game.physics.p2.enable(body10, false);
    game.physics.p2.enable(body11, false);
    game.physics.p2.enable(body12, false);

    game.physics.p2.enable(joint, false);
    game.physics.p2.enable(joint2, false);

    //  Creating the joints controlled by the device angle

    joint.body.static = true;
    joint2.body.static = true;

    // Adding springs between body and joints
    line = new Phaser.Line(body.x, body.y, joint.x, joint.y);
    line2 = new Phaser.Line(body2.x, body2.y, joint2.x, joint2.y);
    shoulderLine = new Phaser.Line(body.x, body.y, body2.x, body2.y);

    leftArmLine = new Phaser.Line(body.x, body.y, body3.x, body3.y);
    rightArmLine = new Phaser.Line(body2.x, body2.y, body4.x, body4.y);
    leftArmLine2 = new Phaser.Line(body3.x, body3.y, body5.x, body5.y);
    rightArmLine2 = new Phaser.Line(body4.x, body4.y, body6.x, body6.y);
    leftTorsoLine = new Phaser.Line(body.x, body.y, body7.x, body7.y);
    rightTorsoLine = new Phaser.Line(body2.x, body2.y, body8.x, body8.y);

    hipLine = new Phaser.Line(body7.x, body7.y, body8.x, body8.y);

    leftLegLine = new Phaser.Line(body7.x, body7.y, body9.x, body9.y);
    rightLegLine = new Phaser.Line(body8.x, body8.y, body10.x, body10.y);
    leftLegLine2 = new Phaser.Line(body9.x, body9.y, body11.x, body11.y);
    rightLegLine2 = new Phaser.Line(body10.x, body10.y, body12.x, body12.y);

    ////////
    mouseSpring = game.physics.p2.createSpring(joint, body, 20, 10, 1);
    mouseSpring2 = game.physics.p2.createSpring(joint2, body2, 20, 10, 1);
    shoulderSpring = game.physics.p2.createSpring(body, body2, 100, 5, 2);

    leftArmSpring = game.physics.p2.createSpring(body, body3, 60, 5, 2);
    rightArmSpring = game.physics.p2.createSpring(body2, body4, 60, 5, 2);
    leftArmSpring2 = game.physics.p2.createSpring(body3, body5, 75, 5, 2);
    rightArmSpring2 = game.physics.p2.createSpring(body4, body6, 75, 5, 2);
    leftTorsoSpring = game.physics.p2.createSpring(body, body7, 120, 5, 2);
    rightTorsoSpring = game.physics.p2.createSpring(body2, body8, 120, 5, 2);

    hipSpring = game.physics.p2.createSpring(body7, body8, 30, 5, 2);

    leftLegSpring = game.physics.p2.createSpring(body7, body9, 70, 5, 2);
    rightLegSpring = game.physics.p2.createSpring(body8, body10, 70, 5, 2);
    leftLegSpring2 = game.physics.p2.createSpring(body9, body11, 85, 5, 2);
    rightLegSpring2 = game.physics.p2.createSpring(body10, body12, 85, 5, 2);

    ////////
    line.setTo(body.x, body.y, joint.x, joint.y);
    line2.setTo(body2.x, body2.y, joint2.x, joint2.y);
    shoulderLine.setTo(body.x, body.y, body2.x, body2.y);

    leftArmLine.setTo(body.x, body.y, body3.x, body3.y);
    rightArmLine.setTo(body2.x, body2.y, body4.x, body4.y);
    leftArmLine2.setTo(body3.x, body3.y, body5.x, body5.y);
    rightArmLine2.setTo(body4.x, body4.y, body6.x, body6.y);
    leftTorsoLine.setTo(body.x, body.y, body7.x, body7.y);
    rightTorsoLine.setTo(body2.x, body2.y, body8.x, body8.y);

    hipLine.setTo(body7.x, body7.y, body8.x, body8.y);

    leftLegLine.setTo(body7.x, body7.y, body9.x, body9.y);
    rightLegLine.setTo(body8.x, body8.y, body10.x, body10.y);
    leftLegLine2.setTo(body9.x, body9.y, body11.x, body11.y);
    rightLegLine2.setTo(body10.x, body10.y, body12.x, body12.y);

    game.physics.enable(cityline1, Phaser.Physics.ARCADE);
    game.physics.enable(cityline2, Phaser.Physics.ARCADE);
    game.physics.enable(cityline3, Phaser.Physics.ARCADE);

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


        if(joint.body.y > joint2.body.y){
            game.add.tween(joint.body).to( { y: 100+distance, x: joint.body.x-70 }, 2000, "Linear", true);
            game.add.tween(joint2.body).to( { y: 100-distance, x: joint2.body.x-70 }, 2000, "Linear", true);

            cityline1.body.velocity.x=70;
            cityline2.body.velocity.x=30;
            cityline3.body.velocity.x=10;
        } else if (joint.body.y < joint2.body.y) {
            game.add.tween(joint.body).to( { y: 100+distance, x: joint.body.x+70 }, 2000, "Linear", true);
            game.add.tween(joint2.body).to( { y: 100-distance, x: joint2.body.x+70 }, 2000, "Linear", true);
            cityline1.body.velocity.x=-70;
            cityline2.body.velocity.x=-30;
            cityline3.body.velocity.x=-10;
        } else {
            game.add.tween(joint.body).to( { y: 100+distance }, 2000, "Linear", true);
            game.add.tween(joint2.body).to( { y: 100-distance }, 2000, "Linear", true);
        }
    };
}

function update() {

    line.setTo(body.x, body.y, joint.x, joint.y);
    line2.setTo(body2.x, body2.y, joint2.x, joint2.y);
    shoulderLine.setTo(body.x, body.y, body2.x, body2.y);
    leftArmLine.setTo(body.x, body.y, body3.x, body3.y);
    rightArmLine.setTo(body2.x, body2.y, body4.x, body4.y);
    leftArmLine2.setTo(body3.x, body3.y, body5.x, body5.y);
    rightArmLine2.setTo(body4.x, body4.y, body6.x, body6.y);
    leftTorsoLine.setTo(body.x, body.y, body7.x, body7.y);
    rightTorsoLine.setTo(body2.x, body2.y, body8.x, body8.y);
    hipLine.setTo(body7.x, body7.y, body8.x, body8.y);
    leftLegLine.setTo(body7.x, body7.y, body9.x, body9.y);
    rightLegLine.setTo(body8.x, body8.y, body10.x, body10.y);
    leftLegLine2.setTo(body9.x, body9.y, body11.x, body11.y);
    rightLegLine2.setTo(body10.x, body10.y, body12.x, body12.y);

}

function preRender() {

    line.setTo(body.x, body.y, joint.x, joint.y);
    line2.setTo(body2.x, body2.y, joint2.x, joint2.y);
    shoulderLine.setTo(body.x, body.y, body2.x, body2.y);
    leftArmLine.setTo(body.x, body.y, body3.x, body3.y);
    rightArmLine.setTo(body2.x, body2.y, body4.x, body4.y);
    leftArmLine2.setTo(body3.x, body3.y, body5.x, body5.y);
    rightArmLine2.setTo(body4.x, body4.y, body6.x, body6.y);
    leftTorsoLine.setTo(body.x, body.y, body7.x, body7.y);
    rightTorsoLine.setTo(body2.x, body2.y, body8.x, body8.y);
    hipLine.setTo(body7.x, body7.y, body8.x, body8.y);
    leftLegLine.setTo(body7.x, body7.y, body9.x, body9.y);
    rightLegLine.setTo(body8.x, body8.y, body10.x, body10.y);
    leftLegLine2.setTo(body9.x, body9.y, body11.x, body11.y);
    rightLegLine2.setTo(body10.x, body10.y, body12.x, body12.y);

}

function render() {

    game.debug.geom(line, lineColor);
    game.debug.geom(line2, lineColor);
    game.debug.geom(shoulderLine, lineColor);
    game.debug.geom(leftArmLine, lineColor);
    game.debug.geom(rightArmLine, lineColor);
    game.debug.geom(leftArmLine2, lineColor);
    game.debug.geom(rightArmLine2, lineColor);
    game.debug.geom(leftTorsoLine, lineColor);
    game.debug.geom(rightTorsoLine, lineColor);
    game.debug.geom(hipLine, lineColor);
    game.debug.geom(leftLegLine, lineColor);
    game.debug.geom(rightLegLine, lineColor);
    game.debug.geom(leftLegLine2, lineColor);
    game.debug.geom(rightLegLine2, lineColor);

}

function updateCounter() {

    counter++;
}
