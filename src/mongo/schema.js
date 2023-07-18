import mongoose from "./model.js";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [35, "Password cannot be longer than 20 characters"],
  },
  username: {
    type: String,
    required: true,
    unique: [true, "Username already taken"],
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username cannot be longer than 20 characters"],
    // match: {
    //   pattern: /^[A-Za-z0-9_]+$/,
    //   errmsg: "Username can only contain letters, numbers, and underscores.",
    // },
    // match: /^[A-Za-z0-9_]+$/,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9_]+$/.test(v);
      },
      message: "Username can only contain letters, numbers, and underscores.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    maxlength: [15, "Password cannot be longer than 20 characters"],
  },
  uuid: {
    type: String,
    default: uuidv4,
  },
  img: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxlength: [40, "Password cannot be longer than 20 characters"],
  },
  isOnline: {
    type: Schema.Types.Mixed,
  },
});

userSchema.index({ username: "text", uuid: "text" });

const UserModel = mongoose.model("User", userSchema);

let obj = {
  name: "M",
  username: "Mfghfghfghfghfhf",
  password: "M",
};

// (async function () {
//     try {

//     //    let user= await UserModel.create(obj)
//             console.log(user);

//     } catch (error) {
//         if (error.code==11000) {
//             console.log("Username already taken");
//         } else {
//             console.log(error.message.split(':').at(-1).trim());
//         }
//     }

// })();

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
  },
  path: {
    type: String, 
  },
});

const Message = mongoose.model("Message", messageSchema);

// let senderId

// Message.create({
//   text: "salom",
//   sender: "643067853f15d2fbb8cd5324",
//   recipient: "6430bbea70516024e1de320f",
// });

export default {
  UserModel,
  Message,
};
