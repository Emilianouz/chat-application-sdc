//front end storage
export const state = {
  messages: []
};

export function render() {
  const container = document.getElementById("chat-container");
  const template = document.getElementById("chat-template");
  container.innerHTML = "";

  state.messages.forEach(msg => {
    const clone = template.content.cloneNode(true);

    clone.querySelector("h3").textContent = msg.message;
    clone.querySelector("h4").textContent = msg.sender;
    clone.querySelector(".likes").textContent = msg.likes;
    clone.querySelector(".dislikes").textContent = msg.dislikes;

    clone.querySelector(".likes-button")
      .addEventListener("click", () => window.likeHandler(msg.idMessage));

    clone.querySelector(".dislikes-button")
      .addEventListener("click", () => window.dislikeHandler(msg.idMessage));

    container.appendChild(clone);
  });
}