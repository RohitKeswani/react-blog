//entry point for backend app
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://rohitkeswani:rohit1234@react-blog-7kwcn.mongodb.net/test?retryWrites=true&w=majority", 
{useNewUrlParser: true}).then(()=>console.log("Connected to mongo db database")).catch(err=>console.error(err));

app.get('/',function (req, res){
    res.send("Hello, World")
});

app.listen(5000);