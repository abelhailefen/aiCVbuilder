import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone, address, skills, sections } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API Key" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or "gemini-1.5-pro"
    });

    // 🔹 New structured prompt for a full resume
    const prompt = `
      Generate a full professional resume for:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone}
      - Address: ${address}
      - Skills: ${skills.join(", ")}
      
      Additional Sections:
      ${sections.map((s: { title: string; content: string }) => `- ${s.title}: ${s.content}`).join("\n")}

      Format it professionally using markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Generated Resume:", text);
    return NextResponse.json({ resume: text });

  } catch (error) {
    console.error("Generation Error:", error);

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
