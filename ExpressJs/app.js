const express = require('express');
const mongoose = require("mongoose");
const app =express();
require("dotenv/config");
const bodyParser = require("body-parser");
const taskRoute = require("./taskroute/task");
var cors = require("cors");


app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use('/task',taskRoute);

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser: true}, ()=> console.log('connected to mongodb')
);


app.listen(3000);