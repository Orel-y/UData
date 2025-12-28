import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { getUsers, addUser, MockUser } from '../auth/userStore';
import { useData } from '../context/DataContext';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const { buildings, campuses } = useData() as any;

  const [users, setUsers] = useState<MockUser[]>([]);
  const [selected, setSelected] = useState<MockUser | null>(null);
  const [form, setForm] = useState({ email: '', username: '', isAdmin: false });

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  if (!currentUser?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-xl font-semibold">Unauthorized</h2>
        <p className="text-gray-600 mt-2">You must be an administrator to see this page.</p>
      </div>
    );
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const u = addUser({ email: form.email, username: form.username, isAdmin: form.isAdmin, permittedCampusIds: [] });
    setUsers(prev => [...prev, u]);
    setForm({ email: '', username: '', isAdmin: false });
  };

  const buildingsForUser = (userId: number) => {
    return (buildings || []).filter((b:any) => b.createdBy === userId);
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg p-4 shadow">
          <h2 className="font-semibold mb-3">Users</h2>
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
          </ul>

          <form onSubmit={handleAddUser} className="mt-4 space-y-3">
            <input className="w-full px-3 py-2 border rounded my-2" placeholder="email" value={form.email} onChange={e => setForm(s => ({...s, email: e.target.value}))} required />
            <input className="w-full px-3 py-2 border rounded my-2" placeholder="username" value={form.username} onChange={e => setForm(s => ({...s, username: e.target.value}))} required />
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isAdmin} onChange={e => setForm(s => ({...s, isAdmin: e.target.checked}))} /> Make admin</label>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded">Add user</button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow">
          {selected ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
