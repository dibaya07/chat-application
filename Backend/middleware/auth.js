import jwt from 'jsonwebtoken'

export const verifyToken = (req,res,next)=>{
  let token = req.cookies['chatapp-token'];
  // console.log(token)


  if(!token){
    // console.log('from auth token missing')
    // console.log('auth',token)
    req.token = false;
    return next()
  }

  jwt.verify(token, process.env.TOKEN_KEY,(err,decoded)=>{
    if(err){
      // console.log('token verification failed')
      req.token = false;
      return next()
    }else{
      req.token = true;
      req.user = decoded;
      return next()
    }
  })
}