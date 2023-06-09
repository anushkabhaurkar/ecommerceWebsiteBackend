const {Order} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get(`/`,async(req,res)=>{
    const orderList = await Order.find();

    if(!orderList){
        res.status(500).json({sucess:false})
    }
    res.send(orderList);
})

module.exports = router;