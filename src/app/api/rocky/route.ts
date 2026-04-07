import { NextResponse } from "next/server";

type RockyRequest = {
  question?: string;
  style?: string;
  taskTitle?: string;
  taskPrompt?: string;
};

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

function buildPrompt(input: Required<RockyRequest>) {
  return [
    "You are Rocky, a friendly educational companion for kids age 8-12 building a fantasy world.",
    "Rules:",
    "- Keep response under 2 short sentences.",
    "- Encourage thinking and creativity.",
    "- Do NOT provide unsafe content.",
    "- Do NOT produce scary, violent, or adult topics.",
    "- Avoid giving rigid step-by-step answers; guide with hints/questions.",
    "",
    `Mission title: ${input.taskTitle}`,
    `Mission prompt: ${input.taskPrompt}`,
    `Current style: ${input.style || "not set"}`,
    `Student question: ${input.question}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in server environment." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as RockyRequest;
  const question = body.question?.trim();
  if (!question) {
    return NextResponse.json(
      { error: "Question is required." },
      { status: 400 },
    );
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: buildPrompt({
              question,
              style: body.style?.trim() || "",
              taskTitle: body.taskTitle?.trim() || "Creative Mission",
              taskPrompt: body.taskPrompt?.trim() || "Help the student build.",
            }),
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 120,
    },
  };

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { error: "Gemini request failed.", details },
        { status: 502 },
      );
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Nice question! What one small detail would make your world feel more magical?";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to contact Gemini.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}

