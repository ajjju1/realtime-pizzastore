const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT || 3000

const app = express();

//Assets
app.use(express.static('public'))


//set Template engine
// console.log(path.join(__dirname, '/resources/views'))
// app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');


app.get("/", (req,res) =>{
    res.render("home");
})

app.listen(PORT, () =>{
    console.log(`listening on port : - ${PORT}`)
})