import dbs from "../../mongo/schema.js";
import fs from "fs";
let { UserModel: userModel } = dbs;

export default {
  async editUser(req, res) {
    // console.log(req.files);
    // console.log(req.body);

    try {

      let { userName, name, password, bio } = req.body;
      let img = req.files?.img;
      
        if (img) {
            let mainLink = process.cwd() + "/db/images";
            const imageTypes = ["jpeg", "png", "gif", "webp"];
             imageTypes.forEach((e) => {
               fs.unlink(req.params.token + e, (error) => {});
             });
             let userImageLink =
               req.params.token + "." + img.mimetype.split("/")[1];
             img.mv(mainLink + "/" + userImageLink);
             let user = await userModel.findOneAndUpdate(
               {
                 uuid: req.params.token,
               },
               {
                 $set: {
                   
                   name,
                   username: userName,
                   password,
                   img: "images/" + userImageLink,
                   bio,
                  }
               },
                { new: true, runValidators: true }
             );
             res.send(user);
        } else {
             let user = await userModel.findOneAndUpdate(
               {
                 uuid: req.params.token,
               },
               {
                 $set: {
                   name,
                   username: userName,
                   password,
                   bio,
                 },
               },
               { new: true, runValidators: true }
          );
          
             res.send(user);
        }

         
    } catch (error) {
      if (error.code == 11000) {
        res.status(400).send("Username already taken");
      } else {
        res.status(400).json(error.message.split(":").at(-1).trim());
      }
      // res.status(400).send(error.message);
      // console.log(error.message);
    }
  },
  async setActive(token, value = "online") {
    let user = await userModel.updateOne(
      {
        uuid: token,
      },
      {
        isOnline: value,
      }
    );
    return user;
  }
};
