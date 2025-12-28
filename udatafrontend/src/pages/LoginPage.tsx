import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';


export default function LoginPage() {
    const {login} = useAuth();

    const [error,setError] = useState(0); //here if username is empty error=1, if password is empty error=2 and if both error=3
    const [formData,setFormData] = useState({
        username: "",
        password: ""    
    });
    const [showMsg,setShowMsg] = useState(false);
    const [msg,setMsg] = useState("All fields are required")
   
    const handleSubmit = async(e:FormEvent)=>{
        setShowMsg(false);
        e.preventDefault();
        if(formData.username=="" && formData.password==""){
            setError(3);
            setShowMsg(true);
            return;
        }
        if(formData.username==""){
            setError(1);
            setShowMsg(true);
            return;
        }
        if(formData.password==""){
            setError(2);
            setShowMsg(true);
            return;
        }
        const success = await login(formData);
        if(success){
            setError(0);
            setMsg("Loging in...");
            setShowMsg(true);
            return
        }else{
            setError(5);
            setMsg("Error occured while logging in..please try again")
            setShowMsg(true);
        }
    }
  return (
    <div className='block item-center justify-center max-w-md  mx-auto login'>
        <h3 className='text-center '>Welcome back</h3>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="m-4">
                <label 
                    htmlFor='uusername'
                    className='mb-2'>Username</label>
                <input 
                    id='uusername'
                    type='text'
                    onChange={(e)=>setFormData({...formData,username:e.target.value})}
                    className={(error==1 || error==3 ? 
                            "w-full px-3 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500")}
                        required />
            </div>
            <div className="m-4">
                <label htmlFor='email'>Password</label>
                <input type='password' 
                    onChange={(e)=>setFormData({...formData,password:e.target.value})}
                    className={(error==2 || error==3 ? 
                            "w-full px-3 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            : "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500")}
                        required/>
            </div>
            <div className="m-4">
                <button
                    type='submit'
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >Login</button>
            </div>
            {showMsg && 
                <div className= {error==0? "text-green":"text-red"}>
                    {msg}
                </div>}
            <div>
                {/* <p className='text-center'>Don't have account? <Link to="/register">Sign up</Link></p> */}
                {/* <p className='text-right'><Link to="/">Forgot Password?</Link></p> */}
            </div>
        </form>
     </div>
  )
}
