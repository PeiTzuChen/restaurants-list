const express = require("express");
const router = express.Router();
const restaurants = require("./restaurants");
const authHandler = require("../middlewares/authHandler");
const users = require("./users");
const root = require("./root");
const oauth = require("./oauth");

router.use("/restaurants", authHandler, restaurants);
router.use("/users", users); //新增user
router.use("/auth", oauth); //FB驗證
router.use("/", root); //登入,登出,register跟login畫面


module.exports = router;