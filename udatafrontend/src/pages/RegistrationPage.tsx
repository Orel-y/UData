import {useState } from 'react'
import { Link } from 'react-router-dom';

export default function RegistrationPage() {
    const [formData,setFormData] = useState({
        name: "",
        email: "",
        password: ""    
    });
   
    const handleSubmit = ()=>{
        if(formData.email=="" || formData.name=="" || formData.password==""){
            alert("Please fill all credentials first");
            return;
        }
        alert(JSON.stringify(formData));
    }
  return (
    <div className='block item-center justify-center max-w-md  mx-auto'>
        <h3 className='text-center'>Register to Udata</h3>
        <form onSubmit={handleSubmit}>
            <div className="block m-4">
                <label htmlFor='email'>Full Name</label>
                <input 
                    type='text'
                    onChange={(e)=>setFormData({...formData,name:e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="m-4">
                <label htmlFor='email'>Email</label>
                <input 
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
            <div className='m-4'>
                <button
                    type='submit'
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >Sign UP</button>
            </div>
            <div className="m-4">
                <p className='text-center'>Already have account? <Link to="/">Login</Link></p>
            </div>
        </form>
     </div>
  )
}
