import React ,{useState} from 'react'
import { Link ,useHistory} from 'react-router-dom'
import M from 'materialize-css'


const SignUp = () => {
    const history =useHistory()
    const [name, setname] = useState("")
    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")
    
    
    const PostData =()=>{
        // regx for email...
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html:"Invalid email address !", classes:"red"})
        }
        // 
        fetch("/signup" , {  
            // http://localhost:5000/signup
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name,
                email,
                password
            }) 
        }).then( res => res.json())
        .then(data =>{
            if(data.error){
                M.toast({html:data.error, classes:"red"})
            }
            else{
                M.toast({html:data.message, classes:'green'})
                history.push('./login')
            }
        })
        .catch(err =>(console.log(err)))
    }

    return (
    <div className='signuppage' >
        <div className="card auth-card">
            <h2>Instagram</h2>
            <input type='text' placeholder='username' value={name} onChange={ e =>setname(e.target.value)}/>
            <input type='email' placeholder='email'  value={email} onChange={ e =>setemail(e.target.value)}/>
            <input type='password' placeholder='password'  value={password} onChange={ e =>setpassword(e.target.value)}/>
            <button className="btn waves-effect blue " onClick={PostData} >signup </button>
            <h6> 
                <Link to='/login'>Already have an Account ?</Link>
            </h6>
        </div>
    </div>
    )
}

export default SignUp
