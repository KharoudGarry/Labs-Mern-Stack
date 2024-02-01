import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export default () => {
    mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}.8md1ukj.mongodb.net/inclass?retryWrites=true&w=majority`)
.then(() => console.log("MongoDb connected"))
.catch((error) => console.error(error));
};