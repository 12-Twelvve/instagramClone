import React, {useContext, } from 'react'
import './navbar.css'
import { Link } from 'react-router-dom'
import { UserContext} from '../reducres/userReducer'


export default function Navbar() {
    const {state, dispatch} = useContext(UserContext)
    const renderList = ()=>{
        if(state){
            return[
            <li key='h'><Link to="/">Home</Link></li>,
            <li key='f'><Link to="/subscribe">Subscribed</Link></li>,
            <li key='p'><Link to="/profile" >profile</Link></li>,
            <li key='l'><Link to="/login" onClick={()=>{
                localStorage.clear();
                dispatch({type:"CLEAR"})
                }}
                className='red'
            >Logout</Link></li>
            ]
        }else{
            return [
                <li key='l'><Link to="/login">LogIn</Link></li>,
                <li key='s'><Link to="/signup">SignUp</Link></li>
            ]
        }
    }
    return (
            <nav className='navBar'>
                <div className="nav-wrapper white">
                <Link to={state?'/':'/login'} className="brand-logo left ">Instagram</Link>
                <ul id="nav-mobile" className="right">
                  {renderList()}
                </ul>
                </div>
            </nav>
    )
}
