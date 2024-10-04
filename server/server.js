require("dotenv").config()
const express = require("express")
const router = require("./router/auth-router")
const app = express()
const PORT = 5000
const cors = require("cors")
const ConnectDB = require("./utils/db")
const errorMiddleware = require("./middlewares/error-middleware")

app.use(express.json())

const corsOptions = {
    origin: "http://localhost:5173",
    method: "GET, POST, PUT, PATCH, DELETE, HEAD",
    credentials: true,
}
app.use(cors(corsOptions))
app.use("/api/auth", router)

app.use(errorMiddleware)

ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in PORT ${PORT}`)
    })
})