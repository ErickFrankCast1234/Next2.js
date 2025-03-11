// User.js (Modelo de Mongoose usando CommonJS)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    image: {
        type: String,
    },
    boards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Board",
        },
    ],
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

