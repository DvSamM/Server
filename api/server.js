// const jsonServer = require('json-server')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')

// const middlewares = jsonServer.defaults()

// server.use(middlewares)
// // Add this before server.use(router)
// server.use(jsonServer.rewriter({
//     '/api/*': '/$1',
//     '/blog/:resource/:id/show': '/:resource/:id'
// }))
// server.use(router)
// server.listen(3000, () => {
//     console.log('JSON Server is running')
// })

// module.exports = server
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json') // your JSON file with products and orders

const middlewares = jsonServer.defaults()

server.use(middlewares)

// Rewriting the routes to handle the `/products` and `/orders` endpoints
server.use(jsonServer.rewriter({
    '/api/products/:id': '/products/:id',      // Get a single product by ID
    '/api/products': '/products',               // Get all products or POST a new product
    '/api/orders/:id': '/orders/:id',           // Get a single order by ID
    '/api/orders': '/orders',                   // Get all orders or POST a new order
}))

// Make sure you can handle POST, GET, PATCH, DELETE for products and orders
server.use(router)

server.listen(3000, () => {
    console.log('JSON Server is running on http://localhost:3000')
})

module.exports = server
