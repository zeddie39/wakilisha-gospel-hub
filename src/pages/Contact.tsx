
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@wakilishagospel.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+254 123 456 789',
      description: 'Available Monday - Friday, 9AM - 6PM'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Nairobi, Kenya',
      description: 'Contact us for specific venue details'
    },
    {
      icon: Clock,
      title: 'Response Time',
      content: '24-48 Hours',
      description: 'We typically respond within 1-2 business days'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gospel-navy to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-fade-in">
            We'd love to hear from you! Whether you want to book our services, 
            join our ministry, or just say hello - reach out to us.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={info.title} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-gospel-gold p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gospel-navy mb-2">{info.title}</h3>
                  <p className="text-xl font-bold text-gray-800 mb-1">{info.content}</p>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-slide-in">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl text-gospel-navy">Send Us a Message</CardTitle>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gospel-navy font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gospel-navy font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-gospel-navy font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                          placeholder="+254 123 456 789"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject" className="text-gospel-navy font-medium">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-1 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                          placeholder="What is this about?"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gospel-navy font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="mt-1 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white py-3 text-lg font-semibold"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Map & Additional Info */}
            <div className="animate-fade-in space-y-8">
              {/* Map Placeholder */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gospel-navy">Find Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gospel-gold mx-auto mb-2" />
                      <p className="text-gray-600">Interactive map coming soon</p>
                      <p className="text-sm text-gray-500">Nairobi, Kenya</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    We're based in Nairobi and travel throughout Kenya for our ministry. 
                    Contact us for specific venue information for upcoming events.
                  </p>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gospel-navy">Follow Our Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Stay connected with us on social media for the latest updates, 
                    behind-the-scenes content, and live worship moments.
                  </p>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors duration-300"
                    >
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a 
                      href="#" 
                      className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-colors duration-300"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a 
                      href="#" 
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-300"
                    >
                      <Youtube className="h-6 w-6" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gospel-navy mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How can I book Wakilisha Gospel Band for an event?",
                answer: "Simply fill out our contact form or call us directly. We'll discuss your event details, provide a quote, and confirm availability."
              },
              {
                question: "Do you travel outside of Nairobi?",
                answer: "Yes! We travel throughout Kenya for ministry events. Travel costs may apply depending on the location."
              },
              {
                question: "What type of events do you perform at?",
                answer: "We perform at church services, weddings, conferences, community outreach events, and other Christian gatherings."
              },
              {
                question: "How can I join the band?",
                answer: "We're always looking for dedicated musicians and vocalists. Contact us to learn about audition opportunities and requirements."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gospel-navy mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gospel-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Connect?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Don't wait - reach out today and let's discuss how we can serve your ministry or event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gospel-gold hover:bg-gospel-light-gold text-white px-8 py-3 text-lg">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
            <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-gospel-navy px-8 py-3 text-lg">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
