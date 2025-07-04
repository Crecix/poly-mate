﻿// pages/api/recommend.ts

export default async function handler(req, res) {
    console.log("✅ /api/recommend route hit");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { language, level, interests } = req.body;

  const prompt = `
You're a language learning coach. Recommend 5 personalized resources for someone learning ${language} at a ${level} level. 
Focus on their interests: ${interests}. Include podcasts, articles, videos, books, and websites. Add short descriptions.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // switch from gpt-4 for reliability
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("🔍 OpenAI raw response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]) {
      console.error("⚠️ OpenAI response missing choices:", data);
      return res.status(500).json({ error: "OpenAI returned no choices." });
    }

    const result = data.choices[0].message.content;
    return res.status(200).json({ result });

  } catch (error) {
    console.error("🔥 OpenAI API error:", error);
    return res.status(500).json({ error: "Something went wrong in the server." });
  }
}
