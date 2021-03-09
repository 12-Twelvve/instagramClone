import React , {useState, useContext} from 'react'
import './login.css'
import { Link , useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../reducres/userReducer'


const Login = () => {
    const {state, dispatch}= useContext(UserContext)
    const history =useHistory()
    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")

    const PostData =()=>{
        // regx for email...
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html:"Invalid email address !", classes:"red"})
        }
        // 
        fetch("/signin" , {  
            // http://localhost:5000/signin
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email,
                password
            }) 
        }).then( res => res.json())
        .then(data =>{
            if(data.error){
                M.toast({html:data.error, classes:"red"})
            }
            else{
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user',JSON.stringify(data.user))
                // 
                dispatch({type:"USER", payload:data.user})
                M.toast({html:"Enjoy your moment :)", classes:'green'})
                history.push('/')
            }
        })
        .catch(err =>(console.log(err)))
    }
    return (
    <div className='loginpage' >
        <div className="card auth-card">
            <h2>Instagram</h2>
            <input type='email' placeholder='email' value={email} onChange={(e)=>setemail(e.target.value)}/>
            <input type='password' placeholder='password'  value={password} onChange={(e)=>setpassword(e.target.value)}/>
            <button className="btn waves-effect blue " onClick={PostData}>LogIn </button>
            <h6> 
                <Link to='/signup'> Don't have an Account ?</Link>
            </h6>
        </div>
    </div>
    )
}

export default Login
