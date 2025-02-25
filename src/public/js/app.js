const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);  // 여기(app.js) socket은 -> Server와 통신을 위한 socket


function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

// Open
function handleOpen() {
  console.log("Connected to Server 🛜");
}
socket.addEventListener("open", handleOpen);

// Close
function handleClose() {
  console.log("Disconnected from Server ❌");
}
socket.addEventListener("close", handleClose);

// Message
function handleMessage(message) {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
}
socket.addEventListener("message", handleMessage);

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `You: ${input.value}`;
  messageList.append(li);

  input.value="";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleMessageSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
