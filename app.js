const express = require("express");
const port = 3000;
const app = express();
const { engine } = require("express-handlebars");
const db = require("./models");
const Restaurant = db.Restaurant;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => {
  return Restaurant.findAll({
    raw: true,
  })
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((err) => console.log(err));
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => res.render("detail", { restaurant }))
    .catch((err) => console.log(err));
});

app.get("/search", (req, res) => {
  const searchTerm = req.query.keyword.trim().toLowerCase();
  return Restaurant.findAll({
    raw: true,
  })
    .then((restaurants) => {
      const restaurantsFiltered = restaurants.filter(
        (restaurant) =>
          restaurant.category.toLowerCase().includes(searchTerm) ||
          restaurant.name.toLowerCase().includes(searchTerm)
      );
      res.render("index", { restaurants: restaurantsFiltered, searchTerm });
    })
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`express server listening on http://localhost:${port}`);
});
