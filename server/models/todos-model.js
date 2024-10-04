const mongoose = require("mongoose")

const TodoSchema = new mongoose.Schema({

    email: {
        type: String,
        require: true
    },
    mainId: {
        type: String,
        require: true
    },
    todo: {
        type: String,
        require: true
    }
})


const Todos = new mongoose.model("Todo", TodoSchema)

module.exports = Todos