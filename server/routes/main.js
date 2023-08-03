const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
require("dotenv").config();

/* GET /
   HOME */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Nodejs blog",
      desc: "Simple blog making", //변경할 부분들
      name: "Hyun",
    };
    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("home", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (err) {
    console.log(err);
  }
});

/* router.get("", async (req, res) => {
  try {
    const data = await Post.find();
    res.render("home", { data });
  } catch (err) {
    console.log(err);
  }
}); */

router.get("/about", (req, res) => {
  res.render("about", {
    currentRoute: "/about",
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    currentRoute: "/contact",
  });
});

router.get("/signin", (req, res) => {
  res.render("sign_in", {
    currentRoute: "/sign_in",
  });
});

module.exports = router;
