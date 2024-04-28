const app = require('express');

const httpServer = require('http').createServer(app);

const { createGame } = require('./words'); // important to import the function from words.js
const e = require('express');

const io = require('socket.io')(httpServer, {
    cors: true,
    origins: ["*"]  
});


const animals = [
    {name: 'dog', icon: '../assets/dog.png'},
    {name: 'cat', icon: '../assets/cat.png'},
    {name: 'elephant', icon: '../assets/elephant.png'},
    {name: 'lion', icon: '../assets/lion.png'},
    {name: 'tiger', icon: '../assets/tiger.png'},
    {name: 'bear', icon: '../assets/bear.png'},
    {name: 'wolf', icon: '../assets/wolf.png'},
    {name: 'fox', icon: '../assets/fox.png'},
    {name: 'deer', icon: '../assets/deer.png'},
    {name: 'rabbit', icon: '../assets/rabbit.png'},
    {name: 'horse', icon: '../assets/horse.png'},
    {name: 'cow', icon: '../assets/cow.png'},
    {name: 'pig', icon: '../assets/pig.png'}
]

clients = {};
rooms = [];
io.on('connection', (socket)=>{
    console.log('User connected', socket.id);
    
    const animal = animals[Math.floor(Math.random() * animals.length)];
    animals.splice(animals.indexOf(animal), 1);
    clients[socket.id] = animal;
    socket.emit('assignAnimal', {clients: clients, animal: animal});

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
        io.to(gameId).emit('gameUpdate', words);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        const animal = clients[socket.id];
        animals.push(animal);
        delete clients[socket.id];
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
    
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
