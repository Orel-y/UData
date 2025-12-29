import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../api/api';
import { AxiosError } from 'axios';
import { saveToken } from '../auth/authStore';


export default function LoginPage() {
    
    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        username: "",
        password: ""    
    });
    const [isloading,setIsLoading] = useState(false);
    const [error,setError] = useState(0);
    const [msg,setMsg] = useState("All fields are required");
    const [showMsg,setShowMsg] = useState(false);
   
    const handleSubmit = async(e:FormEvent)=>{
        setIsLoading(true);
        setShowMsg(false);
        setError(0);
        e.preventDefault();
        if(formData.username=="" || formData.password==""){
            setError(1);
            setMsg("All fields are required")
            setShowMsg(true);
            setIsLoading(false);
            return;
        }
        try {
            const response = await authenticate(formData); 
            const token = response.data.access_token;
            saveToken(token);
            setError(0);
            setMsg("Redirecting...")
            navigate('/campuses');
        } catch (error) {
            const er =  error as AxiosError
            setMsg(er.response?.data?.detail)
            setError(1);
        }finally{
            setShowMsg(true);
            setIsLoading(false)
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required />
            </div>
            <div className="m-4">
                <label htmlFor='email'>Password</label>
                <input type='password' 
                    onChange={(e)=>setFormData({...formData,password:e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required/>
            </div>
            <div className="m-4">
                <button
                    type='submit'
                    className={isloading==true?"w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                : "w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"}
                    disabled={isloading==true}
                    >{isloading?"LOADING..":"Login"}</button>
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
