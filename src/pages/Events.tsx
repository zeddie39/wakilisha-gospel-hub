
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Worship Service',
      date: '2024-06-02',
      time: '10:00 AM',
      location: 'Grace Church, Nairobi',
      description: 'Join us for a powerful Sunday worship service as we lead the congregation in praise and worship.',
      type: 'worship',
      recurring: 'Weekly'
    },
    {
      id: 2,
      title: 'Gospel Concert - City Square',
      date: '2024-06-15',
      time: '6:00 PM',
      location: 'City Square, Nairobi',
      description: 'Free outdoor gospel concert bringing the community together for an evening of worship and fellowship.',
      type: 'concert',
      recurring: null
    },
    {
      id: 3,
      title: 'Youth Conference 2024',
      date: '2024-06-22',
      time: '2:00 PM',
      location: 'KICC, Nairobi',
      description: 'Annual youth conference where we will lead worship and minister to young people across the city.',
      type: 'conference',
      recurring: null
    },
    {
      id: 4,
      title: 'Community Outreach - Kibera',
      date: '2024-06-29',
      time: '3:00 PM',
      location: 'Kibera Community Center',
      description: 'Evangelistic outreach in Kibera slums, sharing the Gospel through music and ministry.',
      type: 'outreach',
      recurring: 'Monthly'
    }
  ];

  const pastEvents = [
    {
      title: 'Easter Celebration Concert',
      date: '2024-03-31',
      location: 'Uhuru Park',
      attendees: '500+'
    },
    {
      title: 'Christmas Carols Tour',
      date: '2023-12-25',
      location: 'Various Churches',
      attendees: '1000+'
    },
    {
      title: 'Gospel Music Festival',
      date: '2023-11-18',
      location: 'Kasarani Stadium',
      attendees: '2000+'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'worship': return 'bg-blue-500';
      case 'concert': return 'bg-purple-500';
      case 'conference': return 'bg-green-500';
      case 'outreach': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
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
            Events
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in">
            Join us for worship, concerts, and community outreach events. 
            Experience the power of Gospel music in fellowship with believers.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Don't miss these opportunities to worship with us!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${getEventTypeColor(event.type)} px-3 py-1 rounded-full text-white text-sm font-medium capitalize`}>
                      {event.type}
                    </div>
                    {event.recurring && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {event.recurring}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-gospel-navy">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-gospel-gold" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-3 text-gospel-gold" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-gospel-gold" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gospel-gold hover:bg-gospel-light-gold text-white">
                      <Users className="mr-2 h-4 w-4" />
                      RSVP
                    </Button>
                    <Button variant="outline" className="border-gospel-gold text-gospel-gold hover:bg-gospel-gold hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Past Events</h2>
            <p className="text-xl text-gray-600">Celebrating God's faithfulness in our ministry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <Card key={event.title} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gospel-navy mb-2">{event.title}</h3>
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-2 text-gospel-gold" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 mr-2 text-gospel-gold" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-2 text-gospel-gold" />
                      <span className="text-sm">{event.attendees} attendees</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Calendar Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gospel-navy mb-6">Full Event Calendar</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stay updated with all our events and never miss a worship opportunity.
          </p>
          <div className="bg-gray-100 rounded-lg p-12">
            <Calendar className="h-24 w-24 text-gospel-gold mx-auto mb-6" />
            <p className="text-gray-600 mb-6">
              Our full interactive calendar will be available soon. For now, follow our social media 
              or contact us directly for the most up-to-date event information.
            </p>
            <Button className="bg-gospel-gold hover:bg-gospel-light-gold text-white">
              Contact for Events
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Want Us at Your Event?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Invite Wakilisha Gospel Band to lead worship at your church, conference, or special event.
          </p>
          <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
            Book Us for Your Event
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Events;
