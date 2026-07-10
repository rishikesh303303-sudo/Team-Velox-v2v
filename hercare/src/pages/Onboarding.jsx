import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";


/**
 * HerWellness — Onboarding
 * React + Tailwind CSS port of the original static HTML/CSS/JS version.
 *
 * UPDATED:
 * - Age select supports a custom "Other (Enter manually)" input.
 * - "Get My Results" now triggers a real API call to the backend
 *   (POST /api/analyze) which calls Groq and returns an age-bracket-aware
 *   stage, score, tagWord, and personalized insight.
 * - AnalyzingStep runs the fake progress animation AND waits for the
 *   real API response before moving on to Results.
 * - ResultsStep now renders whatever the AI/backend returned instead of
 *   computing the score locally.
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
@keyframes spin-orb { to { transform: rotate(360deg); } }
@keyframes pulse-dot { 0%,100% { box-shadow: 0 0 0 0 rgba(236,72,153,.35);} 50% { box-shadow: 0 0 0 6px rgba(236,72,153,0);} }
.orb-ring::before {
  content:'';
  position:absolute; inset:-8px;
  border-radius:50%;
  border:3px solid transparent;
  border-top-color:#ec4899;
  border-right-color:#a855f7;
  animation: spin-orb 1.1s linear infinite;
}
.pulse-ring { animation: pulse-dot 1s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .orb-ring::before, .pulse-ring { animation: none; }
}
`;

const STEPS = ["welcome", "1", "2", "3", "4", "5", "analyzing", "results"];

const GOAL_OPTIONS = [
  { value: "Symptom Relief", emoji: "🌿", desc: "Manage and reduce uncomfortable symptoms" },
  { value: "Doctor Consultation", emoji: "🩺", desc: "Prepare for a better consultation" },
  { value: "Lifestyle Guidance", emoji: "✨", desc: "Improve overall wellness and lifestyle" },
];

const CYCLE_OPTIONS = [
  { value: "Regular", desc: "My cycles are regular" },
  { value: "Irregular", desc: "My cycles are irregular" },
  { value: "Missed 3–6 months", desc: "I haven't had a period for 3-6 months" },
  { value: "No period for 12+ months", desc: "I haven't had a period for 12+ months" },
];

const SYMPTOM_OPTIONS = [
  { value: "Hot Flashes / Night Sweats", emoji: "🔥" },
  { value: "Mood Swings / Anxiety", emoji: "😟" },
  { value: "Insomnia / Brain Fog", emoji: "🌙" },
  { value: "Joint Pain / Stiffness", emoji: "🦴" },
  { value: "Weight Gain", emoji: "⚖️" },
  { value: "Vaginal Dryness", emoji: "💧" },
];

const SEVERITY_OPTIONS = ["Low", "Moderate", "Severe"];

const CONDITION_OPTIONS = ["PCOS", "Thyroid Disorder", "Diabetes", "High Blood Pressure", "None of the above"];

const TASKS = [
  "Evaluating your symptoms",
  "Analyzing hormonal patterns",
  "Checking risk factors",
  "Generating your personalized insights",
];

// Age options shown in the dropdown. Kept separate so we can easily check
// whether the current answers.age value matches a preset or is custom.
const AGE_OPTIONS = ["25 years", "30 years", "38 years", "42 years", "48 years", "55 years"];

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function App() {
  
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animClass, setAnimClass] = useState("active");
  const [toastMsg, setToastMsg] = useState(null);

  // Holds whatever the backend /api/analyze returns: { ageGroup, stage, score, tagWord, insight }
  const [aiResult, setAiResult] = useState(null);

  const [answers, setAnswers] = useState({
    age: "38 years",
    goal: null,
    lastPeriod: "2024-04-25",
    cycle: null,
    symptoms: [],
    severity: null,
    hrt: null,
    conditions: [],
  });

  // Preselect defaults to mirror original first-load behavior
  useEffect(() => {
    setAnswers((a) => ({
      ...a,
      goal: "Doctor Consultation",
      cycle: "Irregular",
      symptoms: [
        "Hot Flashes / Night Sweats",
        "Mood Swings / Anxiety",
        "Insomnia / Brain Fog",
        "Joint Pain / Stiffness",
        "Weight Gain",
      ],
      severity: "Moderate",
      hrt: "Yes",
      conditions: ["PCOS", "Thyroid Disorder"],
    }));
  }, []);

  const goToIndex = useCallback((index, dir) => {
    setDirection(dir);
    setAnimClass("enter-" + dir);
    requestAnimationFrame(() => {
      setCurrent(index);
      setAnimClass("active");
    });
  }, []);

  const goNext = () => {
    if (current < STEPS.length - 1) {
      goToIndex(current + 1, "next");
    }
  };
  const goBack = () => {
    if (current > 0) goToIndex(current - 1, "back");
  };
  const jumpTo = (step) => goToIndex(STEPS.indexOf(step), "back");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  const toggleSymptom = (value) => {
    setAnswers((a) => {
      const has = a.symptoms.includes(value);
      return { ...a, symptoms: has ? a.symptoms.filter((s) => s !== value) : [...a.symptoms, value] };
    });
  };
  const toggleCondition = (value) => {
    setAnswers((a) => {
      const has = a.conditions.includes(value);
      return { ...a, conditions: has ? a.conditions.filter((c) => c !== value) : [...a.conditions, value] };
    });
  };

  const step1Valid = !!answers.goal && !!answers.age;
  const step2Valid = !!answers.cycle;
  const step3Valid = answers.symptoms.length > 0 && !!answers.severity;

  const stepName = STEPS[current];

  return (
    <div className="font-body min-h-screen page-bg text-[#3b2440]">
      <style>{FONT_STYLE}</style>

      <div className="max-w-[640px] mx-auto px-5 pt-10 pb-16 min-h-screen flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2 justify-center mb-7">
          <div className="w-[34px] h-[34px] rounded-[10px] grad-bg flex items-center justify-center text-white text-base shadow-soft">
            ✿
          </div>
          <span className="font-display font-semibold text-xl brand-grad-text">HerWellness</span>
        </div>

        {/* Stage */}
        <div className="relative flex-1 min-h-[620px]">
          <StepCard visible={stepName === "welcome"} animClass={animClass}>
            <WelcomeStep onNext={goNext} />
          </StepCard>

          <StepCard visible={stepName === "1"} animClass={animClass}>
            <Step1
              answers={answers}
              setAnswers={setAnswers}
              onBack={goBack}
              onNext={goNext}
              onSave={() => showToast("Progress saved!")}
              valid={step1Valid}
            />
          </StepCard>

          <StepCard visible={stepName === "2"} animClass={animClass}>
            <Step2 answers={answers} setAnswers={setAnswers} onBack={goBack} onNext={goNext} valid={step2Valid} />
          </StepCard>

          <StepCard visible={stepName === "3"} animClass={animClass}>
            <Step3
              answers={answers}
              toggleSymptom={toggleSymptom}
              setAnswers={setAnswers}
              onBack={goBack}
              onNext={goNext}
              valid={step3Valid}
            />
          </StepCard>

          <StepCard visible={stepName === "4"} animClass={animClass}>
            <Step4 answers={answers} setAnswers={setAnswers} toggleCondition={toggleCondition} onBack={goBack} onNext={goNext} />
          </StepCard>

          <StepCard visible={stepName === "5"} animClass={animClass}>
            <ReviewStep
              answers={answers}
              onBack={goBack}
              onJump={jumpTo}
              onGetResults={() => goToIndex(STEPS.indexOf("analyzing"), "next")}
            />
          </StepCard>

          <StepCard visible={stepName === "analyzing"} animClass={animClass}>
            <AnalyzingStep
              active={stepName === "analyzing"}
              answers={answers}
              onResult={(data) => setAiResult(data)}
              onDone={() => goToIndex(STEPS.indexOf("results"), "next")}
            />
          </StepCard>

          <StepCard visible={stepName === "results"} animClass={animClass}>
            <ResultsStep
              active={stepName === "results"}
              answers={answers}
              aiResult={aiResult}
              onCta={() => showToast("Generating your care plan...")}
            />
          </StepCard>
        </div>

        {/* Footer trust */}
        <div className="grid grid-cols-3 gap-3.5 max-w-[640px] mx-auto mt-8 px-5 w-full">
          <TrustFoot icon="📋" title="Save & Resume Anytime" sub="Your progress is always saved" />
          <TrustFoot icon="🛡️" title="Secure & Private" sub="Your data is 100% confidential" />
          <TrustFoot icon="💗" title="Personalized for You" sub="Insights tailored to your unique journey" />
        </div>
      </div>

      {toastMsg && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white py-3 px-6 rounded-2xl font-semibold text-sm shadow-2xl z-[999] transition-opacity duration-300"
          style={{ background: "linear-gradient(135deg,#f472b6,#9333ea)" }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}

/* ---------------- Shared bits ---------------- */

function StepCard({ visible, animClass, children }) {
  if (!visible) return null;
  const entering = animClass === "enter-next" ? "translate-x-[60px] opacity-0" : animClass === "enter-back" ? "-translate-x-[60px] opacity-0" : "translate-x-0 opacity-100";
  return (
    <div
      className={
        "absolute inset-0 bg-white rounded-[28px] shadow-soft-lg px-[30px] pt-[34px] pb-7 flex flex-col overflow-y-auto overflow-x-hidden transition-all duration-500 ease-out " +
        entering
      }
    >
      {children}
    </div>
  );
}

function StepHeader({ step, total, pct, onBack }) {
  return (
    <div className="flex items-center gap-3.5 mb-2.5">
      <div
        onClick={onBack}
        className="w-[38px] h-[38px] rounded-xl border border-[#f0e0ea] bg-white flex items-center justify-center cursor-pointer text-[#7c6a83] hover:bg-pink-50 hover:border-pink-500 hover:text-pink-600 transition flex-shrink-0"
      >
        ←
      </div>
      <div className="flex-1">
        <div className="text-[13px] text-[#7c6a83] font-semibold flex justify-between">
          <span>Step {step} of {total}</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-[7px] rounded-full bg-[#f3e3ee] overflow-hidden">
          <div className="h-full rounded-full grad-bg transition-all duration-500" style={{ width: pct + "%" }} />
        </div>
      </div>
    </div>
  );
}

function IconBadge({ children }) {
  return (
    <div className="w-[46px] h-[46px] rounded-2xl grad-soft-bg flex items-center justify-center text-xl mb-3.5">
      {children}
    </div>
  );
}

function FooterRow({ children }) {
  return <div className="mt-auto pt-4 flex items-center justify-between gap-3">{children}</div>;
}

function PrimaryBtn({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        "border-none rounded-2xl py-3 px-[22px] font-bold text-[14.5px] font-body flex items-center gap-2 text-white grad-bg shadow-soft transition-all duration-200 hover:enabled:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed " +
        className
      }
    >
      {children}
    </button>
  );
}

function OutlineBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border-[1.5px] border-[#f0e0ea] text-[#7c6a83] rounded-2xl py-3 px-[22px] font-bold text-[14.5px] font-body hover:border-pink-500 hover:text-pink-600 transition"
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="bg-transparent text-pink-600 py-3 px-1.5 font-bold text-[14.5px] font-body">
      {children}
    </button>
  );
}

function TrustFoot({ icon, title, sub }) {
  return (
    <div className="text-center">
      <div className="w-[38px] h-[38px] rounded-xl bg-white shadow-soft flex items-center justify-center mx-auto mb-2 text-base">
        {icon}
      </div>
      <b className="text-[12.5px] block mb-0.5">{title}</b>
      <span className="text-[11px] text-[#7c6a83]">{sub}</span>
    </div>
  );
}

/* ---------------- Welcome ---------------- */

function WelcomeStep({ onNext }) {
  return (
    <div className="text-center pt-2.5">
      <div className="w-[120px] h-[120px] mx-auto mb-4.5 rounded-full grad-soft-bg flex items-center justify-center text-5xl">
        🧘‍♀️
      </div>
      <h1 className="font-display text-[26px] mb-1.5 leading-tight">
        Let's understand your body better, <span className="brand-grad-text">Neha</span> 💗
      </h1>
      <p className="text-[#7c6a83] text-sm mx-auto mb-5 max-w-[380px]">
        This quick assessment will help us personalize your wellness journey.
      </p>
      <div className="flex flex-col gap-3 text-left max-w-[320px] mx-auto mb-6">
        <TrustItem icon="🔒" label="Safe & Private" />
        <TrustItem icon="⏱" label="Takes just 3–5 minutes" />
        <TrustItem icon="💗" label="Personalized for You" />
      </div>
      <PrimaryBtn onClick={onNext} className="w-full justify-center py-[15px] text-[15.5px] rounded-2xl">
        Let's Begin →
      </PrimaryBtn>
      <div className="text-xs text-[#7c6a83] mt-3">You can save and resume anytime</div>
    </div>
  );
}

function TrustItem({ icon, label }) {
  return (
    <div className="flex items-center gap-2.5 text-[13.5px] font-semibold">
      <span className="w-[26px] h-[26px] rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-[13px] flex-shrink-0">
        {icon}
      </span>
      {label}
    </div>
  );
}

/* ---------------- Step 1 ---------------- */

function Step1({ answers, setAnswers, onBack, onNext, onSave, valid }) {
  // Custom age mode is active if the current age value is non-empty
  // but doesn't match any of the preset dropdown options.
  const [customAge, setCustomAge] = useState(
    !!answers.age && !AGE_OPTIONS.includes(answers.age)
  );

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setCustomAge(true);
      setAnswers((a) => ({ ...a, age: "" })); // clear so user types fresh
    } else {
      setCustomAge(false);
      setAnswers((a) => ({ ...a, age: val }));
    }
  };

  const handleCustomAgeChange = (e) => {
    const num = e.target.value;
    setAnswers((a) => ({ ...a, age: num ? `${num} years` : "" }));
  };

  return (
    <>
      <StepHeader step={1} total={5} pct={20} onBack={onBack} />
      <IconBadge>👤</IconBadge>
      <h2 className="font-display text-[22px] font-semibold mb-1">First, a few basics about you</h2>
      <p className="text-sm text-[#7c6a83] mb-[22px]">Help us personalize your experience</p>

      <label className="text-[13.5px] font-bold mb-2 block">What is your age?</label>
      <select
        value={customAge ? "custom" : answers.age}
        onChange={handleSelectChange}
        className="w-full py-[13px] px-3.5 rounded-2xl border-[1.5px] border-[#f0e0ea] text-[14.5px] bg-white outline-none mb-3 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
      >
        <option value="">Select your age</option>
        {AGE_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
        <option value="custom">Other (Enter manually)</option>
      </select>

      {customAge && (
        <input
          type="number"
          inputMode="numeric"
          placeholder="Enter your age"
          min="15"
          max="100"
          value={answers.age.replace(" years", "")}
          onChange={handleCustomAgeChange}
          className="w-full py-[13px] px-3.5 rounded-2xl border-[1.5px] border-[#f0e0ea] text-[14.5px] bg-white outline-none mb-5 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
          autoFocus
        />
      )}

      {!customAge && <div className="mb-2" />}

      <label className="text-[13.5px] font-bold mb-2 block">What is your primary goal today?</label>
      {GOAL_OPTIONS.map((opt) => {
        const selected = answers.goal === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => setAnswers((a) => ({ ...a, goal: opt.value }))}
            className={
              "border-[1.5px] rounded-2xl p-3.5 px-4 flex items-start gap-3 cursor-pointer mb-3 transition-all bg-white hover:border-pink-300 hover:-translate-y-0.5 " +
              (selected ? "border-pink-500 bg-pink-500/[0.06] shadow-md" : "border-[#f0e0ea]")
            }
          >
            <span className="text-xl leading-none mt-0.5">{opt.emoji}</span>
            <div>
              <b className="block text-[14.5px] font-bold mb-0.5">{opt.value}</b>
              <small className="text-[#7c6a83] text-[12.5px] font-medium">{opt.desc}</small>
            </div>
            <div
              className={
                "ml-auto w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition " +
                (selected ? "border-pink-500 bg-pink-500" : "border-[#e3d0dd]")
              }
            >
              {selected && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
            </div>
          </div>
        );
      })}

      <FooterRow>
        <GhostBtn onClick={onSave}>Save &amp; Resume</GhostBtn>
        <PrimaryBtn onClick={onNext} disabled={!valid}>
          Next →
        </PrimaryBtn>
      </FooterRow>
    </>
  );
}

/* ---------------- Step 2 ---------------- */

function Step2({ answers, setAnswers, onBack, onNext, valid }) {
  return (
    <>
      <StepHeader step={2} total={5} pct={40} onBack={onBack} />
      <IconBadge>📅</IconBadge>
      <h2 className="font-display text-[22px] font-semibold mb-1">Let's talk about your menstrual cycle</h2>
      <p className="text-sm text-[#7c6a83] mb-[22px]">This helps us understand your hormonal patterns</p>

      <label className="text-[13.5px] font-bold mb-2 block">When was your last period?</label>
      <input
        type="date"
        value={answers.lastPeriod}
        onChange={(e) => setAnswers((a) => ({ ...a, lastPeriod: e.target.value }))}
        className="w-full py-[13px] px-3.5 rounded-2xl border-[1.5px] border-[#f0e0ea] text-[14.5px] bg-white outline-none mb-5 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
      />

      <label className="text-[13.5px] font-bold mb-2 block">How would you describe your cycle?</label>
      {CYCLE_OPTIONS.map((opt) => {
        const selected = answers.cycle === opt.value;
        return (
          <div
            key={opt.value}
            onClick={() => setAnswers((a) => ({ ...a, cycle: opt.value }))}
            className={
              "border-[1.5px] rounded-2xl p-3.5 px-4 flex items-start gap-3 cursor-pointer mb-3 transition-all bg-white hover:border-pink-300 hover:-translate-y-0.5 " +
              (selected ? "border-pink-500 bg-pink-500/[0.06] shadow-md" : "border-[#f0e0ea]")
            }
          >
            <div
              className={
                "w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition " +
                (selected ? "border-pink-500 bg-pink-500" : "border-[#e3d0dd]")
              }
            >
              {selected && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
            </div>
            <div>
              <b className="block text-[14.5px] font-bold mb-0.5">{opt.value}</b>
              <small className="text-[#7c6a83] text-[12.5px] font-medium">{opt.desc}</small>
            </div>
          </div>
        );
      })}

      <FooterRow>
        <OutlineBtn onClick={onBack}>← Back</OutlineBtn>
        <PrimaryBtn onClick={onNext} disabled={!valid}>
          Next →
        </PrimaryBtn>
      </FooterRow>
    </>
  );
}

/* ---------------- Step 3 ---------------- */

function Step3({ answers, toggleSymptom, setAnswers, onBack, onNext, valid }) {
  return (
    <>
      <StepHeader step={3} total={5} pct={60} onBack={onBack} />
      <IconBadge>💗</IconBadge>
      <h2 className="font-display text-[22px] font-semibold mb-1">What symptoms are you experiencing?</h2>
      <p className="text-sm text-[#7c6a83] mb-[22px]">Select all that apply and rate their severity</p>

      <div className="grid grid-cols-3 gap-2.5 mb-[18px]">
        {SYMPTOM_OPTIONS.map((s) => {
          const selected = answers.symptoms.includes(s.value);
          return (
            <div
              key={s.value}
              onClick={() => toggleSymptom(s.value)}
              className={
                "relative border-[1.5px] rounded-2xl p-3.5 px-2.5 text-center cursor-pointer transition bg-white hover:-translate-y-0.5 hover:border-pink-300 " +
                (selected ? "border-pink-500 shadow-md" : "border-[#f0e0ea]")
              }
              style={selected ? { background: "linear-gradient(160deg,#fff0f7,#fdf5ff)" } : {}}
            >
              {selected && (
                <div className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full grad-bg text-white text-[11px] flex items-center justify-center">
                  ✓
                </div>
              )}
              <span className="text-[22px] block mb-1.5">{s.emoji}</span>
              <span className="text-[12.5px] font-bold leading-tight block">{s.value}</span>
            </div>
          );
        })}
      </div>

      <label className="text-[13.5px] font-bold mb-2 block">Rate the severity of your selected symptoms</label>
      <div className="grid grid-cols-3 gap-2.5 mb-1.5">
        {SEVERITY_OPTIONS.map((sev) => {
          const selected = answers.severity === sev;
          return (
            <div
              key={sev}
              onClick={() => setAnswers((a) => ({ ...a, severity: sev }))}
              className={
                "py-3 text-center rounded-2xl border-[1.5px] font-bold text-[13.5px] cursor-pointer transition " +
                (selected ? "text-white border-transparent shadow-md grad-bg" : "bg-white text-[#7c6a83] border-[#f0e0ea]")
              }
            >
              {sev}
            </div>
          );
        })}
      </div>

      <FooterRow>
        <OutlineBtn onClick={onBack}>← Back</OutlineBtn>
        <PrimaryBtn onClick={onNext} disabled={!valid}>
          Next →
        </PrimaryBtn>
      </FooterRow>
    </>
  );
}

/* ---------------- Step 4 ---------------- */

function Step4({ answers, setAnswers, toggleCondition, onBack, onNext }) {
  return (
    <>
      <StepHeader step={4} total={5} pct={80} onBack={onBack} />
      <IconBadge>🛡️</IconBadge>
      <h2 className="font-display text-[22px] font-semibold mb-1">Medical history &amp; lifestyle</h2>
      <p className="text-sm text-[#7c6a83] mb-[22px]">This helps us provide more accurate insights</p>

      <label className="text-[13.5px] font-bold mb-2 block">
        Are you currently taking any supplements or Hormone Replacement Therapy (HRT)?
      </label>
      <div className="flex gap-3 mb-5">
        {["Yes", "No"].map((v) => {
          const selected = answers.hrt === v;
          return (
            <div
              key={v}
              onClick={() => setAnswers((a) => ({ ...a, hrt: v }))}
              className={
                "flex-1 text-center py-3.5 rounded-2xl border-[1.5px] font-bold cursor-pointer transition bg-white " +
                (selected ? "border-pink-500 bg-pink-50 text-pink-600 shadow-md" : "border-[#f0e0ea]")
              }
            >
              {v}
            </div>
          );
        })}
      </div>

      <label className="text-[13.5px] font-bold mb-2 block">
        Do you have any of the following conditions? <span className="text-xs font-normal text-[#7c6a83] ml-1">(Select all that apply)</span>
      </label>
      {CONDITION_OPTIONS.map((c) => {
        const selected = answers.conditions.includes(c);
        return (
          <div
            key={c}
            onClick={() => toggleCondition(c)}
            className={
              "flex items-center gap-3 py-3.5 px-4 border-[1.5px] rounded-2xl mb-2.5 cursor-pointer transition font-semibold text-sm " +
              (selected ? "border-pink-500 bg-pink-50" : "border-[#f0e0ea] hover:border-pink-300")
            }
          >
            <div
              className={
                "w-[19px] h-[19px] rounded-md border-2 flex-shrink-0 flex items-center justify-center text-xs text-white transition " +
                (selected ? "bg-pink-500 border-pink-500" : "border-[#e3d0dd]")
              }
            >
              {selected && "✓"}
            </div>
            {c}
          </div>
        );
      })}

      <FooterRow>
        <OutlineBtn onClick={onBack}>← Back</OutlineBtn>
        <PrimaryBtn onClick={onNext}>Next →</PrimaryBtn>
      </FooterRow>
    </>
  );
}

/* ---------------- Step 5: Review ---------------- */

function ReviewStep({ answers, onBack, onJump, onGetResults }) {
  const items = [
    { ic: "👤", title: "Age", val: answers.age, step: "1" },
    { ic: "🎯", title: "Primary Goal", val: answers.goal || "—", step: "1" },
    { ic: "📅", title: "Last Period", val: formatDate(answers.lastPeriod), step: "2" },
    { ic: "🔄", title: "Cycle Regularity", val: answers.cycle || "—", step: "2" },
    { ic: "💗", title: "Top Symptoms", val: answers.symptoms.join(", ") || "—", step: "3" },
    { ic: "💊", title: "Supplements / HRT", val: answers.hrt || "—", step: "4" },
    { ic: "📝", title: "Conditions", val: answers.conditions.join(", ") || "None", step: "4" },
  ];

  return (
    <>
      <StepHeader step={5} total={5} pct={100} onBack={onBack} />
      <IconBadge>📋</IconBadge>
      <h2 className="font-display text-[22px] font-semibold mb-1">Almost there! Let's review your responses</h2>
      <p className="text-sm text-[#7c6a83] mb-[22px]">You can go back and edit if needed</p>

      <div>
        {items.map((it, i) => (
          <div key={i} className="flex items-start justify-between gap-2.5 py-3.5 border-b border-[#f0e0ea] last:border-b-0">
            <div className="flex gap-3 items-start">
              <div className="w-[34px] h-[34px] rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-[15px] flex-shrink-0">
                {it.ic}
              </div>
              <div>
                <b className="text-[13.5px] block">{it.title}</b>
                <small className="text-[#7c6a83] text-[12.5px]">{it.val}</small>
              </div>
            </div>
            <button onClick={() => onJump(it.step)} className="text-[12.5px] font-bold text-pink-600 flex-shrink-0">
              Edit
            </button>
          </div>
        ))}
      </div>

      <FooterRow>
        <OutlineBtn onClick={onBack}>← Back</OutlineBtn>
        <PrimaryBtn onClick={onGetResults}>Get My Results ✨</PrimaryBtn>
      </FooterRow>
    </>
  );
}

/* ---------------- Analyzing ---------------- */

function AnalyzingStep({ active, answers, onDone, onResult }) {
  const [doneCount, setDoneCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    setDoneCount(0);
    setActiveIdx(-1);
    let i = 0;

    // Kick off the real API call in parallel with the fake progress animation
    let apiDone = false;
    let apiData = null;
    let apiFailed = false;

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          apiFailed = true;
        } else {
          apiData = data;
        }
        apiDone = true;
      })
      .catch(() => {
        apiFailed = true;
        apiDone = true;
      });

    function step() {
      setActiveIdx(i);
      if (i > 0) setDoneCount(i);
      if (i < TASKS.length) {
        i++;
        timerRef.current = setTimeout(step, 700);
      } else {
        setDoneCount(TASKS.length);
        // Wait for the real API response before moving to Results,
        // but don't let the fake animation finish before it's ready either.
        function waitForApi() {
          if (apiDone) {
            onResult(apiFailed ? null : apiData);
            timerRef.current = setTimeout(onDone, 400);
          } else {
            timerRef.current = setTimeout(waitForApi, 300);
          }
        }
        waitForApi();
      }
    }
    step();
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="text-center pt-5">
      <div className="orb-ring relative w-[112px] h-[112px] mx-auto mb-5 rounded-full grad-soft-bg flex items-center justify-center text-[44px]">
        🤖
      </div>
      <h2 className="font-display text-xl mb-1">Analyzing your answers…</h2>
      <p className="text-[13.5px] text-[#7c6a83] mb-[22px]">Our AI is working its magic ✨</p>
      <div className="bg-pink-50 rounded-2xl p-4 px-[18px] text-left max-w-[360px] mx-auto mb-[18px]">
        {TASKS.map((t, idx) => {
          const isDone = idx < doneCount;
          const isActive = idx === activeIdx && !isDone;
          return (
            <div
              key={t}
              className={
                "flex items-center gap-2.5 py-2 text-[13.5px] font-semibold transition-opacity duration-400 " +
                (isDone || isActive ? "opacity-100 text-[#3b2440]" : "opacity-40 text-[#7c6a83]")
              }
            >
              <div
                className={
                  "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[11px] text-white " +
                  (isDone ? "bg-[#22b07d] border-[#22b07d]" : isActive ? "border-pink-500 pulse-ring" : "border-[#e3d0dd]")
                }
              >
                {isDone ? "✓" : ""}
              </div>
              {t}
            </div>
          );
        })}
      </div>
      <div className="text-[12.5px] text-pink-600 font-semibold bg-pink-50 inline-block py-2 px-4 rounded-full">
        💗 This will just take a few seconds…
      </div>
    </div>
  );
}

/* ---------------- Results ---------------- */

function ResultsStep({ active, answers, aiResult, onCta }) {
   const navigate = useNavigate();
  const [displayNum, setDisplayNum] = useState(0);
  const [arcOffset, setArcOffset] = useState(251);
  const rafRef = useRef(null);

  const hasResult = !!aiResult;
  const stage = aiResult?.stage || "—";
  const ageGroup = aiResult?.ageGroup;
  const score = aiResult?.score ?? 0;
  const tagWord = aiResult?.tagWord || "—";
  const insightText =
    aiResult?.insight ||
    "We couldn't generate a personalized insight right now. Please try again in a moment, or consult a doctor for a full evaluation.";

  // Heading changes tone depending on the age group so we're not implying
  // menopause/perimenopause for younger users.
  const headingLabel =
    ageGroup === "Teen" || ageGroup === "Reproductive"
      ? "Your current cycle health status is"
      : "You are currently in";

  useEffect(() => {
    if (!active) return;

    const circumference = 251;
    requestAnimationFrame(() => {
      setArcOffset(circumference - circumference * (score / 100));
    });

    const dur = 1200;
    const startTime = performance.now();
    function tick(t) {
      const p = Math.min(1, (t - startTime) / dur);
      setDisplayNum(Math.round(p * score));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, score]);

  return (
    <>
      <div className="text-center mb-[18px]">
        <h2 className="font-display text-xl mb-1">Your Assessment Results 🎉</h2>
        <p className="text-[#7c6a83] text-[13px] m-0">Here's your personalized health overview</p>
      </div>

      <div
        className="rounded-[20px] p-5 px-[22px] mb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(120deg,#fde3ef,#f3e3fb)" }}
      >
        <div className="text-[13px] font-bold text-purple-600 mb-0.5">{headingLabel}</div>
        <h3 className="font-display text-[23px] m-0 mb-2.5 text-pink-600">
          {hasResult ? stage : "Loading…"}
        </h3>
        <span className="inline-block bg-white py-1.5 px-3.5 rounded-full text-[11.5px] font-bold text-purple-600">
          Stage Detected
        </span>
      </div>

      <div className="text-center mb-5">
        <div className="text-[13px] font-bold text-[#7c6a83] mb-2">Symptom Intensity Score</div>
        <svg width="200" height="120" viewBox="0 0 200 120" className="mx-auto">
          <path
            d="M20,110 A80,80 0 0 1 180,110"
            fill="none"
            stroke="#f3e3ee"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M20,110 A80,80 0 0 1 180,110"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={arcOffset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}
          />
          <defs>
            <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <span className="text-[26px] font-bold text-[#3b2440]">{displayNum}</span>
          <span className="text-[15px] font-semibold text-[#7c6a83]"> / 100</span>
        </div>
        <div className="text-[12.5px] text-[#7c6a83] font-bold mt-0.5">{tagWord}</div>
      </div>

      <div className="bg-pink-50 rounded-2xl p-4 px-[18px] mb-[22px] text-[13.5px] leading-relaxed">
        <div className="font-bold text-pink-600 flex items-center gap-1.5 mb-2 text-[13.5px]">💡 AI Insights</div>
        <div>{insightText}</div>
      </div>

     <PrimaryBtn
  onClick={() => navigate("/care-plan", { state: { answers, aiResult } })}
  className="w-full justify-center py-[15px] text-[15.5px] rounded-2xl"
>
  Generate My Personalized Care Plan →
</PrimaryBtn>
<div className="text-xs text-center text-[#7c6a83] mt-3">🔒 Your data is private and secure</div>
    </>
  );
}