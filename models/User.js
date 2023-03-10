const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    user_key: {type: String, required: true, lowercase: true},
    phone: Number,
    bank_account: Number,
    address: String,
})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel