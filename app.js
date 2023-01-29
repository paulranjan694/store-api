require('dotenv').config()
require('express-async-errors') //async wrapper package

// require
const express = require('express')
const app = express();

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

// middleware
app.use(express.json())

// routes

// app.get("/api/v1/products", (req,res)=> {
//     res.send("products api")
// })

app.use('/api/v1/products',productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

// PORT
const port = process.env.PORT || 3000

// spin the server
const start = async ()=>{
    try {
        // connect db
        await connectDB(process.env.MONGO_URI);
        app.listen(port, ()=>{
            console.log(`server is running on port ${port}.....`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()