
import {Router} from "express";
import { createServer } from "http";
import mainFunc from "../Controller/functions.js";
import register from '../Controller/register.controller.js'
import message from "../Controller/message.controller.js";
import  getters  from "../Controller/getters.js"
import  editors  from "../Controller/userEdit.js" 
import multer from "multer";
let { postData, LoginFunc } = register
let { sentMessage, searchUsers,getMessages, getChats} = message;  
let { getNameByToken,getUserNameByToken,getImgByToken,getNameByUserName,getActiveByUserName } = getters
let { format } = mainFunc
let {editUser } = editors

const app = Router();
const httpServer = createServer(app);
// const upload = multer({ dest: "db/images" });



app.get("/", (req, res) => res.sendFile(format("src",'front', "views", "chat.html")));
app.get("/#:token", (req, res) => res.sendFile(format("src",'front', "views", "chat.html")));
app.get("/login", (req, res) =>res.sendFile(format("src",'front', "views", "login.html")));
app.get("/register", (req, res) => res.sendFile(format("src", 'front', "views", "register.html")));
app.get("/getNameByToken/:token", getNameByToken);
app.get("/getUserNameByToken/:token", getUserNameByToken);
app.get("/getImgByToken/:token", getImgByToken);
app.get("/getNameByUserName/:username", getNameByUserName); 
app.get("/getActiveByUserName/:username", getActiveByUserName); 


app.post("/getMessages", getMessages);
app.post("/getChats", getChats);

app.post('/register',postData) 
app.post('/login', LoginFunc)
app.post("/chat/:token",sentMessage);

app.put('/editUser/:token',editUser)
 
app.post("/search",searchUsers);
export default {
    app
}


