-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('media_uploads', 'media_uploads')
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for media_uploads bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media_uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow public viewing of approved media" ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'media_uploads'
    AND EXISTS (
      SELECT 1 FROM public.media_submissions ms
      WHERE ms.file_url LIKE '%' || name || '%'
      AND ms.status = 'approved'
    )
  );

-- Enable RLS on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Update media_submissions table to add status validation
ALTER TABLE public.media_submissions
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add RLS policies for media_submissions table
CREATE POLICY "Users can create their own submissions"
ON public.media_submissions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own submissions or approved ones"
ON public.media_submissions
FOR SELECT
TO public
USING (
  status = 'approved'
  OR (
    auth.role() = 'authenticated'
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Only admins can update status"
ON public.media_submissions
FOR UPDATE
TO authenticated
USING (exists (
  SELECT 1 FROM public.admin_users
  WHERE user_id = auth.uid()
))
WITH CHECK (
  exists (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  )
  AND (OLD.status IS DISTINCT FROM NEW.status)
);

-- Enable RLS on media_submissions
ALTER TABLE public.media_submissions ENABLE ROW LEVEL SECURITY;
