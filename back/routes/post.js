const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')




router.get('/allpost',requireLogin, (req, res)=>{
    Post.find()
    .populate('postedBy',"_id name")
    .populate('comments.postedBy', "_id name")
    .then(posts =>{
        res.json({posts})
    }).catch(err => console.log(err))
} )

router.get('/subscribedpost',requireLogin, (req, res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy',"_id name")
    .populate('comments.postedBy', "_id name")
    .then(posts =>{
        res.json({posts})
    }).catch(err => console.log(err))
} )

router.post("/createpost" ,requireLogin , (req, res) =>{ 
    const {title, body, url} = req.body;

    if(!title || !body || !url) {
        res.status(422).json({error:"please add all the required field !"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        picture:url,
        postedBy:req.user
    })
    post.save() 
    .then(result =>{
        res.json({post:result})
    })
    .catch(err=>(console.log(err)))
})


router.get("/mypost", requireLogin, (req, res)=>{
    Post.find({postedBy:req.user._id})
    .populate('postedBy',"_id name")
    .then( mypost =>{
              res.json({mypost})
    })
    .catch(err => console.log(err))
})

// updated request so.
router.put("/like", requireLogin, (req, res)=>{
    const {postId} = req.body
   
    Post.findByIdAndUpdate(postId, {
        $push:{likes:req.user._id},
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate('comments.postedBy', "_id name")
    .exec((err, result) =>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate('comments.postedBy', "_id name")
    .exec((err, result) =>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

// updated request so.
router.put("/comment", requireLogin, (req, res)=>{
    const comment ={
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment},
    },{
        new:true
    })
    .populate('postedBy', "_id name")
    .populate('comments.postedBy',"_id name")
    .exec((err, result) =>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.delete('/deletepost/:postId', requireLogin, (req, res)=>{
    Post.findOne({_id:req.params.postId})
    .populate('postedBy',"_id")
    .exec((err, post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json({message:'successfully deleted !'})
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})


// underconstruction
router.put('/deletecomment', requireLogin, (req, res)=>{
    // const {commentId} = req.body
    Post.findByIdAndUpdate({_id:req.body.postId},
        {
            $pull:{comments:req.body.commentId}
        },
        {
            new:true
        })
    .populate('comments.postedBy',"_id")
    .populate('postedBy',"_id")
    .exec((err, result)=>{
        console.log(result)
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


module.exports = router;