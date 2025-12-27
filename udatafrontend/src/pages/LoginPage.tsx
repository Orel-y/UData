import { FormEvent, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';


export default function LoginPage() {
    const {login} = useAuth();

    const [error,setError] = useState(0); //here if email is empty error=1, if password is empty error=2 and if both error=3
    const [formData,setFormData] = useState({
        email: "",
        password: ""    
    });
   
    const handleSubmit = (e:FormEvent)=>{
        e.preventDefault();
        if(formData.email=="" && formData.password==""){
            setError(3);
            return;
        }
        if(formData.email==""){
            setError(1);
            return;
        }
        if(formData.password==""){
            setError(2);
            return;
        }
        setError(0);
        login(formData);
    }
  return (
    <div className='block item-center justify-center max-w-md  mx-auto login'>
        <h3 className='text-center '>Welcome back</h3>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="m-4">
                <label 
                    htmlFor='email'
                    className='mb-2'>Email</label>
                <input 
                    id='email'
                    type='email'
                    onChange={(e)=>setFormData({...formData,email:e.target.value})}
                    className={(error==1 || error==3 ? 
                            "w-full px-3 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500")} 
                    placeholder='youremail@gmail.com'
                    required/>
            </div>
            <div className="m-4">
                <label htmlFor='email'>Password</label>
                <input type='password' 
                    onChange={(e)=>setFormData({...formData,password:e.target.value})}
                    className={(error==2 || error==3 ? 
                            "w-full px-3 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500")} 
                    placeholder='....'
                    required
                    />
            </div>
            <div className="m-4">
                <button
                    type='submit'
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >Login</button>
            </div>
            <div>
                {/* <p className='text-center'>Don't have account? <Link to="/register">Sign up</Link></p> */}
                <p className='text-right'><Link to="/">Forgot Password?</Link></p>
            </div>
        </form>
     </div>
  )
}
