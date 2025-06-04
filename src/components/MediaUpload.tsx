
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, Image, Video } from 'lucide-react';

const MediaUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('video');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit media.",
        variant: "destructive"
      });
      return;
    }

    if (!title || !fileUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and file URL.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('media_submissions')
        .insert({
          user_id: user.id,
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Media Submitted! 🎥",
        description: "Your media has been submitted for review. Admin will review and approve it for the gallery.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFileUrl('');
      setFileType('video');
    } catch (error: any) {
      console.error('Media submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gospel-navy flex items-center">
          <Upload className="mr-3 h-6 w-6 text-gospel-gold" />
          Submit Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Media Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter media title"
              required
            />
          </div>

          <div>
            <Label htmlFor="fileType">Media Type</Label>
            <select
              id="fileType"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gospel-gold"
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
            </select>
          </div>

          <div>
            <Label htmlFor="fileUrl">File URL</Label>
            <Input
              id="fileUrl"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Enter YouTube URL, Google Drive link, or direct file URL"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your media submission"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Media'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
