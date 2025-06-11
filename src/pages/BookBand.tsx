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
import { Calendar, ArrowLeft, Music, Loader2 } from 'lucide-react';

interface BookingFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  eventType: string;
  preferredDate: string;
  eventLocation: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: BookingFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  eventType: '',
  preferredDate: '',
  eventLocation: '',
  message: '',
};

const BookBand = () => {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }

    const state = location.state as { serviceType?: string };
    if (state?.serviceType) {
      setFormData(prev => ({ ...prev, eventType: state.serviceType }));
    }
  }, [user, location]);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.eventType) newErrors.eventType = 'Event type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSelectChange = (value: string, field: keyof BookingFormData) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book our band.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    let stillWorkingTimeout: NodeJS.Timeout | null = null;
    try {
      stillWorkingTimeout = setTimeout(() => {
        toast({
          title: "Still working...",
          description: "Submitting your booking is taking longer than usual. Please wait...",
        });
      }, 3000);
      const insertPromise = supabase
        .from('booking_requests')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          event_type: formData.eventType,
          preferred_date: formData.preferredDate || null,
          location: formData.eventLocation,
          message: formData.message,
          status: 'pending'
        })
        .single();
      // Add a 10s timeout to the insert
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out. Please try again.')), 10000));
      const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;
      if (error) throw error;
      toast({
        title: "Booking Request Submitted! 🎵",
        description: "We've received your booking request. We'll contact you soon!",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking request error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : 'Failed to submit booking request',
        variant: "destructive"
      });
    } finally {
      if (stillWorkingTimeout) clearTimeout(stillWorkingTimeout);
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gospel-navy flex items-center justify-center gap-2">
            <Music className="h-8 w-8 text-gospel-gold" />
            Book Our Band
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'border-red-500' : ''}
                  disabled={loading}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-sm text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => handleSelectChange(value, 'eventType')}
                  disabled={loading}
                >
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="worship-service">Worship Service</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="concert">Concert</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventType && (
                  <p className="text-sm text-red-500">{errors.eventType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventLocation">Event Location</Label>
                <Input
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Where will the event take place?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Any special requirements or additional information..."
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Booking Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default BookBand;
