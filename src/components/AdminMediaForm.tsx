
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Plus } from 'lucide-react';

interface AdminMediaFormProps {
  onMediaAdded: () => void;
}

const AdminMediaForm = ({ onMediaAdded }: AdminMediaFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('image');
  const [category, setCategory] = useState('worship');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Admin can directly add approved media
      const { error } = await supabase
        .from('media_submissions')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Admin placeholder
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          status: 'approved' // Auto-approve admin submissions
        });

      if (error) throw error;

      toast({
        title: "Media Added Successfully! ✅",
        description: "The media has been added to the gallery.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFileUrl('');
      setFileType('image');
      setCategory('worship');
      
      onMediaAdded();
    } catch (error: any) {
      console.error('Admin media submission error:', error);
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
          <Plus className="mr-3 h-6 w-6 text-gospel-gold" />
          Add Media to Gallery
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="fileUrl">File URL</Label>
            <Input
              id="fileUrl"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Enter direct file URL, YouTube link, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the media content"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gospel-gold hover:bg-gospel-light-gold text-white"
          >
            {isSubmitting ? 'Adding Media...' : 'Add to Gallery'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminMediaForm;
