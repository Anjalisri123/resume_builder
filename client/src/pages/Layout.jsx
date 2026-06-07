import React from 'react'
import Nav from '../components/home/Nav';
import {Outlet} from "react-router-dom";
import Loader from '../components/home/Loader';
import Login from './Login';
import {useSelector} from 'react-redux'
const Layout = () => {

const {user,loading }=useSelector(state=> state.auth)
if(loading){
  return <Loader/>
}

  return (
    <div>
      {
        user ?(
           <div className='min-h-screen bg-gray-50'>
        <Nav/>
        <Outlet/>
      </div>
   ):<Login/>
      }
      </div>
  )
}

export default Layout
