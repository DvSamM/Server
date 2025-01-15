const jsonServer = require('json-server');
const cors = require('cors');  // Import CORS middleware
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // Your JSON file with products and orders

const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors({
  origin: 'http://localhost:5173',  // Allow requests from your frontend's origin (adjust if deployed)
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true,  // Allow credentials (cookies, etc.)
}));

// Log requests for debugging purposes
server.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);  // Log method and URL
  if (req.body) {
    console.log('Request body:', req.body);  // Log the request body for POST and PATCH
  }
  next();
});

// Rewriting the routes to handle the `/products` and `/orders` endpoints
server.use(jsonServer.rewriter({
  '/api/products/:id': '/products/:id',  // Get a single product by ID
  '/api/products': '/products',           // Get all products or POST a new product
  '/api/orders/:id': '/orders/:id',       // Get a single order by ID
  '/api/orders': '/orders',               // Get all orders or POST a new order
}));

// Use default middlewares (CORS, static, etc.)
server.use(middlewares);

// Error handler for all routes
server.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);  // Log the error message
  console.error('Stack Trace:', err.stack);       // Log the stack trace
  res.status(500).json({ error: 'Internal Server Error' });  // Respond with a 500 error
});

// // Product PATCH route to handle stock update
// server.patch('/api/products/:id', async (req, res) => {
//   const { id } = req.params;  // Get the product ID from the request
//   const { stock } = req.body; // Get the updated stock value

//   // Check if stock is provided in the request body
//   if (stock === undefined) {
//     return res.status(400).json({ error: 'Stock value is required' });
//   }

//   try {
//     // Fetch the product from the database (assuming you're using lowdb with json-server)
//     const db = router.db;
//     const product = db.get('products').find({ id: parseInt(id) }).value();  // Find product by ID

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });  // Product not found
//     }

//     // Update the stock for the product
//     product.stock = stock;

//     // Save the updated product back to the database
//     db.get('products').find({ id: parseInt(id) }).assign({ stock }).write();

//     // Return the updated product
//     res.status(200).json(product);
//   } catch (error) {
//     console.error('Error updating stock:', error);  // Log the error details
//     res.status(500).json({ error: 'Failed to update stock' });  // Respond with a 500 error if anything goes wrong
//   }
// });
server.patch('/api/products/:id', async (req, res) => {
  const { id } = req.params;  // Get the product ID from the request
  const { stock } = req.body; // Get the updated stock value

  // Check if stock is provided in the request body
  if (stock === undefined) {
    return res.status(400).json({ error: 'Stock value is required' });
  }

  try {
    const db = router.db;
    const product = db.get('products').find({ id: parseInt(id) }).value();  // Find product by ID

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });  // Product not found
    }

    // Update the stock for the product
    product.stock = stock;

    // Save the updated product back to the database
    await db.get('products').find({ id: parseInt(id) }).assign({ stock }).write();

    // Return the updated product
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating stock:', error);  // Log the error details
    res.status(500).json({ error: 'Failed to update stock' });  // Respond with a 500 error if anything goes wrong
  }
});


// Use the JSON server's router to handle the actual CRUD operations
server.use(router);

// Listen on port 3000
server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});

module.exports = server;
