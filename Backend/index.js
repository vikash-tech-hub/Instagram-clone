import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import express from "express"
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";

import { app, server } from "./Socket/Socket.js";

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// attach routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// start server + socket
server.listen(PORT, () => {
  connectDB();
  console.log(`Server + Socket.IO running on port ${PORT}`);
});
