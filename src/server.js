import http from "http";
import SocketIO from "socket.io";
import express from "express";

// create express
const app = express();

// express setting
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// HTTP Server make
const httpServer = http.createServer(app);

// WebSocket Server make 
const wsServer = SocketIO(httpServer);
 
// WebSocket Server on
wsServer.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    setTimeout(() => {
      done() 
    }, 1000)
  })
});



/* ---------------- WebSocket Server Code ----------------

// WebSocket Server make
const wss = new WebSocket.Server({ server });

// fake db
const sockets = [];

// WebSocket Server Event
function onSocketClose() {
  console.log("Disconnected from Browser ❌");
}

// WebSocket Server on
wss.on("connection", (socket) => {
  if (socket != null) console.log("Connected to Browser 🌏");
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => { aSocket.send(`${socket.nickname}: ${message.payload}`) });
      case "nickname":
        socket["nickname"] = message.payload;  // socket의 type은 기본적으로 object. 
    }
  });
});
--------------------------------------------------------- */


// HTTP Server on
const handleListener = () => console.log("Listening on http://localhost:3000 ✅");
httpServer.listen(3000, handleListener);
