
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

const PrayerRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          user_id: user.id,
          title,
          description,
          is_anonymous: isAnonymous
        });

      if (error) throw error;

      toast({
        title: "Prayer Request Submitted",
        description: "Your prayer request has been received. Our community will pray for you.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
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
            <div className="mx-auto bg-red-100 p-4 rounded-full w-fit mb-4">
              <Heart className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl text-gospel-navy">Submit Prayer Request</CardTitle>
            <p className="text-gray-600 mt-2">
              Share your prayer needs with our community. We believe in the power of collective prayer.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-gospel-navy font-medium">
                  Prayer Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                  placeholder="Brief title for your prayer request"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gospel-navy font-medium">
                  Prayer Details
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  className="mt-2 border-gray-300 focus:border-gospel-gold focus:ring-gospel-gold"
                  placeholder="Share the details of your prayer request. Be as specific as you'd like."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="border-gospel-gold text-gospel-gold focus:ring-gospel-gold"
                />
                <Label htmlFor="anonymous" className="text-gospel-navy">
                  Submit anonymously
                </Label>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? 'Submitting...' : 'Submit Prayer Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerRequest;
