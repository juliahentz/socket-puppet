const express   = require('express');
const app       = express();

const server    = require('http').Server(app);
const io        = require('socket.io')(server);

const PORT      = 3033;

app.use('/', express.static('../dev-app'));

app.use('/test', express.static('../app'));

server.listen(PORT, ()=>{

    console.log(`Server is listening on port: ${PORT}`);

});

io.on('connection', (socket)=>{

    console.log('User connected');

    socket.emit('message', 'hello from the server');

    socket.on('message', function(msg){
        console.log(`message: ${msg}`);
    });

    /*socket.on('disconnect', function(){
        console.log('User disconnected');
    });*/

});