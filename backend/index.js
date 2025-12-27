require("dotenv").config()
const express = require("express");
const app = express()
const http = require("http")
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        credentials: true,
        origin: `${process.env.FRONTEND_URL}`
    }
});
const cors = require("cors")

const user = new Map()
const socketIdToEmail = new Map();
const emailToSocketId = new Map();
const emailToName = new Map();
app.use(cors({
    credentials: true,
    origin: `${process.env.FRONTEND_URL}`
}))
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("room-join", (data) => {
        const { email, room, name } = data;
        socketIdToEmail.set(socket.id, email);
        emailToSocketId.set(email, { socketId: socket.id });
        emailToName.set(email, { name: name })
        console.log(`${email} joined in ${room}`);
        io.to(room).emit("user-joined", { email, Id: socket.id, name })
        socket.join(room);
        io.to(socket.id).emit("room-join", data)
    });
    socket.on("outgoingCall", ({ To, offer }) => {
        const email = socketIdToEmail.get(socket.id); 
        const userData = emailToName.get(email); 
        const name = userData ? userData.name : "REMOTE USER"; 
        console.log("Caller name:", name)
        io.to(To).emit("incoming-call", { from: socket.id, offer, name });
    })

    socket.on("answere", ({ To, ans }) => {
        io.to(To).emit("call-accepted", { from: socket.id, ans })
    })
    socket.on("negoNeed", ({ offer, To }) => {
        io.to(To).emit("negoInco", { from: socket.id, offer })
    });
    socket.on("negoAns", ({ To, ans }) => {
        io.to(To).emit("negoAccept", { from: socket.id, ans })
    })
    socket.on("disconnect", () => {
        const user = socketIdToEmail.get(socket.id);
        if (user) {
            console.log(`User disconnected: ${user}`);
            socketIdToEmail.delete(socket.id);
        } else {
            console.log("User disconnected:", socket.id);
        }
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("running on " + PORT);
})
