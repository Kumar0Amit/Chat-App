import jwt from 'jsonwebtoken';

// we are using httponly cookie method of jwt security not the direct jwt 
const generateTokenAndSetCookie = (req,res) =>{
    const token  = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })

    res.cookie("jwt",token,{
        maxAge : 15*24*60*60*1000,
        httpOnly : true, // prevents xss attack ,cross site scripting attacks ,user can not access it using javascript
        sameSite : "strict" // prevents CSRF attacks cross site request forgery


    });
}


export default generateTokenAndSetCookie;


// const generateTokenAndSetCookie = async (userId,res) =>{
//     const token  = jwt.sign({userId},process.env.JWT_SECRET,{
//         expiresIn: '15d'
//     })

//     res.cookie("jwt",token,{});
// }