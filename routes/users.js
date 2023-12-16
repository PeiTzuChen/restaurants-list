const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");

router.post("/", (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "驗證密碼與密碼不符");
    return res.redirect("back");
  }
  if (!email || !password) {
    req.flash("error", "信箱及密碼為必填");
    return res.redirect("back");
  }
  User.count({
    where: { email },
  })
    .then((amount) => {
      if (amount > 0) {
        req.flash("error", "此信箱已註冊過");
        return res.redirect("back");
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, email, password: hash });
    })
    .then(() => {
      req.flash("success", "註冊成功");
      return res.redirect("/login");
    })
    .catch((error) => {
      error.errorMessage = "註冊失敗";
      next(error);
    });
});

module.exports = router;
