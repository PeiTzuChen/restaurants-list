const express = require("express");
const router = express.Router();
const db = require("../models");
const Restaurant = db.Restaurant;
const pageSize = 6;
router.get("/", (req, res, next) => {
  //listening page
  const pageNumber = parseInt(req.query.page) || 1;
  return Restaurant.findAndCountAll({
    where: { userId: req.user },
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
      });
    })
    .catch((error) => {
      error.errorMessage = "資料取得失敗";
      console.error(error);
      next(error);
    });
});

router.get("/search", (req, res, next) => {
  //searching page
  const { keyword, order, page } = req.query;
  const searchTerm = keyword.trim().toLowerCase();
  const pageNumber = parseInt(page) || 1;
  const userId = req.user;
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
    where: { userId },
  })
    .then((restaurants) => {
      const restaurantsFiltered = restaurants.filter(
        (restaurant) =>
          restaurant.category.toLowerCase().includes(searchTerm) ||
          restaurant.name.toLowerCase().includes(searchTerm)
      );
      const totalPage = Math.ceil(restaurantsFiltered.length / pageSize);
      res.render("listening", {
        restaurants: restaurantsFiltered.slice(
          (pageNumber - 1) * pageSize,
          (pageNumber - 1) * pageSize + 6
        ),
        searchTerm,
        order,
        orderValue,
        page: pageNumber,
        totalPage,
        prev: pageNumber > 1 ? pageNumber - 1 : pageNumber,
        next: pageNumber < totalPage ? pageNumber + 1 : pageNumber,
      });
    })
    .catch((error) => {
      error.errorMessage = "資料取得失敗";
      next(error);
    });
});

router.get("/new", (req, res) => {
  res.render("new");
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => {
      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }
      return res.render("detail", {
        restaurant,
      });
    })
    .catch((error) => {
      error.errorMessage = "資料取得失敗";
      next(error);
    });
});

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user;
  return Restaurant.findByPk(id, {
    raw: true,
  })
    .then((restaurant) => {
      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }
      return res.render("edit", {
        restaurant,
      });
    })
    .catch((error) => {
      error.errorMessage = "資料取得失敗";
      next(error);
    });
});

router.post("/", (req, res, next) => {
  //create restaurant
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    description,
  } = req.body;

  const userId = req.user;

  const rating = Number(req.body.rating);
  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating: rating,
    description,
    userId,
  })
    .then(() => {
      req.flash("success", "新增成功");
      return res.redirect("/restaurants");
    })
    .catch((error) => {
      error.errorMessage = "新增失敗";
      next(error);
    });
});

router.put("/:id", (req, res, next) => {
  //edit restaurant
  const id = req.params.id;
  const body = req.body;
  const userId = req.user;

  return Restaurant.findByPk(id, {
    attributes: ["id", "name", "userId"],
  })
    .then((restaurant) => {
      console.log("show", restaurant);
      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }
      return restaurant
        .update({
          name: body.name,
          category: body.category,
          location: body.location,
          google_map: body.google_map,
          phone: body.phone,
          description: body.description,
          image: body.image,
        })
        .then(() => {
          req.flash("success", "編輯成功");
          return res.redirect(`/restaurants/${id}`);
        });
    })
    .catch((error) => {
      error.errorMessage = "編輯失敗";
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user;
  return Restaurant.findByPk(id, { attributes: ["id", "name", "userId"] })
    .then((restaurant) => {
      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }
      return restaurant.destroy().then(() => {
        req.flash("success", "刪除成功");
        res.redirect("/restaurants");
      });
    })
    .catch((error) => {
      error.errorMessage = "刪除失敗";
      next(error);
    });
});

module.exports = router;
