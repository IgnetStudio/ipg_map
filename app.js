const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const getResponse = require("./datagen.js");
const port = 3000;

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

app.use(express.static("public"));

getResponse(io);
