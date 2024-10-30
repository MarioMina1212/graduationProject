const asyncMiddleware = require("../middleware/async.middleware");
const httpStatusText = require("../utils/http.status.text"); 
const User =require('../Schema/user.model');
const appError =require("../utils/appError");
const bcrypt =require("bcryptjs");
const genrateToken =require("../utils/genrateJWT");

const getAllUsers =asyncMiddleware( async (req, res) => {

  const query = req.query
const limit = query.limit|| 10;//2
const page =query.page || 1;//3
const skip = (page-1)*limit
  // get all courses from DB using Course Model
  const  users = await  User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { users } });
})



const register = asyncMiddleware(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const userExistsPromise = User.findOne({ email });
  const hashedPasswordPromise = bcrypt.hash(password, 10);

  const [oldUser, hashedPassword] = await Promise.all([userExistsPromise, hashedPasswordPromise]);

  if (oldUser) {
    const error = appError.create("user already exists", 400, httpStatusText.FAIL);
    return next(error);
  }

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const tokenPromise = generateToken({ email: newUser.email, id: newUser._id });

  const [savedUser, token] = await Promise.all([newUser.save(), tokenPromise]);

  savedUser.token = token;

  return res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: savedUser } });
});

     



const Login =asyncMiddleware(async (req, res,next) => {
     
  const { email, password } = req.body;

  
  
 if(!email||!password){
  const error=appError.create("email and password are required",400,httpStatusText.FAIL)
  return  next(error)
 }
 
 
 const user = await User.findOne({ email }); 
  
if(!user){
  const error=appError.create("User Not Found",400,httpStatusText.FAIL)
  return  next(error)
}


 const matcedPassword = await bycrpt.compare(password, user.password)
 if(user&&matcedPassword){
  //logged in successfully
  const token = await genrateToken({email:user.email,id:user._id})
  return res.status(200).json({ status: httpStatusText.SUCCESS, data: {token} });
 }else{
  const error=appError.create("Email Or Password is Wrong Please Try Again",400,httpStatusText.FAIL)
  return  next(error)
 }
})


module.exports={
  getAllUsers,
  register,
  Login
}