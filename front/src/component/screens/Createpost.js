import React , {useState, useEffect} from 'react'
import M from 'materialize-css'
// import { useHistory } from 'react-router-dom'



const Createpost = () => {
    // const history =useHistory();
    const [title, settitle] = useState("")
    const [body, setbody] = useState("")
    const [image, setimage] = useState("")
    const [url, seturl] = useState("")
    useEffect(()=>{
        if(url){
            fetch("/createpost" , {  
                // http://localhost:5000/signup
                method:'post',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':"Bearer "+ localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    url
                }) 
            })
            .then( res => res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html:data.error, classes:"red"})
                }
                else{
                    M.toast({html:"successfully posted :)", classes:'green'})
                    // history.push('/')
                }
            })
            .catch(err =>(console.log(err)))
        }

    },[url])

    const postDetails = ()=>{
        // const setPostButton ="red"
        console.log('post')
        if(!title || !body || !image){
            return M.toast({html:"please insert all the field !", classes:'brown'})
        }
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
            seturl(result.url)
        })   
        .catch(error =>console.log(error))   
    }

    return (
        <div className='card input-field  createpost'>
            <input type="text" placeholder='title' value={title} onChange={e=>settitle(e.target.value)} />
            <input type="text" placeholder="what's on your mind ?" value={body} onChange={e=>setbody(e.target.value)} />

            <div className="file-field input-field">
                <div className="btn blue">
                    <span >Upload image</span>
                    <input type="file" onChange={e=> setimage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate " type="text" placeholder="share your moment :)" />
                </div>    
            </div>
            <button className="btn waves-effect waves-light #64b3f3 blue"   onClick={postDetails} > post </button>     
        </div>
    )
}

export default Createpost
