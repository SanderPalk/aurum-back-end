const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    user_key: {type: String, required: true, lowercase: true},
    role: {type: String, lowercase: true, default: 'investor'},
    phone: String,
    bank_account: String,
    address: String,
})

const userModel = mongoose.model("Users", userSchema)

module.exports = userModel