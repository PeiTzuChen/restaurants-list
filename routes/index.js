const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local");
const passport = require("passport");
const restaurants = require("./restaurants");
const users = require("./users");
const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            type: "error",
            message: "信箱或密碼錯誤",
          });
        }
        bcrypt.compare(password, user.password).then((res) => {
          if (!res) {
            return done(null, false, {
              type: "error",
              message: "信箱或密碼錯誤",
            });
          }
          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "登入失敗";
        return done(error);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

router.use("/restaurants", restaurants);
router.use("/users", users);

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
module.exports = router;
