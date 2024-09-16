import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import foodRouter from './route/foodRoute.js'
import userRouter from './route/userRoute.js'
import 'dotenv/config'
import cartRouter from './route/cartRoute.js'
import orderRouter from './route/orderRoute.js'

// initialize express app
const app = express()
const port = 7500

// middleware 
app.use(express.json())
app.use(cors())

// end point 
app.use("/api/food", foodRouter,)
app.use("/api/user", userRouter,)
app.use("/api/cart", cartRouter,)
app.use("/api/order", orderRouter,)
app.use("/image", express.static('uploads'))

app.get("/", (req, res) => { 
    res.send("app is working perfectly well")
})

// connect db
connectDB()

app.listen(port,() =>{
    console.log(`app running on port: ${port}`)
})