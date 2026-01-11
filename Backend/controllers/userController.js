import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const myData = async(req,res)=>{
  try{
    const isToken = req.token;
    if(!isToken){
      return res.status(401).json({isToken,message:'Need to sign in'})
    }
    const id = req.user.id;
    const user = await User.find({_id:id});
    // console.log(user)
    if(!user.length > 0){
      return res.json({message:'user not found'})
    }
    const {password, ...rest} = user[0]?._doc;
    return res.json({isToken,rest})
  }catch(error){
    // console.log(error)
    return res.json({message:"myData error "})
  }
}

export const allUsers = async (req, res) => {
  try {
    // console.log("allusers " ,req.token)
    const isToken = req.token;
    // console.log(users)
    if (!isToken) {
      console.log(isToken)
      return res.status(401).json({ success: false, message:'Need to sign in' ,isToken });
    }
    // const id = req.user.id;

    // const user = await User.find({ _id: id });
    // const { password, ...rest } = user[0]._doc;
  
    const allUsers = await User.find();
    return res.json({ message: "success", isToken, allUsers }); // rest,
  } catch (error) {
    console.log("all user getting error ", error);
  }
};

export const signup = async (req, res) => {
  try {
    // console.log("arrived");
    // console.log(req.body)
    const { username, email, password } = req.body;

    // console.log(req.token)
    if (!username || !email || !password) {
      console.log("error occure");
      return res.status(400).json({ message: "all fields are required" });
    }
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });

    let newUser = await user.save();
    const token = jwt.sign(
      { username, id: newUser._id },
      process.env.TOKEN_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("chatapp-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // newUser = newUser[password,...rest]
    const { password: pass, ...rest } = newUser._doc;
    // console.log("ln 1",newUser);
    // console.log("ln 2",pass);
    // console.log("ln 3",rest);
    return res.json({ token, user: rest, success: true });
  } catch (error) {
    console.log("signup controller error", error);
  }
};

export const userLogin = async(req,res)=>{
 try{
   const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).json({message:"all fields are required"})
  }
  const user = await User.findOne({email})
  // console.log(user)
  // console.log(!user)

  // if(!user){
  //   return res.json({message:'User not found, Create a account'})
  // }
  if(user && (await bcrypt.compare(password , user.password))){
    const token = jwt.sign({username: user.username,id : user._id},process.env.TOKEN_KEY,{expiresIn: "7d"});
    res.cookie("chatapp-token",token,{
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    const {password:pass,...rest} = user._doc;
    // console.log("rest",rest)
    // console.log("user",user)
    return res.json({message:'login successfully',user:rest,success:true})
  }else{
    return res.status(404).json({message:'User not found, Create a account'})
  }

 }catch(error){
  console.log(error)
  return res.status(400).json({success:false,message:'login unsuccessful'})
 }
}

export const userLogout = (req, res) => {
  try {
    res.clearCookie("chatapp-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res
      .status(200)
      .json({ success: true, message: "successfully Logout" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Logout unsuccessfull" });
  }
};

// export {}
