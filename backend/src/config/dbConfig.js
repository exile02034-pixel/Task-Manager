
import mongoose from "mongoose";
import { DB_URI } from "./envConfig.js";

const connectToDatabase = async () => {
    try{
        await mongoose.connect( DB_URI, {
            autoIndex:true
        })
        console.log("Sucesfully connected to mongodb")
    }catch(err){
        console.log('Cannot connect to database', err.message);
         process.exit(1);
    }
}

export default connectToDatabase;