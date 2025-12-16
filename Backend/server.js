import express from "express"
const app = express();
import cors from "cors"
import { connectDB } from "./lib/db.js";
const port = 3000;
import userRoute from './routes/userRoute.js'
import { Server } from "socket.io";
import { createServer } from "http";
import { chatSocket } from "./lib/socket.js";
import chatRoute from './routes/chatRoute.js'
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
configDotenv()

connectDB() //connect mongoDB


app.use(cors(
  {
    origin:"http://localhost:5173",
    credentials: true,
  }
)); 
app.use(express.json())
app.use(cookieParser())

app.use('/api/user',userRoute) //Rest api's
// app.use('/api/chat',chatR) //Rest api's
app.use('/api/chat', chatRoute)

const server = createServer(app) //create HTTP server

const io = new Server(server,{ //attach socket.io to the same server
  cors: {
    origin: "http://localhost:5173", //frontend url
    credentials:true,
    methods: ['GET','POST']
  },
});

chatSocket(io) //initialize socket logic


server.listen(3000,()=>{ //start server
  console.log("server running...")
})

