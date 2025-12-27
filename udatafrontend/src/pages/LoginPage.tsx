import React, { ChangeEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';

export default function LoginPage() {
    const [formData,setFormData] = useState({
        email: "",
        password: ""    
    });
   
    const handleSubmit = ()=>{
        if(formData.email=="" || formData.password==""){
            alert("Please fill all credentials first");
            return;
        }
        alert(JSON.stringify(formData));
    }
  return (
    <div className='block item-center justify-center max-w-md  mx-auto'>
        <h3 className='text-center '>Welcome back</h3>
        <form onSubmit={handleSubmit}>
            <div className="m-4">
                <label 
                    htmlFor='email'
                    className='mb-2'>Email</label>
                <input 
                    id='email'
                    type='email'
                    onChange={(e)=>setFormData({...formData,email:e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="m-4">
                <label htmlFor='email'>Password</label>
                <input type='password' 
                    onChange={(e)=>setFormData({...formData,password:e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="m-4">
                <button
                    type='submit'
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >Login</button>
            </div>
            <div>
                <p className='text-center'>Don't have account? <Link to="/register">Sign up</Link></p>
            </div>
        </form>
     </div>
  )
}
