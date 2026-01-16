const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const button = document.getElementById("new-quote");

const form = document.getElementById("quote-form");
const message = document.getElementById("message");

async function fetchQuote() {
  try {
    const response = await fetch("https://emiliano-quote-generator-sdc-backend.hosting.codeyourfuture.io/");
    const data = await response.json();
    quoteElement.textContent = `"${data.quote}"`;
    authorElement.textContent = `— ${data.author}`;
  } catch (error) {
    quoteElement.textContent = "Failed to load quote";
    authorElement.textContent = "";
  }
}

fetchQuote();

button.addEventListener("click", fetchQuote);

form.addEventListener("submit", async (event) => {
  event.preventDefault(); 

  const quote = document.getElementById("quote-input").value;
  const author = document.getElementById("author-input").value;

  try {
    const response = await fetch(
      "https://emiliano-quote-generator-sdc-backend.hosting.codeyourfuture.io/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quote: quote,
          author: author
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add quote");
    }

    const data = await response.json();
    message.textContent = data.message;
    message.style.color = "green";

    form.reset();
    
    setTimeout(() => {
      message.textContent = "";
    }, 3000);
  } catch (error) {
    message.textContent = "Something went wrong";
    message.style.color = "red";
  }
});