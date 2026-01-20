
const button = document.getElementById("update-messages");

const form = document.getElementById("message-form");
const messageFeedback = document.getElementById("message-feedback");

const chatTemplate = document.getElementById("chat-template");


async function fetchMessage() {
  try {
    const response = await fetch("http://127.0.0.1:3000/"); // http://127.0.0.1:3000/ https://emiliano-quote-generator-sdc-backend.hosting.codeyourfuture.io/
    const data = await response.json();
    messageElement.textContent = `"${data.message}"`;
    senderElement.textContent = `— ${data.sender}`;
  } catch (error) {
    messageElement.textContent = "Failed to load message";
    senderElement.textContent = "";
  }
}

fetchMessage();

async function fetchChat() {
  try {
    const response = await fetch("http://127.0.0.1:3000/");
    const data = await response.json();

    // Get the container where chats will be displayed
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = ""; // Clear previous messages

    data.forEach(chatObj => {
      const chat = chatTemplate.content.cloneNode(true);
      const messageElement = chat.querySelector("h3");
      const senderElement = chat.querySelector("p");

      messageElement.textContent = `${chatObj.message}`;
      senderElement.textContent = `${chatObj.sender}:`;

      chatContainer.appendChild(chat);
    });
  } catch (error) {
    console.error("Failed to load messages", error);
  }
}

function scrollToBottom() {
  const chatContainer = document.getElementById("chat-container");
  requestAnimationFrame(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
    console.log("botton")
  });
}
button.addEventListener("click", fetchChat,scrollToBottom);

form.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  const message = document.getElementById("message-input").value;
  const sender = document.getElementById("sender-input").value;

  try {
    const response = await fetch(
      "http://127.0.0.1:3000/",
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

    const data = await response.json();
    messageFeedback.textContent = data.message;
    console.log(data.message)
    messageFeedback.style.color = "green";

    //form.reset();
    document.getElementById("message-input").value = "";

    setTimeout(() => {
      messageFeedback.textContent = "";
    }, 3000);
    fetchChat()
    scrollToBottom();

  } catch (error) {
    messageFeedback.textContent = "Something went wrong";
    messageFeedback.style.color = "red";
  }
});

