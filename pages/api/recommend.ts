// pages/api/recommend.ts

export default async function handler(req, res) {
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
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "OpenAI failed to respond." });
    }

    const result = data.choices[0].message.content;

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error fetching from OpenAI:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
