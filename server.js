import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import controller from "./public/controller.js";
import  mainFunc from "./public/functions.js";
let { format } = mainFunc

const app = express();
const httpServer = createServer(app);
app.use(express.static(format('src')))
app.use(express.json())
app.use(express.text())
app.use(controller)

const io = new Server(httpServer, {});



io.on("connection", (socket) => {

    console.log("connected");

    socket.on('message1', (data) => {

        console.log(data);
        console.log(socket.id+ " dan  "+'xabar keldi');

        io.emit('hello',data) 
    })

    socket.on("disconnect", () => {
      console.log("uzildi");
    });

});


// app.get('/', (req, res) => res.sendFile(join('src','views','index.html')))




httpServer.listen(3000,console.log('Running..'));
