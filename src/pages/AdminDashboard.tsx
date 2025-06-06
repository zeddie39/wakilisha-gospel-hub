import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, Trash2, Check, X, Calendar, User, Users, Shield, Plus, Loader2 } from 'lucide-react';
import AdminMediaForm from '@/components/AdminMediaForm';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate } from 'react-router-dom';

interface MediaSubmission {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
  phone_number: string;
}

const PAGE_SIZE = 5;

const AdminDashboard = () => {
  const [mediaSubmissions, setMediaSubmissions] = useState<MediaSubmission[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaPage, setMediaPage] = useState(0);
  const [userPage, setUserPage] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isAdmin, loading: adminLoading } = useAdmin();

  // Fetch media counts separately for stats dashboard
  const fetchMediaCounts = useCallback(async () => {
    try {
      // Get pending count
      const { count: pendingResult, error: pendingError } = await supabase
        .from('media_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) throw pendingError;
      setPendingCount(pendingResult || 0);

      // Get approved count
      const { count: approvedResult, error: approvedError } = await supabase
        .from('media_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      if (approvedError) throw approvedError;
      setApprovedCount(approvedResult || 0);

      // Get rejected count
      const { count: rejectedResult, error: rejectedError } = await supabase
        .from('media_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      if (rejectedError) throw rejectedError;
      setRejectedCount(rejectedResult || 0);

      // Get total count
      const { count: totalResult, error: totalError } = await supabase
        .from('media_submissions')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;
      setMediaCount(totalResult || 0);
    } catch (error) {
      console.error('Error fetching media counts:', error);
    }
  }, []);

  // Fetch users count separately
  const fetchUserCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setUserCount(count || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }, []);

  // Improved paginated media submissions fetch
  const fetchMediaSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(mediaPage * PAGE_SIZE, (mediaPage * PAGE_SIZE) + PAGE_SIZE - 1);

      if (error) throw error;
      setMediaSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching media submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch media submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [mediaPage, toast]);

  // Improved paginated user profiles fetch
  const fetchUserProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .range(userPage * PAGE_SIZE, (userPage * PAGE_SIZE) + PAGE_SIZE - 1);

      if (error) throw error;
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive"
      });
    }
  }, [userPage, toast]);

  // Initial data loading with separate counters
  useEffect(() => {
    // Fetch counts first (lightweight)
    fetchMediaCounts();
    fetchUserCount();
    
    // Then fetch the actual data for display
    fetchMediaSubmissions();
    fetchUserProfiles();
  }, [fetchMediaCounts, fetchUserCount, fetchMediaSubmissions, fetchUserProfiles]);

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('media_submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMediaSubmissions(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );

      // Update counts based on status change
      if (status === 'approved') {
        setPendingCount(prev => prev - 1);
        setApprovedCount(prev => prev + 1);
      } else if (status === 'rejected') {
        setPendingCount(prev => prev - 1);
        setRejectedCount(prev => prev + 1);
      }

      toast({
        title: "Success",
        description: `Media submission ${status}`,
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive"
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUserProfiles(prev => 
        prev.map(profile => 
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      );

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const { error } = await supabase
        .from('media_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMediaSubmissions(prev => prev.filter(item => item.id !== id));

      toast({
        title: "Success",
        description: "Media submission deleted",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  // Redirect non-admin users
  if (!adminLoading && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-gospel-gold mb-4" />
          <div className="text-xl text-gospel-navy">Verifying admin access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gospel-navy mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage media, users, and community content</p>
        </div>

        {/* Stats Cards - Now using cached counts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gospel-navy">
                    {pendingCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gospel-navy">
                    {approvedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gospel-navy">
                    {rejectedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gospel-navy">
                    {userCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="media" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="media">Media Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="add-media">Add Media</TabsTrigger>
          </TabsList>

          {/* Media Management Tab */}
          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gospel-gold" />
                  </div>
                ) : mediaSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No media submissions found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {mediaSubmissions.map((submission) => (
                        <div key={submission.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gospel-navy">
                                  {submission.title}
                                </h3>
                                <Badge className={`${getStatusColor(submission.status)} text-white`}>
                                  {submission.status}
                                </Badge>
                                <Badge variant="outline">
                                  {submission.file_type}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-3">{submission.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  <span>User ID: {submission.user_id.slice(0, 8)}...</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{formatDate(submission.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(submission.file_url, '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>

                              {submission.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => deleteSubmission(submission.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setMediaPage(p => Math.max(0, p - 1))}
                        disabled={mediaPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {mediaPage + 1} of {Math.ceil(mediaCount / PAGE_SIZE) || 1}
                      </span>
                      <Button 
                        variant="outline"
                        onClick={() => setMediaPage(p => p + 1)}
                        disabled={(mediaPage + 1) * PAGE_SIZE >= mediaCount}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {userProfiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {userProfiles.map((profile) => (
                        <div key={profile.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gospel-navy">
                                  {profile.full_name || 'Unknown User'}
                                </h3>
                                <Badge className={`${profile.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'} text-white`}>
                                  {profile.role}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  <span>ID: {profile.id.slice(0, 8)}...</span>
                                </div>
                                {profile.phone_number && (
                                  <div className="flex items-center">
                                    <span>Phone: {profile.phone_number}</span>
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>Joined: {formatDate(profile.created_at)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {profile.role !== 'admin' && (
                                <Button
                                  size="sm"
                                  className="bg-purple-500 hover:bg-purple-600 text-white"
                                  onClick={() => updateUserRole(profile.id, 'admin')}
                                >
                                  <Shield className="h-4 w-4 mr-1" />
                                  Make Admin
                                </Button>
                              )}
                              {profile.role === 'admin' && profile.id !== user?.id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
                                  onClick={() => updateUserRole(profile.id, 'user')}
                                >
                                  Remove Admin
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* User Pagination Controls */}
                    <div className="flex justify-between items-center mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setUserPage(p => Math.max(0, p - 1))}
                        disabled={userPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {userPage + 1} of {Math.ceil(userCount / PAGE_SIZE) || 1}
                      </span>
                      <Button 
                        variant="outline"
                        onClick={() => setUserPage(p => p + 1)}
                        disabled={(userPage + 1) * PAGE_SIZE >= userCount}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Media Tab */}
          <TabsContent value="add-media">
            <AdminMediaForm onMediaAdded={() => {
              fetchMediaSubmissions();
              fetchMediaCounts();
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
