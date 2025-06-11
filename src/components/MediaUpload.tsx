import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Image, Video, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';

const MediaUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('video');
  const [uploadMethod, setUploadMethod] = useState('link');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const mediaUpload = useMutation({
    mutationFn: async (formData: FormData) => {
      // First upload to Supabase Storage via REST API
      const uploadUrl = 'https://lefdftauoubelcfcrala.supabase.co/storage/v1/object/media_uploads/' + 
        user!.id + '/' + Date.now() + '_' + file!.name;
      
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmRmdGF1b3ViZWxjZmNyYWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MjYyMzIsImV4cCI6MjA2NDAwMjIzMn0.GDVCD4jyLoOg1MzUKTVE4AF9oai5KJS-l-7ihWggqU4',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmRmdGF1b3ViZWxjZmNyYWxhIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDg0MjYyMzIsImV4cCI6MjA2NDAwMjIzMn0.GDVCD4jyLoOg1MzUKTVE4AF9oai5KJS-l-7ihWggqU4'
        }
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Upload failed: ${text}`);
      }

      const uploadData = await uploadRes.json();
      const fileUrl = `https://lefdftauoubelcfcrala.supabase.co/storage/v1/object/public/media_uploads/${uploadData.Key}`;

      // Then create the media submission via REST API
      const submissionUrl = 'https://lefdftauoubelcfcrala.supabase.co/rest/v1/media_submissions';
      const submissionRes = await fetch(submissionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmRmdGF1b3ViZWxjZmNyYWxhIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDg0MjYyMzIsImV4cCI6MjA2NDAwMjIzMn0.GDVCD4jyLoOg1MzUKTVE4AF9oai5KJS-l-7ihWggqU4',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmRmdGF1b3ViZWxjZmNyYWxhIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDg0MjYyMzIsImV4cCI6MjA2NDAwMjIzMn0.GDVCD4jyLoOg1MzUKTVE4AF9oai5KJS-l-7ihWggqU4',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: user!.id,
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          status: 'pending'
        })
      });

      if (!submissionRes.ok) {
        const text = await submissionRes.text();
        throw new Error(`Submission failed: ${text}`);
      }

      return fileUrl;
    }
  });

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

    try {
      if (uploadMethod === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        await mediaUpload.mutateAsync(formData);
      } else {
        // Handle link submission
        const submissionUrl = 'https://lefdftauoubelcfcrala.supabase.co/rest/v1/media_submissions';
        const res = await fetch(submissionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmRmdGF1b3ViZWxjZmNyYWxhIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDg0MjYyMzIsImV4cCI6MjA2NDAwMjIzMn0.GDVCD4jyLoOg1MzUKTVE4AF9oai5KJS-l-7ihWggqU4',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZmRmdGF1b3ViZWxjZmNyYWxhIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDg0MjYyMzIsImV4cCI6MjA2NDAwMjIzMn0.GDVCD4jyLoOg1MzUKTVE4AF9oai5KJS-l-7ihWggqU4',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            user_id: user.id,
            title,
            description,
            file_url: fileUrl,
            file_type: fileType,
            status: 'pending'
          })
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Submission failed: ${text}`);
        }
      }

      toast({
        title: "Media Submitted! 🎥",
        description: "Your media has been submitted for review. Admin will review and approve it for the gallery.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFileUrl('');
      setFileType('video');
      setFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error('Media submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
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
        <Tabs defaultValue="link" onValueChange={(v) => setUploadMethod(v)}>
          <TabsList className="mb-4">
            <TabsTrigger value="link" className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4" />
              Media Link
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Media Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your media"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description of your media"
                className="min-h-[100px]"
              />
            </div>

            <TabsContent value="link">
              <div>
                <Label htmlFor="fileUrl">Media URL</Label>
                <Input
                  id="fileUrl"
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Enter YouTube or media URL"
                  required={uploadMethod === 'link'}
                />
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
                />
                {uploadMethod === 'file' && file && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-gray-600 mt-1">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <div>
              <Label htmlFor="fileType">Media Type</Label>
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

            <Button
              type="submit"
              className="w-full"
              disabled={mediaUpload.isPending}
            >
              {mediaUpload.isPending ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Media
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
