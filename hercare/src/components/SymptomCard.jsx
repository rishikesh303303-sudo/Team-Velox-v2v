import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  CalendarCheck, Flame, Smile, Moon, TrendingUp, ClipboardCheck,
  ArrowRight, ChevronRight, ChevronDown, Home, ClipboardList, HeartHandshake,
  Users, User, HelpCircle, Heart, Check,
} from "lucide-react";

const initialLogs = [
  { id: 4, day: 31, month: "May", hotFlash: 3, hotWord: "Moderate", mood: 4, moodWord: "Good", sleep: 3, sleepWord: "Average", note: "Felt a bit tired in the evening.", time: "9:30 PM" },
  { id: 3, day: 30, month: "May", hotFlash: 4, hotWord: "High", mood: 3, moodWord: "Okay", sleep: 2, sleepWord: "Below Avg", note: "Busy day, low energy.", time: "9:15 PM" },
  { id: 2, day: 29, month: "May", hotFlash: 2, hotWord: "Mild", mood: 4, moodWord: "Good", sleep: 4, sleepWord: "Good", note: "Had a restful sleep last night.", time: "8:45 PM" },
  { id: 1, day: 28, month: "May", hotFlash: 3, hotWord: "Moderate", mood: 2, moodWord: "Low", sleep: 3, sleepWord: "Average", note: "Hot flashes were more frequent.", time: "9:10 PM" },
];

const chartSeed = [
  { label: "May 1", hotFlash: 2, mood: 1, sleep: 1 },
  { label: "May 6", hotFlash: 4, mood: 3, sleep: 2 },
  { label: "May 11", hotFlash: 3, mood: 3, sleep: 2 },
  { label: "May 16", hotFlash: 3, mood: 2, sleep: 1 },
  { label: "May 21", hotFlash: 2, mood: 4, sleep: 2 },
  { label: "May 26", hotFlash: 2, mood: 4, sleep: 2 },
  { label: "May 31", hotFlash: 4, mood: 3, sleep: 3 },
];

function WomanIllustration() {
  // Empty full-width placeholder — drop your own image here, e.g.:
  // <img src="/your-image.png" className="w-full h-48 sm:h-56 object-cover rounded-2xl" />
  return (
    <div className="w-full h-48 sm:h-56 rounded-2xl" aria-hidden="true" />
  );
}

function ClipboardIllustration() {
  // Empty full-width placeholder — drop your own image here, e.g.:
  // <img src="/your-image.png" className="w-full h-40 object-cover rounded-2xl" />
  return (
    <div className="w-full h-40 rounded-2xl" aria-hidden="true" />
  );
}

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
        <span className="self-end">1</span>
        <span className="self-end">2</span>
        <span className="self-end">3</span>
        <span className="self-end">4</span>
        <span className="text-right">5<br /><span className="text-purple-300">{maxLabel}</span></span>
      </div>
    </div>
  );
}

export default function SymptomTrackerPage() {
  const [hotFlash, setHotFlash] = useState(3);
  const [mood, setMood] = useState(4);
  const [sleep, setSleep] = useState(3);
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState(initialLogs);
  const [chartData, setChartData] = useState(chartSeed);
  const [saved, setSaved] = useState(false);

  const wordFor = (v, words) => words[Math.min(v, words.length - 1)];
  const hotWords = ["None", "Mild", "Mild", "Moderate", "High", "Severe"];
  const moodWords = ["Very Low", "Low", "Okay", "Good", "Good", "Very Good"];
  const sleepWords = ["Very Poor", "Poor", "Below Avg", "Average", "Good", "Excellent"];

  const save = () => {
    const now = new Date();
    const entry = {
      id: Date.now(),
      day: now.getDate(),
      month: now.toLocaleDateString("en-US", { month: "short" }),
      hotFlash, hotWord: wordFor(hotFlash, hotWords),
      mood, moodWord: wordFor(mood, moodWords),
      sleep, sleepWord: wordFor(sleep, sleepWords),
      note: notes || "—",
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setLogs((prev) => [entry, ...prev]);
    setChartData((prev) => [...prev, { label: `${entry.month} ${entry.day}`, hotFlash, mood, sleep }]);
    setNotes("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const visibleLogs = useMemo(() => logs.slice(0, 4), [logs]);

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-purple-950 pb-24">
      <style>{`
        .hw-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px; border-radius: 9999px;
          background: #fff; border: 4px solid currentColor;
          box-shadow: 0 2px 6px rgba(107,63,160,0.25); cursor: pointer;
        }
        .hw-slider::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 9999px;
          background: #fff; border: 4px solid currentColor; cursor: pointer;
        }
      `}</style>

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-pink-50/95 backdrop-blur max-w-6xl mx-auto flex items-center px-5 sm:px-8 lg:px-12 py-4">
        <div className="font-serif font-semibold text-lg text-purple-900 flex items-center gap-1.5">
          🌸 HerWellness
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-4 mb-5 mt-2">
          <WomanIllustration />
          <div className="text-center px-2 pt-4 pb-1">
            <h1 className="font-serif text-2xl font-semibold text-purple-900 mb-1">Symptom Tracker</h1>
            <p className="text-sm text-purple-700/80 leading-snug">Track your daily symptoms and understand your wellness better.</p>
          </div>
        </div>

        {/* Daily Log */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <CalendarCheck size={20} />
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

        {/* Promo / empty-state card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 mb-5 text-center">
          <div className="mb-4">
            <ClipboardIllustration />
          </div>
          <h3 className="font-serif font-semibold text-purple-900">No Logs Yet</h3>
          <p className="text-sm text-purple-400 max-w-xs mx-auto">Start tracking your symptoms daily to see your trends and improve your wellness journey.</p>
          <button
            onClick={() => document.querySelector("textarea")?.focus()}
            className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm inline-flex items-center gap-2 shadow hover:opacity-90"
          >
            Log Your First Entry <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-pink-100 shadow-[0_-4px_20px_rgba(107,63,160,0.08)]">
        <div className="max-w-6xl mx-auto flex justify-around items-center h-20">
          {[
            { icon: Home, label: "Home" },
            { icon: ClipboardList, label: "Logs", active: true },
            { icon: HeartHandshake, label: "Care Plan" },
            { icon: Users, label: "Community" },
            { icon: User, label: "Profile" },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} className={`flex flex-col items-center gap-1 text-xs font-semibold ${active ? "text-pink-600" : "text-purple-300"}`}>
              <Icon size={22} strokeWidth={2.2} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}