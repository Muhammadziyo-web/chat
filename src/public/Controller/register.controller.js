import dbs from '../../mongo/schema.js'

let {UserModel:userModel}=dbs

let allUsers = userModel.find({}) ;

export default{
  postData(req, res) {
    let { userName, name, password } = req.body;

    let obj = {
      name,
      username:userName,
      password,
    };

    (async function () {
        try {
          let user= await userModel.create(obj)
          // console.log(user);
                res.send(user);

        } catch (error) {
          // console.log(error);
            if (error.code==11000) {
                res.send({ err: "Username already taken" });
            } else {
              res
                .status(400)
                .json({ err: error.message.split(":").at(-1).trim() });
            }
        }

    })();
  },

  async LoginFunc(req, res) {
    let allData = await userModel.find(req.body)
    if (allData.length) {
      res.send(allData[0])
    } else {
      res.sendStatus(404);
    }
  },
};


