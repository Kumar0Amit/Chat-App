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

        console.log("Error in signup comntroller ",error.message);
        res.status(500).json({error : "Internal Server Error"})
    }    
};






// login user controller/logic
export const login = (req,res) => {
    console.log("loginUser");
}


// logout user controller/logic
export const logout = (req,res) => {
    console.log("loginUser");
}



