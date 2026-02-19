//const server = "https://emiliano-chat-app-backend.hosting.codeyourfuture.io";
const server = "http://127.0.0.1:3000";
//front end storage
const state = {
  messages: []
};

//const button = document.getElementById("update-messages");
const form = document.getElementById("message-form");
const messageFeedback = document.getElementById("message-feedback");
const chatTemplate = document.getElementById("chat-template");
// polling function:
const keepFetchingMessages = async () => {
  //get timestamp of latest message
    const lastMessageTime = state.messages.length > 0 ? state.messages[state.messages.length - 1].timestamp : null;
    const queryString = lastMessageTime ? `?since=${lastMessageTime}` : "";
    const url = `${server}/messages${queryString}`;
    // Ftch messages from backend
    const rawResponse = await fetch(url);
    const response = await rawResponse.json();
    //update state and UI
    state.messages.push(...response);
    render();
    setTimeout(keepFetchingMessages, 2000);
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
    document.getElementById("message-input").value = "";
    messageFeedback.textContent = "Message sent!";
    messageFeedback.style.color = "green";

    setTimeout(() => {
      messageFeedback.textContent = "";
    }, 3000);

  } catch (error) {
    messageFeedback.textContent = "Something went wrong";
    messageFeedback.style.color = "red";
  }
});
// Function to like:
function like(idMessage){
  fetch(`${server}/messages/${idMessage}/like`,{
    method: "POST"
  })
    .then( res => res.json())
    .then( data => {
      const msg = state.messages.find(m => m.idMessage === idMessage);
      if (msg) {
        msg.likes = data.likes;
        render(); // 
      }
    })
    .catch( err => {
      console.error("Failed to like message", err)
    })
}

function dislike(idMessage){
  fetch(`${server}/messages/${idMessage}/dislike`,{
    method: "POST"
  })
    .then( res => res.json())
    .then( data => {
      const msg = state.messages.find(m => m.idMessage === idMessage);
      if (msg) {
        msg.dislikes = data.dislikes;
        render(); // 
      }
    })
    .catch( err => {
      console.error("Failed to like message", err)
    })
}

// Function to render
function render() {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = "";

  state.messages.forEach((chatObj) => {
    const chat = chatTemplate.content.cloneNode(true);
    const messageElement = chat.querySelector("h3");
    const senderElement = chat.querySelector("h4");

    const likesElement = chat.querySelector('.likes');
    const dislikesElement = chat.querySelector('.dislikes');
    const likeButton = chat.querySelector('.likes-button');
    const dislikeButton = chat.querySelector('.dislikes-button');

    messageElement.textContent = chatObj.message;
    senderElement.textContent = `${chatObj.sender}:`;

    likesElement.textContent = chatObj.likes;
    dislikesElement.textContent = chatObj.dislikes;

    likeButton.addEventListener("click", () => like(chatObj.idMessage));
    dislikeButton.addEventListener("click", () => dislike(chatObj.idMessage));

    chatContainer.appendChild(chat);
  });

  scrollToBottom();
}
