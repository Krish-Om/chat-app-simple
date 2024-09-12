const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

//helper functions
const {addUser, deleteUser, getUser, getUsersInRoom} = require('./users');

//port
const port = process.env.PORT || 5000;
//server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const corsOption ={
    origin: "https://chat-app-simple-eta.vercel.app",
    methods:['GET','POST'],
    allowedHeaders :['Content-Type'],
    credentials :true
};

//router
const router = require("./router")
app.use(cors(corsOption));
app.use(router);


io.on("connection", (socket) => {

    socket.on("join", ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room});

        if (error) return callback(error);

        socket.emit("message", {user: 'admin', text: `${user.name}, welcome to the room: ${user.room}`})
        socket.broadcast.to(user.room).emit("message", {user: 'admin', text: `${user.name}, has joined!`});

        socket.join(user.room);

        io.to(user.room).emit('roomData',{room:user.room,users: getUsersInRoom(user.room)})
        callback();
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (!user) {
            return callback("User not found")
        }
        io.to(user.room).emit("message", {user: user.name, text: message})
        io.to(user.room).emit("roomData", {user: user.name, text: getUsersInRoom(user.room)})

        callback();
    })

    socket.on("disconnect", () => {
        const user = deleteUser(socket.id);
        if (user) {
            io.to(user.room)
                .emit('message', {user: 'admin', text: `${user.name} has left`})
        }
    })
})



server.listen(port, () => {
    console.log(`Server running on ${port}`);
})