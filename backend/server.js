import express from 'express';
import dotenv from 'dotenv';


import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from './db/connectToMongoDB.js';



const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// middleware

app.use(express.json()); // to parse the incoming requestr with JSON payload ( from req.body)

app.use("/api/auth",authRoutes);



// root route http://localhost:5000/
// app.get('/',(req,res)=> {console.log("hello"); res.json({message:"hi my friend"})});


app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`server is running on port ${PORT}`);
});
