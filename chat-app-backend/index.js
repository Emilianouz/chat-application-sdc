import express from "express";
import cors from "cors";
// create Express app
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const messages = [
  {
    idMessage: 1,
    likes:0,
    dislikes:0,
    message: "Either write something worth reading or do something worth writing.",
    sender: "Linus Torvalds",
    timestamp: Date.now()
  },
  {
    idMessage: 2,
    likes:0,
    dislikes:0,
    message: "I should have been more kind.",
    sender: "Bill Gates",
    timestamp: Date.now()
  },
];
// Define GET endpoint
app.get("/messages", (req, res) => {
const since = Number(req.query.since);

  if (!since) {
    // if no timestamp return all messages
    return res.json(messages);
  }
  // if there are timestamp filter only newer messages
  const newMessages = messages.filter(
    (msg) => msg.timestamp > since
  );

  res.json(newMessages); // send
});
// Define POST endpoint
app.post("/messages", (req, res) => {
  const { message, sender } = req.body; // extract data from request
  
  if (!message || !sender) { //validate
    return res.status(400).json({ 
      error: "Expected body to be a JSON object containing key message and sender." 
    });
  }
  // save message with timestamp
  messages.push({ 
    idMessage: messages.length + 1,
    message: message,
    sender: sender,
    likes:0,
    dislikes:0,
    timestamp: Date.now(),
  });
  
  res.status(201).json({ message: "Message sent" });
});

//like endpoint
app.post("/messages/:id/like",(req,res) => {
  const id = Number(req.params.id);
  const message = messages.find(msg => msg.idMessage === id);
  if (!message){
    return res.status(404).json({error:"Message not found"});
  }
  message.likes += 1;
  res.json({likes: message.likes});
}
);
//dislike endpoint
app.post("/messages/:id/dislike",(req,res) => {
  const id = Number(req.params.id);
  const message = messages.find(msg => msg.idMessage === id);
  if (!message){
    return res.status(404).json({error:"Message not found"});
  }
  message.dislikes += 1;
  res.json({dislikes: message.dislikes});
}
);

//start server
app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});