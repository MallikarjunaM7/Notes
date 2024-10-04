const Users = require("../models/user-model")
const Otps = require("../models/otp-model")
var nodemailer = require('nodemailer');
const bcrypt = require("bcrypt")
const ForgotOtps = require("../models/forgototp-model")
const Todos = require("../models/todos-model")

const Register = async(req, res) => {

    const {username, email, phone, password} = req.body;
    console.log(username, password, email, phone)
    try {

        const otp = Math.floor(Math.random() * 9000) + 1000;
        const userEmail = await Users.find({email: email})
        const userUsername = await Users.find({username: username})
        console.log(userEmail, userUsername)
        if(userEmail.length != 0){
            return res.status(404).json({alreadymsg: "User already registered. Please Login"})
        }

        if(userUsername.length != 0){
            return res.status(404).json({alreadymsg: "Username Not Available"})
        }

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MY_EMAIL,
              pass: process.env.MY_PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Sending Email using Node.js',
            text: `Your otp is ${otp}`
          };
          
          transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
              console.log(error);
            } else {
                const createOtp = await Otps.create({username, email, phone, password, otp})
                return res.status(200).json({sucmsg: "Email Sent"})
            }
          });

    } catch (error) {
        console.log(error)
    }

}

const verifyOtp = async(req, res) => {
  const userOtp = req.body.otp
  const email = req.params.email
  const users =  await Otps.find({email: email})
  console.log(users)
  const singleUser = users[users.length - 1]
  if(userOtp === singleUser.otp){
      try {
          await Otps.deleteMany({email: email})
          const saltRounds = 10
          const hashedPassword = await bcrypt.hash(singleUser.password, saltRounds)
  
          const userCreated = await Users.create({username: singleUser.username, email, phone: singleUser.phone, password: hashedPassword})
          console.log(userCreated)
          return res.status(201).json({
              sucmsg: "OTP Verifired: Registered Successfully",
              userId: userCreated._id.toString()
          })
  
      } catch (error) {
          console.log(error)
      }
  }else{
      return res.status(500).json({inmsg: "OTP entered is Incorrect"})
  }
}

const login = async(req, res) => {

  const {email, password} = req.body
  try {
      const user = await Users.findOne({email: email})
      console.log(user)
      if(!user){
          return res.status(500).json({msg: "Please Register"})
      }
      const userExist = await user.compared(password)
      console.log(userExist)
      if(userExist){
          return res.status(200).json({
              msg: "Logined Successfully",
              token: await user.generateToken(),
              userId: user._id
          })
      }else{
          return res.status(500).json({msg: "Wrong password"})
      }
  } catch (error) {
      console.log(error)
  }
}

const forgotPassword = async(req, res) => {
  const {email} = req.body
  try {

      const isRegistered = await Users.findOne({email: email})
      if(!isRegistered){
          return res.status(500).json({notregmsg: `${email} isn't registered.Please Register!`})
      }
      const otp = Math.floor(Math.random() * 9000) + 1000;
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD
          }
        });
        
        var mailOptions = {
          from: process.env.MY_EMAIL,
          to: email,
          subject: 'Sending Email using Node.js',
          text: `Your Reset otp is ${otp}`
        };
        
        transporter.sendMail(mailOptions, async function(error, info){
          if (error) {
            console.log(error);
          } else {
              const createOtp = await ForgotOtps.create({email, otp})
              return res.status(200).json({sucmsg: `Reset email Sent to ${email}`})
          }
        });  
  } catch (error) {
      console.log(error)
  }
}

const verifyOtpForgot = async(req, res) => {
  const {email, otp} = req.body
  try {
      const users =  await ForgotOtps.find({email: email})
      const singleUser = users[users.length - 1]
      console.log(users)
      if(singleUser.otp === otp){
          await ForgotOtps.deleteMany({email: email})
          return res.status(200).json({correctotpmsg: "OTP verified Successfully"})
      }else{
          return res.status(500).json({inmsg: "OTP entered is Incorrect"})
      }
  } catch (error) {
      console.log(error)
  }
}

const changeForgotPassword = async(req, res) => {
  const {password, confirmPassword, email} = req.body
  console.log("email", email)
  try {
      if(password != confirmPassword){
          return res.status(200).json({nomatchmsg: "Both the Passwords doesn't match"})
      }
      
      const user = await Users.findOne({email: email})
      console.log("email", user)
      const isSame = await user.compared(password)
      console.log(isSame)

      if(isSame){
          return res.status(500).json({oldpassmsg: "Your new password is Same as the Old one"})
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const updatePassword = await Users.updateOne({email: email}, {$set: {password: hashedPassword}})
      return res.status(200).json({sucmsg: "Password Changed Successfully"})

  } catch (error) {
      console.log(error)
  }
}

const updateMainUser = async(req, res) => {
  console.log("hii")
  const {id, username, email, phone, oldUsername, oldEmail, oldPhone} = req.body
  console.log(id)
  const data = {username, email, phone}

  if(username === oldUsername && email === oldEmail && phone === oldPhone){
      return res.status(500).json({samemsg: "Same data cant be updated"})
  }

  if(username === oldUsername && email != oldEmail){
      const isPresent = await Users.findOne({email: email})
      if(isPresent){
          return res.status(500).json({ispresmsg: "Email already exits "})
      }
      const updateMainUser = await Users.updateOne({_id: id}, {$set: data})
      return res.status(200).json({halfmsg: "Updated Successfully"})
  }

  try {
      if(oldEmail != email){
          const isPresentEmail = await Users.findOne({email: email})
          if(isPresentEmail){
              return res.status(500).json({ispresmsg: "Email already exits "})
          }
      }
      if(username != oldUsername){
          const isPresentUsername = await Users.findOne({username: username})
          if(isPresentUsername){
              return res.status(500).json({ispresmsg: "Username Already Exits Please try Another one"})
          }
      }
  } catch (error) {
      console.log(error)
  }
  try {
      const updateMainUser = await Users.updateOne({_id: id}, {$set: data})
      res.status(200).json({halfmsg: "Updated Successfully"})
  } catch (error) {
      console.log(error)

  }
}

const getMyDetails = async(req, res) => {
  const id = req.id
  console.log("iddf",id)
  try {
      const myDetails =  await Users.findOne({_id: id}).select({password: 0, __v: 0, isAdmin: 0})
      console.log(myDetails)
      res.status(200).json({mydetails: myDetails})
  } catch (error) {
      console.log(error)
  }
}

const changePassword = async(req, res) => {
  const id = req.id
  const {currentPassword, password, confirmPassword} = req.body

  const user = await Users.findOne({_id: id})
  const correctPasword = await user.compared(currentPassword)

  if(correctPasword){
      if(currentPassword === password){
          return res.status(401).json({samepassmsg: "Old Password and New password are same"})
      }
      else if(password === confirmPassword){
          try {
              const saltRounds = 10
              const hashedPassword = await bcrypt.hash(password, saltRounds)
              const passData = {password: hashedPassword}
              const updatePassword = await Users.updateOne({_id: id}, {$set: passData})
              return res.status(200).json({sucmsg: "Password Updated Successfully"})
          } catch (error) {
              console.log(error)
          }
      }else{
          return res.status(401).json({nomatchmsg: "Passwords Dont Match"})
      }
  }else{
      return res.status(401).json({wrongmsg: "Current Passord is Wrong"})
  }
}

const addTodo = async(req, res) => {
  const {todo, email, mainId} = req.body;
  console.log(mainId)
  try {
    if(!todo){
      return res.status(500).json({noconmsg: "Todo cannot be empty"})
    }
      const updateTodos = await Todos.create({email, mainId, todo})
      return res.status(200).json({sucmsg: "Todo Added Successfully"})
  } catch (error) {
    console.log(error)
  }
}

const getAllTodos = async(req, res) => {
  const email = req.body.email
  const mainId = req.body.mainId
  console.log(email)
  try {
      const allTodos = await Todos.find({email: email, mainId: mainId}, {todo: 1, _id: 1})
      console.log(allTodos)
      if(allTodos.Todos && allTodos.Todos.length === 0){
        return res.status(200).json({notodosmsg: "You Dont have any Todos...Create One "})
      }
      return res.status(200).json({allTodos: allTodos})
  } catch (error) {
    console.log(error)
  }
}

const deleteTodo = async(req, res) => {
    const id = req.body.id;
    const email = req.body.email
    try {
        await Todos.deleteOne({_id: id})
        return res.status(200).json({deletemsg: "Todo Deleted"})
    } catch (error) {
        console.log(error)
    }
}

const getTodo = async(req, res) => {
    const {id} = req.body
    console.log("fsdf",id)
    try {
        const todo = await Todos.findOne({_id: id})
        return res.status(200).json({todo: todo})
    } catch (error) {
        console.log(error)
    }
}

const updateTodo = async(req, res) => {
    const todo = req.body.todo
    const id = req.body.id
    try {
        const updateT = await Todos.updateOne({_id: id}, {$set: {todo: todo}})
        return res.status(200).json({sucmsg: "Updated Successfully"})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {updateTodo, getTodo, deleteTodo, Register, verifyOtp, login, forgotPassword, verifyOtpForgot, changeForgotPassword, updateMainUser, getMyDetails, changePassword, addTodo, getAllTodos}