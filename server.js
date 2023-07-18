import express, { urlencoded } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import routes from "./src/public/Routes/routes.js";
import mainFunc from "./src/public/Controller/functions.js";
import "./src/mongo/schema.js";
import fileUpload from "express-fileupload";
// const fileUpload = require('fileUpload');
import messageController from "./src/public/Controller/message.controller.js";
import editor from "./src/public/Controller/userEdit.js";
import cors from "cors";
import fs from "fs";
import { v4 as uuid } from "uuid"; 
import { fileTypeFromBuffer } from "file-type";


let {sentMessage}=messageController
let { format } = mainFunc;
let { app: Router } = routes

let {setActive}= editor

const app = express();
const httpServer = createServer(app);

app.use(cors())
// app.use(express.urlencoded())
app.use(express.static(format("src", "front")));
app.use(express.static(format("db")));
app.use('/img',express.static(format("db",'messages')));
app.use(express.json());
app.use(express.text());
app.use(fileUpload()); 
console.log('Request')
app.use(Router);

const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  // console.log('connected');
  
  socket.on('active', async (data) => {
    let res = await setActive(data.token)
  })
  socket.on("message1", async (formData) => { 
    if (formData.img) {
      sentMessage(formData)
      console.log("img sended");
    } else {
      sentMessage(formData)  
      console.log("message sended");
    }  

    // console.log(formData);
    if (formData.img) {
      let nameImg = uuid();
      const fileInfo = await fileTypeFromBuffer(formData.img);
      // console.log(fileInfo);
      let imgPath = `${nameImg}.${fileInfo.ext}`;
      io.emit(
        "hello",
        {
          path: "/img/" + imgPath,
          type: imgPath ? "img" : "",
          text: formData.message,
          username: formData.senderUsername,
        },
        imgPath
      );
    } else {
      io.emit(
        "hello",
        {
          text: formData.message,
          username: formData.senderUsername,
        }
      );
    }
    
  });    

   

  socket.on("disconnect", async(data) => {
    let token = socket.handshake.query.token;
 await setActive(token,new Date())
  });
});

 

httpServer.listen(3000, console.log("Running.."));
