
import Hero from '../components/Hero';
import MissionSection from '../components/MissionSection';
import TeamMembers from '../components/TeamMembers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Heart, Users, Calendar, Phone, Mail, MessageCircle, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Updated About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">About Wakilisha Gospel Band</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Wakilisha Gospel Band</strong> is a devoted group of young believers who passionately serve God through the unique gifts and talents He has entrusted to us. Our ministry is deeply rooted in worship, and we are committed to using our music and creativity to inspire healing, hope, and transformation.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We are widely recognized for our impactful <strong>street worship sessions</strong>, where we bring the presence of God directly to the people—right where they are.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to <strong>touch lives</strong> and remind everyone of <strong>God's deep, unconditional love</strong>.
              </p>
            </div>
            <div className="mt-8">
              <Link to="/about">
                <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Verse Section */}
      <section className="py-16 bg-gradient-to-r from-gospel-navy to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Foundation</h2>
          <blockquote className="text-xl md:text-2xl leading-relaxed italic font-light">
            "Because I am no longer a stranger but a member of God's household (Ephesians 2:19), and my life is built on the foundation of Christ (v.20), I now choose to live every moment, word, and action in the name of Jesus (Colossians 3:17), giving thanks to God."
          </blockquote>
        </div>
      </section>

      <MissionSection />

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Our Ministry Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intimate worship sessions to large community events, we bring God's love through music
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6">
                  <Music className="h-10 w-10 text-gospel-gold" />
                </div>
                <h3 className="text-2xl font-semibold text-gospel-navy mb-4">Worship Services</h3>
                <p className="text-gray-600 mb-6">
                  Leading worship in churches, conferences, and special events with anointed music ministry.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6">
                  <Users className="h-10 w-10 text-gospel-gold" />
                </div>
                <h3 className="text-2xl font-semibold text-gospel-navy mb-4">Street Ministry</h3>
                <p className="text-gray-600 mb-6">
                  Bringing God's presence to the streets through powerful worship and outreach programs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6">
                  <Heart className="h-10 w-10 text-gospel-gold" />
                </div>
                <h3 className="text-2xl font-semibold text-gospel-navy mb-4">Community Outreach</h3>
                <p className="text-gray-600 mb-6">
                  Touching lives in marginalized communities through music, prayer, and acts of love.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 mr-4">
                View All Services
              </Button>
            </Link>
            <Link to="/book-band">
              <Button size="lg" variant="outline" className="border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white px-8 py-3">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Watch Us Worship Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Watch Us Worship</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of worship through our ministry
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/jH1RNk8954Q"
                title="Wakilisha Gospel Band Worship Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-center mt-6">
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="border-gospel-gold text-gospel-gold hover:bg-gospel-gold hover:text-white">
                  <Play className="mr-2 h-4 w-4" />
                  View More Videos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <TeamMembers />

      {/* Call to Action */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Ministry Today</h2>
          <p className="text-xl text-gray-200 mb-8">
            Be part of a community that spreads God's love through music and worship
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button 
                size="lg" 
                className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
                  Join Our Ministry
                </Button>
              </Link>
            )}
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gospel-navy px-8 py-3 text-lg"
              onClick={scrollToContact}
            >
              Call Now
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section id="contact-form" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600">
              Ready to book us for your event or have questions? Reach out!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">WhatsApp</h3>
                <a 
                  href="https://wa.me/254757756763" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gospel-gold hover:text-gospel-navy font-medium text-lg"
                >
                  0757756763
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">Email</h3>
                <a 
                  href="mailto:wakilishagospelband@gmail.com"
                  className="text-gospel-gold hover:text-gospel-navy font-medium text-lg"
                >
                  wakilishagospelband@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="p-8">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6">
                  <Phone className="h-8 w-8 text-gospel-gold" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">Call Us</h3>
                <a 
                  href="tel:+254757756763"
                  className="text-gospel-gold hover:text-gospel-navy font-medium text-lg"
                >
                  0757756763
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact form moved to Contact page */}
          <div className="text-center">
            <Link to="/contact">
              <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3">
                Send Us a Message
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
