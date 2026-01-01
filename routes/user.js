const express = require("express");
const router = express.Router({ mergeParams: true });


router.get("/signup", (req, res)=>{
    res.render("../views/signup.ejs")
})

router.post("/signup", (req, res)=>{
    res.render("../views/signup.ejs")
})

module.exports=router;