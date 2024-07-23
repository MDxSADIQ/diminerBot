const mongoose = require("mongoose");


const mongoURI = process.env.MONGODB_URL
mongoose.connect(mongoURI)

// db work
const userSchema = mongoose.Schema({
        chatId: {
            type: String,
        
        },
        points:{
            type:mongoose.Types.Decimal128,
            default: 0
        },
        referby: String,
        papa: String
         
     });

module.exports = mongoose.model("User", userSchema)
