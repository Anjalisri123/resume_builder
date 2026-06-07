import React, { use, useEffect } from 'react'
import {Route,Routes} from "react-router-dom";
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import Login from './pages/Login';
import Loader from './components/home/Loader';
import Preview from './pages/Preview';
import Resumebuilder from './pages/Resumebuilder';
import Resumepreview from './pages/Resumepreview';
import { useDispatch } from 'react-redux';
import { login,setLoading } from './app/features/authSlice';

import { Toaster} from 'react-hot-toast';
import api from './configs/api';
const App = () => {
const dispatch =useDispatch()
const getUserData=async()=>{
const token =localStorage.getItem('token')
try{
if(token){
  const {data}=await api.get('/api/users/data',{
    headers:{
      Authorization:token
    }
  })
  if(data.user){
  dispatch(login({token,user:data.user}))
  }
dispatch(setLoading(false))
}else{
  dispatch(setLoading(false))
}
}catch(error){
dispatch(setLoading(false))
console.log(error.message)
}}


useEffect(()=>{
getUserData()
},[])

  return (
    <>
     <Toaster/>
      <Routes>
       
        <Route path='/' element={<Home />} />
        <Route path='/app' element={<Layout/>} >
        <Route index element={<Dashboard />} />
        <Route path='builder/:resumeId' element={<Resumebuilder/>} />
        </Route>
        <Route path='view/:resumeId' element={<Resumepreview/>} />
          
</Routes>
     
      
    </>
  )
}
export default App

