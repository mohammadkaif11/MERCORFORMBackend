const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Users = require("../DataContext/Model/Users");
const VerfifyFetchUser = require("../Middleware/VerifyUser");

//SceretKey
const JWT_SECRET = "gfg_jwt_secret_key";

//login() request
router.post("/login", async (req, res) => {
  try {
    const profile = JSON.parse(req.body.profile);
    console.log("profile: ", profile);
    const user = await Users.findOne({ UserId: profile.id });
    if (user) {
      user.picture = profile.picture;
      let data = {
        userId: user.UserId,
      };
      const jwttoken = jwt.sign(data, JWT_SECRET);
      return res
        .json({ Msg: "Success", token: jwttoken, profile: user })
        .status(200);
    } else {
      const NewUser = new Users({
        UserId: profile.id,
        Email: profile.email,
        Name: profile.name,
      });
      const saveUser = await NewUser.save();
      if (saveUser != null) {
        saveUser.picture = profile.picture;
        let data = {
          userId: profile.id,
        };
        const jwttoken = jwt.sign(data, JWT_SECRET);
        return res
          .json({ Msg: "Success", token: jwttoken, profile: saveUser })
          .status(200);
      } else {
        return res
          .json({ Msg: "Serve error", token: "", profile: null })
          .status(500);
      }
    }
  } catch (error) {
    console.log("Error login :", error);
    res.json({ Msg: "Serve error", token: "", profile: null }).status(500);
  }
});

//getuserProfile() and get all workspace and get all groups
router.get("/getuserprofile", VerfifyFetchUser, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Users.find({ UserId: userId });
    return res
      .json({
        Msg: "Success get profile",
        profile: user,
      })
      .status(200);
  } catch (error) {
    console.log("Error get Profile :", error);
    res
      .json({
        Msg: "Internal server error in get profile",
        profile: {},
      })
      .status(500);
  }
});

module.exports = router;
