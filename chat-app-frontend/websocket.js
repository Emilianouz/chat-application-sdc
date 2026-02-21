import { state, render } from "./shared.js";

const socket = new WebSocket(
  "wss://emiliano-chat-app-backend.hosting.codeyourfuture.io"
);
socket.onmessage = event => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    state.messages = data.payload;
  }

  if (data.type === "new-message") {
    state.messages.push(data.payload);
  }

  if (data.type === "update-like" || data.type === "update-dislike") {
    const index = state.messages.findIndex(m => m.idMessage === data.payload.idMessage);
    state.messages[index] = data.payload;
  }
console.log(state.messages); //*** */
  render();
};

window.likeHandler = id => {
  socket.send(JSON.stringify({ type: "like", payload: id }));
};

window.dislikeHandler = id => {
  socket.send(JSON.stringify({ type: "dislike", payload: id }));
};

document.getElementById("message-form").addEventListener("submit", e => {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");
  const senderInput = document.getElementById("sender-input");

  socket.send(JSON.stringify({
    type: "new-message",
    payload: {
      message: messageInput.value,
      sender: senderInput.value
    }
  }));

  messageInput.value = "";
});