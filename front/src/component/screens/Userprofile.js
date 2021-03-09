import React , {useState ,useEffect, useContext, Fragment} from 'react'
import {UserContext} from '../../reducres/userReducer'
import { useParams} from 'react-router-dom'

const Userprofile = () => {
    const {state, dispatch} = useContext(UserContext)
    const [userprofile,setProfile] =useState()
    const [loading,setLoading] = useState(false)
    const {userId} = useParams()

    useEffect(()=>{
        fetch(`/user/${userId}`,{
            headers:{
            'Authorization':"Bearer "+ localStorage.getItem("jwt")
             }
        }).then(res=>res.json())
        .then(result=>{
            setProfile(result)
            setLoading(true)
        })
        .catch(error => console.log(error))
    },[])

    const follow =()=>{
        setProfile( prev =>{
            return {
                ...prev,
                user:{
                    ...prev.user,
                    followers:[...prev.user.followers, state._id]
                }
            }
        })
        fetch('/follow',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
                 },
            body:JSON.stringify({
                userId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            dispatch({type:'UPDATE', payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
        }).catch(err=>console.log(err))
    }
    const unfollow =()=>{
        setProfile( prev =>{
            const newfollower =  prev.user.followers.filter(item => item !=state._id)
                return {
                    ...prev,
                    user:{
                        ...prev.user,
                        followers:newfollower
                    }
                }
            })
        fetch('/unfollow',{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
                 },
            body:JSON.stringify({
                userId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            dispatch({type:'UPDATE', payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
        })
    }

    return (
        <div className='profilepage'>
            <div className='profile_head' style={{
                display:'flex',
                justifyContent:'space-around',
                 margin:'30px 0px' ,
                 paddingBottom:'20px',
                 borderBottom:' 1px solid gray',
            }}>
                <div className='profilepicture'>
                    <img style={{ borderRadius:'50%'}}
                         src={loading?userprofile.user.profile:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"}
                         alt="Avatar"                        
                    />
                </div>
                <div className='profilecontent'>
                    <h4>{loading?userprofile.user.name:"loading"}</h4>
                    <div  style={{display:'flex', fontSize:'smaller', justifyContent:'space-between', width:'112%'}}>
                        <h6>{loading?userprofile.posts.length:'0'} post</h6>
                        <h6>{loading?userprofile.user.followers.length:'0'} followers </h6>
                        <h6>{loading?userprofile.user.following.length:'0'} following </h6>
                    </div>
                    
                     {loading && userprofile.user.followers.includes(state._id)?<button className="btn waves-effect  "style={{marginTop:'5px'}} onClick={unfollow}>unfollow </button>:<button className="btn waves-effect blue "style={{marginTop:'5px'}} onClick={follow}>follow </button>}
                </div>
            </div>
            <div className='profilegallary'>
                {loading? userprofile.posts.map(item=>{ 
                    return(
                        <div key={item._id} >
                        <img className='item'  src={item.picture} alt={item.title} />
                        </div>
                    )
                }) : 'loading...'}
            </div>
        </div>
    )
}

export default Userprofile
