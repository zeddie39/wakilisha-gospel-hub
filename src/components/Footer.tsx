import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gospel-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gospel-gold mb-4">Wakilisha Gospel Band</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Spreading the Gospel through music and worship. Join us as we lift up the name of Jesus 
              and bring hope to communities through the power of music.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61576359388097" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gospel-gold transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/wg_bannd/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gospel-gold transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@WAKILISHAGOSPELBAND" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gospel-gold transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gospel-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
              <li><a href="/events" className="text-gray-300 hover:text-white transition-colors">Events</a></li>
              <li><a href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-gospel-gold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gospel-gold" />
                <span className="text-gray-300 text-sm">info@wakilishagospelband.co.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gospel-gold" />
                <span className="text-gray-300 text-sm">+254757756763</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gospel-gold mt-1" />
                <span className="text-gray-300 text-sm">Kitale, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scripture */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gospel-gold italic mb-2">
            "Sing to the Lord a new song; sing to the Lord, all the earth."
          </p>
          <p className="text-sm text-gray-400 mb-4">- Psalm 96:1</p>
          <p className="text-xs text-gray-500 mt-2">© 2025 Wakilisha Gospel Band. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
