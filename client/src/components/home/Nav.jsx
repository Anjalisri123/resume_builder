import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../app/features/authSlice';


const Nav = () => {
    const {user}=useSelector(state=>state.auth)
const dispatch=useDispatch()
    const navigate=useNavigate();
const logoutUser=()=>{
  navigate('/')
dispatch(logout())

}
  return (
    <div className='shadow bg-white'>
        <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5">
<Link to ="/">
<img src="/logo.svg" alt="logo " className='h-11 w-auto'/>
</Link>
<div className='flex items-center gap-4 text-sm'>
    <p className='max-sm:hidden'>Hii,{user?.name}</p>
    <button  onClick={logoutUser}className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</button>
</div>
            </nav>
    </div>
  )
}

export default Nav
