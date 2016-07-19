angular.module('socketPuppetApp').factory('socketService',function(
    
) {

    var socketService = {
        connect:function(){

            /*var socket = io();

            socket.connect(function(){



            });

            socketIo.on('connect', function(socket){

                socketIo.on('message', function(data){

                    console.log(data);

                });

                socketIo.emit('message', 'Hello from the browser');

            });

             */
        }
    };

    return socketService;
});
