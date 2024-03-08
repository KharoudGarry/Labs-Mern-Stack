import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default () => {
    mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDb connected"))
.catch((error) => console.error(error));
};