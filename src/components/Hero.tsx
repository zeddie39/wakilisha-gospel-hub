import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/auth');
  };

  const handleWatchClick = () => {
    if (window.location.pathname === '/' || window.location.pathname === '/index') {
      const section = document.getElementById('watch-us-worship');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = '#watch-us-worship';
      }
    } else {
      navigate('/#watch-us-worship');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=7372&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gospel-navy/80 to-gospel-navy/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="block">Wakilisha</span>
            <span className="block text-gospel-gold">Gospel Band</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Spreading the Gospel through music and worship. Join us as we lift up the name of Jesus 
            and bring hope to communities across Kenya.
          </p>

          {/* Scripture Verse */}
          <div className="mb-10 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-2xl mx-auto">
            <p className="text-gospel-light-gold italic text-lg mb-2">
              "Sing to the Lord a new song; sing to the Lord, all the earth."
            </p>
            <p className="text-gray-300 text-sm">- Psalm 96:1</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              onClick={handleJoinClick}
            >
              Join Our Ministry
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-gospel-navy px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={handleWatchClick}
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Us Worship
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
