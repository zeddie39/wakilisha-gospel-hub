// This file is for Deno (Supabase Edge Functions)
// To use Resend, we use the REST API since the npm package is not available for Deno

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

// Use Deno.env only if available, fallback to environment variable for local testing
let RESEND_API_KEY: string | undefined;
if (typeof Deno !== "undefined" && (Deno as any).env) {
  RESEND_API_KEY = (Deno as any).env.get("RESEND_API_KEY");
} else {
  RESEND_API_KEY = (globalThis as any).RESEND_API_KEY || "";
}

const TO_EMAIL = "wakilishagospelband@gmail.com";
const FROM_EMAIL = "info@wakilishagospelband.co.ke";

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, subject, message }: ContactEmailRequest = await req.json();

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: `Contact Form: ${subject}`,
        html
      })
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      throw new Error(`Resend API error: ${errorText}`);
    }

    // Save contact form submission to the messages table
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || (globalThis as any).SUPABASE_URL;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || (globalThis as any).SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase service role key or URL not set in environment variables");
    }
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject,
        content: message,
        sender_email: email,
        sender_name: `${firstName} ${lastName}`,
        phone
      })
    });
    if (!insertRes.ok) {
      const errorText = await insertRes.text();
      throw new Error(`Failed to save message to database: ${errorText}`);
    }

    const data = await resendRes.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Contact form submitted and email sent successfully',
      data
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
