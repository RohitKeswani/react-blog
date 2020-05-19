//entry point for backend app
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const {auth} = require('./middleware/auth');
const {User} = require('./models/user');

mongoose.connect(config.mongoURI, 
{useNewUrlParser: true}).then(()=>console.log("Connected to mongo db database")).catch(err=>console.error(err));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register', (req, res)=>{
        const user = new User(req.body);
        
        user.save((err, doc) => {
            if(err) return res.json({success: false, err})
            return res.status(200).json({
                success: true,
                userData: doc
            })
        })
})


app.post('/api/user/login', (req, res)=>{
    //find email
    User.findOne({email: req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess : false,
                message: "Authentication failed, no email address found in database."
            });
        }
        //compare password
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch){
                return res.json({
                    loginSuccess : false,
                    message: "Authentication failed, password incorrect."
                });
            }
            //generate token
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                res.cookie("x_auth", user.token)
                .status(200).json({
                    loginSuccess: true,
                    message: "Authentication successful."
                })
            })
        })
    });
})

app.get('/api/user/auth', auth,  (req, res)=>{
    res.status(200).json({
        _id: req._id,
        isAuth : true,
        email : req.user.email,
        firstName : req.user.firstName,
        lastName : req.user.lastName,
        role: req.user.role
    })
})

app.listen(5000);