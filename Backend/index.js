const app = require('express');

const httpServer = require('http').createServer(app);

const { createGame } = require('./words'); // important to import the function from words.js

const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]  
});


rooms = [];
io.on('connection', (socket)=>{
    console.log('User is connected');
    
    socket.on('startGame', ({gameId})=>{
        if(rooms[gameId] && rooms[gameId].length > 0){
            return io.to(gameId).emit('startGame', rooms[gameId])
        }
        createGame().then(words => {
            rooms[gameId] = words;
            io.to(gameId).emit('startGame', words);
        });
    });

    socket.on('nextGame', ({gameId})=>{
        createGame().then(words => {
            rooms[gameId] = words;
            io.to(gameId).emit('startGame', words);
        });
    });

    socket.on('creategame', ({gameId})=>{
        socket.join(gameId);
        rooms[gameId] = [];
        socket.emit('creategame', `You have created the game with ID: ${gameId}`); 
    });

    socket.on('joingame', ({gameId})=>{
        if(!rooms[gameId])
            return socket.emit('joingame', `Game with ID: ${gameId} does not exist`);
        
        socket.join(gameId);
        socket.emit('joingame', `You have joined the game with ID: ${gameId}`);
    });

    socket.on('gameUpdate', ({gameId, words})=>{
        rooms[gameId] = words;
        console.log('gameUpdate', words)
        io.to(gameId).emit('gameUpdate', words);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
    
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
