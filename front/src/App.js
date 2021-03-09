import React ,{useEffect,useContext,useReducer } from 'react';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import './App.css'
import Navbar from './component/Navbar'
import Login from './component/screens/Login'
import SignUp from './component/screens/SignUp'
import Home from './component/screens/Home'
import Profile from './component/screens/Profile'
import Userprofile from './component/screens/Userprofile'
import Subscribe from './component/screens/Subscribe'
import {UserContext, initialState, reducer} from './reducres/userReducer'


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter> 
          <Navbar />
          <Routing/>      
      </BrowserRouter>
    </UserContext.Provider>
  );
}
export default App;

function Routing(){
  const history =useHistory();
  const {state, dispatch}  = useContext(UserContext)
  useEffect( ()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('appusertestrouting')
    if(user){
      history.push('/')
      dispatch({type:'USER', payload:user})  // for not be logged out  when browser closed with out log out ..
    }else{
      history.push('/login')
    }
  },[]);
  return(
    <Switch>
          <Route exact path='/'>
            <Home />
          </Route>          
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/signup'>
            <SignUp />
          </Route>
          <Route exact path='/profile'>
            <Profile />
          </Route>
          <Route path='/profile/:userId'>
            <Userprofile />
          </Route>
          <Route path='/subscribe'>
            <Subscribe />
          </Route>
        
    </Switch>
  )
}