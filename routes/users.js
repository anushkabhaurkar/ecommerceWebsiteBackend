const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var jwt1 = require('express-jwt');
router.get(`/`,async(req,res)=>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({sucess:false})
    }
    res.send(userList);
})

router.get(`/:id`,jwt1({ secret: process.env.code, algorithms: ['HS256'] }),async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({sucess:false})
    }
    res.status(200).send(user);
})
router.post('/post',async (req,res)=>{
        let user = new User({
            name:req.body.name,
            email:req.body.email,
            passwordHash: bcrypt.hashSync(req.body.passwordHash,10),
            phone:req.body.phone,
            isAdmin:req.body.isAdmin,
            street:req.body.street,
            aprtment:req.body.aprtment,
            zip:req.body.zip,
            city:req.body.city,
            country:req.body.country
        })
    user=await user.save();

    if(!user)
    return res.status(400).send('Cannot craete user');

    res.send(user);
})

router.put('/:id',jwt1({ secret: process.env.code, algorithms: ['HS256'] }),async(req,res)=>{
    const userExist = await User.findById(req.params.id);

    let newPassword
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.passwordHash,10)
    }
    else{
        newPassword = userExist.passwordHash;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,{
            name:req.body.name,
            email:req.body.email,
            passwordHash:newPassword,
            phone:req.body.phone,
            isAdmin:req.body.isAdmin,
            street:req.body.street,
            aprtment:req.body.aprtment,
            zip:req.body.zip,
            city:req.body.city,
            country:req.body.country

        },
        {new:true}
    )
    if(!user)
    return res.status(400).send('Cannot create user');

    res.send(user);
})

router.post('/login',async(req,res)=>{
    const user = await User.findOne({
        email:req.body.email,   
        password:req.body.passwordHash 
    })
    const code = process.env.code;
    console.log('code:',code);
    if(!user)
    return res.status(400).send('Email id not found');

    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign(
            {
                userid:user.id
            },
            code,
            {expiresIn:'1d'}
        )
        res.status(200).send({user:user.email, token:token,message:'success',isAdmin:user.isAdmin})
    }
    else{
        res.status(500).send({message:'invalid user'})
    }
})

module.exports = router;