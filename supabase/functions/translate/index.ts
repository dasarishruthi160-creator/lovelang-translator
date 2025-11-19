import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, targetLanguage, sourceLanguage } = await req.json();
    
    if (!message || !targetLanguage) {
      throw new Error('Message and target language are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create translation prompt
    const systemPrompt = `You are LoveLang, a friendly and helpful multilingual translation assistant. 
Your role is to translate text accurately while maintaining the original meaning and tone.
When translating:
- Preserve the original tone and style
- Maintain cultural context appropriately
- Provide natural-sounding translations
- If asked about language capabilities, explain that you can translate between many languages
- Be conversational and friendly in your responses`;

    const userPrompt = sourceLanguage && sourceLanguage !== 'auto'
      ? `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only provide the translation, no explanations:\n\n${message}`
      : `Translate the following text to ${targetLanguage}. Detect the source language automatically. Only provide the translation, no explanations:\n\n${message}`;

    console.log('Translation request:', { message, sourceLanguage, targetLanguage });

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Translation service error');
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content;

    if (!translation) {
      throw new Error('No translation received');
    }

    console.log('Translation successful');

    return new Response(
      JSON.stringify({ translation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in translate function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Translation failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});