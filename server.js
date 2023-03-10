require("dotenv").config()

const express = require("express")
const userModel = require("./models/User")
const investmentsModel = require("./models/Investments")
const mongoose = require("mongoose");
const cors = require("cors")
const bodyParser = require("body-parser");

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', process.env.APP_URI]
}

app.use(cors(corsOptions))

mongoose.connect(process.env.DB_URI)
app.use(bodyParser.urlencoded({extended: false}))

async function saveAdmin() {
    try {
        const user = new userModel({
            first_name: "Michael",
            last_name: "Wright",
            user_key: "7264admin",
            phone: 5848455,
            bank_account: 666666,
            address: "Somewhere near",
        })
        console.log(user)
        await user.save()

        const investment1 = new investmentsModel({
            user_key: "7364admin",
            amount: 1000000000.01,
            type: "Small loan on billion dollars",
            start_date: new Date(2023, 2, 10),
            time_period: "Very long",
            status: 3,
        })
        const investment2 = new investmentsModel({
            user_key: "7364admin",
            amount: 1337.01,
            type: "Crypto scammer",
            start_date: new Date(2023, 2, 10),
            time_period: "Maybe today, maybe tomorrow",
            status: 3,
        })
        await investment1.save()
        await investment2.save()

    } catch (e) {
        console.log(e.message)
    }
}


app.get('/user/:user_key', async (req, res) => {
    try {
        const user = await userModel.findOne({ user_key: req.params.user_key })
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

app.get('/investments/:user_key', async (req, res) => {
    try {
        const user = await investmentsModel.find({ user_key: req.params.user_key})
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
