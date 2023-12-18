const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local");
const passport = require("passport");
const restaurants = require("./restaurants");
const authHandler = require("../middlewares/authHandler");
const users = require("./users");
const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const FacebookStrategy = require("passport-facebook");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["displayName", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      const email = profile.emails[0].value;
      const name = profile.displayName;
      User.findOne({
        attributes: ["id", "name", "email"],
        where: { email },
        raw: true,
      }).then((user) => {
        if (user) {
          return done(null, user);
        }
        const randomPwd = Math.random().toString(36).slice(-8);
        bcrypt.hash(randomPwd, 10).then((hash) => {
          User.create({ email, password: hash, name }).then(() => {
            return done(null, user);
          });
        });
      });
    }
  )
);

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

router.use("/restaurants", authHandler, restaurants);
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

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

module.exports = router;
