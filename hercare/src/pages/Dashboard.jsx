import { useState } from "react";
import {
  Bell, User, Sun, ChevronRight, ArrowRight, BatteryMedium,
  Stethoscope, Pill, Users, Sparkles, CalendarCheck, CalendarDays,
} from "lucide-react";

function WomanIllustration() {
  // Empty placeholder — drop your own image here, e.g.:
  // <img src="/woman.png" className="w-full h-full object-contain" />
  return <div className="w-40 h-40 sm:w-48 sm:h-48 flex-shrink-0" aria-hidden="true" />;
}

function FlowerDecoration() {
  // Empty placeholder for the decorative flower illustration, e.g.:
  // <img src="/flowers.png" className="w-full h-full object-contain" />
  return <div className="hidden md:block w-28 h-28 flex-shrink-0" aria-hidden="true" />;
}

function SadClipboardIllustration() {
  // Empty placeholder — drop your own image here, e.g.:
  // <img src="/clipboard-sad.png" className="w-24 h-24 object-contain" />
  return <div className="w-24 h-24 mx-auto" aria-hidden="true" />;
}

function RobotIllustration() {
  // Empty placeholder — drop your own image here, e.g.:
  // <img src="/robot.png" className="w-28 h-28 object-contain" />
  return <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0" aria-hidden="true" />;
}

const snapshotStats = [
  { label: "Mood", value: "Tired", emoji: "😴" },
  { label: "Sleep", value: "6 hrs", emoji: "🌙" },
  { label: "Hot Flushes", value: "Moderate", emoji: "🔥" },
  { label: "Energy", value: "Medium", emoji: "🔋" },
];

const quickActions = [
  { icon: Stethoscope, title: "Book Doctor", subtitle: "Consult experts", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Pill, title: "Buy Supplements", subtitle: "Curated for you", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Users, title: "Community Forum", subtitle: "Connect & share", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Sparkles, title: "Wellness Tools", subtitle: "Guided for you", color: "text-pink-500", bg: "bg-pink-50" },
];

const reminders = [
  { icon: Pill, title: "Take Vitamin D", time: "Today, 9:00 AM", action: "Mark as Done", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: CalendarCheck, title: "Doctor Appointment", time: "Today, 5:00 PM", action: "View Details", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function Dashboard() {
  const [userName] = useState("Neha");

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-purple-950 pb-8">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-pink-50/95 backdrop-blur max-w-6xl mx-auto flex items-center px-5 sm:px-8 lg:px-12 py-4">
        <div className="font-serif font-semibold text-lg text-purple-900 flex items-center gap-1.5">
          🌸 HerWellness
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 p-6 flex items-center justify-between gap-4 mb-5 mt-2 overflow-hidden">
          <button className="absolute top-5 right-6 bg-white/90 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm flex items-center gap-1.5">
            <User size={14} /> Edit Profile
          </button>

          <WomanIllustration />

          <div className="flex-1 min-w-0 pt-6 sm:pt-0">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-purple-900 mb-3 flex items-center gap-2 flex-wrap">
              Good Morning, <span className="text-pink-500">{userName}!</span> <Sun size={26} className="text-amber-400" />
            </h1>
            <span className="inline-block bg-white rounded-full px-4 py-1.5 text-sm font-semibold text-purple-800 mb-3">
              Stage: <span className="text-pink-500">Perimenopause</span>
            </span>
            <p className="text-sm text-purple-700/80 leading-snug max-w-sm">
              You're on your wellness journey and every small step counts.
            </p>
          </div>

          <FlowerDecoration />
        </div>

        {/* Daily Log + Health Snapshot */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Daily Log Status */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                <CalendarDays size={20} />
              </div>
              <h3 className="font-serif font-semibold text-purple-900">Daily Log Status</h3>
            </div>

            <div className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center">
              <SadClipboardIllustration />
              <h3 className="font-serif font-semibold text-purple-900 mt-3">You haven't logged your symptoms today.</h3>
              <p className="text-sm text-purple-400 max-w-xs mx-auto mb-4">
                Daily logging helps us give you better insights and care.
              </p>
              <button className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold flex items-center justify-center gap-2 shadow hover:opacity-90 active:scale-[0.99] transition">
                Log Today's Symptoms <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Health Snapshot */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <BatteryMedium size={20} />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-purple-900">Today's Health Snapshot</h3>
                <p className="text-xs text-purple-400 m-0">Here's how your day looks so far</p>
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

            <button className="text-sm font-semibold text-pink-600 flex items-center gap-1 mt-4 mx-auto">
              View Full Log <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* AI Care Plan Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100 p-6 flex items-center gap-5 mb-5 overflow-hidden flex-wrap sm:flex-nowrap">
          <RobotIllustration />
          <div className="flex-1 min-w-[200px]">
            <span className="inline-block bg-white rounded-full px-3 py-1 text-xs font-semibold text-purple-700 mb-2">
              AI Care Plan
            </span>
            <h3 className="font-serif text-xl font-semibold text-purple-900 mb-1">
              Your personalized care plan is ready for you!
            </h3>
            <p className="text-sm text-purple-600/80 m-0">Based on your symptoms, stage, and goals.</p>
          </div>
          <button className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-sm flex items-center gap-2 shadow hover:opacity-90 whitespace-nowrap">
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
            {quickActions.map(({ icon: Icon, title, subtitle, color, bg }) => (
              <div key={title} className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex items-center gap-3 cursor-pointer hover:shadow-md transition">
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
              <button className="px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold whitespace-nowrap">
                {r.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}