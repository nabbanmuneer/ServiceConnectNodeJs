const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel')
const { smsOtp, otpValidiation } = require("../utils/otp");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendTokens } = require('../utils/tokenUtils');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;


const googleCallback = (req, res) => {
  const user = { id: req.user.id, email: req.user.email };
  sendTokens(res, user); 
  res.redirect('/'); 
};
exports.googleCallback = googleCallback


const signUp = async (req,res) => {
    try
    {
        let {userInput , password } = req.body;
        console.log(userInput , password);        
        if (emailPattern.test(userInput)) 
        {
            const userData = await userModel.findOne({email: userInput});
            if ( !userData ) 
            {
                const response = await smsOtp(email);
                if (response.status == true )
                {
                    console.log('otp sended');
                    res.status(200).json({status: true})
                } 
                else 
                {
                    console.log('issue in otp generator');
                }
            }else{
                console.log("email already register");
            }
        } 
        else if (phonePattern.test(userInput)) 
        {
                const userData = await userModel.findOne({phoneNo: userInput});
                if ( !userData ) 
                {
                    const response = await smsOtp(PhoneNO);
                    if (response.status == true ){
                        console.log('otp sended');
                        res.status(200).json({status: true})
                        } else {
                        console.log('issue in otp generator');
                    }
                } else {
                    console.log("phone no already registered");
                    
                }
        }else{
            console.log("Invalid input");
        }

    } catch(error)
    {
        console.log('error in signup',error);    
    }
}
exports.signUp = signUp


const otpValidation = async (req,res) => {
    try {
        let { otp,userInput,password } = req.body;
        if (emailPattern.test(userInput)) 
            {
                const response = await otpValidiation(userInput, otp);
                if ( response.status === true ) 
                {
                    const salt = await bcrypt.genSalt(10);
                    password = await bcrypt.hash(password, salt);
                    const data = new userModel({ email: userInput, password: password});
                    await data.save()
                    res.status(200).json({status: true})
                }else{
                    console.log("Otp validation have issue");
                }
            } 
            else if (phonePattern.test(userInput)) 
            {
                const response = await otpValidiation(userInput, otp);
                if ( response.status === true ) 
                {
                    const salt = await bcrypt.genSalt(10);
                    password = await bcrypt.hash(password, salt);
                    const data = new userModel({ phoneNO: userInput, password: password});
                    await data.save()
                    res.status(200).json({status: true})
                }else{
                    console.log("Otp validation have issue");
                }
            }else{
                console.log("Invalid input");
            }    
        } catch (error) {
            res.json({ status: false })
        }
    }
    exports.otpValidation = otpValidation

    const otpResent = async (req,res) =>{
        try{
            let { userInput } = req.body;
            console.log(userInput);
            let data ;
            if (emailPattern.test(userInput)) 
            {
                const otpEmail = await otpModel.findOne({ email: userdata });
                if (!otpEmail){
                    const salt = await bcrypt.genSalt(10);
                    password = await bcrypt.hash(password, salt);
                    data = new userModel({ email: userInput, password: password});
                    await data.save()
                    console.log('data save in email');
                    res.status(200).json({status: true})
                }else{
                    console.log('same otp sended');    
                }
            } 
            else if (phonePattern.test(userInput)) 
            {
                const salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);
                data = new userModel({ phoneNO: userInput, password: password});
                await data.save()
                console.log('data save in email');
                res.status(200).json({status: true})
            }else{
                console.log("Invalid input");
            }                
            res.status(200);   
            }catch(error){
                console.log("error otp resent");
            }
        }
        exports.otpResent = otpResent


    const signIn = async (req,res) => {
        try{
            let {userInput , password } = req.body;
            let userData ;
            let accessToken ;
            if (!userInput || !password) {
                return res.status(400).json({ 'message': 'Username and password are required.' });
            }
            if (emailPattern.test(userInput)) 
            {
                userData = await userModel.findOne({ email: userdata });
                if (userData)
                {
                    const match = bcrypt.compare(password, userData.password);
                    if(match)
                    {
                        let userName = userData.userName;
                        let role = userData.role; 
                        accessToken = jwt.sign({
                            "UserInfo": {
                                "userName": userName,
                                "role": role,
                                "email": userData.email,
                            }},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '5d' });
                        res.status(200).json({status: true})
                    } else 
                    {
                        console.log("invalid password");    
                        res.sendStatus(401);
                    } 
                }
                else {
                    console.log('Email not register');    
                }
            } else if (phonePattern.test(userInput)) 
            {
                userData = await userModel.findOne({ phoneNo: userdata });
                if (userData)
                {
                    const match = bcrypt.compare(password, userData.password);
                    if(match)
                    {
                        let userName = userData.userName;
                        let role = userData.role; 
                        accessToken = jwt.sign({
                            "UserInfo": {
                                "userName": userName,
                                "role": role,
                                "phoneNo": userData.phoneNo,
                            }},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '5d' });
                        res.status(200).json({status: true})
                    } else 
                    {
                        console.log("invalid password");    
                        res.sendStatus(401);
                    } 
                }
                else {
                    console.log('Email not register');    
                }
            }else{
                console.log("Invalid input");
            }
            const newRefreshToken = jwt.sign({ id: userData.id },"abcd1234", {expiresIn: "6d",});
            let newRefreshTokenArray = !cookies?.jwt
                ? userData.refreshToken
                : userData.refreshToken.filter((rt) => rt !== cookies.jwt);            
            if (cookies?.jwt) 
            {
                const refreshToken = cookies.jwt;
                const foundToken = await userModel.findOne({ refreshToken }).exec();                        
                if (!foundToken) {
                    newRefreshTokenArray = [];
                }
                res.clearCookie("jwt", {
                    httpOnly: true,
                    sameSite: "None",
                    secure: true,
                });
            }                        
            userData.refreshToken = [newRefreshTokenArray, newRefreshToken];
            const result = await userData.save();                        
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.json({ accessToken, userData });  
        }catch (error){
            console.log("error");
            
        }
    }
    const refreshToken = async (req, res) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
      
        const foundUser = await User.findOne({ refreshToken }).exec();
      
        // Detected refresh token reuse!
        if (!foundUser) {
          jwt.verify(refreshToken, "abcd1234", async (err, decoded) => {
            if (err) return res.sendStatus(403);
            const hackedUser = await User.findOne({
              id: decoded.id,
            }).exec();
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
          });
          return res.sendStatus(403); //Forbidden
        }
      
        const newRefreshTokenArray = foundUser.refreshToken.filter(
          (rt) => rt !== refreshToken
        );
      
        jwt.verify(refreshToken, "abcd1234", async (err, decoded) => {
          if (err) {
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();
          }
          if (err || foundUser.id !== decoded.id) return res.sendStatus(403);
      
          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: decoded.id,
              },
            },
            "abcd1234",
            { expiresIn: "5d" }
          );
          S;
          const newRefreshToken = jwt.sign({ id: foundUser.id }, "abcd1234", {
            expiresIn: "15s",
          });
          // Saving refreshToken with current user
          foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          const result = await foundUser.save();
      
          // Creates Secure Cookie with refresh token
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });
      
          res.json({ accessToken, foundUser });
        });
      };
      module.exports = { signIn, refreshToken };