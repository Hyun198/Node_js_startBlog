<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin_template";
const publicLayout = "../views/layouts/template";

const jwtSecret = process.env.JWT_SECRET;

/* GET /
  check login */
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

/* GET /
   ADMIN - login page */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "admin page",
      desc: "Simple blog making",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (err) {
    console.log(error);
  }
});

/**
 * Post
 * admin = check login
 */

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (!isPasswordvalid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

/**
 * Post
 * admin dashboard
 */

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const data = await Post.find();
    res.render("admin/dashboard", {
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//get
//admin - create new post
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with Node Js",
    };
    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//get
//admin - view post
router.get("/post/:id", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);
    res.render("post/post-view", {
      data,
      currentRoute: "/",
      layout: publicLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//Post
//admin-create new post
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        desc: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

//get
//admin - edit post
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "edit Post",
      description: "free node js manage System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render("admin/edit-post", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (err) {
    console.log(err);
  }
});

//put
//admin - view post
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });

    res.redirect(`/edit-post/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
});

//admin - register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      //res.status(201).json({ message: "User created", user });
      res.redirect("/");
    } catch (err) {
      if (err.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "internal server error" });
    }
    req.session.signupSuccess = true;
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//delete admin - delete post

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

//Get
//LogOut
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  //res.json({message: 'Logout되었습니다.'})
  res.redirect("/");
});

module.exports = router;
=======
const express= require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const adminLayout = '../views/layouts/admin_template'
const publicLayout ='../views/layouts/template'

const jwtSecret = process.env.JWT_SECRET



/* GET /
  check login */
const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }
    try{
        const decoded = jwt.verify(token, jwtSecret)
        req.userId= decoded.userId
        next()
    }catch(err){
        res.status(401).json({message:'Unauthorized'})
    }
}




/* GET /
   ADMIN - login page */
router.get('/admin', async (req,res)=>{
    try{
        const locals = {
            title: "admin page",
            desc: "Simple blog making",
        
        }
        res.render('admin/index', {locals, layout:adminLayout});
    }catch(err){
        console.log(error);
    }


})

/**
 * Post 
 * admin = check login
 */

router.post('/admin', async (req,res)=>{
    try{
        const { username, password} = req.body
        
        const user = await User.findOne({username})

        if(!user) {
            return res.status(401).json({message: 'invalid credentials'})
        }
        const isPasswordvalid = await bcrypt.compare(password, user.password)
        if (!isPasswordvalid) {
            return res.status(401).json({message: 'invalid credentials'})
        }

        const token = jwt.sign({userId: user._id}, jwtSecret )
        res.cookie('token', token, {httpOnly: true})
        res.redirect('/dashboard')

    }catch(err){
        console.log(err)
    }
})

/**
 * Post 
 * admin dashboard
 */

router.get('/dashboard', authMiddleware, async (req,res)=>{
    try{
        const locals ={
            title: 'Dashboard',
            description: 'Simple Blog created with Node Js'
        }
        const data = await Post.find()
        res.render('admin/dashboard', {
            locals,
            data,
            layout:adminLayout
        })

    }catch(err){
        console.log(err)
    }
})

//get 
//admin - create new post
router.get('/add-post', authMiddleware, async (req,res)=>{
    try{
        const locals ={
            title: 'Add Post',
            description: 'Simple Blog created with Node Js'
        }
        const data = await Post.find()
        res.render('admin/add-post', {
            locals,
            layout:adminLayout
        })

    }catch(err){
        console.log(err)
    }
})

//get 
//admin - view post
router.get('/post/:id', async (req,res)=>{
    try{
        const data = await Post.findById(req.params.id)
        res.render('post/post-view',{
            data,
            currentRoute:'/',
            layout:publicLayout
        })

    }catch(err){
        console.log(err)
    }
})


//Post 
//admin-create new post
router.post('/add-post', authMiddleware, async (req,res)=>{
    try{
        try{
            const newPost = new Post({
                title: req.body.title,
                desc: req.body.body
            })

            await Post.create(newPost)
            res.redirect('/dashboard')

        }catch(err){
           console.log(err)
        }
    }catch(err){
        console.log(err)
    }
})

//get 
//admin - edit post
router.get('/edit-post/:id', authMiddleware, async (req,res)=>{
    try{
        const locals = {
            title: "edit Post",
            description: "free node js manage System"
        }

       const data = await Post.findOne({_id: req.params.id })

        res.render('admin/edit-post', 
        {
            locals,
            data,
            layout: adminLayout
        })
   
    }catch(err){
        console.log(err)
    }
})



//put 
//admin - view post
router.put('/edit-post/:id', authMiddleware, async (req,res)=>{
    try{
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })

        res.redirect(`/edit-post/${req.params.id}`)
   
    }catch(err){
        console.log(err)
    }
})





//admin - register
router.post('/register', async (req,res)=>{
    try{
        const { username, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        try{
            const user = await User.create({
                username, password: hashedPassword
            })
            res.status(201).json({message: 'User created', user});
        }catch(err){
            if(error.code === 11000) {
                res.status(409).json({message: 'User already in use'})
            }
            res.status(500).json({message: 'internal server error'})
        }

        
    }catch(err){
        console.log(err)
    }
})

//delete admin - delete post

router.delete('/delete-post/:id', authMiddleware, async (req,res)=>{
        try{
            await Post.deleteOne({ _id: req.params.id})
            res.redirect('/dashboard')
        }catch(err){
            console.log(err)
        }
})

//Get
//LogOut
router.get('/logout', (req,res)=>{
    res.clearCookie('token')
    //res.json({message: 'Logout되었습니다.'})
    res.redirect('/')

})


module.exports = router










>>>>>>> c79bf96dfc9f59349a227129a3d278f3d51dc059

/* router.post('/admin', async (req,res)=>{
    try{
        const { username, password} = req.body
        if(req.body.username === 'admin'&& req.body.password === 'password'){
            res.send('you are logged in')
        }else {
            res.send('wrong approach')
        }
    }catch(err){
        console.log(err)
    }
<<<<<<< HEAD
}) */
=======
}) */
>>>>>>> c79bf96dfc9f59349a227129a3d278f3d51dc059
