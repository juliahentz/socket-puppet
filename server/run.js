const express   = require('express');
const app       = express();

const server    = require('http').Server(app);
const io        = require('socket.io')(server);

const PORT      = 3033;

if(!process.env.NODE_ENV){
    throw new Error('Set environment variable to development or production');
}


if(process.env.NODE_ENV === 'development') {
    app.use('/', express.static('../app'));
}else if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static('../dist'));
}

server.listen(PORT, ()=>{

    console.log(`Server is listening on port: ${PORT}`);

});

io.on('connection', (socket)=>{

    socket.on('message', function(msg){
        socket.broadcast.emit('message', msg);
    });

   /* socket.on('authentication', function(id){
        console.log(id);
        socket.emit('authenticated', 'everyone!');
    });*/

});