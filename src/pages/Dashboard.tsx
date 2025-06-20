
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import MemberDashboard from './MemberDashboard';

const Dashboard = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gospel-gold" />
          <div className="text-lg text-gospel-navy">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Redirect admins to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Show member dashboard for regular users
  return <MemberDashboard />;
};

export default Dashboard;
