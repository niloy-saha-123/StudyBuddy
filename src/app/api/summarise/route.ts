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
    const prompt = `Generate detailed, comprehensive notes based on the provided transcription.

1. Determine the Main Topic: Identify the central theme or subject of the transcription. Use this as the main heading for the notes.

2. Identify and Explain Key Concepts:
* Extract the most important information and concepts from the transcription.
* For each key concept:
* Provide clear and concise definitions.
* Include relevant examples to illustrate the concept.
* Explain the significance and relevance of the concept within the broader topic.

3. Structure for Clarity:
* Organize the notes with clear sections and subheadings to improve readability and facilitate easy study.
* Use bullet points, lists, and other formatting techniques for enhanced clarity.

4. Conciseness and Clarity:
* Ensure the notes are concise, well-organized, and free of irrelevant information.
* Use precise and accurate language throughout.

5. Potential Exam Questions:
* Include a section with potential exam questions (multiple choice, short answer, etc.) at the end of the notes to help students prepare for assessments.

Key Considerations:

Relevance: Only include information directly related to the main topic of the transcription.
Depth: Go beyond surface-level information to provide a deeper understanding of the concepts.
Study-friendly format: Use clear formatting (headings, bullet points, etc.) to make the notes easy to read and review.
I
    
    ${body.transcription}`;

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