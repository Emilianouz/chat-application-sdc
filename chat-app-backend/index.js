import express from "express";
import cors from "cors";
import http from "http";
import { server as WebSocketServer } from "websocket";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

const messages = [];
let connections = [];

// -------- Helper: Broadcast to all WS clients --------
function broadcast(data) {
  connections.forEach(conn => {
    conn.sendUTF(JSON.stringify(data));
  });
}

// -------- HTTP ROUTES (Polling still works) --------

app.get("/messages", (req, res) => {
  const since = Number(req.query.since);
  if (!since) return res.json(messages);

  const newMessages = messages.filter(msg => msg.timestamp > since);
  res.json(newMessages);
});

app.post("/messages", (req, res) => {
  const { message, sender } = req.body;
  if (!message || !sender) {
    return res.status(400).json({ error: "Missing message or sender" });
  }

  const newMessage = {
    idMessage: messages.length + 1,
    message,
    sender,
    likes: 0,
    dislikes: 0,
    timestamp: Date.now()
  };

  messages.push(newMessage);

  broadcast({ type: "new-message", payload: newMessage });

  res.status(201).json(newMessage);
});

app.post("/messages/:id/like", (req, res) => {
  const id = Number(req.params.id);
  const msg = messages.find(m => m.idMessage === id);
  if (!msg) return res.status(404).json({ error: "Not found" });

  msg.likes++;

  broadcast({ type: "update-like", payload: msg });

  res.json({ likes: msg.likes });
});

app.post("/messages/:id/dislike", (req, res) => {
  const id = Number(req.params.id);
  const msg = messages.find(m => m.idMessage === id);
  if (!msg) return res.status(404).json({ error: "Not found" });

  msg.dislikes++;

  broadcast({ type: "update-dislike", payload: msg });

  res.json({ dislikes: msg.dislikes });
});

// -------- WEBSOCKET --------

wsServer.on("request", request => {
  const connection = request.accept(null, request.origin);
  connections.push(connection);

  connection.sendUTF(JSON.stringify({
    type: "init",
    payload: messages
  }));

  connection.on("message", message => {
    const data = JSON.parse(message.utf8Data);

    if (data.type === "new-message") {
      const newMessage = {
        idMessage: messages.length + 1,
        message: data.payload.message,
        sender: data.payload.sender,
        likes: 0,
        dislikes: 0,
        timestamp: Date.now()
      };

      messages.push(newMessage);
      broadcast({ type: "new-message", payload: newMessage });
    }

    if (data.type === "like") {
      const msg = messages.find(m => m.idMessage === data.payload);
      if (msg) {
        msg.likes++;
        broadcast({ type: "update-like", payload: msg });
      }
    }

    if (data.type === "dislike") {
      const msg = messages.find(m => m.idMessage === data.payload);
      if (msg) {
        msg.dislikes++;
        broadcast({ type: "update-dislike", payload: msg });
      }
    }
  });

  connection.on("close", () => {
    connections = connections.filter(conn => conn !== connection);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});