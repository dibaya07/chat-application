import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("database connected")
    }catch(error){
        console.log("database connection error",error)
    }
}

