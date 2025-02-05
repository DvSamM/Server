
require('dotenv').config(); // Load environment variables from .env
const jsonServer = require('json-server');
const express = require('express'); // Required to use express middleware
const cors = require('cors');
const server = express(); // Use express instead of jsonServer.create()
const router = jsonServer.router('db.json'); // Your JSON file with products and orders
const middlewares = jsonServer.defaults(); // Default middlewares for JSON server

// Enable CORS for all routes
server.use(cors({
  origin: 'https://mini-ecommerce-gray.vercel.app', // or '*'
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Use express.json() to parse JSON request bodies
server.use(express.json()); // This is necessary to parse the body of POST requests

// Admin login route
server.post('/api/admin-login', (req, res) => {
  const { pin } = req.body;  // Extract PIN from the request body

  if (!pin) {
    return res.status(400).json({ message: 'PIN is required' });
  }

  // Validate the PIN against the stored value in the .env file
  if (pin === process.env.ADMIN_PIN) {
    res.status(200).json({ message: 'Login successful', loggedIn: true });
  } else {
    res.status(401).json({ message: 'Invalid PIN' });
  }
});

// Create the Nodemailer transporter

// Rewriting the routes to handle the `/products` and `/orders` endpoints
server.use(jsonServer.rewriter({
  '/api/products/:id': '/products/:id',  // Get a single product by ID
  '/api/products': '/products',          // Get all products or POST a new product
  '/api/orders/:id': '/orders/:id',      // Get a single order by ID
  '/api/orders': '/orders',              // Get all orders or POST a new order
}));

// POST route to handle creating new orders
server.post('/api/orders', async (req, res) => {
  const newOrder = req.body;

  try {
    // Save order to database
    const order = router.db.get('orders').insert(newOrder).write();

    // Send confirmation email
    if (newOrder.status === 'success') {
      sendOrderConfirmationEmail(newOrder.email, newOrder);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


// Error handler for all routes
server.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack Trace:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Use the JSON server's router to handle the actual CRUD operations
server.use(router);

// Listen on port 3000
server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});

module.exports = server;
