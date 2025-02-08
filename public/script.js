const socket = io("http://localhost:5000");

let roomId = null;

function joinChat(gender) {
    socket.emit("join", gender);
}

socket.on("match_found", (data) => {
    roomId = data.roomId;
    document.getElementById("chatbox").style.display = "block";
    alert("Match Found! Start chatting.");
});

function sendMessage() {
    let message = document.getElementById("messageInput").value;
    if (message.trim() !== "") {
        socket.emit("send_message", { roomId, message });
        document.getElementById("messageInput").value = "";
    }
}

socket.on("receive_message", (data) => {
    let messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<p>${data.message}</p>`;
});
