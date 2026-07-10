// routes/analyze.js
const express = require("express");
const router = express.Router();

function getAgeBracket(age) {
  if (age < 21) return "Teen";
  if (age < 36) return "Reproductive";
  if (age < 45) return "Approaching Perimenopause";
  if (age < 55) return "Perimenopause";
  return "Menopause";
}

const STAGE_OPTIONS = {
  Teen: ["Normal Cycle Health", "Irregular Cycle - Monitor", "Possible Hormonal Imbalance"],
  Reproductive: ["Normal Reproductive Health", "Hormonal Imbalance Signs", "PCOS-like Pattern"],
  "Approaching Perimenopause": ["Pre-Menopause (Normal)", "Pre-Menopause Transition"],
  Perimenopause: ["Early Perimenopause", "Late Perimenopause"],
  Menopause: ["Menopause", "Post-Menopause"],
};

// Strips ```json ... ``` or ``` ... ``` fences some models add despite instructions
function cleanJsonString(raw) {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body || {};

    if (!answers) {
      return res.status(400).json({ error: "Missing 'answers' in request body" });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing from environment variables");
      return res.status(500).json({ error: "Server misconfiguration: missing API key" });
    }

    // Safe defaults so .join() / string interpolation never crashes
    const safe = {
      age: answers.age || "Unknown",
      goal: answers.goal || "Not specified",
      lastPeriod: answers.lastPeriod || "Not specified",
      cycle: answers.cycle || "Not specified",
      symptoms: Array.isArray(answers.symptoms) ? answers.symptoms : [],
      severity: answers.severity || "Not specified",
      hrt: answers.hrt || "Not specified",
      conditions: Array.isArray(answers.conditions) ? answers.conditions : [],
    };

    const ageNum = parseInt(safe.age, 10) || 30; // fallback if parsing fails
    const bracket = getAgeBracket(ageNum);
    const allowedStages = STAGE_OPTIONS[bracket];

    const prompt = `
You are a women's hormonal health assistant. The user's age group has already
been determined by the system as "${bracket}". You MUST choose the "stage"
field ONLY from this exact list (do not invent new labels, do not use stages
from other age groups): ${JSON.stringify(allowedStages)}

Return ONLY valid JSON (no markdown, no code fences, no extra text) with this exact shape:

{
  "ageGroup": "${bracket}",
  "stage": <one of: ${allowedStages.map((s) => `"${s}"`).join(" | ")}>,
  "score": <number 0-100, symptom/imbalance intensity>,
  "tagWord": "Mild" | "Moderate" | "High",
  "insight": "<2-3 sentence personalized, warm, non-alarming insight. If the age group is Teen or Reproductive, do NOT mention menopause or perimenopause at all — focus on cycle health, possible PCOS/thyroid/lifestyle causes, and encourage seeing a doctor if symptoms are persistent.>"
}

Scoring guidance: more symptoms + higher severity + longer cycle irregularity
= higher score, regardless of age group.

User data:
- Age: ${safe.age}
- Primary goal: ${safe.goal}
- Last period date: ${safe.lastPeriod}
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
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error response:", groqRes.status, errText);
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
      console.error("Failed to parse model JSON:", raw);
      return res.status(500).json({ error: "Model returned invalid JSON", raw });
    }

    // Safety net: force ageGroup + validate stage is actually from the allowed list
    parsed.ageGroup = bracket;
    if (!allowedStages.includes(parsed.stage)) {
      parsed.stage = allowedStages[0];
    }
    if (typeof parsed.score !== "number" || Number.isNaN(parsed.score)) {
      parsed.score = 30;
    }
    parsed.score = Math.max(0, Math.min(100, parsed.score));

    // Hard safety override for very young ages
    if (ageNum < 30 && bracket !== "Teen") {
      parsed.ageGroup = "Reproductive";
    }

    res.json(parsed);
  } catch (err) {
    console.error("Groq analyze error:", err);
    res.status(500).json({ error: "Failed to analyze", message: err.message });
  }
});

module.exports = router;