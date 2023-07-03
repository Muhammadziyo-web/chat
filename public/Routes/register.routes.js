import mainFunc from "../functions.js";
import fs from "fs";
import { v1 as uuidv1 } from "uuid";

let { format, str, parse, write } = mainFunc;

let allUsers = fs.readFileSync(format("db", "users.json"), "utf-8") || "[]";
let parsedUser = parse(allUsers);

let obj = {
  postData(req, res) {
    let is = parsedUser.find(
      (e) => e.userName.toLowerCase() == req.body.userName.toLowerCase()
    );
    console.log(is);
    if (is) {
      res.json(["error"]);
      // res.end("This username already exist")
    } else {
      let uuid = uuidv1();
      let obj = {
        id: parsedUser.at(-1)?.id + 1 || 1,
        name: req.body?.name,
        userName: req.body?.userName,
        password: req.body?.password,
        uuid: uuid,
      };
      parsedUser.push(obj);
      write(parsedUser, "db", "users.json");

      res.json({
        uuid: uuid,
        status: 200,
      });
    }
  },

  registerFunc(req, res) {
    let is = parsedUser.find(
      (e) =>
        e.userName.toLowerCase() == req.body.userName.toLowerCase() &&
        e.password == req.body.password
    );

      if (is) {
          console.log(is);
        res.json({
          uuid: is?.uuid ,
          status: 200,
          name:is.name
        });
      } else {
          res.json(['error'])
    }
  },
};

export default obj;
