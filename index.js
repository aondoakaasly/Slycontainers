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

const products = [
    { id: '1', name: '40ft open-side containers', price: 1000, image: '/img/20_used.webp' },
    { id: '2', name: 'Headphones', price: 3000, image: '/img/40_new.webp' },
    { id: '3', name: 'Headphones', price: 2500, image: '/img/ano2.webp' },
    { id: '4', name: 'Headphones', price: 4500, image: '/img/ano3.webp' },
];

//renders all my views here.....
app.get('/', (req, res)=>{
    res.render("index", {products})
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

// Route to add an item to the cart
app.post('/cart/add', (req, res) => {
    const { productId, quantity, productImage } = req.body;

    try {
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        // Find product in the in-memory array
        const product = products.find((p) => p.id === productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Initialize cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if product is already in the cart
        let cartItem = req.session.cart.find((item) => item.productId === productId);
        if (cartItem) {
            cartItem.quantity += parseInt(quantity, 10);
        } else {
            req.session.cart.push({
                productId,
                quantity: parseInt(quantity, 10),
                name: product.name,
                price: product.price,
                image: productImage || product.image, // Use provided image or fallback to product's image
            });
        }

        console.log('Cart after update:', req.session.cart);
        res.json({ message: 'Item added to cart', cart: req.session.cart });
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).send('Error adding item to cart');
    }
});


// Route to remove an item from the cart
app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const itemIndex = req.session.cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        req.session.cart.splice(itemIndex, 1);
        res.redirect('/cart');
    } else {
        res.status(404).send('Item not found');
    }
});

// View cart route
app.get('/cart', (req, res) => {
    res.json({ cart: req.session.cart || [] });
});


// Get product by their ID from the in-memory products array
app.get('/cart/:id', (req, res) => {
    const { id } = req.params;

    // Find the product in the array
    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    // Render the product details page with the selected product
    res.render('productDetails', { product });
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