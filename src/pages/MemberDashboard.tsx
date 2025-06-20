
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, MessageSquare, Eye, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import MemberMessages from '@/components/MemberMessages';

interface MediaSubmission {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  status: string;
  created_at: string;
  rejection_reason?: string;
}

const MemberDashboard = () => {
  const [mySubmissions, setMySubmissions] = useState<MediaSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMySubmissions();
    }
  }, [user]);

  const fetchMySubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('media_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMySubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load your submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
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

  const pendingCount = mySubmissions.filter(s => s.status === 'pending').length;
  const approvedCount = mySubmissions.filter(s => s.status === 'approved').length;
  const rejectedCount = mySubmissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gospel-navy mb-2">Member Dashboard</h1>
          <p className="text-gray-600">Manage your media submissions and messages</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gospel-navy">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gospel-navy">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gospel-navy">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submit">Submit Media</TabsTrigger>
            <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Submit Media Tab */}
          <TabsContent value="submit">
            <MediaUpload />
          </TabsContent>

          {/* My Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>My Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gospel-gold"></div>
                  </div>
                ) : mySubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No submissions yet. Start by uploading your first media!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mySubmissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gospel-navy">
                                {submission.title}
                              </h3>
                              <Badge className={`${getStatusColor(submission.status)} text-white flex items-center space-x-1`}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-1">{submission.status}</span>
                              </Badge>
                              <Badge variant="outline">
                                {submission.file_type}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{submission.description}</p>
                            
                            {submission.status === 'rejected' && submission.rejection_reason && (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                <p className="text-red-800 text-sm">
                                  <strong>Rejection Reason:</strong> {submission.rejection_reason}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <MemberMessages />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberDashboard;
