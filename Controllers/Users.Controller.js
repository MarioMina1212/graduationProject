const asyncMiddleware = require("../middleware/async.middleware");
const httpStatusText = require("../utils/http.status.text"); 
const User =require('../Schema/user.model');
const appError =require("../utils/appError");
const bcrypt = require('bcrypt'); 
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

  // التحقق من أن جميع الحقول مطلوبة
  if (!firstName || !lastName || !email || !password) {
    const error = appError.create("All fields are required", 400, httpStatusText.FAIL);
    return next(error);
  }

  // التحقق من عدم وجود المستخدم مسبقاً
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = appError.create("User already exists", 400, httpStatusText.FAIL);
    return next(error);
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء المستخدم الجديد في قاعدة البيانات
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });
  
  await newUser.save(); // حفظ المستخدم أولاً للحصول على _id

  // توليد الرمز المميز (JWT) بعد إنشاء المستخدم للحصول على newUser._id
  const token = await genrateToken({ email: newUser.email, id: newUser._id });

  // تعيين الرمز المميز للمستخدم
  newUser.token = token;
  await newUser.save(); // تحديث المستخدم بالرمز المميز المحفوظ

  // إرسال استجابة مع بيانات المستخدم
  return res.status(201).json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
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