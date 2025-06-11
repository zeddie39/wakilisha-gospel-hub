import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Plus, Link as LinkIcon, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [uploadMethod, setUploadMethod] = useState('link');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-detect file type
      if (selectedFile.type.startsWith('image/')) {
        setFileType('image');
      } else if (selectedFile.type.startsWith('video/')) {
        setFileType('video');
      } else if (selectedFile.type.startsWith('audio/')) {
        setFileType('audio');
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return null;
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `admin_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `admin/${fileName}`;
      
      // Check if media_uploads bucket exists
      const { data: bucketData } = await supabase.storage.getBucket('media_uploads');
      
      if (!bucketData) {
        // Notify admin about missing bucket
        toast({
          title: "Storage Setup Required",
          description: "Please set up storage for media uploads first.",
          variant: "destructive"
        });
        return null;
      }
      
      // Upload file without progress tracking
      const { data, error } = await supabase.storage
        .from('media_uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (error) throw error;
      
      // Create a public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('media_uploads')
        .getPublicUrl(filePath);
        
      return publicUrlData.publicUrl;
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // If upload method is file, upload it first
      if (uploadMethod === 'file') {
        const uploadedUrl = await uploadFile();
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        finalFileUrl = uploadedUrl;
      }

      // Admin can directly add approved media
      const { error } = await supabase
        .from('media_submissions')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Admin placeholder
          title,
          description,
          file_url: finalFileUrl,
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
      setFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      onMediaAdded();
    } catch (error: unknown) {
      console.error('Admin media submission error:', error);
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
          
          <Tabs value={uploadMethod} onValueChange={setUploadMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link" className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Provide Link
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Upload File
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="link">
              <div>
                <Label htmlFor="fileUrl">File URL</Label>
                <Input
                  id="fileUrl"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="Enter direct file URL, YouTube link, etc."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="file">
              <div>
                <Label htmlFor="file">Upload File</Label>
                <div className="mt-2">
                  <Input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/*,audio/*"
                    className="border border-gray-300 rounded-md"
                  />
                </div>
                {file && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-gospel-gold h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

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
