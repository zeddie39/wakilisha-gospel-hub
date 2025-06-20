
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Image, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch approved media using Supabase client
  useEffect(() => {
    const fetchApprovedMedia = async () => {
      try {
        const { data, error } = await supabase
          .from('media_submissions')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        setMediaItems(data || []);
      } catch (error) {
        console.error('Error fetching media:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gallery media',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedMedia();
  }, [toast]);

  const filters = [
    { key: 'all', label: 'All Media', icon: Image },
    { key: 'image', label: 'Images', icon: Image },
    { key: 'video', label: 'Videos', icon: Play },
    { key: 'audio', label: 'Audio', icon: Users }
  ];

  const filteredItems = activeFilter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.file_type === activeFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gospel-navy">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gospel-navy to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Media Gallery
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in">
            Experience our worship moments, community outreach, and the joy of 
            spreading the Gospel through these photos and videos.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                variant={activeFilter === filter.key ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  activeFilter === filter.key 
                    ? 'bg-gospel-gold hover:bg-gospel-light-gold text-white' 
                    : 'border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white'
                }`}
              >
                <filter.icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No media found</h3>
              <p className="text-gray-500">Check back later for new uploads!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in overflow-hidden group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    {item.file_type === 'video' && item.file_url.includes('youtube') ? (
                      <iframe
                        src={item.file_url.replace('watch?v=', 'embed/')}
                        className="w-full h-64"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : item.file_type === 'image' ? (
                      <img 
                        src={item.file_url} 
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <Play className="h-16 w-16 text-gray-400" />
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.file_type === 'video' 
                          ? 'bg-red-500 text-white' 
                          : item.file_type === 'image'
                          ? 'bg-blue-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {item.file_type}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gospel-navy mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Media CTA */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Share Your Moments</h2>
          <p className="text-xl text-gray-200 mb-8">
            Have photos or videos from our events? We'd love to feature them in our gallery!
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
                <Image className="mr-2 h-5 w-5" />
                Submit Media
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
                <Image className="mr-2 h-5 w-5" />
                Join to Submit Media
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
