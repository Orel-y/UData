import {  useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useData } from '../context/DataContext';
import { registerUser } from '../api/api';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { buildings } = useData() as any;
  const [msg,setMsg] = useState("");

  // const [users, setUsers] = useState<AuthUser[]>([]);
  // const [selected, setSelected] = useState<AuthUser | null>(null);
  const [form, setForm] = useState({
        full_name: "",
        email: "",
        username:"",
        password: "",
        role:"ADMIN"   
    });

  //  const getUsers = ()=>{
  //   }

  // useEffect(() => {
  //   setUsers(getUsers());
  // }, []);
  const isAdmin = currentUser?.role=="ADMIN";
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p className="text-gray-600 mt-2">You must be an administrator to see this page.</p>
      </div>
    );
  }

  const handleAddUser = async(e: React.FormEvent) => {
    setMsg("");
    console.log(form)
    e.preventDefault();
    const u = await registerUser(form);
    if(u){
      setMsg("User Added Successfully");
    }else{
      setMsg("Error adding user");
    }
    // setUsers(prev => [...prev, u]);
    setForm({ full_name: "", email: '', password:"", username: '', role: "VIEWER" });
  };

  // const buildingsForUser = (userId: number) => {
  //   return (buildings || []).filter((b:any) => b.createdBy === userId);
  // };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg p-4 shadow">
          {/* <h2 className="font-semibold mb-3">Users</h2>
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id}>
                <button className={`w-full text-left px-3 py-2 rounded ${selected?.id === u.id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(u)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{u.username}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                    {u.isAdmin && <div className="text-xs text-white bg-blue-600 p-2 py-1 rounded-4">Admin</div>}
                  </div>
                </button>
              </li>
            ))}
          </ul> */}
            {msg&&<div className='text-center text-gray-600'>{msg}</div>}
          <form onSubmit={handleAddUser} className="mt-4 space-y-3">
            <input className="w-full px-3 py-2 border rounded my-2" placeholder="Full name" value={form.full_name} onChange={e => setForm(s => ({...s, full_name: e.target.value}))} required />
            <input className="w-full px-3 py-2 border rounded my-2" placeholder="email" type='email' value={form.email} onChange={e => setForm(s => ({...s, email: e.target.value}))} required />
            <input className="w-full px-3 py-2 border rounded my-2" placeholder="username" value={form.username} onChange={e => setForm(s => ({...s, username: e.target.value}))} required />
            <input className="w-full px-3 py-2 border rounded my-2" placeholder="password" value={form.password} onChange={e => setForm(s => ({...s, password: e.target.value}))} required />
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.role=="ADMIN"} onChange={e => setForm(s => (e.target.checked ? {...s, role:"ADMIN"}: {...s, role:"VIEWER"}))} /> Make admin</label>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded" type='submit'>Add user</button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow">
          {/* {selected ? (
            <div>
              <h3 className="text-lg font-semibold">{selected.username}'s buildings</h3>
              <p className="text-sm text-gray-500 mb-4">Showing buildings this user created (if any)</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {buildingsForUser(selected.id).length === 0 ? (
                  <div className="text-gray-500">No buildings created by this user.</div>
                ) : (
                  buildingsForUser(selected.id).map((b:any) => (
                    <div key={b.id} className="border rounded p-3">
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-sm text-gray-600">Campus: {campuses.find((c:any) => c.id === b.campusId)?.name ?? '—'}</div>
                      <div className="text-sm text-gray-600">Floors: {b.floors}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Select a user to view their created buildings.</div>
          )} */}
        </div>
      </div>
    </div>
  );
}
