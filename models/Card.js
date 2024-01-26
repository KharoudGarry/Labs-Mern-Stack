import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "You must provide content for the card. I mean whats the point otherwise"],
        minlength: [3, "Please provide at least 3 characters"],
        maxlength: [300, "Put the pen down motherfucker"]
    },
    type: {
        type: String,
        enum: ["QUESTION", "ANSWER"],
        required: [true, "Choose something you fucking cunt"]
    }
}, { timestamps: true });


export default mongoose.model("card", CardSchema);