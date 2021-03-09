import React , {useState ,useEffect, useContext, Fragment} from 'react'
import {UserContext} from '../../reducres/userReducer'
import M from 'materialize-css' 
import './profile.css'


const Profile = () => {
    const [data, setdata] = useState([])
    const {state, dispatch} =useContext(UserContext)
    const [deleted, setdeleted] = useState(false)
    const [image, setimage] = useState('')

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
            'Authorization':"Bearer "+ localStorage.getItem("jwt")
             }
        }).then(res=>res.json())
        .then(result=>{
            setdata(result.mypost)
        })
        .catch(error => console.log(error))
    },[deleted])

    const uploadprofile = ()=>{
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', "insta-clone")
        data.append("cloud_name", "jack-insta")
        fetch("https://api.cloudinary.com/v1_1/jack-insta/image/upload",{
            method:"post",
            body:data // formdata
        })
        .then(res => res.json())
        .then(result =>{
            dispatch({type: 'UPLOAD', payload: {profile: result.url}})
            localStorage.setItem("user", JSON.stringify({...state, profile:result.url}))
            setimage('')

            fetch('/uploadprofile',{
                method:"put",
                headers:{
                    'Authorization':"Bearer "+ localStorage.getItem("jwt"),
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    profileurl:result.url
                }) 
            }).then( res => res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html:data.error, classes:"red"})
                }
                else{
                    M.toast({html:data.message, classes:'green'})
                }
            })
        })   
        .catch(error =>console.log(error)) 
    }

    const deltpost =(postId)=>{

        fetch(`/deletepost/${postId}`, {
            method:'delete',
            headers:{
                'Authorization':"Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            if(result.error){
                console.log(result.error)
            }else{
            M.toast({html:result.message, classes:"brown"})
            setdeleted(!deleted)
            }
        })
        .catch(error =>console.log(error))
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
                <div className='profilepicture' style={{position:'relative'}}>
                    <label style={{cursor:'pointer'}}>
                    <img style={{ borderRadius:'50%'}}
                         src={state.profile}
                         alt="Avatar"                      
                    />
                    <input style={{display:'none'}} type="file" onChange={e=> setimage(e.target.files[0])}/>
                    </label>
                    {image?<button onClick={uploadprofile} style={{position:'absolute', left:'45px', top:'75px', backgroundColor:'red', border:'none', color:'white', cursor:'pointer', padding:'5px', borderRadius:'10px'}}>upload</button>:''}
                    

                </div>
                <div className='profilecontent'>
                    <h4>{state?state.name:"loading"}</h4>
                    <h4 style={{fontSize:'15px', color:'gray'}}>{state?state.email:"loading"}</h4>
                    <div  style={{display:'flex', fontSize:'smaller', justifyContent:'space-between', width:'112%'}}>
                        <h6>{data.length} post</h6>
                        <h6>{state?state.followers.length:'0'} followers </h6>
                        <h6>{state?state.following.length:'0'} following </h6>
                    </div>
                </div>
            </div>
            <div className='profilegallary'>
                {data.map(item=>{ 
                    return(
                        <div key={item._id} >
                        <img className='item'  src={item.picture} alt={item.title} />
                        <i className='material-icons' onClick={()=>{deltpost(item._id)}} style={{color:'red', cursor:'pointer',position:'absolute' ,left:'10px',top:'5px' }}>delete</i></div>
                    )
                })}       
                
            </div>
        </div>
    )
}

export default Profile