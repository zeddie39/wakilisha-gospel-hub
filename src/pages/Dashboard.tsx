
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Calendar, MessageSquare, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaUpload from '@/components/MediaUpload';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-gospel-navy to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-xl text-gray-200">
            Hello {user?.user_metadata?.full_name || user?.email}! 
            Manage your ministry activities and stay connected with our community.
          </p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Quick Actions */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gospel-navy mb-6">Quick Actions</h2>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-gospel-navy">
                    <Calendar className="mr-3 h-6 w-6 text-gospel-gold" />
                    Event Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    View upcoming events and manage your RSVPs.
                  </p>
                  <div className="space-y-3">
                    <Link to="/events">
                      <Button className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white">
                        View Events & RSVP
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-gospel-navy">
                    <BookOpen className="mr-3 h-6 w-6 text-gospel-gold" />
                    Ministry Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Book our band for your events and special occasions.
                  </p>
                  <Link to="/book-band">
                    <Button className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white">
                      Book Our Band
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center text-gospel-navy">
                    <MessageSquare className="mr-3 h-6 w-6 text-gospel-gold" />
                    Prayer & Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Submit prayer requests and connect with our ministry.
                  </p>
                  <Link to="/prayer-request">
                    <Button className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white">
                      Submit Prayer Request
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Media Upload Section */}
            <div>
              <h2 className="text-3xl font-bold text-gospel-navy mb-6">Share Your Media</h2>
              <MediaUpload />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
