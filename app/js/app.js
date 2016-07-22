/**
 * Blocks:
 * 1. DEFINING GAME ENVIRONMENT
 * 2. SOCKET CONNECTION
 * 3. MOBILE DEVICE EVENT LISTENER
 * 4. PHASER PRELOAD FUNCTION
 * 5. PHASER CREATE FUNCTION
 * 6. PHASER UPDATE FUNCTION
 * 7. PHASER RENDER FUNCTION
 * 8. UPDATE COUNTER FUNCTION
 */

var bodyGroup;
var jointGroup;

var neck;
var head;
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
var line3;

var neckLine;
var shoulderLine;
var shoulderLine2;
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
var joint3;

var neckSpring;
var mouseSpring;
var mouseSpring2;
var mouseSpring3;
var shoulderSpring;
var shoulderSpring2;
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

var text = null;

// ----------------------------------------------- //
// 1. DEFINING GAME ENVIRONMENT
    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-game', {
        preload: preload,
        create: create,
        update: update,
        render: render });

// ----------------------------------------------- //
// 2. SOCKET CONNECTION

    var socket = io();

    socket.on('connect', function(){

        socket.emit('authentication', {username: "John", password: "secret"});
        socket.on('authenticated', function() {
            // use the socket as usual
        });

        // calling an eventListener on possible mobile devices
        // todo: authentication + set up different rout for mobile user for control
        deviceOrientationListener();

        // listening to message coming from server
        // the original message has been sent from deviceOrientationListener function
        socket.on('message', function(data){

            // calling a function within Phaser's create function
            // passing in the angle received from the mobile devie
            onUpdate(data);
        });
    });

// ----------------------------------------------- //
// 3. MOBILE DEVICE EVENT LISTENER
    // Function is listening for device orientation changes
    // todo: make it conditional to mobile devices, solve authentication
    deviceOrientationListener = function(){

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function(event) {

                // event.alpha is the left-to-right motion of the device, it is an angle between 180 and -180
                var current = Math.round(event.alpha);

                // "setTimeout" workaround in Phaser
                // the counter is increased by one in each 10 milliseconds
                // when the counter reaches a number that is divisible by 40, it emits the current angle to the server
                if(counter % 16 === 0) {
                    socket.emit('message', current);
                }
            }, false);
        }

    };

// ----------------------------------------------- //
// 4. PHASER PRELOAD FUNCTION
    function preload() {

        //game.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
        game.load.image('cityline1', '../assets/cityline1.png');
        game.load.image('cityline2', '../assets/cityline2.png');
        game.load.image('cityline3', '../assets/cityline3.png');

    }

// ----------------------------------------------- //
// 5. PHASER CREATE FUNCTION
    function create() {

        game.stage.backgroundColor = '#000';

        // Game physics (P2JS)
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 150;
        game.physics.p2.restitution = 0.3; // bounce effect

        // creating TimerEvent, that sets off in each millisecond
        // counter is responsible for emitting messages in deviceOrientationListener function
        // sets a pace close to current frame-rate
        timer = game.time.create(false);
        timer.loop(1, updateCounter, this);
        timer.start();

        // adding and manipulating top skyline images
        var cityline1 = game.add.tileSprite(-700, -50, 5000, 283, 'cityline1');
        var cityline2 = game.add.tileSprite(-400, -50, 3500, 300, 'cityline2');
        var cityline3 = game.add.tileSprite(-300, -50, 2400, 342, 'cityline3');
        cityline2.alpha = 0.7;
        cityline3.alpha = 0.4;

        /**
         * PUPPET OBJECT ELEMENTS:
         * head
         * neck
         * body: left shoulder joint
         * body2: right shoulder joint
         * body3: left elbow joint
         * body4: right elbow joint
         * body5: left wrist joint
         * body6: right wrist joint
         * body7: left hip joint
         * body8: right hip joint
         * body9: left knee joint
         * body10: right knee joint
         * body11: left ankle joint
         * body12: right ankle joint
         *
         * joint: left spring anchor - to left shoulder
         * joint2: right spring anchor - to right shoulder
         * joint3: middle spring anchor - to head
         */

        bodyGroup = game.add.group();

        neck = game.add.graphics(0, 0);
        head = game.add.graphics(0, 0);
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

        bodyGroup.add(neck);
        bodyGroup.add(head);
        bodyGroup.add(body);
        bodyGroup.add(body2);
        bodyGroup.add(body3);
        bodyGroup.add(body4);
        bodyGroup.add(body5);
        bodyGroup.add(body6);
        bodyGroup.add(body7);
        bodyGroup.add(body8);
        bodyGroup.add(body9);
        bodyGroup.add(body10);
        bodyGroup.add(body11);
        bodyGroup.add(body12);

        bodyGroup.forEach(function(item) {
            item.beginFill(0xFFFFFF, 0.7);
            item.drawCircle(0, 0, 15);
            item.x = 250;
            item.y = 200;
            game.physics.p2.enable(item, false);
        }, this);

        jointGroup = game.add.group();

        joint = game.add.graphics(0, 0);
        joint2 = game.add.graphics(0, 0);
        joint3 = game.add.graphics(0, 0);

        jointGroup.add(joint);
        jointGroup.add(joint2);
        jointGroup.add(joint3);


        joint.x = 150; joint.y = 0;
        joint2.x = 350; joint2.y = 0;
        joint3.x = 250; joint3.y = 0;

        jointGroup.forEach(function(item){
            item.beginFill(0xFFFFFF, 1);
            item.drawCircle(0, 0, 15);
            game.physics.p2.enable(item, false);
            item.body.static = true;
        });

        // Adding lines/springs between body and joints
        line = new Phaser.Line(body.x, body.y, joint.x, joint.y);
        line2 = new Phaser.Line(body2.x, body2.y, joint2.x, joint2.y);
        line3 = new Phaser.Line(head.x, head.y, joint3.x, joint3.y);

        neckLine = new Phaser.Line(head.x, head.y, neck.x, neck.y);

        shoulderLine = new Phaser.Line(body.x, body.y, neck.x, neck.y);
        shoulderLine2 = new Phaser.Line(body2.x, body2.y, neck.x, neck.y);

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
        mouseSpring = game.physics.p2.createSpring(joint, body, 200, 10, 1);
        mouseSpring2 = game.physics.p2.createSpring(joint2, body2, 200, 10, 1);
        mouseSpring3 = game.physics.p2.createSpring(joint3, head, 180, 10, 1);

        shoulderSpring = game.physics.p2.createSpring(body, neck, 20, 5, 2);
        shoulderSpring2 = game.physics.p2.createSpring(body2, neck, 20, 5, 2);

        neckSpring = game.physics.p2.createSpring(head, neck, 5, 5, 2);

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
        line3.setTo(head.x, head.y, joint3.x, joint3.y);

        neckLine.setTo(head.x, head.y, neck.x, neck.y);
        shoulderLine.setTo(body.x, body.y, neck.x, neck.y);
        shoulderLine2.setTo(body2.x, body2.y, neck.x, neck.y);

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

        // called in deviceOrientationListener function, after a message from the server has been received
        // accepts data (left-to-right tilt angle) sent from server
        onUpdate = function(tiltLR){

            var nullDistace = 0;
            var distance = 0;

            // Conditions are testing if the angle has been saved already to a variable
            if(a === null) {
                a = tiltLR;

            // If a variable has already an assigned value, tests if it has angle saved to b variable also
            }else {
                if(b === null){
                    b = tiltLR;

                    // logic calculating the difference between the angles on each call
                    if (a != b){
                        if((360-a+b) >= 360){
                            nullDistace = b - a;
                        } else {
                            nullDistace = 360 - a + b;
                        }
                    }

                    if (nullDistace > 180) {
                        distance = nullDistace - 360;
                    } else {
                        distance = nullDistace;
                    }

                // if both a and b variable have assigned values
                }else{
                    if (a != b){
                        if((360-a+b) >= 360){
                            nullDistace = b - a;
                        } else {
                            nullDistace = 360 - a + b;
                        }
                    }

                    if (nullDistace > 180) {
                        distance = nullDistace - 360;
                    } else {
                        distance = nullDistace;
                    }
                    // and assign the new angle to b variable
                    b = tiltLR;
                }
            }

            // using the distance calculated above, we tween to the specific position with the joints
            if(joint.body.y > joint2.body.y){
                game.add.tween(joint.body).to( { y: distance, x: joint.body.x-Math.abs(distance) }, 1000, "Linear", true);
                game.add.tween(joint2.body).to( { y: 0-distance, x: joint2.body.x-Math.abs(distance) }, 1000, "Linear", true);
                game.add.tween(joint3.body).to( { x: joint3.body.x-Math.abs(distance) }, 1000, "Linear", true);


                if(joint2.body.x <= 0){
                    cityline1.body.velocity.x=0;
                    cityline2.body.velocity.x=0;
                    cityline3.body.velocity.x=0;
                } else {
                    cityline1.body.velocity.x=Math.abs(distance)/2;
                    cityline2.body.velocity.x=Math.abs(distance)/4;
                    cityline3.body.velocity.x=Math.abs(distance)/7;
                }

            } else if (joint.body.y < joint2.body.y) {
                game.add.tween(joint.body).to( { y: distance, x: joint.body.x+Math.abs(distance) }, 1000, "Linear", true);
                game.add.tween(joint2.body).to( { y: 0-distance, x: joint2.body.x+Math.abs(distance) }, 1000, "Linear", true);
                game.add.tween(joint3.body).to( { x: joint3.body.x+Math.abs(distance) }, 1000, "Linear", true);

                if(joint.body.x >= game.width){
                    cityline1.body.velocity.x=0;
                    cityline2.body.velocity.x=0;
                    cityline3.body.velocity.x=0;
                } else {
                    cityline1.body.velocity.x=-Math.abs(distance)/2;
                    cityline2.body.velocity.x=-Math.abs(distance)/4;
                    cityline3.body.velocity.x=-Math.abs(distance)/7;
                }

            } else {
                game.add.tween(joint.body).to( { y: distance }, 1000, "Linear", true);
                game.add.tween(joint2.body).to( { y: 0-distance }, 1000, "Linear", true);
            }
        };
    }

// ----------------------------------------------- //
// 6. PHASER UPDATE FUNCTION
    function update() {

        line.setTo(body.x, body.y, joint.x, joint.y);
        line2.setTo(body2.x, body2.y, joint2.x, joint2.y);
        line3.setTo(head.x, head.y, joint3.x, joint3.y);
        neckLine.setTo(neck.x, neck.y, head.x, head.y);
        shoulderLine.setTo(body.x, body.y, neck.x, neck.y);
        shoulderLine2.setTo(body2.x, body2.y, neck.x, neck.y);
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

// ----------------------------------------------- //
// 7. PHASER RENDER FUNCTION
    function render() {

        game.debug.geom(line, lineColor);
        game.debug.geom(line2, lineColor);
        game.debug.geom(line3, lineColor);
        game.debug.geom(neckLine, lineColor);
        game.debug.geom(shoulderLine, lineColor);
        game.debug.geom(shoulderLine2, lineColor);
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

// ----------------------------------------------- //
// 8. UPDATE COUNTER FUNCTION
    function updateCounter() {

        counter++;
    }

