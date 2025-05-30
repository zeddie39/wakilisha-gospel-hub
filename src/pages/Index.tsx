
import React from 'react';
import Hero from '../components/Hero';
import MissionSection from '../components/MissionSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Music, Users } from 'lucide-react';

const Index = () => {
  const upcomingEvents = [
    {
      title: 'Sunday Worship Service',
      date: 'June 2, 2024',
      location: 'Grace Church, Nairobi',
      time: '10:00 AM'
    },
    {
      title: 'Gospel Concert - City Square',
      date: 'June 15, 2024',
      location: 'City Square, Nairobi',
      time: '6:00 PM'
    },
    {
      title: 'Youth Conference 2024',
      date: 'June 22, 2024',
      location: 'KICC, Nairobi',
      time: '2:00 PM'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Mission Section */}
      <MissionSection />

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gospel-navy mb-6">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join us for worship, fellowship, and community outreach. 
              Experience the power of Gospel music in person.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event, index) => (
              <Card 
                key={event.title}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="bg-gospel-gold p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gospel-navy mb-2">{event.title}</h3>
                  <div className="space-y-1 text-gray-600 text-sm mb-4">
                    <p>{event.date} at {event.time}</p>
                    <p>{event.location}</p>
                  </div>
                  <Button variant="outline" className="w-full border-gospel-gold text-gospel-gold hover:bg-gospel-gold hover:text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg"
            >
              View All Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gospel-navy mb-6">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From worship leading to community outreach, we serve with excellence 
              and passion in everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Music,
                title: 'Worship Leading',
                description: 'Professional worship music for churches, conferences, and special events.',
                color: 'bg-blue-500'
              },
              {
                icon: Users,
                title: 'Community Outreach',
                description: 'Reaching communities with the Gospel through music and ministry.',
                color: 'bg-green-500'
              },
              {
                icon: Users,
                title: 'Youth Mentorship',
                description: 'Mentoring young musicians and believers in faith and music.',
                color: 'bg-purple-500'
              }
            ].map((service, index) => (
              <Card 
                key={service.title}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`${service.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gospel-navy mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                  <Button variant="outline" className="border-gospel-gold text-gospel-gold hover:bg-gospel-gold hover:text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Ministry
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Whether you're looking to book us for an event, want to join our band, 
            or simply want to be part of our community - we'd love to connect with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg"
            >
              Contact Us Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-gospel-navy px-8 py-3 text-lg"
            >
              Learn Our Story
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
