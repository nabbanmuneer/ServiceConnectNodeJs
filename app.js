const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const homeRoute = require('./routers/homeRoute')
const app = express();
const passport = require('passport');
const cookieParser = require('cookie-parser');

dotenv.config();
require('./passportConfig');

const PORT = process.env.PORT || 5000;
const CONNECTDB = process.env.CONNECTDB

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use("/",homeRoute);


mongoose.connect(CONNECTDB).then(()=>{
    mongoose.set('strictQuery', false);
    app.listen(PORT,()=>{
        console.log("listing ......")
    });
});
