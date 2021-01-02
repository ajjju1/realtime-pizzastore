require('dotenv').config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbstore = require("connect-mongo")(session);
const passport = require("passport");
const Emitter = require('events');

//Database Connection
const url = "mongodb://localhost/pizza";
mongoose.connect(url,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
useFindAndModify: true});
const connection = mongoose.connection;
connection.once('open', () =>{
    console.log("Database Connected");
}).catch((err) =>{
    console.log("connection falied....");
});

//Session store
let mongoStore = new MongoDbstore({
    mongooseConnection : connection,
    collection : 'sessions'
})

//Event emitter
const eventEmitter = new Emitter() //this is to create event emitter bzc we are sending it to statuscontroller 
app.set('eventEmitter', eventEmitter); //app.set('anyName', function/variablefunction)

//Session config
app.use(session({
    secret : process.env.COOKIE_SECERT,
    resave : false,
    store : mongoStore,
    saveUninitialized : false,
    cookie : { maxAge : 1000*60*60*24 } //24 hours
    // cookie : { maxAge : 1000*15 } //15secs
}));

//Passport config
const passportInit = require("./app/config/passport");
passportInit(passport); 
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


//Assets
app.use(express.static('public'));
app.use(express.urlencoded({extended : false}));

app.use(express.json());


//Global middleware
app.use((req,res,next) =>{
 res.locals.session = req.session
 res.locals.user = req.user;
 next();
})

//set Template engine
// console.log(path.join(__dirname, '/resources/views'))
app.use(expressLayout);
app.set('views',path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');


require("./routes/web")(app)


const server = app.listen(PORT, () =>{
    console.log(`listening on port : - ${PORT}`)
})

//socket:- This socket is for server side
const io = require('socket.io')(server)
io.on('connection', (socket) =>{
    //Join cleint to a private room room should had name which must be unique
    // console.log(socket.id);
    socket.on('join', (orderId) =>{ //this join is emmited by client we are catching it here
        // console.log(orderId);
        socket.join(orderId)              //this join method is socket's internal join method
    });
})

eventEmitter.on('orderUpdated', (data) => { //this we are catching this from statuscontroller even name orderUpdated
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) =>{
    io.to('adminRoom').emit('orderPlaced', data);
})