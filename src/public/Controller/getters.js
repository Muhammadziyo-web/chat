import usersdb from "../../mongo/schema.js";

let { UserModel: userModel } = usersdb;

async function get(req, res, arg, arg2 = 'token', keys = 'uuid') {
  
  let result = await userModel.findOne({
    [keys]: req.params[arg2],

  });
  res.send(result ? result[arg] : "");
} 

export default {
  async getNameByToken(req, res) {
    get(req, res, "name");
  },
  async getUserNameByToken(req, res) {
    get(req, res, "username");
  },
  async getNameByUserName(req, res) {
    get(req, res, "name",'username',"username");
  },
  async getActiveByUserName(req, res) {
    get(req, res, "isOnline",'username',"username");
  },
    async getImgByToken(req, res) {
      
    res.send(
      (
        await userModel.findOne({
          uuid: req.params.token,
        })
      )?.img
    );
  },
};
