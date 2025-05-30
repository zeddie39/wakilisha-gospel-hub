
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactEmailRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, subject, message }: ContactEmailRequest = await req.json();

    console.log('Contact form submission received:', {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message: message.substring(0, 100) + '...' // Log first 100 chars of message
    });

    // For now, we'll just log the contact form submission
    // In a real implementation, you would send an email using a service like Resend
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    // Simulate email sending
    const emailResponse = {
      id: 'contact_' + Date.now(),
      to: 'wakilishagospelband@gmail.com',
      from: email,
      subject: `Contact Form: ${subject}`,
      status: 'queued'
    };

    console.log("Contact email logged successfully:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted successfully',
      data: emailResponse
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
