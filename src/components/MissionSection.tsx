
import React from 'react';
import { Heart, Users, Music, Globe } from 'lucide-react';

const MissionSection = () => {
  const values = [
    {
      icon: Heart,
      title: 'Worship',
      description: 'Leading hearts to genuine worship and encounter with God through music and praise.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a strong community of believers united in faith and fellowship.'
    },
    {
      icon: Music,
      title: 'Excellence',
      description: 'Pursuing musical excellence as an act of worship and service to God.'
    },
    {
      icon: Globe,
      title: 'Outreach',
      description: 'Reaching the lost and spreading the Gospel message across Kenya and beyond.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gospel-navy mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            To glorify God through music, worship, and ministry while building a community 
            of believers who are passionate about spreading the Gospel message through 
            the power of song and fellowship.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gospel-gold p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                <value.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gospel-navy mb-3 text-center">
                {value.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">23</div>
              <div className="text-gray-600 font-medium">Dedicated Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">5+</div>
              <div className="text-gray-600 font-medium">Years of Ministry</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gospel-gold mb-2">100+</div>
              <div className="text-gray-600 font-medium">Lives Touched</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
