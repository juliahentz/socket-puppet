/**
 * Blocks:
 * 1. DEFINING GAME ENVIRONMENT
 * 2. SOCKET CONNECTION
 * 3. MOBILE EVENT LISTENER
 * 4. PHASER CREATE FUNCTION
 * 5. UPDATE COUNTER FUNCTION
 */


var counter = 0;

var text;

// ----------------------------------------------- //
// 1. DEFINING GAME ENVIRONMENT
    var game = new Phaser.Game('100', '100', Phaser.CANVAS, 'phaser-game', {
        create: create });


// ----------------------------------------------- //
// 2. SOCKET CONNECTION
    var socket = io();

    socket.on('connect', function(){

        // calling an eventListener on mobile devices
        // todo: authentication + set up different rout for mobile user for control
        deviceOrientationListener();

    });

// ----------------------------------------------- //
// 3. MOBILE EVENT LISTENER
    // todo: solve authentication
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
// 4. PHASER CREATE FUNCTION
    function create() {

        game.stage.backgroundColor = '#000000';

        // creating TimerEvent, that sets off in each millisecond
        // counter is responsible for emitting messages in deviceOrientationListener function
        // sets a pace close to current frame-rate
        timer = game.time.create(false);
        timer.loop(1, updateCounter, this);
        timer.start();

        var style = { font: "bold 50px Arial", align: 'center', fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  The Text is positioned at 0, 100
        text = game.add.text(game.width/2, game.height/2, "Tilt your phone in order\nto move the puppet", style);
        text.anchor.set(0.5);
        
    }

// ----------------------------------------------- //
// 5. UPDATE COUNTER FUNCTION
    function updateCounter() {
        counter++;
    }

