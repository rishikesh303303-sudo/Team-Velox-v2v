import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * HerWellness — Personalized Care Plan
 *
 * Expects to be navigated to with state:
 *   navigate("/care-plan", { state: { answers, aiResult } })
 * where `answers` is the onboarding answers object and `aiResult` is
 * whatever /api/analyze returned (stage, ageGroup, score, tagWord, insight).
 *
 * On mount, calls POST /api/care-plan with { answers, aiResult } and renders
 * the AI-generated categories (Dietary Adjustments, Supplements & Hydration,
 * Sleep Hygiene Routine, etc). "Get New Suggestions" re-fetches a fresh plan.
 */

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap');
.font-display { font-family: 'Fraunces', serif; }
.font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
.brand-grad-text {
  background: linear-gradient(135deg,#f472b6 0%,#c026d3 55%,#9333ea 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.grad-bg { background: linear-gradient(135deg,#f472b6 0%,#c026d3 55%,#9333ea 100%); }
.grad-soft-bg { background: linear-gradient(135deg,#fde3ef 0%,#f3e3fb 100%); }
.page-bg {
  background:
    radial-gradient(circle at 12% 8%, #ffe0ef 0%, transparent 45%),
    radial-gradient(circle at 90% 12%, #efe0ff 0%, transparent 40%),
    linear-gradient(180deg,#fff7fb 0%, #fdf3fb 100%);
}
.shadow-soft { box-shadow: 0 10px 30px -12px rgba(154,42,148,0.18); }
.shadow-soft-lg { box-shadow: 0 24px 60px -18px rgba(124,32,140,0.28); }
@keyframes pulse-dot { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
.loading-dot { animation: pulse-dot 1.2s ease-in-out infinite; }
`;

const CATEGORY_COLORS = {
  diet: { card: "bg-pink-50/60", badge: "text-pink-600 bg-white" },
  supplements: { card: "bg-purple-50/60", badge: "text-purple-600 bg-white" },
  sleep: { card: "bg-indigo-50/40", badge: "text-purple-600 bg-white" },
};

function formatDateNice(d) {
  const dt = d ? new Date(d) : new Date();
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Renders "text with **highlighted** phrase" -> bold pink span
function HighlightedText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-pink-600 font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export default function CarePlan() {
  const location = useLocation();
  const navigate = useNavigate();

  const answers =
    location.state?.answers ||
    JSON.parse(localStorage.getItem("herwellness_answers") || "null");
  const aiResult =
    location.state?.aiResult ||
    JSON.parse(localStorage.getItem("herwellness_ai_result") || "null");

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [openWhy, setOpenWhy] = useState({});
  const progressTimer = useRef(null);

  const fetchPlan = () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    // Fake progress bar while the real request runs, similar to onboarding's analyzing step
    let p = 0;
    progressTimer.current = setInterval(() => {
      p = Math.min(p + Math.random() * 12, 92);
      setProgress(Math.round(p));
    }, 350);

    fetch("/api/care-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, aiResult }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setError(data.error);
        } else {
          setPlan(data);
          setProgress(100);
        }
      })
      .catch(() => setError("Something went wrong while generating your plan."))
      .finally(() => {
        clearInterval(progressTimer.current);
        setTimeout(() => setLoading(false), 400);
      });
  };

  useEffect(() => {
    if (!answers) {
      setError("Missing onboarding data. Please complete the assessment first.");
      setLoading(false);
      return;
    }
    fetchPlan();
    return () => clearInterval(progressTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleItem = (catId, idx) => {
    const key = `${catId}-${idx}`;
    setCheckedItems((c) => ({ ...c, [key]: !c[key] }));
  };

  const toggleWhy = (catId) => {
    setOpenWhy((w) => ({ ...w, [catId]: !w[catId] }));
  };

  const stage = aiResult?.stage || "—";
  const planFocus = plan?.planFocus || "Personalized Wellness";

  return (
    <div className="font-body min-h-screen page-bg text-[#3b2440]">
      <style>{FONT_STYLE}</style>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-14 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl border border-[#f0e0ea] bg-white flex items-center justify-center text-[#7c6a83] hover:border-pink-400 hover:text-pink-600 transition flex-shrink-0"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] grad-bg flex items-center justify-center text-white text-base shadow-soft">
              ✿
            </div>
            <span className="font-display font-semibold text-xl brand-grad-text">HerWellness</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#f0e0ea] bg-white text-[#7c6a83] text-sm font-semibold hover:border-pink-400 hover:text-pink-600 transition flex-shrink-0"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="sm:hidden w-10 h-10 rounded-xl border border-[#f0e0ea] bg-white flex items-center justify-center text-[#7c6a83] hover:border-pink-400 hover:text-pink-600 transition flex-shrink-0"
              aria-label="Go to dashboard"
            >
              📊
            </button>
          </div>
        </div>

        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
          <div>
            <h1 className="font-display text-[32px] md:text-[36px] font-bold leading-tight mb-1">
              Your Personalized Plan
            </h1>
            <div className="flex items-center gap-2 text-pink-600 font-semibold mb-1">
              for {formatDateNice()} <span>📅</span>
            </div>
            <p className="text-sm text-[#7c6a83]">AI-powered plan based on your stage, symptoms &amp; goals</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-5 min-w-[240px] flex-1 max-w-[300px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-full grad-soft-bg flex items-center justify-center text-sm">💡</span>
              <span className="text-[13px] font-semibold text-[#7c6a83]">Your Stage</span>
            </div>
            <div className="font-display text-lg font-bold text-pink-600 mb-3">{stage}</div>
            <div className="text-[13px] font-semibold text-[#7c6a83] mb-1">Plan Focus</div>
            <div className="text-sm font-bold">{planFocus}</div>
          </div>
        </div>

        {/* Loading / progress */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full grad-soft-bg flex items-center justify-center text-3xl flex-shrink-0">
              🤖
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold text-lg mb-1">AI is analyzing your symptoms…</div>
              <p className="text-[13px] text-[#7c6a83] mb-3">
                Crafting the perfect plan for your body and wellness goals.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-[#f3e3ee] overflow-hidden">
                  <div
                    className="h-full rounded-full grad-bg transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[13px] font-bold text-pink-600 w-10 text-right">{progress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm text-[#7c6a83] mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {answers && (
                <button
                  onClick={fetchPlan}
                  className="px-5 py-2.5 rounded-full grad-bg text-white font-bold text-sm shadow-soft"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => navigate("/onboarding")}
                className="px-5 py-2.5 rounded-full border-[1.5px] border-[#f0e0ea] text-pink-600 font-bold text-sm bg-white"
              >
                Start New Assessment
              </button>
            </div>
          </div>
        )}

        {/* Plan categories */}
        {!loading && !error && plan && (
          <>
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
              {plan.categories?.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  colorSet={CATEGORY_COLORS[cat.id] || CATEGORY_COLORS.diet}
                  checkedItems={checkedItems}
                  toggleItem={toggleItem}
                  openWhy={!!openWhy[cat.id]}
                  toggleWhy={() => toggleWhy(cat.id)}
                />
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="flex-1 bg-white rounded-2xl shadow-soft p-5 flex items-center gap-4">
                <span className="text-2xl">💗</span>
                <div>
                  <div className="font-display font-semibold mb-0.5">This plan is 100% personalized for you!</div>
                  <p className="text-[13px] text-[#7c6a83]">
                    Keep following your plan daily for better results and long-term wellness.
                  </p>
                </div>
              </div>

              <button
                onClick={fetchPlan}
                className="flex-1 rounded-2xl grad-bg text-white shadow-soft p-5 flex flex-col items-center justify-center gap-1 font-bold hover:-translate-y-0.5 transition"
              >
                <span className="flex items-center gap-2">🔄 Get New Suggestions</span>
                <span className="text-xs font-medium opacity-90">Want different recommendations?</span>
              </button>
            </div>

            <p className="text-center text-xs text-[#7c6a83] mt-6">
              🛡️ This is AI-generated advice. Please consult a doctor for medical emergencies.
            </p>

            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/onboarding")}
                className="text-sm font-bold text-pink-600 hover:text-purple-600 transition underline underline-offset-2"
              >
                Start New Assessment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ cat, colorSet, checkedItems, toggleItem, openWhy, toggleWhy }) {
  return (
    <div className={`rounded-2xl shadow-soft overflow-hidden h-fit ${colorSet.card}`}>
      <div className="p-5 pb-3 flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-3">
          <span className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-soft">
            {cat.icon}
          </span>
          <div>
            <h3 className="font-display font-semibold text-lg">{cat.title}</h3>
            <p className="text-[13px] text-[#7c6a83]">{cat.subtitle}</p>
          </div>
        </div>

        <button
          onClick={toggleWhy}
          className="text-[12.5px] font-bold text-pink-600 bg-white py-1.5 px-3.5 rounded-full flex items-center gap-1.5 shadow-soft flex-shrink-0"
        >
          💡 Why this helps? <span className={"transition-transform " + (openWhy ? "rotate-180" : "")}>⌄</span>
        </button>
      </div>

      {openWhy && (
        <div className="mx-5 mb-3 -mt-1 bg-white/70 rounded-xl px-4 py-3 text-[13px] text-[#5c4a63] leading-relaxed">
          {cat.whyThisHelps}
        </div>
      )}

      <div className="bg-white mx-2 mb-2 rounded-xl overflow-hidden">
        {cat.items?.map((item, idx) => {
          const key = `${cat.id}-${idx}`;
          const checked = !!checkedItems[key];
          return (
            <div
              key={idx}
              className="flex items-start gap-3 px-4 py-3.5 border-b border-[#f5e9f2] last:border-b-0"
            >
              <button
                onClick={() => toggleItem(cat.id, idx)}
                className={
                  "w-[18px] h-[18px] mt-0.5 rounded-md border-2 flex-shrink-0 flex items-center justify-center text-[10px] text-white transition " +
                  (checked ? "bg-pink-500 border-pink-500" : "border-[#e3d0dd]")
                }
              >
                {checked && "✓"}
              </button>
              <p className={"text-sm flex-1 leading-relaxed " + (checked ? "line-through text-[#b7a6bd]" : "")}>
                <HighlightedText text={item.text} />
              </p>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 py-1 px-2.5 rounded-full flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                AI Recommendation ✨
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}