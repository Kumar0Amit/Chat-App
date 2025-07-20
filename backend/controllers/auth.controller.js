import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";



// signup user controller/logic
export const signup = async (req,res) => {
    try{
        const {fullName,username,password,confirmPassword,gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error: "Passwords don't match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error : "Username already exists. Please try another one"});
        }

   
        // Hash the password here before  storing it in db 
        // provide security if db is exposed 

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        // https://avatar-placeholder.iran.liara.run/    place for avatar that we often see on our profile in chatting apps

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password : hashedPassword,
            gender,
            profilePic : gender === "male" ? boyProfilePic : girlProfilePic
        });


        // optimise it furthur instead of directly saving we could do 

        if(newUser){

            // generate JWT token here 

            // await generateTokenAndSetCookie;  we have not made this functin in its file as async so we cant use await with it here 
            //generateTokenAndSetCookie(newUser,res); // we can pass this newUser directly as a res and extract its _id in jwt.sign(req._id) also which we have studied so far but passing userid directly is also a  better thing 
            generateTokenAndSetCookie(newUser._id,res);

            await newUser.save();

        res.status(201).json({
            _id : newUser._id,
            fullName : newUser.fullName,
            username : newUser.username,
            profilePic : newUser.profilePic
        });
        }else{
            res.status(400).json({error:"Invalid user data"});
        }


        // await newUser.save();

        // res.status(201).json({
        //     _id : newUser._id,
        //     fullName : newUser.fullName,
        //     username : newUser.username,
        //     profilePic : newUser.profilePic
        // });

    }catch(error){

        console.log("Error in signup controller ",error.message);
        res.status(500).json({error : "Internal Server Error"})
    }    
};






// login user controller/logic
export const login = async (req,res) => {
    try {
        const {username,password} = req.body;

        if(username === "" || password === ""){
            return res.status(400).json({error:"username or password cannot be empty"});
        }

        const user = await User.findOne({username});

        // if(!user){
        //     return res.status(400).json({error:"User not exists.Please signup first"});
        // } // this is also correct but noobs use this 

        // verify the password which we have hashed earlier 

        const isPasswordCorrect = await bcrypt.compare(password,user?.password || ""); // we use terenray operator because if the user does not exists the user will be null and it will give typeerror cause .compare expect 2 args so for fallback situatiuon we passes a empty string

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        } // this is better way

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic:user.profilePic,
        });
        
    } catch (error) {
        console.log("Error in login ",error.message);
        res.status(500).json({error : "Internal Server Error"})
    }
}


// logout user controller/logic
export const logout = async (req,res) => {
   try {
        // res.cookie("jwt","",{maxAge:0});
        res.clearCookie('jwt');
        //console.log(`User ${req.user?._id || 'unknown'} logged out at ${new Date().toISOString()} from IP: ${req.ip}`); //advance feature
         // Note: req.user?._id assumes you have a middleware that extracts user ID from JWT and attaches it to req.user
        // req.ip gets the client's IP address (may need proxy configuration for accuracy in production)
        return res.status(200).json({message:"Logged out successfully"});
    
   } catch (error) {
    console.log("Error in logout ",error.message);
    res.status(500).json({error : "Internal Server Error"})
   }
}



