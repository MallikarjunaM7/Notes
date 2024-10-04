const mongoose = require("mongoose")

const URI = process.env.MONGO_DB

const ConnectDB = async() => {
    try {
        await mongoose.connect(URI)
        console.log("Connection Succesfull")
    } catch (error) {
        console.log("Database connect failed")
        process.exit(0)
    }
}

module.exports = ConnectDB