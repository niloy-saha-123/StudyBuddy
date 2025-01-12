// src/app/api/summarise/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Export the POST handler
export async function POST(request: Request) {
  try {
    // Ensure request is JSON
    if (request.headers.get('content-type') !== 'application/json') {
      return NextResponse.json({ error: 'Content type must be application/json' }, { status: 415 });
    }

    const body = await request.json();
    
    if (!body.transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      );
    }

    // Select the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt
    const prompt = `Generate detailed, comprehensive notes based on the transcription, adding relevant information and insights that might not be explicitly mentioned but are critical for exam preparation. Structure the content with clear sections, highlighting each key concept in bold. For every key concept, provide a dedicated paragraph that includes a clear explanation, examples, and its relevance to the topic. Also, include potential exam questions at the end of the notes to help students anticipate test scenarios. Ensure the notes are concise, well-organized, and formatted for easy study from the following transcription:
    
    ${body.transcription}
    
    Summary:`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    if (!summary) {
      throw new Error('Failed to generate summary');
    }

    // Return successful response
    return NextResponse.json({ summary });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate summary' },
      { status: 500 }
    );
  }
}