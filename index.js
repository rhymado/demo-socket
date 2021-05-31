const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
// const ioOption = {
//   cors: {
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: ["x-access-token"],
//   },
// };
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["x-access-token"],
  },
});

io.on("connection", (socket) => {
  console.log(`${socket.id} has joined`);
  socket.on("send-message", (body, room, cb) => {
    console.log(`incoming from ${socket.id}`);
    cb({ status: true });

    if (room) {
      socket.to(room).emit("message-received", body);
    } else {
      socket.broadcast.emit("message-received", body);
    }
  });
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb({ status: true });
  });
});

server.listen(8080, () => {
  console.log("server is online");
});

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  //   res.header("Access-Control-Allow-Headers", "x-access-token");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    return res.sendStatus(200);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("welcome");
});

app.post("/", (req, res) => {
  const { body } = req;
  const token = req.header("x-access-token");
  res.json({
    token,
    body,
  });
});

app.patch("/", (req, res) => {
  const { body } = req;
  const token = req.header("x-access-token");
  res.json({
    token,
    body,
  });
});

app.delete("/", (req, res) => {
  const token = req.header("x-access-token");
  res.json({
    token,
  });
});
