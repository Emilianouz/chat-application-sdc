import { state, render } from "./shared.js";

const server = "https://emiliano-chat-app-backend.hosting.codeyourfuture.io";
// polling function:
async function fetchMessages() {
  // Fetch messages from backend
  const res = await fetch(`${server}/messages`);   // always fetch all
  const data = await res.json();
  data.forEach(incoming => {
      //get timestamp of latest message
    const existing = state.messages.find(m => m.idMessage === incoming.idMessage);
    if (existing) {
      existing.likes = incoming.likes;       // update counts in place
      existing.dislikes = incoming.dislikes;
    } else {
      state.messages.push(incoming);         // append new messages
    }
  });

  render();
  setTimeout(fetchMessages, 1500);
}

window.likeHandler = async id => {
  await fetch(`${server}/messages/${id}/like`, { method: "POST" });
};

window.dislikeHandler = async id => {
  await fetch(`${server}/messages/${id}/dislike`, { method: "POST" });
};

document.getElementById("message-form").addEventListener("submit", async e => {
  e.preventDefault();

  const messageInput = document.getElementById("message-input");
  const senderInput = document.getElementById("sender-input");

  const message = messageInput.value;
  const sender = senderInput.value;

  await fetch(`${server}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sender })
  });

  messageInput.value = "";
});

fetchMessages();