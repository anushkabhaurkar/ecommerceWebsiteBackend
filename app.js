const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');   
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/errorHandler');

app.use(cors());
app.options('*',cors);

//middleware
app.use(express.json())
app.use(morgan('tiny'));


//Routes
const productRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');


const api = process.env.API_URL;

app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/users`,usersRouter);
app.use(`${api}/orders`,ordersRouter);

//Database
mongoose.connect(process.env.CONNECTION_STRING,{
    dbName:'webapp'
})
.then(()=>{
    console.log('Database is connected')
})
.catch((err)=>{
    console.log(err);
})

//Server
app.listen(3000, ()=>{
    console.log('server is running ');
})