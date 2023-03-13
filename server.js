require("dotenv").config()

const express = require("express")
const userModel = require("./models/User")
const investmentsModel = require("./models/Investments")
const mongoose = require("mongoose");
const cors = require("cors")
const bodyParser = require("body-parser");

const app = express();

const corsOptions = {
    origin: [process.env.APP_URI]
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true})

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


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


// GET requests
app.get('/user/:user_key', async (req, res) => {
    try {
        const user = await userModel.findOne({user_key: req.params.user_key}, null, {timeout: 20000})
        res.json(user)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

app.get('/investments/:user_key', async (req, res) => {
    try {
        const user = await investmentsModel.find({user_key: req.params.user_key}, null, {timeout: 20000})
        res.json(user)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

app.get('/admin/:user_key', async (req, res) => {
    try {
        const admin = await userModel.findOne({user_key: req.params.user_key, role: 'admin'}, null, {timeout: 20000})
        res.json(admin)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

app.get('/users/:search_option/:search_value', async (req, res) => {
    try {
        const searchOption = req.params.search_option;
        const searchValue = req.params.search_value;
        const user = await userModel.findOne({
            [searchOption]: searchValue,
            role: {$not: /admin/}
        }, null, {timeout: 20000})
        res.json(user)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

app.get('/investments', async (req, res) => {
    try {
        const investments = await investmentsModel.find({user_key: {$not: /admin$/}, role: {$not: /admin/}})
        res.json(investments)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await userModel.find({user_key: {$not: /admin$/}, role: {$not: /admin/}})
        res.json(users)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})


// POST requests
app.post('/users/post/:user_key', (req, res) => {
    const adminKey = req.params.user_key
    if (adminKey === process.env.ADMIN_KEY_1 || process.env.ADMIN_KEY_2) {
        const userData = req.body;
        const newUser = new userModel(userData)
        console.log(newUser)
        newUser.save()
            .then(() => {
                res.status(201).send(newUser)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else res.status(401).send("Unauthorized Key")
})

app.post('/investments/post/:user_key', (req, res) => {
    const adminKey = req.params.user_key
    if (adminKey === process.env.ADMIN_KEY_1 || process.env.ADMIN_KEY_2) {
        const investmentData = req.body
        const newInvestment = new investmentsModel(investmentData)
        console.log(newInvestment)
        newInvestment.save()
            .then(() => {
                res.status(201).send(newInvestment)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    }
})
