import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
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
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsServer, {
  auth: false,
});

// get public rooms
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

// 유저 인원 세기
function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

// WebSocket Server on
wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
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
