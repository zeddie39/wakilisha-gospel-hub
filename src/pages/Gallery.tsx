
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Image, Calendar, Users } from 'lucide-react';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const mediaItems = [
    {
      id: 1,
      type: 'image',
      category: 'worship',
      title: 'Sunday Worship Service',
      date: '2024-05-15',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Leading worship at Grace Church'
    },
    {
      id: 2,
      type: 'image',
      category: 'concert',
      title: 'City Square Concert',
      date: '2024-04-20',
      thumbnail: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Community gospel concert under the stars'
    },
    {
      id: 3,
      type: 'video',
      category: 'worship',
      title: 'Praise & Worship Medley',
      date: '2024-05-01',
      thumbnail: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Beautiful worship medley from our latest service'
    },
    {
      id: 4,
      type: 'image',
      category: 'outreach',
      title: 'Kibera Outreach',
      date: '2024-04-10',
      thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Spreading hope through music in Kibera'
    },
    {
      id: 5,
      type: 'video',
      category: 'concert',
      title: 'Easter Celebration Highlights',
      date: '2024-03-31',
      thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Highlights from our Easter celebration concert'
    },
    {
      id: 6,
      type: 'image',
      category: 'band',
      title: 'Band Practice Session',
      date: '2024-05-08',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Our dedicated members during practice'
    }
  ];

  const filters = [
    { key: 'all', label: 'All Media', icon: Image },
    { key: 'worship', label: 'Worship', icon: Users },
    { key: 'concert', label: 'Concerts', icon: Play },
    { key: 'outreach', label: 'Outreach', icon: Calendar },
    { key: 'band', label: 'Band Life', icon: Users }
  ];

  const filteredItems = activeFilter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === activeFilter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <Card 
                key={item.id} 
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in overflow-hidden group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Video Overlay */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 p-3 rounded-full">
                        <Play className="h-8 w-8 text-gospel-navy" />
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'video' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {item.type === 'video' ? 'Video' : 'Photo'}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gospel-gold text-white capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gospel-navy mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3"
            >
              Load More Media
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">200+</div>
              <div className="text-gray-600 font-medium">Photos Captured</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">50+</div>
              <div className="text-gray-600 font-medium">Video Recordings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">25+</div>
              <div className="text-gray-600 font-medium">Events Documented</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">5+</div>
              <div className="text-gray-600 font-medium">Years of Memories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Submit Media CTA */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Share Your Moments</h2>
          <p className="text-xl text-gray-200 mb-8">
            Have photos or videos from our events? We'd love to feature them in our gallery!
          </p>
          <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
            <Image className="mr-2 h-5 w-5" />
            Submit Media
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
