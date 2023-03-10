const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
    user_key: {type: String, required: true, lowercase: true},
    amount: {type: Number, double: true, required: true},
    type: String,
    start_date: {type: Date, required: true, default: () => Date.now()},
    end_date: {type: Date},
    time_period: String,
    status: {type: Number, required: true, min: 1, max: 5,},
})

const investmentsModel = mongoose.model("Investments", investmentSchema)

module.exports = investmentsModel