//all imports should be at the top of the file
const express = require("express");
const app = express();
const port = process.env.PORT||3500;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

require('dotenv').config();


//connects to the mongoDB databse
//mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{console.log("Database Connected")}).catch((err)=>{console.log(err)});
//host my express static files
app.use (express.static(path.join(__dirname, "assets")));
//allows cross origin resources sharing
app.use(cors({origin: "http://localhost:3500/", methods: 'GET, POST, PUT, DELETE', allowedHeaders:'Content-Type,authorization'}));
//creates a session to store user details
app.use(session({
    secret: "slycontainers",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false, }
    
}));
//parses data  to json
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
//set my view engine as ejs....
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 



//renders all my views here.....
app.get('/', (req, res)=>{
    res.render("index")
});

app.get('/both', (req, res)=>{
    res.render("both")
});


app.get('/event', (req, res)=>{
    res.render("forevent")
});

app.get('/shop', (req, res)=>{
    res.render("forshop")
});

//logout rout to destroy all the sessions
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ status: "Failed", message: err.message });
        }
        res.redirect('/'); // Redirect to login page after logout
    });
});


app.use((req, res, next) => {
    res.status(404).render('404');
  });
  
//listening to the port
app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

module.exports = app;