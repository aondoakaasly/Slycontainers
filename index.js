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
    { id: '1', name: '40ft open-side containers', price: 3000, image: '/img/1732200957489.jpg', description: 'The 40ft Open-Side Container is a versatile and robust cargo container designed for efficient storage, transportation, and accessibility. Unlike standard shipping containers, this unit features full side access, allowing for seamless loading and unloading of large or irregularly shaped items.' },

    { id: '2', name: '20ft double-door containers', price: 3000, image: '/img/1732200960154.jpg', description: 'The 40ft Open-Side Container is a versatile and robust cargo container designed for efficient storage, transportation, and accessibility. Unlike standard shipping containers, this unit features full side access, allowing for seamless loading and unloading of large or irregularly shaped items.' },

    { id: '3', name: '40ft open-side containers', price: 2500, image: '/img/1732200962879-removebg-preview.png', description: 'The 40ft Open-Side Container is a versatile and robust cargo container designed for efficient storage, transportation, and accessibility. Unlike standard shipping containers, this unit features full side access, allowing for seamless loading and unloading of large or irregularly shaped items.' },

    { id: '4', name: '40ft open-side containers', price: 4500, image: '/img/ano3.webp', description: 'The 40ft Open-Side Container is a versatile and robust cargo container designed for efficient storage, transportation, and accessibility. Unlike standard shipping containers, this unit features full side access, allowing for seamless loading and unloading of large or irregularly shaped items.' },

    { id: '5', name: '40ft open-side containers', price: 4500, image: '/img/shop4.webp', description: 'The 40ft Open-Side Container is a versatile and robust cargo container designed for efficient storage, transportation, and accessibility. Unlike standard shipping containers, this unit features full side access, allowing for seamless loading and unloading of large or irregularly shaped items.' },

    { id: '6', name: '40ft open-side containers', price: 4500, image: '/img/shop3.webp', description: 'The 40ft Open-Side Container is a versatile and robust cargo container designed for efficient storage, transportation, and accessibility. Unlike standard shipping containers, this unit features full side access, allowing for seamless loading and unloading of large or irregularly shaped items.' },
];



const productsevent = [
    { id: '1', name: '40ft open-side containers', price: 9000, image: '/vd/Tiktok_1733561066242.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will' },

    { id: '2', name: '20ft double-door containers', price: 9999, image: '/vd/Tiktok_1733835914172.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will' },

    { id: '3', name: '40ft open-side containers', price: 9000, image: '/vd/Tiktok_1733905804552.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will.' },

    { id: '4', name: '40ft open-side containers', price: 9000, image: '/vd/Tiktok_1731432035999.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will.' },

    { id: '5', name: '40ft open-side containers', price: 9000, image: '/vd/Tiktok_1734154082451.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will.' },

    { id: '6', name: '40ft open-side containers', price: 9999, image: '/vd/Tiktok_1733363472531.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will.' },

    { id: '7', name: '40ft open-side containers', price: 9999, image: '/vd/Tiktok_1733363472531.mp4', description: 'The export-oriented multi-functional mobile banquet vehicle adopts high-tech 5D holographic projection techniology, 1,000 backgrounds can be switched at will.' },
];

//renders all my views here.....
app.get('/', (req, res)=>{
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)
    res.render("index", {products, cartItemCount})
});

app.get('/both', (req, res)=>{
    res.render("both")
});

app.get('/contact', (req, res)=>{
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)
    res.render("contact", {cartItemCount})
});

app.get('/event', (req, res)=>{
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)
    res.render("forevent", { productsevent, cartItemCount})
});

app.get('/shop', (req, res)=>{
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)
    res.render("forshop", {cartItemCount})
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
        res.redirect('/cart');

        // console.log('Cart after update:', req.session.cart);
        // res.json({ message: 'Item added to cart', cart: req.session.cart });
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
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('cart', { cart, total, cartItemCount });

});


// Get product by their ID from the in-memory products array
app.get('/cart/:id', (req, res) => {
    const { id } = req.params;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)

    // Find the product in the array
    const product = products.find((p) => p.id === id);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    // Render the product details page with the selected product
    res.render('productDetails', { product, cartItemCount });
});


app.get('/cartevent/:id', (req, res) => {
    const { id } = req.params;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartItemCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);
    // res.json({ cartItemCount });
    console.log(cartItemCount)

    // Find the product in the array
    const product = productsevent.find((p) => p.id === id);

    if (!product) {
        return res.status(404).send('Product not found');
    }

    // Render the product details page with the selected product
    res.render('productevent', { product, cartItemCount });
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