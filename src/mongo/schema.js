import mongoose from "./model.js";
import {v4 as uuidv4} from 'uuid' 

const { Schema } = mongoose;


    
    
    
    let userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: [true, "Username already taken"],
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username cannot be longer than 20 characters"],
      },
      password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [20, "Password cannot be longer than 20 characters"],
      },
      uuid: {
        type: String,
        default: uuidv4,
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
        required: true,
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
    Message
}
