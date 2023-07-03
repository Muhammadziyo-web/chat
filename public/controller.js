import express from "express";
import { createServer } from "http";
import mainFunc from "./functions.js";
import register from './Routes/register.routes.js'

let {postData, registerFunc} = register

let { format } = mainFunc

const app = express();
const httpServer = createServer(app);




app.get("/", (req, res) => res.sendFile(format("src", "views", "index.html")));
app.get("/login", (req, res) =>res.sendFile(format("src", "views", "login.html")));
app.get("/register", (req, res) => res.sendFile(format("src", "views", "register.html")));

app.post('/register',postData)
app.post('/login',registerFunc)
export default app;
