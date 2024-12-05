import express from "express"
const cors=require('cors')
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoutes.js"

const PORT = process.env.PORT || 4000 
const app = express()

app.use(express.json())

app.use(cors({
    origin: 'https://soma-sundaram-sudo.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed methods
}));

await connectDB()
app.use("/api/user",userRouter)
app.use("/api/image",imageRouter)
app.get("/", (req,res) => res.send("API working"))

app.listen(PORT, () => console.log("Server running in port " + PORT))
