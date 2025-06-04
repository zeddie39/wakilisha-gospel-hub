
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

interface RSVPFormProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

const RSVPForm = ({ eventId, eventTitle, eventDate, eventTime, eventLocation }: RSVPFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRSVP = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to RSVP for events.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user profile for full name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('rsvps')
        .insert({
          user_id: user.id,
          event_id: eventId,
          event_title: eventTitle,
          user_name: profile?.full_name || user.email?.split('@')[0] || 'User',
          user_email: user.email || '',
          status: 'pending'
        });

      if (error) throw error;

      setHasRSVPed(true);
      toast({
        title: "RSVP Submitted! 🎉",
        description: "Your RSVP has been submitted. Admin will review and send you a confirmation email with your ticket.",
      });
    } catch (error: any) {
      console.error('RSVP Error:', error);
      if (error.code === '23505') {
        toast({
          title: "Already RSVP'd",
          description: "You have already RSVP'd for this event.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "RSVP Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-gospel-navy">{eventTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gospel-gold" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gospel-gold" />
            <span>{eventTime}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gospel-gold" />
            <span>{eventLocation}</span>
          </div>
        </div>

        <Button 
          onClick={handleRSVP}
          disabled={isSubmitting || hasRSVPed}
          className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white"
        >
          <Users className="mr-2 h-4 w-4" />
          {hasRSVPed ? 'RSVP Submitted ✓' : isSubmitting ? 'Submitting...' : 'RSVP for This Event'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RSVPForm;
