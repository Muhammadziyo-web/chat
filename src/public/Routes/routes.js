
import {Router} from "express";
import { createServer } from "http";
import mainFunc from "../Controller/functions.js";
import register from '../Controller/register.controller.js'
import message from "../Controller/message.controller.js";

let { postData, LoginFunc } = register
let { sentMessage, searchUsers,getMessages, getChats} = message;  

let { format } = mainFunc

const app = Router();
const httpServer = createServer(app);




app.get("/", (req, res) => res.sendFile(format("src",'front', "views", "chat.html")));
app.get("/#:token", (req, res) => res.sendFile(format("src",'front', "views", "chat.html")));
app.get("/login", (req, res) =>res.sendFile(format("src",'front', "views", "login.html")));
app.get("/register", (req, res) => res.sendFile(format("src" ,'front', "views", "register.html")));

app.post("/getMessages", getMessages);
app.post("/getChats", getChats);

app.post('/register',postData) 
app.post('/login', LoginFunc)
app.post("/chat/:token",sentMessage);

app.post("/search",searchUsers);
export default {
    app
}
