import React from 'react';
import { Outlet } from 'react-router-dom';
import ProfilePanel from './ProfilePanel';

export default function DashboardLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex gap-6">
        <ProfilePanel />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
