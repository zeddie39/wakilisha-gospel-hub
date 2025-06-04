
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, ArrowLeft, Music } from 'lucide-react';

const BookBand = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventType, setEventType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const locationState = useLocation();

  useEffect(() => {
    // Pre-fill the user's email if available
    if (user?.email) {
      setEmail(user.email);
    }

    // Check if a service type was passed from Services page
    const state = locationState.state as { serviceType?: string };
    if (state?.serviceType) {
      setEventType(state.serviceType);
    }
  }, [user, locationState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book our band.",
        variant: "destructive"
      });
      return;
    }

    if (!fullName || !email || !phoneNumber || !eventType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('booking_requests')
        .insert({
          user_id: user.id,
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          event_type: eventType,
          preferred_date: preferredDate || null,
          location,
          message
        });

      if (error) throw error;

      toast({
        title: "Booking Request Submitted! 🎵",
        description: "We've received your booking request. We'll contact you soon!",
      });

      // Reset form
      setFullName('');
      setEmail(user?.email || '');
      setPhoneNumber('');
      setEventType('');
      setPreferredDate('');
      setLocation('');
      setMessage('');

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Booking request error:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 border-gospel-gold text-gospel-navy hover:bg-gospel-gold hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gospel-cream p-4 rounded-full w-fit mb-4">
              <Music className="h-10 w-10 text-gospel-gold" />
            </div>
            <CardTitle className="text-3xl text-gospel-navy">Book Our Band</CardTitle>
            <p className="text-gray-600 mt-2">
              Let's spread the Gospel through music at your event. Fill out the details below.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-gospel-navy font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gospel-navy font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber" className="text-gospel-navy font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="eventType" className="text-gospel-navy font-medium">
                    Event Type *
                  </Label>
                  <Select value={eventType} onValueChange={setEventType} required>
                    <SelectTrigger className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worship-service">Worship Service</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="funeral">Funeral</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="outreach">Outreach Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate" className="text-gospel-navy font-medium">
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gospel-navy font-medium">
                    Event Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                    placeholder="Event venue or location"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-gospel-navy font-medium">
                  Additional Details
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                  placeholder="Tell us more about your event, expected audience size, specific requirements, etc."
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white font-semibold py-3 text-lg"
                >
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookBand;
