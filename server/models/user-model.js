const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Todos: {
        type: Array,
        default: []
    }
})

userSchema.methods.generateToken = async function() {
    try {
        return jwt.sign({
            userId : this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: "30d"}
    )
    } catch (error) {
        console.log(error)
    }
}

userSchema.methods.compared = async function(password) {
    try {
        return bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
    }
}

const Users = new mongoose.model("User", userSchema)

module.exports = Users