const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('Users')


module.exports =(req, res, next)=>{
    const { authorization } = req.headers  //use smallletter for 'A'uthorization
    // authrorization === Bearer adlfkaldkf(token)
    if(!authorization){
        return res.status(401).json({error:"NOt authorized u must be logedd iN!! :("})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if(err){
            return res.status(401).json({error:"You must be logged In :("})
        }
        const {_id } = payload
        User.findById(_id)
        .then(userData =>{
            req.user = userData
            next()
        })
    })
}