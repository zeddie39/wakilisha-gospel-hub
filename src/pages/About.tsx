
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Star, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gospel-navy to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About Us
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in">
            Discover the heart and story behind Wakilisha Gospel Band - a community 
            of 23 dedicated believers united in worship and ministry.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h2 className="text-4xl font-bold text-gospel-navy mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Wakilisha Gospel Band was founded with a divine calling to spread the Gospel 
                through the universal language of music. What began as a small group of 
                passionate believers has grown into a 23-member ministry that touches hearts 
                across Kenya.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our name "Wakilisha" speaks to our mission of representation - we represent 
                Christ's love and message through every song, every performance, and every 
                interaction with our community.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to grow in faith, music, and ministry, always remembering 
                that our purpose is to glorify God and lead others into His presence through 
                worship and praise.
              </p>
            </div>
            <div className="animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=4928&q=80" 
                alt="Gospel Band in Worship" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-gold p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gospel-navy mb-4">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be a leading Gospel music ministry in Kenya and East Africa, 
                  transforming lives through worship and spreading the message of 
                  Christ's love to every corner of our nation and beyond.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-gold p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gospel-navy mb-4">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To glorify God through excellence in music and worship, build a 
                  strong community of believers, and reach the lost through the 
                  power of Gospel music and authentic Christian fellowship.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do as a ministry and community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Worship Excellence',
                description: 'We pursue excellence in worship as an act of love and reverence to God, believing that He deserves our very best in every performance and gathering.'
              },
              {
                icon: Users,
                title: 'Community Unity',
                description: 'We foster a spirit of unity and brotherhood among our members, creating a safe space where everyone can grow in faith and fellowship.'
              },
              {
                icon: Star,
                title: 'Authentic Ministry',
                description: 'We believe in authentic, spirit-led ministry that touches hearts and transforms lives through the genuine message of the Gospel.'
              }
            ].map((value, index) => (
              <Card key={value.title} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="bg-gospel-gold p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gospel-navy mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Foundation</h2>
          <blockquote className="text-2xl italic text-gospel-light-gold mb-6">
            "Let the message of Christ dwell among you richly as you teach and admonish 
            one another with all wisdom through psalms, hymns, and songs from the Spirit, 
            singing to God with gratitude in your hearts."
          </blockquote>
          <cite className="text-lg text-gray-300">- Colossians 3:16</cite>
        </div>
      </section>
    </div>
  );
};

export default About;
