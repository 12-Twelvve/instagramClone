import React , {useState, useEffect ,useContext, Fragment}from 'react'
import {UserContext} from '../../reducres/userReducer'
import './home.css'
import {Link} from 'react-router-dom'
import Createpost from './Createpost'
import M from 'materialize-css'

export default function Home() {

    return (
        <div className="homepage">
            <Createpost/>
            <div>
                <Homecard/>
            </div>
        </div>
    )
}

function Homecard() {

    const {state, dispatch} = useContext(UserContext)
    const [data, setdata] = useState([])
    const [likeorunlike, setlikeorunlike] = useState(false)
    useEffect(() => {
        fetch('/allpost',{
            headers:{
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setdata(result.posts)
        })
        .catch(error => console.log(error))
    }, [])
   
    const likePost =(id)=>{
        fetch('/like',{
            method:"PUT",
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then( result =>{
            const newData = data.map(i =>{
                if(i._id==result._id){
                    return result
                }
                else{
                   return i 
                }
            })
            setdata(newData)
        }).catch(error => console.log(error))
    }
    const unlikePost =(id)=>{
        fetch('/unlike',{
            method:"PUT",
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })

        }).then(res=>res.json())
        .then( result =>{
            const newData = data.map(i =>{
                if(i._id==result._id){
                    return result
                }
                else{
                   return i 
                }
            })
            setdata(newData)
        }).catch(error =>console.log(error))
    }
    const makecomment =(text, postId)=>{
        fetch('/comment',{
            method:"PUT",
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text,
                postId
            })
        }).then(res=>res.json())
        .then( result =>{
            const newData = data.map(i =>{
                if(i._id==result._id){
                    return result
                }
                else{
                   return i 
                }
            })
            setdata(newData)
        }).catch(error =>console.log(Error))

    }
    
// under construction ...... 
    const deletecomment =(postId,commentId)=>{

        fetch('/deletecomment', {
            method:'put',
            headers:{
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                commentId,
                postId
            })
        }).then(res=>res.json())
        .then( result =>{
            const newData = data.map(i =>{
                if(i._id==result._id){
                    return result
                }
                else{
                   return i 
                }
            })
            setdata(newData)
        })
        .catch(error =>console.log(error))
    }

    return (
        <Fragment>
            {
                data.map(item =>{
                    return(
                    
                      <div className="card homecard" key={item._id+item.picture+item.title}>
                        <h5><Link to={item.postedBy._id ==state._id?'/profile':'/profile/'+item.postedBy._id}>{item.postedBy.name}</Link></h5>
                        <div className="card-image">
                            <img src={item.picture}  alt=""/>
                        </div>
                        <div className="card-content">
                            {item.likes.includes(state._id)?
                            <i className='material-icons' onClick={()=>{unlikePost(item._id)}} style={{color:'red', cursor:'pointer'}}>favorite</i>:<i className='material-icons' onClick={(e)=>{likePost(item._id)}} style={{color:'red', cursor:'pointer'}}>favorite_border</i> 
                            }
                            <span ><span  style={{ fontWeight:'500' }}>{item.likes.length}</span><span style={{color:'lightgray'}}>likes</span> </span>
                            <h6>{item.title}</h6>
                            <p style={{borderBottom:'1px solid lightgray', paddingBottom:'10px'}}>-{item.body}</p>
                            {
                            item.comments.map(comment=>{
                                 return(<h6 key={comment._id}><span style={{fontWeight: '600', letterSpacing:'1px',fontSize:'12px', marginRight:'5px'}}>@{comment.postedBy.name}</span> <span> {comment.text}</span>
                                 { (comment.postedBy._id==state._id)?<i className='material-icons'style={{color:'red',cursor:'pointer' ,float:'right',fontSize:'15px' }} >delete</i>:<span></span>}
                                    </h6>)
                            })}
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                makecomment(e.target[0].value, item._id)
                            }}>
                              <input type="text" placeholder='add a comment' className=''/>
                            </form>
                        </div>
                      </div>
                    )
                })
            }
        </Fragment>
    )
}