import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, skills } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API Key" }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Current working models (as of July 2024)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",  // or "gemini-1.5-pro"
    });

    const prompt = `Write a 3-4 sentence professional summary for ${name}, highlighting their expertise in ${skills.join(", ")}.`;

    // Simplified modern API call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ summary: text });

  } catch (error) {
    console.error("Generation Error:", error);
    
    // More detailed error response
    return NextResponse.json(
      {
        error: "Generation Failed",
        details: error.message,
        possible_fixes: [
          "Verify your API key has Gemini API access",
          "Check model availability in your region",
          "Try 'gemini-1.5-pro' if flash isn't working"
        ]
      },
      { status: 500 }
    );
  }
}