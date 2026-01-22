const server = "https://emiliano-chat-app-backend.hosting.codeyourfuture.io";//"http://127.0.0.1:3000";

const state = {
  messages: []
};

//const button = document.getElementById("update-messages");
const form = document.getElementById("message-form");
const messageFeedback = document.getElementById("message-feedback");
const chatTemplate = document.getElementById("chat-template");

const keepFetchingMessages = async () => {
    const lastMessageTime = state.messages.length > 0 ? state.messages[state.messages.length - 1].timestamp : null;
    const queryString = lastMessageTime ? `?since=${lastMessageTime}` : "";
    const url = `${server}/messages${queryString}`;
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    state.messages.push(...response);
    render();
    setTimeout(keepFetchingMessages, 100);
}


keepFetchingMessages();

function scrollToBottom() {
  const chatContainer = document.getElementById("chat-container");
  requestAnimationFrame(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  const message = document.getElementById("message-input").value;
  const sender = document.getElementById("sender-input").value;

  try {
    const response = await fetch(
      `${server}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          sender: sender
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add message");
    }

    //const data = await response.json();
    document.getElementById("message-input").value = "";
    messageFeedback.textContent = "Message sent!";
    messageFeedback.style.color = "green";

    setTimeout(() => {
      messageFeedback.textContent = "";
    }, 3000);
    //fetchChat()
    //scrollToBottom();

  } catch (error) {
    messageFeedback.textContent = "Something went wrong";
    messageFeedback.style.color = "red";
  }
});
// Function to render
function render() {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = "";

  state.messages.forEach((chatObj) => {
    const chat = chatTemplate.content.cloneNode(true);
    const messageElement = chat.querySelector("h3");
    const senderElement = chat.querySelector("p");

    messageElement.textContent = chatObj.message;
    senderElement.textContent = `${chatObj.sender}:`;

    chatContainer.appendChild(chat);
  });

  scrollToBottom();
}
