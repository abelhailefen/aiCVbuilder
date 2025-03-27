import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, skills } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OpenAI API Key" }, { status: 500 });
    }

    const prompt = `Write a professional summary for ${name}, who has skills in ${skills.join(", ")}.`;

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ summary: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
