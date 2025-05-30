
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, MessageCircle, Clock, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          firstName,
          lastName,
          email,
          phone,
          subject,
          message
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for your message! We'll get back to you soon.",
      });

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
            Ready to experience the power of worship? Let's connect and bring God's love to your community.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">WhatsApp</h3>
                <a 
                  href="https://wa.me/254757756763" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gospel-gold hover:text-gospel-navy font-medium text-lg block"
                >
                  0757756763
                </a>
                <p className="text-gray-600 text-sm mt-2">Click to chat</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <Mail className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">Email</h3>
                <a 
                  href="mailto:wakilishagospelband@gmail.com"
                  className="text-gospel-gold hover:text-gospel-navy font-medium text-lg block"
                >
                  wakilishagospelband@gmail.com
                </a>
                <p className="text-gray-600 text-sm mt-2">Send us an email</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="bg-gospel-cream p-4 rounded-full w-fit mx-auto mb-6">
                  <Phone className="h-10 w-10 text-gospel-gold" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">Phone</h3>
                <a 
                  href="tel:+254757756763"
                  className="text-gospel-gold hover:text-gospel-navy font-medium text-lg block"
                >
                  0757756763
                </a>
                <p className="text-gray-600 text-sm mt-2">Call us directly</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
              <CardContent className="p-8">
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <Clock className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gospel-navy mb-4">Available</h3>
                <p className="text-gospel-gold font-medium text-lg">24/7</p>
                <p className="text-gray-600 text-sm mt-2">We're here for you</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-none shadow-xl" id="contact-form">
              <CardHeader>
                <CardTitle className="text-3xl text-gospel-navy text-center">Send Us a Message</CardTitle>
                <p className="text-gray-600 text-center">
                  We'd love to hear from you. Fill out the form below and we'll get back to you soon.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gospel-navy font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gospel-navy font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gospel-navy font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gospel-navy font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gospel-navy font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gospel-navy font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white font-semibold py-3 text-lg"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <div className="space-y-8">
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gospel-navy mb-6">Why Choose Wakilisha?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Heart className="h-6 w-6 text-gospel-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gospel-navy">Passionate Ministry</h4>
                        <p className="text-gray-600">We serve with genuine hearts devoted to God's calling</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="h-6 w-6 text-gospel-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gospel-navy">Personal Touch</h4>
                        <p className="text-gray-600">Every event is tailored to your community's needs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-6 w-6 text-gospel-gold mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gospel-navy">Always Available</h4>
                        <p className="text-gray-600">Ready to respond to your ministry needs anytime</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-gospel-navy to-blue-800 text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Book?</h3>
                  <p className="mb-6">
                    Let's bring the power of worship to your community. Contact us today!
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="https://wa.me/254757756763" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp Us
                      </Button>
                    </a>
                    <a href="tel:+254757756763">
                      <Button className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
