
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Image, Video, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const MediaUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('video');
  const [uploadMethod, setUploadMethod] = useState('link');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-detect file type
      if (selectedFile.type.startsWith('image/')) {
        setFileType('image');
      } else if (selectedFile.type.startsWith('video/')) {
        setFileType('video');
      } else if (selectedFile.type.startsWith('audio/')) {
        setFileType('audio');
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image, video, or audio file",
          variant: "destructive"
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }
  };

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

    if (!title || (uploadMethod === 'link' && !fileUrl) || (uploadMethod === 'file' && !file)) {
      toast({
        title: "Missing Information",
        description: uploadMethod === 'link' 
          ? "Please provide both title and file URL." 
          : "Please provide both title and select a file.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalFileUrl = fileUrl;
      
      // If upload method is file, we'll use the file URL as-is for now
      // In a production app, you'd want to upload to Supabase Storage
      if (uploadMethod === 'file' && file) {
        // For now, we'll just use a placeholder URL
        finalFileUrl = `file://${file.name}`;
        
        toast({
          title: "File Upload Note",
          description: "File uploads require storage setup. Please use URL method for now.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Member submissions go to pending status
      const { error } = await supabase
        .from('media_submissions')
        .insert({
          user_id: user.id,
          title,
          description,
          file_url: finalFileUrl,
          file_type: fileType,
          status: 'pending' // Members' submissions need approval
        });

      if (error) throw error;

      toast({
        title: "Media Submitted! 📝",
        description: "Your media has been submitted for admin review. You'll be notified once it's approved.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFileUrl('');
      setFileType('video');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error('Media submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : String(error),
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
          Submit Media for Review
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Submit your photos, videos, or audio files. All submissions require admin approval before appearing in the gallery.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="link" onValueChange={(v) => setUploadMethod(v)}>
          <TabsList className="mb-4">
            <TabsTrigger value="link" className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4" />
              Media Link
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center" disabled>
              <FileText className="mr-2 h-4 w-4" />
              Upload File (Coming Soon)
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Media Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your media"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your media content (optional)"
                className="min-h-[100px]"
              />
            </div>

            <TabsContent value="link">
              <div>
                <Label htmlFor="fileUrl">Media URL *</Label>
                <Input
                  id="fileUrl"
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Enter YouTube, Google Drive, or direct media URL"
                  required={uploadMethod === 'link'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: YouTube, Vimeo, Google Drive, direct image/video URLs
                </p>
              </div>
            </TabsContent>

            <TabsContent value="file">
              <div>
                <Label htmlFor="file">Upload File (Max 5MB)</Label>
                <Input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,audio/*"
                  required={uploadMethod === 'file'}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  File uploads coming soon. Please use the Media Link option for now.
                </p>
              </div>
            </TabsContent>

            <div>
              <Label htmlFor="fileType">Media Type *</Label>
              <select
                id="fileType"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Submission Guidelines:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• All submissions require admin approval</li>
                <li>• Please ensure content is appropriate and relevant</li>
                <li>• You can track your submission status in the "My Submissions" tab</li>
                <li>• If rejected, you'll receive feedback on why</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Submitting for Review...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit for Admin Review
                </>
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default MediaUpload;
