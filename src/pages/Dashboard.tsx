
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Calendar, Upload, LogOut, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gospel-gold p-2 rounded-full">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gospel-navy">Dashboard</h1>
                <p className="text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Prayer Request Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer" 
                onClick={() => navigate('/prayer-request')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-3">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gospel-navy">Submit Prayer Request</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Share your prayer needs with our community. We believe in the power of collective prayer.
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Submit Request
              </Button>
            </CardContent>
          </Card>

          {/* Book Band Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/book-band')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gospel-cream p-3 rounded-full w-fit mb-3">
                <Calendar className="h-8 w-8 text-gospel-gold" />
              </div>
              <CardTitle className="text-xl text-gospel-navy">Book Our Band</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Invite us to minister at your event. Let's spread the Gospel through music together.
              </p>
              <Button className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white">
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Submit Media Card */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/submit-media')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-3">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gospel-navy">Submit Media</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Share your photos or videos from our events to be featured in our gallery.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Upload Media
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gospel-navy mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white"
              onClick={() => navigate('/events')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              View Events
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white"
              onClick={() => navigate('/gallery')}
            >
              <Upload className="h-6 w-6 mb-2" />
              Gallery
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white"
              onClick={() => navigate('/services')}
            >
              <Music className="h-6 w-6 mb-2" />
              Our Services
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white"
              onClick={() => navigate('/contact')}
            >
              <Heart className="h-6 w-6 mb-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
