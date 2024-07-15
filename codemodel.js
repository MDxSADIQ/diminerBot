const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URL
mongoose.connect(mongoURI)

// db work
const codeSchema = mongoose.Schema({
        price: String,
        code: {
                type: String,
                unique: true
        }
});

module.exports = mongoose.model("codes", codeSchema)