import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import routes  from "./src/public/Routes/routes.js";
import mainFunc from "./src/public/Controller/functions.js";
import "./src/mongo/schema.js";
import messageController from "./src/public/Controller/message.controller.js";
import cors from "cors";


let {sentMessage}=messageController
let { format } = mainFunc;
let { app: Router } = routes

const app = express();
const httpServer = createServer(app);
app.use(cors())
app.use(express.static(format("src", "front")));
app.use(express.json());
app.use(express.text());
console.log('Request')
app.use(Router);

const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("message1", (data) => {
    // console.log(data);
    sentMessage(data)


    io.emit("hello", {
      text: data.message,
      username:data.senderUsername
    });
  });

  socket.on("disconnect", () => {
    console.log("uzildi");
  });
});



httpServer.listen(3000, console.log("Running.."));
