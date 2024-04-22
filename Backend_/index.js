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
        
        if(rooms[gameId]){
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

    socket.on('joinGame', ({gameId})=>{
        socket.join(gameId);
        
        socket.emit('joinGame', `You have joined the game using ID: ${gameId}`); 
    });

    socket.on('gameUpdate', ({gameId, words})=>{
        console.log('Game Update:', words)
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
