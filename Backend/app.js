const dotenv=require('dotenv');
const express=require('express');
const app=express();

dotenv.config({path:'./config.env'});

require('./db/conn');

app.use(express.json());

app.use(require('./router/auth'));

const User=require('./model/userSchema');

const PORT=process.env.PORT;

app.get('/',(req,res)=>{
    res.send(`hello backend from app.js`);
});

app.listen(PORT,()=>{
    console.log({PORT});
})