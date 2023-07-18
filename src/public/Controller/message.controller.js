import msg from "../../mongo/schema.js";
import usersdb from "../../mongo/schema.js";
import { v4 as uuid } from "uuid"; 
import fs from 'fs'
import { fileTypeFromBuffer } from "file-type";


let { UserModel: userModel } = usersdb;
let { Message: messageDb } = msg;

export default {
  async sentMessage(data,imgPath) {
    try {
      let { senderUsername, receiverUsername, message, img } = data;
      let senderUserId = (await userModel.find({ username: senderUsername }))[0]
        ?._id;
      let receiverUserId = (
        await userModel.find({ username: receiverUsername })
      )[0]?._id;

      if (img) {
        
        
        let ress = await messageDb.create({
          sender: senderUserId,
          recipient: receiverUserId,
          text: message,
          type: "img",
          path:'/img/'+imgPath  
        });
        fs.writeFileSync(process.cwd() + '/db/messages/' + imgPath, img)
        // console.log(ress);
        return ress; 
      } else {
        let ress = await messageDb.create({
          sender: senderUserId,
          recipient: receiverUserId,
          text: message,
        });
        return ress;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  async searchUsers(req, res) {
    try {
      let { text, userToken } = JSON.parse(req.body);
      let user = await userModel.find({
        username: { $regex: text, $options: "i" },
      });
      user = user.sort((a, b) => {
        return (
          a.username
            .toLowerCase()
            .split("")
            .indexOf(text.split("")[0].toLowerCase()) -
          b.username
            .toLowerCase()
            .split("")
            .indexOf(text.split("")[0].toLowerCase())
        );
      });
      user = user.filter((e) => e.uuid != userToken);
      res.send(user.splice(0, 5));
    } catch (error) {
      console.log("yana error: ", error.message);
      res.send(error.message);
    }
  },
  async getMessages(req, res) {
    try {
      let { user1, user2 } = JSON.parse(req.body);
      // console.log(user1);
      if (!user1 || !user2) {
        throw new Error("Invalid data");
      }

      let user1Id = (await userModel.find({ username: user1 }))[0]?._id;
      let user2Id = (await userModel.find({ username: user2 }))[0]?._id;
      // console.log(user1Id);
      if (!user1Id || !user2Id) {
        throw new Error("Invalid username");
      }

      let messages = await messageDb
        .find({
          $or: [
            { sender: user1Id, recipient: user2Id },
            { sender: user2Id, recipient: user1Id },
          ],
        })
        .populate("sender", "username name")
        .populate("recipient", "username name");
      // console.log(messages);
      res.send(messages);
    } catch (error) {
      console.log(error.message);
      res.sendStatus("400");
    }
  },
  async getChats(req, res) {
    try {
      let { username } = JSON.parse(req.body);
      let userId = (await userModel.find({ username: username }))[0]?._id;
      // console.log(await userModel.find({ username: username }));

      let messageSendedUsers = await messageDb.aggregate([
        {
          $group: {
            _id: "$sender",
            // reciever:"$reciever",
            count: { $sum: 1 },
          },
        },
      ]);

      // console.log(messageSendedUsers);

      const usersId = await messageDb
        .aggregate([
          {
            $match: {
              $or: [{ sender: userId }, { recipient: userId }],
            },
          },
          {
            $group: {
              _id: {
                $cond: {
                  if: { $eq: ["$sender", userId] },
                  then: "$recipient",
                  else: "$sender",
                },
              },
              count: { $sum: 1 },
            },
          },
        ])
        .exec();
      // userId = userId.map(e=>e._id)
      let users = await userModel.find({
        _id: { $in: usersId },
      });

      // console.log(usersId);
      // console.log(users);

      // console.log(users);
      res.send(users);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  },
};

// db.users.insert({
//   name: "kimdur",
//   username: "snur",
//   password: "asdfsdf",
// });
