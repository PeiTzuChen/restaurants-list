const express = require("express")
const router = express.Router()

const restaurants = require("./restaurants");
const users = require("./users")

router.use('/restaurants',restaurants);
router.use("/users", users);

router.get('/', (req, res) => {
	res.render('index')
})

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router

