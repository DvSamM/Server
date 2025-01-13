// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json'); // your JSON file with products and orders

// const middlewares = jsonServer.defaults();

// // Add custom middleware for logging requests
// server.use((req, res, next) => {
//     console.log(`Received request: ${req.method} ${req.url}`);  // Log the request type and URL
//     if (req.method === 'PATCH' || req.method === 'POST') {
//         console.log('Request body:', req.body); // Log the request body for POST and PATCH
//     }
//     next();
// });

// // Rewriting the routes to handle the `/products` and `/orders` endpoints
// server.use(jsonServer.rewriter({
//     '/api/products/:id': '/products/:id',      // Get a single product by ID
//     '/api/products': '/products',               // Get all products or POST a new product
//     '/api/orders/:id': '/orders/:id',           // Get a single order by ID
//     '/api/orders': '/orders',                   // Get all orders or POST a new order
// }));

// // Use default middlewares (CORS, static, etc.)
// server.use(middlewares);

// // Add a custom error handler
// server.use((err, req, res, next) => {
//     console.error('Error occurred:', err.message);  // Log the error message
//     res.status(500).json({ error: 'Internal Server Error' });
// });

// // Use the JSON server's router to handle the actual CRUD operations
// server.use(router);

// // Listen on port 3000
// server.listen(3000, () => {
//     console.log('JSON Server is running on http://localhost:3000');
// });

// module.exports = server;
const jsonServer = require('json-server');
const cors = require('cors');  // Import CORS middleware
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // your JSON file with products and orders

const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors({
    origin: 'http://localhost:5173',  // Allow requests from your frontend's origin (adjust if deployed)
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true,  // Allow credentials (cookies, etc.)
}));

// Add custom middleware for logging requests
server.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);  // Log the request type and URL
    if (req.method === 'PATCH' || req.method === 'POST') {
        console.log('Request body:', req.body); // Log the request body for POST and PATCH
    }
    next();
});

// Rewriting the routes to handle the `/products` and `/orders` endpoints
server.use(jsonServer.rewriter({
    '/api/products/:id': '/products/:id',      // Get a single product by ID
    '/api/products': '/products',               // Get all products or POST a new product
    '/api/orders/:id': '/orders/:id',           // Get a single order by ID
    '/api/orders': '/orders',                   // Get all orders or POST a new order
}));

// Use default middlewares (CORS, static, etc.)
server.use(middlewares);

// Add a custom error handler
server.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);  // Log the error message
    res.status(500).json({ error: 'Internal Server Error' });
});

// Use the JSON server's router to handle the actual CRUD operations
server.use(router);

// Listen on port 3000
server.listen(3000, () => {
    console.log('JSON Server is running on http://localhost:3000');
});

module.exports = server;
