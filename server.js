const Express=require("express");
const http=require("http");
const cors=require("cors");
const {Server}=require("socket.io");
require("dotenv").config();

const app=Express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});
let girlsQueue = [];
let boysQueue = [];
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    socket.on("send_message", (data) => {
        io.to(data.roomId).emit("receive_message", { message: data.message });
    });
    socket.on("join", (gender) => {
        if (gender === "girl") {
            if (boysQueue.length > 0) {
                let boySocket = boysQueue.shift();
                createRoom(socket, boySocket);
            } else {
                girlsQueue.push(socket);
            }
        } else if (gender === "boy") {
            if (girlsQueue.length > 0) {
                let girlSocket = girlsQueue.shift();
                createRoom(socket, girlSocket);
            } else {
                boysQueue.push(socket);
            }
        }
        
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

function createRoom(user1, user2) {
    const roomId = user1.id + user2.id;
    user1.join(roomId);
    user2.join(roomId);
    
    io.to(roomId).emit("match_found", { roomId });

    user1.roomId = roomId;
    user2.roomId = roomId;
}

server.listen(5000,()=>{
    console.log("Server Started!!");
});