import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const quotes = [
  {
    quote: "Either write something worth reading or do something worth writing.",
    author: "Benjamin Franklin",
  },
  {
    quote: "I should have been more kind.",
    author: "Clive James",
  },
];

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

app.get("/", (req, res) => {
  const quote = randomQuote();
  res.json(quote);
});

app.post("/", (req, res) => {
  const { quote, author } = req.body;
  
  if (!quote || !author) {
    return res.status(400).json({ 
      error: "Expected body to be a JSON object containing keys quote and author." 
    });
  }
  
  quotes.push({ 
    quote: quote,
    author: author,
  });
  
  res.status(201).json({ message: "Quote added" });
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});