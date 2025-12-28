import { Menu, X } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useState } from 'react';
import profile from '../assets/image.png'

export default function ProfilePanel() {
  const { currentUser, logout } = useAuth();
  const [showProfile,setShowProfile] = useState(
    (window.innerWidth<840 ? false : true)
  );

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 p-6 profile">
      {currentUser ? (
        (showProfile ? <>
        <div className="flex flex-col items-center gap-3">
          <img
            src={profile}
            alt={currentUser.username}
            style={{ width: 130, height: 90, objectFit: 'cover' }}
            className="rounded-sm"
          />
          <div className="font-semibold mt-1">{currentUser.username}</div>
          <div className="flex flex-col gap-2 mt-3 w-full">
            {currentUser.role=="ADMIN" && (
              <a href="/admin" className="text-sm text-blue-600 hover:underline">Admin panel</a>
            )}
            <button
              onClick={() => logout()}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Log out
            </button>
            <div className="closeProfile">
                <X 
                size={23} 
                onClick={()=>setShowProfile(false)}/>
            </div>
          </div>
        </div>
        
        </> : 
        <div className="showProfile">
            <Menu
             size={34}
             onClick={()=>setShowProfile(true)}/>
        </div>)
      ) : (
        <div className="text-center">
          <div className="font-semibold">Not logged in</div>
          <div className="text-sm text-gray-600">Please log in to see your campuses</div>
        </div>
      )}
    </div>
  );
}
