const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
require("dotenv").config();

//GET HOME
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Nodejs blog",
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

//Post- searchTerm

router.post("/search", async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;

    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      data,
      currentRoute: "/",
    });
  } catch (err) {
    console.log(err);
  }
});

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

router.get("/signup", (req, res) => {
  res.render("signup", {
    currentRoute: "/signup",
  });
});

module.exports = router;
