
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Users, Heart, MapPin, Clock, Star } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Music,
      title: 'Live Worship Performances',
      description: 'Professional worship leading for church services, conferences, and special events.',
      features: ['Full band setup', 'Sound system included', 'Repertoire of 100+ songs', '2-4 hour performances'],
      color: 'bg-blue-500'
    },
    {
      icon: Heart,
      title: 'Wedding & Special Events',
      description: 'Beautiful worship music for weddings, anniversaries, and other special celebrations.',
      features: ['Customized song selection', 'Ceremony & reception music', 'Professional presentation', 'Flexible packages'],
      color: 'bg-pink-500'
    },
    {
      icon: Users,
      title: 'Community Outreach',
      description: 'Evangelistic music ministry reaching communities with the Gospel message.',
      features: ['Street evangelism', 'Hospital visits', 'Prison ministry', 'Community gatherings'],
      color: 'bg-green-500'
    },
    {
      icon: Star,
      title: 'Youth Mentorship',
      description: 'Mentoring young musicians and believers in both music and spiritual growth.',
      features: ['Music lessons', 'Spiritual mentorship', 'Performance opportunities', 'Character development'],
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gospel-navy to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Our Services
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in">
            Bringing the Gospel through music to every corner of our community. 
            Discover how we can serve your church, event, or ministry.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={service.title} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className={`${service.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gospel-navy">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gospel-gold rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white">
                    Book This Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">How We Work</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple process ensures your event is memorable and glorifies God.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Contact Us', description: 'Reach out with your event details and requirements' },
              { step: '02', title: 'Consultation', description: 'We discuss your vision and customize our service' },
              { step: '03', title: 'Preparation', description: 'We prepare songs and coordinate all logistics' },
              { step: '04', title: 'Performance', description: 'We deliver an anointed worship experience' }
            ].map((item, index) => (
              <div key={item.step} className="text-center animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="bg-gospel-gold text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gospel-navy mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">What People Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Pastor John Mwangi',
                role: 'Senior Pastor, Grace Church',
                text: 'Wakilisha Gospel Band brought such anointing to our church anniversary. The congregation was moved to tears and worship.'
              },
              {
                name: 'Mary Wanjiku',
                role: 'Event Coordinator',
                text: 'They made our wedding ceremony absolutely beautiful. Professional, talented, and truly spirit-filled musicians.'
              },
              {
                name: 'David Kimani',
                role: 'Youth Pastor',
                text: 'Their youth mentorship program has transformed our young people. Both musically and spiritually excellent.'
              }
            ].map((testimonial, index) => (
              <Card key={testimonial.name} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gospel-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gospel-navy">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Our Services?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Let us help make your next event a truly worshipful and memorable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
              <Clock className="mr-2 h-5 w-5" />
              Book Now
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gospel-navy px-8 py-3 text-lg">
              <MapPin className="mr-2 h-5 w-5" />
              Get Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
