// routes/careplan.js
const express = require("express");
const router = express.Router();

function cleanJsonString(raw) {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

router.post("/care-plan", async (req, res) => {
  try {
    const { answers, aiResult } = req.body || {};

    if (!answers) {
      return res.status(400).json({ error: "Missing 'answers' in request body" });
    }
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing from environment variables");
      return res.status(500).json({ error: "Server misconfiguration: missing API key" });
    }

    const stage = aiResult?.stage || "Not yet determined";
    const ageGroup = aiResult?.ageGroup || "Unknown";

    const safe = {
      age: answers.age || "Unknown",
      goal: answers.goal || "Not specified",
      cycle: answers.cycle || "Not specified",
      symptoms: Array.isArray(answers.symptoms) ? answers.symptoms : [],
      severity: answers.severity || "Not specified",
      hrt: answers.hrt || "Not specified",
      conditions: Array.isArray(answers.conditions) ? answers.conditions : [],
    };

    const prompt = `
You are a women's hormonal wellness assistant. Based on the user's profile below,
generate a personalized daily care plan.

Return ONLY valid JSON (no markdown, no code fences, no extra text) with this exact shape:

{
  "planFocus": "<2-4 word focus area, e.g. 'Symptom Relief & Hormonal Balance'>",
  "categories": [
    {
      "id": "diet",
      "title": "Dietary Adjustments",
      "subtitle": "Food choices that support your symptoms today",
      "icon": "🥗",
      "whyThisHelps": "<1-2 sentence explanation of why diet matters for this user's specific stage/symptoms>",
      "items": [
        { "text": "<specific, actionable recommendation; wrap the key symptom or benefit phrase in **double asterisks**>" }
      ]
    },
    {
      "id": "supplements",
      "title": "Supplements & Hydration",
      "subtitle": "Boost your wellness from within",
      "icon": "💊",
      "whyThisHelps": "<1-2 sentence explanation>",
      "items": [ { "text": "<...>" } ]
    },
    {
      "id": "sleep",
      "title": "Sleep Hygiene Routine",
      "subtitle": "Tonight's plan for deeper, restful sleep",
      "icon": "🌙",
      "whyThisHelps": "<1-2 sentence explanation>",
      "items": [ { "text": "<...>" } ]
    }
  ]
}

Rules:
- Each category must have exactly 3 items.
- Tailor every recommendation to the user's actual symptoms, severity, cycle status, and stage — do not give generic advice unrelated to their data.
- If the age group is "Teen" or "Reproductive", do NOT reference menopause or perimenopause; focus on cycle health, PCOS/thyroid-friendly habits, and general hormonal balance instead.
- Keep each item to one short, practical sentence that's easy to act on today.
- For supplements, only suggest common, generally-safe wellness items (e.g. Vitamin D3, Magnesium, hydration amounts) framed as general wellness suggestions, never as prescriptions or medical directives.

User profile:
- Age: ${safe.age}
- Age group: ${ageGroup}
- Detected stage: ${stage}
- Primary goal: ${safe.goal}
- Cycle regularity: ${safe.cycle}
- Symptoms: ${safe.symptoms.join(", ") || "None reported"}
- Symptom severity: ${safe.severity}
- Currently on supplements/HRT: ${safe.hrt}
- Existing conditions: ${safe.conditions.join(", ") || "None"}
`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq care-plan error:", groqRes.status, errText);
      return res.status(502).json({ error: "Groq API request failed", details: errText });
    }

    const data = await groqRes.json();
    const raw = data.choices?.[0]?.message?.content;

    if (!raw) {
      console.error("Groq returned no content:", JSON.stringify(data));
      return res.status(500).json({ error: "No response content from model" });
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanJsonString(raw));
    } catch (parseErr) {
      console.error("Failed to parse care-plan JSON:", raw);
      return res.status(500).json({ error: "Model returned invalid JSON", raw });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Care-plan error:", err);
    res.status(500).json({ error: "Failed to generate care plan", message: err.message });
  }
});

module.exports = router;