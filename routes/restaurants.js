const express = require("express");
const router = express.Router();
const db = require("../models");
const Restaurant = db.Restaurant;

router.use(express.static("public"));

router.get("/", (req, res) => {
  //listening page
  console.log('進入router')
  const pageSize = 6;
  const pageNumber = parseInt(req.query.page) || 1;
  return Restaurant.findAndCountAll({
    raw: true,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  })
    .then((restaurants) => {
      const totalPage = Math.ceil(restaurants.count / pageSize);
      res.render("listening", {
        restaurants: restaurants.rows,
        totalPage: totalPage,
        page: pageNumber,
        prev: pageNumber > 1 ? pageNumber - 1 : pageNumber,
        next: pageNumber < totalPage ? pageNumber + 1 : pageNumber,
        // success: req.flash("success"),
        // error: req.flash("error_msg"),
      });
    })
    .catch((err) => console.error(err));
});

router.get("/search", (req, res) => {
  //searching page
  const { keyword, order, page } = req.query;
  const searchTerm = keyword.trim().toLowerCase();
  const pageNumber = parseInt(page) || 1;
  let orderState = [];
  let orderValue = {};
  switch (
    order //不同排列方式有不同取得資料庫的關鍵字，orderValue是為了點選後能保留結果而設計的參數
  ) {
    case "none":
      orderState = ["id"];
      orderValue.none = true;
      break;
    case "AtoZ":
      orderState = ["name_en"];
      orderValue.AtoZ = true;
      break;
    case "ZtoA":
      orderState = ["name_en", "DESC"];
      orderValue.ZtoA = true;
      break;
    case "category":
      orderState = ["category"];
      orderValue.category = true;
      break;
    case "location":
      orderState = ["location"];
      orderValue.location = true;
      break;
    case "ratingDESC":
      orderState = ["rating", "DESC"];
      orderValue.ratingDESC = true;
      break;
    case "ratingASC":
      orderState = ["rating"];
      orderValue.ratingASC = true;
      break;
  }
  return Restaurant.findAll({
    raw: true,
    order: [orderState],
  })
    .then((restaurants) => {
      req.flash("success", "找出符合查詢結果如下");
      const restaurantsFiltered = restaurants.filter(
        (restaurant) =>
          restaurant.category.toLowerCase().includes(searchTerm) ||
          restaurant.name.toLowerCase().includes(searchTerm)
      );
      const pagesize = 6;
      const totalPage = Math.ceil(restaurantsFiltered.length / pagesize);
      res.render("listening", {
        restaurants: restaurantsFiltered.slice(
          (pageNumber - 1) * pagesize,
          (pageNumber - 1) * pagesize + 6
        ),
        searchTerm,
        order,
        orderValue,
        page: pageNumber,
        totalPage,
        prev: pageNumber > 1 ? pageNumber - 1 : pageNumber,
        next: pageNumber < totalPage ? pageNumber + 1 : pageNumber,
        // message_onsearch: req.flash("success"),
      });
    })
    .catch((err) => console.error(err));
});

router.get("/new", (req, res) => {
  //create restaurant page
  res.render("new", { error: req.flash("error_msg") });
});

router.get("/:id", (req, res) => {
  //restaurant detail page
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => {
      res.render("detail", {
        restaurant,
        // success: req.flash("success"),
      });
    })
    .catch((err) => console.error(err));
});

router.get("/:id/edit", (req, res) => {
  // edit restaurant page
  const id = req.params.id;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => {
      return res.render("edit", { restaurant, error: req.flash("error_msg") });
    })
    .catch((err) => console.error(err));
});

router.post("/", (req, res) => {
  //create restaurant
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
    .then(() => {
      req.flash("success", "新增成功");
      return res.redirect("/restaurants");
    })
    .catch((err) => {
      console.error(err);
      req.flash("error_msg", "新增失敗");
      return res.redirect("back");
    });
});

router.put("/:id", (req, res) => {
  //edit restaurant
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
    .then(() => {
      req.flash("success", "編輯成功");
      return res.redirect(`/restaurants/${id}`);
    })
    .catch((err) => {
      console.error(err);
      req.flash("error_msg", "編輯失敗");
      return res.redirect("back");
    });
});

router.delete("/:id", (req, res) => {
  //delete restaurant
  const id = req.params.id;
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash("success", "刪除成功");
      return res.redirect("/restaurants");
    })
    .catch((err) => {
      console.error(err);
      req.flash("error_msg", "刪除失敗");
      return res.redirect("back");
    });
});

module.exports = router;
