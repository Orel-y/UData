import React from 'react';
import { useAuth } from '../auth/useAuth';

export default function ProfilePanel() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="w-64 p-4 bg-white/80 rounded shadow">
      {currentUser ? (
        <div className="flex flex-col items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            style={{ width: 130, height: 90, objectFit: 'cover' }}
            className="rounded-sm"
          />
          <div className="font-semibold mt-1">{currentUser.username}</div>
          <button
            onClick={() => logout()}
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Log out
          </button>
          <div className="text-sm text-gray-600 mt-2">You have access to {currentUser.permittedCampusIds.length} campuses</div>
        </div>
      ) : (
        <div className="text-center">
          <div className="font-semibold">Not logged in</div>
          <div className="text-sm text-gray-600">Please log in to see your campuses</div>
        </div>
      )}
    </div>
  );
}
