const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('Users')
const requireLogin = require('../middleware/requireLogin')


// for tokenvarification
const jwt = require('jsonwebtoken')
// tokenskey
const { JWT_SECRET } = require('../config/keys')
// password encrption
const bcrypt = require('bcryptjs');


router.get('/', (req, res)=>{
    res.send('home page ');
})
// router.get('/protected',requireLogin, (req, res)=>{
//     res.json('protected page    - u re loged IN :)');
// })

router.post('/signup', (req, res)=>{
    const {name, email, password} = req.body
    if(!name || !email || !password){
        return res.status(422).json({error:"please insert all the required fields !!"})
    }
    // res.send("process Success :)")
    // quering
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){  //true or false
            return res.status(422).json({error:"email already exists !"})
        }
        bcrypt.hash(password, 8)
        .then(hassedpass=>{
            const user = new User({
                email,
                password:hassedpass,
                name
            })
            user.save()
            .then(user =>{
                res.json({message:'Account created sucessfully :)'})
            })
            .catch(err=>{
                console.log(err)
            })
        })   
    })
    .catch(err => console.log(err))
})


router.post('/signin', (req, res) =>{
    const {email , password} = req.body
    if(!email || !password ) {
       return res.status(422).json({error:" please enter your email and password !!"})
    }
    User.findOne({email :email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password :("})
        }
        bcrypt.compare(password, savedUser.password)
        .then( domatch =>{
            if(domatch){
                // return res.json({message:"successfully signed in" })
                // we are passing json token
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id, name, email, followers, following, profile} = savedUser
                res.json({token, user:{_id, name, email, followers, following, profile}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password :("})
            }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))

})

module.exports = router;