const express =require('express')
const router = express.Router()
const appError = require("../utils/appError")
const userController = require('../Controllers/Users.Controller')
const verifyToken =require('../middleware/verifyToken')
//get all users
//register
//login

router.route('/')
   .get(verifyToken,userController.getAllUsers)

   router.route('/register')
   .post(userController.register)










module.exports =router;