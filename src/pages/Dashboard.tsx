
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import MemberDashboard from './MemberDashboard';

const Dashboard = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-gospel-gold mb-4" />
          <div className="text-xl text-gospel-navy">Loading dashboard...</div>
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
