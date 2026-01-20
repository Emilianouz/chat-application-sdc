import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const messages = [
  {
    message: "Either write something worth reading or do something worth writing.",
    sender: "Benjamin Franklin",
  },
  {
    message: "I should have been more kind.",
    sender: "Clive James",
  },
];

app.get("/", (req, res) => {
  res.json(messages);
});

app.post("/", (req, res) => {
  const { message, sender } = req.body;
  
  if (!message || !sender) {
    return res.status(400).json({ 
      error: "Expected body to be a JSON object containing key message and sender." 
    });
  }
  
  messages.push({ 
    message: message,
    sender: sender,
  });
  
  res.status(201).json({ message: "Message sent" });
});

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});