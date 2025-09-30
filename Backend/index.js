import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js"
import dotenv from "dotenv"
import userRoute from "./routes/user.routes.js"
const app = express()
dotenv.config()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
const PORT=process.env.PORT||3000

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}
app.use(cors(corsOptions))


// routes
app.use("/api/v1/user",userRoute)
app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running at ${PORT}`)
})
