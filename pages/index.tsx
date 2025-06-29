import { useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState("French");
  const [level, setLevel] = useState("Beginner");
  const [interests, setInterests] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, level, interests }),
    });

    const data = await response.json();
    setResult(data.result || "Sorry, something went wrong.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🌍 Welcome to PolyMate</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>French</option>
              <option>Spanish</option>
              <option>German</option>
              <option>Chinese</option>
              <option>Arabic</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Interests</label>
            <input
              type="text"
              placeholder="e.g., travel, food, business"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Thinking..." : "Get Recommendations"}
          </button>
        </form>

        {result && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">🎯 Personalized Suggestions</h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

