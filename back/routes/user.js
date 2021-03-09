const { json } = require('express');
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('Users')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin');
const { route } = require('./auth');


router.get('/user/:userId',(req,res)=>{
    User.findOne({_id:req.params.userId})
    .select("-password")
    .then(user =>{
        Post.find({postedBy:req.params.userId})
        .populate("postedBy", "_id name")
        .exec((err, posts)=>{
            if(err){
                console.log(err)
                return res.status(422).json({error:err})
            }
            res.json({user, posts})
        })
    }).catch(error=>{
        console.log(error)
        return res.status(422).json({error:'user not found'})
    })
})

router.put('/follow', requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.userId, {
        $push:{followers:req.user._id}
    },
    {
        new:true,
    },
    (err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push:{following:req.body.userId}
        },
        {
            new:true,    
        },
        (err, result)=>{
            if(err){
                return res.status(422).json({error:err})
            }        
        }) 
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
            return res.status(422).json({error:err})
        }) 
    })
})
    

router.put('/unfollow', requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.userId, {
        $pull:{followers:req.user._id}
    },
    {
        new:true,
    },
    (err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull:{following:req.body.userId}
        },
        {
            new:true,    
        },
        (err, result)=>{
            if(err){
                return res.status(422).json({error:err})
            }        
        }) 
        .select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
            return res.status(422).json({error:err})
        }) 
    })
})

router.put('/uploadprofile', requireLogin, (req, res)=>{
    User.findByIdAndUpdate({_id:req.user._id}, {
        $set:{profile:req.body.profileurl}
    },{
        new:true
    },(err, result)=>{
        if(err){
            return res.status(422).json({error:"error upoading file :("})
        }        
    })
    .then(result => {
        res.json({message:'Profile uploaded sucessfully :)'})
    })
    .catch(err=>console.log(err))
})

module.exports = router;
