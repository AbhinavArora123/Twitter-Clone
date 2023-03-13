const jwt=require('jsonwebtoken');

const express=require('express');
const router=express.Router();

const bcrypt=require('bcrypt');

require('../db/conn');
const User=require('../model/userSchema');

router.get('/',(req,res)=>{
    res.send(`hello server from auth.js`);
    // res.send(req.body);
})

router.post('/register',async (req,res)=>{
    // res.send(req.body);

    const{name,email,phone,password}=req.body;
    if(!name || !email || !phone || !password){
        return res.status(400).json({msg:'Form incomplete'})
    }

    try{
        const userExist=await User.findOne({email:email})
        
        if(userExist){
            return res.status(422).json({msg:'Email already exists'})
        }

        const user=new User({name,email,phone,password})

        const userRegister=await user.save();

        if(userRegister){
            res.status(201).json({msg:"Successfully registered",newUser:user})
        } else{
            res.status(500).json({msg:"failed to register"});
        }
        // console.log(user);

    } catch(err){
        console.log(err);
    }
});
// router.post('/register',(req,res)=>{
//     // res.send(req.body);

//     const{name,email,phone,password}=req.body;
//     if(!name || !email || !phone || !password){
//         return res.status(400).json({msg:'Form incomplete'})
//     }

//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(400).json({msg:'Email lready exists'})
//         }
//         const user=new User({name,email,phone,password})

//         user.save()
//         .then(()=>{
//             res.status(201).json({msg:"Successfully registered",newUser:user})      
//         }).catch((err)=>res.status(500).json({msg:"failed to register"}));
//     }).catch(err=>{console.log(err)});

// });

router.post('/signin', async (req,res)=>{
    try{
        const userMail=req.body.email;
        const userPassword=req.body.password;

        if(!userMail || !userPassword){
            return res.status(422).json({msg:"Sign In incomplete"});
        }

        const userLogin=await User.findOne({email:userMail})

        if(userLogin){
            const isMatch = await bcrypt.compare(userPassword,userLogin.password);

            const token=await userLogin.generateAuthToken();

            console.log(token);

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            });

            if( !isMatch){
                res.json({error:'Email or password incorrect'})
            } else{
                res.json({msg:"Signin Successful",user:userLogin})
            }

        } else{
            res.status(400).json({error:"Invalid Credentials!"})
        }
     // console.log(userLogin);

    } catch(err){
        console.log(err);
    }
})

module.exports=router;