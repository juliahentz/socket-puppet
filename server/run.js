const express   = require('express');
const app       = express();

const server    = require('http').Server(app);
const io        = require('socket.io')(server);

const PORT      = 3033;

app.use('/', express.static('../app'));

server.listen(PORT, ()=>{

    console.log(`Server is listening on port: ${PORT}`);

});

io.on('connection', (socket)=>{

    console.log('User connected');

});