import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js"
import dotenv from "dotenv"
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
app.get("/", (_, res) => {
  return res.status(200).json({
    message: "I am coming from backend",
    success: true
  })
})

app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running at ${PORT}`)
})
