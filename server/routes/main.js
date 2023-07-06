const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
require('dotenv').config()

/* GET /
   HOME */
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Nodejs blog",
            desc: "Simple blog making",
            name: "Hyun"
        }
        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage)

        res.render('home',
            {
                locals,
                data,
                current: page,
                nextPage: hasNextPage ? nextPage : null,
                currentRoute: '/'
            });
    } catch (err) {
        console.log(error);
    }


})

router.get('', async (req, res) => {
    const locals = {
        title: "Nodejs blog",
        desc: "Simple blog making",
        name: "Hyun"
    }
    try {
        const data = await Post.find();
        res.render('home', { locals, data });
    } catch (err) {
        console.log(error);
    }


})


router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    })
})

router.get('/contact', (req,res)=>{
    res.render('contact',{
        currentRoute: '/contact'
    })
})




module.exports = router



/* function insertPostData () {
    Post.insertMany([
        {
            title: "Building AI",
            desc:  "This is the body text",
        },
        {
            title: "Building Node js",
            desc:  "This is the body text",
        },
        {
            title: "Building Flask",
            desc:  "This is the body text",
        },
        {
            title: "Building CGV",
            desc:  "This is the body text",
        },
    ])
}
insertPostData();  */
