import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import path from "path"

import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001
const __dirname = path.resolve()

//middleware
if(process.env.NODE_ENV !== "production"){
    app.use(cors())
}
app.use(express.json()); //will parse the JSON bodies: req.body 
app.use(ratelimiter);


// app.use((req,res,next) => {
//     console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//     next();
// });

app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../Frontend/dist")))

    app.get("*",(req,res) => {
        res.sendFile(path.join(__dirname),"../Frontend","dist","index.html")    
})
}


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:",PORT);
    });  
});




