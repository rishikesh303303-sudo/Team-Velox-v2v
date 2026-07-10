import { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Bell, User, Sun, ChevronRight, ArrowRight, ArrowLeft, BatteryMedium,
  Stethoscope, Pill, Users, Sparkles, CalendarCheck, CalendarDays,
  CalendarCheck as CalendarCheckIcon, Flame, Smile, Moon, TrendingUp, ClipboardCheck,
  ChevronDown, Home, ClipboardList, HeartHandshake, HelpCircle, Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   SHARED "DATABASE" — every log, from either the Dashboard's
   quick button or the full Tracker page, is read/written here.
   Both views are fed from the same `logs` state (lifted up to
   <Dashboard>), so an entry logged in one place shows up
   instantly in the other — no separate stores, no reload.
   ========================================================= */
const STORAGE_KEY = "herwellness_symptom_logs";

const hotWords = ["None", "Mild", "Mild", "Moderate", "High", "Severe"];
const moodWords = ["Very Low", "Low", "Okay", "Good", "Good", "Very Good"];
const sleepWords = ["Very Poor", "Poor", "Below Avg", "Average", "Good", "Excellent"];
const wordFor = (v, words) => words[Math.min(v, words.length - 1)];

const seedLogs = [
  { id: 4, dateISO: "2026-05-31T21:30:00", day: 31, month: "May", hotFlash: 3, mood: 4, sleep: 3, note: "Felt a bit tired in the evening.", time: "9:30 PM" },
  { id: 3, dateISO: "2026-05-30T21:15:00", day: 30, month: "May", hotFlash: 4, mood: 3, sleep: 2, note: "Busy day, low energy.", time: "9:15 PM" },
  { id: 2, dateISO: "2026-05-29T20:45:00", day: 29, month: "May", hotFlash: 2, mood: 4, sleep: 4, note: "Had a restful sleep last night.", time: "8:45 PM" },
  { id: 1, dateISO: "2026-05-28T21:10:00", day: 28, month: "May", hotFlash: 3, mood: 2, sleep: 3, note: "Hot flashes were more frequent.", time: "9:10 PM" },
].map((l) => ({ ...l, hotWord: wordFor(l.hotFlash, hotWords), moodWord: wordFor(l.mood, moodWords), sleepWord: wordFor(l.sleep, sleepWords) }));

function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seedLogs;
  } catch {
    return seedLogs;
  }
}

/* ---------------- Illustration placeholders ---------------- */
function WomanIllustration() {
  return <div className="w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0" aria-hidden="true" />;
}
function FlowerDecoration() {
  return <div className="hidden md:block w-28 h-28 flex-shrink-0" aria-hidden="true" />;
}
function SadClipboardIllustration() {
  return <div className="w-24 h-24 mx-auto" aria-hidden="true" />;
}
function RobotIllustration() {
  return <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0" aria-hidden="true" />;
}
function ClipboardIllustration() {
  return <div className="w-full h-40 rounded-2xl" aria-hidden="true" />;
}

/* ---------------- Slider (used in Tracker's Daily Log form) ---------------- */
function Slider({ icon, label, value, onChange, color, minLabel, maxLabel }) {
  const pct = (value / 5) * 100;
  return (
    <div className="mb-7">
      <div className="flex items-center gap-2 text-sm font-semibold text-purple-950 mb-3">
        {icon} {label}
        <span title={`${label}: how you're feeling today, 0 to 5`}>
          <HelpCircle size={14} className="text-purple-300" />
        </span>
      </div>
      <div className="relative pt-6">
        <div
          className="absolute -top-1 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow"
          style={{ left: `${pct}%`, transform: "translateX(-50%)", background: color }}
        >
          {value}
        </div>
        <input
          type="range" min={0} max={5} step={1} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="hw-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${color} ${pct}%, #F6E8F0 ${pct}%)`, accentColor: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-purple-300 mt-2">
        <span>0<br /><span className="text-purple-300">{minLabel}</span></span>
        <span className="self-end">1</span><span className="self-end">2</span>
        <span className="self-end">3</span><span className="self-end">4</span>
        <span className="text-right">5<br /><span className="text-purple-300">{maxLabel}</span></span>
      </div>
    </div>
  );
}

/* =========================================================
   SYMPTOM TRACKER — imported/embedded as its own view.
   Reads/writes the SAME `logs` + `addLog` passed down from
   <Dashboard>, so it's never out of sync with the dashboard.
   ========================================================= */
function SymptomTrackerView({ logs, addLog, onBack }) {
  const [hotFlash, setHotFlash] = useState(3);
  const [mood, setMood] = useState(4);
  const [sleep, setSleep] = useState(3);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    addLog({ hotFlash, mood, sleep, notes });
    setNotes("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const chartData = useMemo(() => {
    return [...logs].slice(0, 8).reverse().map((l) => ({
      label: `${l.month} ${l.day}`, hotFlash: l.hotFlash, mood: l.mood, sleep: l.sleep,
    }));
  }, [logs]);

  const visibleLogs = useMemo(() => logs.slice(0, 4), [logs]);

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-purple-950 pb-8">
      <style>{`
        .hw-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 9999px; background: #fff; border: 4px solid currentColor; box-shadow: 0 2px 6px rgba(107,63,160,0.25); cursor: pointer; }
        .hw-slider::-moz-range-thumb { width: 18px; height: 18px; border-radius: 9999px; background: #fff; border: 4px solid currentColor; cursor: pointer; }
      `}</style>

      <div className="sticky top-0 z-20 bg-pink-50/95 backdrop-blur max-w-6xl mx-auto flex items-center gap-3 px-5 sm:px-8 lg:px-12 py-4">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-700">
          <ArrowLeft size={20} />
        </button>
        <div className="font-serif font-semibold text-lg text-purple-900 flex items-center gap-2">
  <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-200 shadow-sm flex-shrink-0">
    <img 
      src="/assets/logo.jpg" 
      alt="Logo" 
      className="w-full h-full object-cover"
    />
  </div>
  HerCare
</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
       <div className="relative rounded-3xl overflow-hidden mb-5 mt-2 h-[180px] sm:h-[200px]">
  <img
    src="/assets/symptom.jpg"
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
  />
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
    <h1 className="font-serif text-2xl font-semibold text-pink-900 mb-1">Symptom Tracker</h1>
    <p className="text-sm text-pink-700/80 leading-snug max-w-xs">Track your daily symptoms and understand your wellness better.</p>
  </div>
</div>

        {/* Daily Log */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <CalendarCheckIcon size={20} />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-purple-900">Daily Log</h3>
              <p className="text-xs text-purple-400 m-0">How are you feeling today?</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Slider icon={<Flame size={16} className="text-pink-500" />} label="Hot Flash Intensity" value={hotFlash} onChange={setHotFlash} color="#F5578A" minLabel="None" maxLabel="Severe" />
              <Slider icon={<Smile size={16} className="text-violet-500" />} label="Mood" value={mood} onChange={setMood} color="#8B5CF6" minLabel="Very Low" maxLabel="Very Good" />
              <Slider icon={<Moon size={16} className="text-violet-300" />} label="Sleep Quality" value={sleep} onChange={setSleep} color="#C9A6F0" minLabel="Very Poor" maxLabel="Excellent" />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-950 mb-2 block">Notes <span className="text-purple-300 font-normal">(Optional)</span></label>
              <textarea
                rows={8} maxLength={300}
                placeholder="Add any notes about your day..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-pink-100 bg-pink-50/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <div className="text-right text-xs text-purple-300 mt-1">{notes.length}/300</div>
            </div>
          </div>

          <button
            onClick={save}
            className="w-full mt-2 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold flex items-center justify-center gap-2 shadow hover:opacity-90 active:scale-[0.99] transition"
          >
            {saved ? <><Check size={17} /> Saved!</> : <>Save Today's Log <ArrowRight size={17} /></>}
          </button>
        </div>

        {/* Trends */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-serif font-semibold text-purple-900 flex-1">Your Symptom Trends</h3>
            <button className="text-xs font-medium text-purple-700 border border-pink-100 rounded-full px-3 py-1.5 flex items-center gap-1">
              Last 30 Days <ChevronDown size={14} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F6E8F0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#C9B8CC" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "#C9B8CC" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F6E8F0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
              <Line type="monotone" dataKey="hotFlash" name="Hot Flash Intensity" stroke="#F5578A" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1300} animationEasing="ease-out" />
              <Line type="monotone" dataKey="mood" name="Mood" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1300} animationEasing="ease-out" animationBegin={200} />
              <Line type="monotone" dataKey="sleep" name="Sleep Quality" stroke="#C9A6F0" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1300} animationEasing="ease-out" animationBegin={400} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Log History */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <ClipboardCheck size={20} />
            </div>
            <h3 className="font-serif font-semibold text-purple-900 flex-1">Log History</h3>
            <span className="text-xs font-semibold text-pink-600">See All</span>
          </div>
          {visibleLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 py-3 border-b border-pink-50 last:border-0 text-xs">
              <div className="w-10 text-center flex-shrink-0">
                <div className="font-bold text-sm text-purple-950">{log.day}</div>
                <div className="text-[10px] uppercase text-purple-300">{log.month}</div>
              </div>
              <div className="flex items-center gap-1 min-w-[54px] text-purple-500">
                <Flame size={13} className="text-pink-500" /> {log.hotFlash}
                <span className="text-purple-300 hidden sm:inline">{log.hotWord}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[54px] text-purple-500">
                <Smile size={13} className="text-violet-500" /> {log.mood}
                <span className="text-purple-300 hidden sm:inline">{log.moodWord}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[54px] text-purple-500">
                <Moon size={13} className="text-violet-300" /> {log.sleep}
                <span className="text-purple-300 hidden sm:inline">{log.sleepWord}</span>
              </div>
              <div className="flex-1 text-purple-400 hidden sm:block truncate">{log.note}</div>
              <div className="flex items-center gap-1 text-purple-300 flex-shrink-0">
                {log.time} <ChevronRight size={13} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard-only data ---------------- */
const quickActions = [
  { icon: Stethoscope, title: "Book Doctor", subtitle: "Consult experts", color: "text-purple-600", bg: "bg-purple-50", path: "/Doctors" },
  { icon: Pill, title: "Buy Supplements", subtitle: "Curated for you", color: "text-pink-500", bg: "bg-pink-50", path: "/supplements" },
  { icon: Users, title: "Community Forum", subtitle: "Connect & share", color: "text-purple-600", bg: "bg-purple-50", path: "/community" },
  { icon: Sparkles, title: "Wellness Tools", subtitle: "Guided for you", color: "text-pink-500", bg: "bg-pink-50", path: "/wellness-tools" },
];
const reminders = [
  { icon: Pill, title: "Take Vitamin D", time: "Today, 9:00 AM", action: "Mark as Done", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: CalendarCheck, title: "Doctor Appointment", time: "Today, 5:00 PM", action: "View Details", color: "text-purple-600", bg: "bg-purple-50" },
];

/* =========================================================
   MAIN DASHBOARD — holds the shared `logs` state and decides
   which view (dashboard / tracker) is on screen.
   ========================================================= */
export default function Dashboard() {
  const navigate = useNavigate(); 
  const [userName] = useState("Neha");
  const [view, setView] = useState("dashboard");
  const [logs, setLogs] = useState(loadLogs);
  const [justSaved, setJustSaved] = useState(false);

  // Persist to "database" (localStorage) any time logs change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = (entry) => {
    const now = new Date();
    const full = {
      id: Date.now(),
      dateISO: now.toISOString(),
      day: now.getDate(),
      month: now.toLocaleDateString("en-US", { month: "short" }),
      hotFlash: entry.hotFlash, hotWord: wordFor(entry.hotFlash, hotWords),
      mood: entry.mood, moodWord: wordFor(entry.mood, moodWords),
      sleep: entry.sleep, sleepWord: wordFor(entry.sleep, sleepWords),
      note: entry.notes || "—",
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setLogs((prev) => [full, ...prev]);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  };

  const todayLog = useMemo(
    () => logs.find((l) => new Date(l.dateISO).toDateString() === new Date().toDateString()),
    [logs]
  );

  // Weekly snapshot — last 7 logs, oldest -> newest, for the sparkline + averages
  const weekLogs = useMemo(() => [...logs].slice(0, 7).reverse(), [logs]);
  const weekAvg = (key) =>
    weekLogs.length ? (weekLogs.reduce((sum, l) => sum + l[key], 0) / weekLogs.length).toFixed(1) : "—";

  if (view === "tracker") {
    return <SymptomTrackerView logs={logs} addLog={addLog} onBack={() => setView("dashboard")} />;
  }

  const snapshotStats = [
    { label: "Mood", value: todayLog ? todayLog.moodWord : "—", emoji: "😴" },
    { label: "Sleep", value: todayLog ? `${todayLog.sleep}/5` : "—", emoji: "🌙" },
    { label: "Hot Flushes", value: todayLog ? todayLog.hotWord : "—", emoji: "🔥" },
    { label: "Energy", value: todayLog ? todayLog.moodWord : "—", emoji: "🔋" },
  ];

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-purple-950 pb-8">
      {/* Top bar */}
     <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-2 flex items-center justify-between">
  {/* Left side: Your Logo in a circle */}
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-200 shadow-sm flex-shrink-0">
      <img 
        src="/assets/logo.jpg"
        alt="HerWellness Logo" 
        className="w-full h-full object-cover"
      />
    </div>
    <span className="font-serif font-semibold text-lg text-purple-900">
      HerCare
    </span>
  </div>
</div>

      {justSaved && (
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl px-4 py-3 mb-3 flex items-center gap-2">
            <Check size={16} /> Saved! Dashboard and Tracker are both updated.
          </div>
        </div>
      )}

    <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <div className="relative rounded-3xl mb-5 mt-2 overflow-hidden h-[220px] sm:h-[260px]">
          <img
            src="/assets/dashboard.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <button className="absolute top-5 right-6 bg-white/90 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm flex items-center gap-1.5 z-10">
            <User size={14} /> Edit Profile
          </button>
          <div className="absolute inset-0 flex flex-col justify-center pl-[38%] sm:pl-[32%] pr-6 z-10">
            <h1 className="font-serif text-xl sm:text-3xl font-semibold text-purple-900 mb-2 sm:mb-3 flex items-center gap-2 flex-wrap">
              Good Morning, <span className="text-pink-500">{userName}!</span> <Sun size={22} className="text-amber-400" />
            </h1>
            <span className="inline-block bg-white rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-purple-800 mb-2 sm:mb-3 w-fit">
              Stage: <span className="text-pink-500">Perimenopause</span>
            </span>
            <p className="text-xs sm:text-sm text-purple-700/80 leading-snug max-w-sm">
              You're on your wellness journey and every small step counts.
            </p>
          </div>
        </div>
        {/* Daily Log + Health Snapshot */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                <CalendarDays size={20} />
              </div>
              <h3 className="font-serif font-semibold text-purple-900">Daily Log Status</h3>
            </div>

            {todayLog ? (
              <div className="border-2 border-green-100 bg-green-50/50 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <Check size={26} />
                </div>
                <h3 className="font-serif font-semibold text-purple-900">You've logged your symptoms today!</h3>
                <p className="text-sm text-purple-400 max-w-xs mx-auto mb-4">Logged at {todayLog.time}</p>
                <button
                  onClick={() => setView("tracker")}
                  className="w-full py-3 rounded-full bg-white border border-pink-200 text-pink-600 font-semibold flex items-center justify-center gap-2 hover:bg-pink-50 transition"
                >
                  Edit Today's Log
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center">
                <SadClipboardIllustration />
                <h3 className="font-serif font-semibold text-purple-900 mt-3">You haven't logged your symptoms today.</h3>
                <p className="text-sm text-purple-400 max-w-xs mx-auto mb-4">
                  Daily logging helps us give you better insights and care.
                </p>
                <button
                  onClick={() => setView("tracker")}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold flex items-center justify-center gap-2 shadow hover:opacity-90 active:scale-[0.99] transition"
                >
                  Log Today's Symptoms <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <BatteryMedium size={20} />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-purple-900">Today's Health Snapshot</h3>
                <p className="text-xs text-purple-400 m-0">{todayLog ? "Based on today's log" : "Log today's symptoms to see this"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {snapshotStats.map((s) => (
                <div key={s.label} className="bg-pink-50/60 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">{s.emoji}</div>
                  <div className="font-semibold text-purple-900 text-sm">{s.value}</div>
                  <div className="text-xs text-purple-400">{s.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setView("tracker")} className="text-sm font-semibold text-pink-600 flex items-center gap-1 mt-4 mx-auto">
              View Full Log <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Weekly Symptom Snapshot — NEW */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <TrendingUp size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-purple-900">This Week's Symptoms</h3>
              <p className="text-xs text-purple-400 m-0">Average across your last {weekLogs.length || 0} logs</p>
            </div>
            <button onClick={() => setView("tracker")} className="text-xs font-medium text-purple-700 border border-pink-100 rounded-full px-3 py-1.5">
              Full Tracker
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-pink-50/60 rounded-2xl p-3 text-center">
              <div className="text-lg mb-1">🔥</div>
              <div className="font-semibold text-purple-900 text-sm">{weekAvg("hotFlash")}/5</div>
              <div className="text-xs text-purple-400">Avg Hot Flash</div>
            </div>
            <div className="bg-pink-50/60 rounded-2xl p-3 text-center">
              <div className="text-lg mb-1">🙂</div>
              <div className="font-semibold text-purple-900 text-sm">{weekAvg("mood")}/5</div>
              <div className="text-xs text-purple-400">Avg Mood</div>
            </div>
            <div className="bg-pink-50/60 rounded-2xl p-3 text-center">
              <div className="text-lg mb-1">🌙</div>
              <div className="font-semibold text-purple-900 text-sm">{weekAvg("sleep")}/5</div>
              <div className="text-xs text-purple-400">Avg Sleep</div>
            </div>
          </div>

          {weekLogs.length > 0 && (
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={weekLogs.map((l) => ({ label: `${l.month} ${l.day}`, hotFlash: l.hotFlash, mood: l.mood, sleep: l.sleep }))}>
                <Line type="monotone" dataKey="hotFlash" stroke="#F5578A" strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} />
                <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} animationBegin={150} />
                <Line type="monotone" dataKey="sleep" stroke="#C9A6F0" strokeWidth={2} dot={false} isAnimationActive animationDuration={1000} animationBegin={300} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* AI Care Plan Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100 p-6 flex items-center gap-5 mb-5 overflow-hidden flex-wrap sm:flex-nowrap">
          <RobotIllustration />
          <div className="flex-1 min-w-[200px]">
            <span className="inline-block bg-white rounded-full px-3 py-1 text-xs font-semibold text-purple-700 mb-2">AI Care Plan</span>
            <h3 className="font-serif text-xl font-semibold text-purple-900 mb-1">Your personalized care plan is ready for you!</h3>
            <p className="text-sm text-purple-600/80 m-0">Based on your symptoms, stage, and goals.</p>
          </div>
          <button
          onClick={() => navigate("/care-plan")}
           className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-sm flex items-center gap-2 shadow hover:opacity-90 whitespace-nowrap">
            View Your Daily<br />AI Action Plan <ArrowRight size={17} />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-serif font-semibold text-purple-900 text-lg">Quick Actions</h3>
            <span className="text-sm font-semibold text-pink-600 cursor-pointer">See All</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map(({ icon: Icon, title, subtitle, color, bg, path }) => (
              <div key={title}
              onClick={() => navigate(path)}
               className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition">
                <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-purple-900 truncate">{title}</div>
                  <div className="text-xs text-purple-400 truncate">{subtitle}</div>
                </div>
                <ChevronRight size={15} className="text-purple-200 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                <Bell size={20} />
              </div>
              <h3 className="font-serif font-semibold text-purple-900">Upcoming Reminders</h3>
            </div>
            <span className="text-sm font-semibold text-pink-600 cursor-pointer">View All</span>
          </div>
          {reminders.map((r) => (
            <div key={r.title} className="flex items-center gap-4 py-3 border-b border-pink-50 last:border-0">
              <div className={`w-10 h-10 rounded-xl ${r.bg} ${r.color} flex items-center justify-center flex-shrink-0`}>
                <r.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-purple-900">{r.title}</div>
                <div className="text-xs text-purple-400">{r.time}</div>
              </div>
              <button className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold whitespace-nowrap">{r.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-pink-100 shadow-[0_-4px_20px_rgba(107,63,160,0.08)]">
        <div className="max-w-6xl mx-auto flex justify-around items-center h-20">
          {[
            { icon: Home, label: "Home", onClick: () => setView("dashboard") },
            { icon: ClipboardList, label: "Logs", onClick: () => setView("tracker") },
            { icon: HeartHandshake, label: "Care Plan", onClick: () => navigate("/care-plan") },
            { icon: Users, label: "Community", onClick: () => navigate("/community") },
            { icon: User, label: "Profile", onClick: () => navigate("/profile") },
          ].map(({ icon: Icon, label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${view === "dashboard" && label === "Home" ? "text-pink-600" : "text-purple-300"}`}
            >
              <Icon size={22} strokeWidth={2.2} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}