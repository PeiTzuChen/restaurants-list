const express = require("express");
const port = 3000;
const app = express();
const { engine } = require("express-handlebars");
const db = require("./models");
const Restaurant = db.Restaurant;
const methodOverride = require("method-override");

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  return Restaurant.findAll({
    raw: true,
  })
    .then((restaurants) => res.render("index", { restaurants }))
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

app.get("/restaurants/new", (req, res) => {
  res.render("new");
});

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => res.render("detail", { restaurant }))
    .catch((err) => console.log(err));
});

app.get("/restaurants/:id/edit", (req, res) => {
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => res.render("edit", { restaurant }))
    .catch((err) => console.log(err));
});

app.post("/restaurants", (req, res) => {
  const restaurant = req.body;
  const rating = Number(restaurant.rating);
  return Restaurant.create({
    name: restaurant.name,
    name_en: restaurant.name_en,
    category: restaurant.category,
    image: restaurant.image,
    location: restaurant.location,
    phone: restaurant.phone,
    google_map: restaurant.google_map,
    rating: rating,
    description: restaurant.description,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.put("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  return Restaurant.update(
    {
      name: body.name,
      category: body.category,
      location: body.location,
      google_map: body.google_map,
      phone: body.phone,
      description: body.description,
      image: body.image,
    },
    { where: { id } }
  )
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch((err) => console.log(err));
});

app.delete('/restaurants/:id', (req,res) => {
   const id = req.params.id;
   return Restaurant.destroy({ where: { id } })
     .then(() => res.redirect("/"))
     .catch((err) => console.log(err));
})
app.listen(port, () => {
  console.log(`express server listening on http://localhost:${port}`);
});
