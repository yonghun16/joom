const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone() {
  console.log("done")
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  // emit(이벤트 이름, 메시지, 서버에서 호출되는 함수)
  socket.emit(
    "enter_room",
    input.value,
    backendDone
  );
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
