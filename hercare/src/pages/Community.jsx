import React, { useState } from "react";

/**
 * HerWellness — Community Page
 * React + Tailwind CSS implementation based on the provided design.
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
.page-bg { background: #faf7f9; }
.shadow-soft { box-shadow: 0 10px 30px -12px rgba(154,42,148,0.12); }
.shadow-sm-soft { box-shadow: 0 4px 15px -5px rgba(154,42,148,0.08); }
`;

export default function CommunityPage() {
  const [isAnonymous, setIsAnonymous] = useState(false);

  return (
    <div className="font-body min-h-screen page-bg text-[#3b2440] pb-24">
      <style>{FONT_STYLE}</style>

      {/* --- TOP NAVBAR --- */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm-soft sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-[34px] h-[34px] rounded-[10px] grad-bg flex items-center justify-center text-white text-base shadow-soft">
            ✿
          </div>
          <span className="font-display font-semibold text-xl brand-grad-text">HerWellness</span>
        </div>

        <div className="flex-1 max-w-xl px-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics, symptoms, or ask a question..."
              className="w-full bg-[#f8f5f8] rounded-full py-2.5 pl-5 pr-10 text-[14.5px] outline-none border border-transparent focus:border-pink-300 focus:bg-white transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7c6a83]">🔍</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer text-[#7c6a83] hover:text-pink-600 transition">
            🔔
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </div>
          {/* USER AVATAR PLACEHOLDER */}
          <div className="w-9 h-9 rounded-full bg-pink-100 overflow-hidden cursor-pointer border-2 border-transparent hover:border-pink-400 transition flex items-center justify-center text-pink-500 font-bold">
            {/* IMAGE GOES HERE */}
            <img src="" alt="User" className="w-full h-full object-cover hidden" />
            N
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT GRID --- */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8 grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6">
        
        {/* === LEFT SIDEBAR === */}
        <aside className="space-y-6 hidden lg:block">
          {/* Nav Menu */}
          <div className="bg-white rounded-3xl p-3 shadow-sm-soft space-y-1">
            <NavItem icon="🏠" label="Community" active />
            <NavItem icon="📄" label="My Posts" />
            <NavItem icon="🔖" label="Saved" />
            <NavItem icon="❓" label="My Questions" />
            <NavItem icon="📑" label="Bookmarks" />
          </div>

          {/* Create Post Action */}
          <div className="bg-white rounded-3xl p-4 shadow-sm-soft border border-[#f0e0ea]">
            <button className="w-full py-3 rounded-2xl text-white font-bold text-[14.5px] grad-bg shadow-soft hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 mb-4">
              📝 Create a Post
            </button>
            <div className="flex items-center justify-between px-2">
              <span className="text-[13px] font-semibold flex items-center gap-2">
                <span className="text-[#a855f7]">🎭</span> Post Anonymously
              </span>
              <button 
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${isAnonymous ? 'bg-[#a855f7]' : 'bg-[#e3d0dd]'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAnonymous ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Safe Community Info */}
          <div className="bg-gradient-to-b from-[#fff0f7] to-white rounded-3xl p-5 border border-pink-100 text-center">
            <div className="w-10 h-10 mx-auto bg-pink-100 text-pink-500 rounded-xl flex items-center justify-center mb-3">🛡️</div>
            <h4 className="font-bold text-[14.5px] text-pink-600 mb-4">AI-Powered<br/>Safe Community</h4>
            <div className="space-y-2.5 text-left text-[12.5px] text-[#7c6a83] font-medium">
              <p className="flex items-center gap-2">✔️ AI moderates 24/7</p>
              <p className="flex items-center gap-2">✔️ Hate & toxicity filtered</p>
              <p className="flex items-center gap-2">✔️ Privacy always protected</p>
              <p className="flex items-center gap-2">✔️ A safe space for you</p>
            </div>
          </div>

          {/* Illustration Card Placeholder */}
          <div className="bg-white rounded-3xl p-5 shadow-sm-soft text-center h-48 relative overflow-hidden flex flex-col items-center border border-[#f0e0ea]">
             <h4 className="font-bold text-[#3b2440] mb-1 z-10">You are not alone.</h4>
             <p className="text-[12px] text-[#7c6a83] z-10">We are stronger<br/>together. 💜</p>
             {/* ILLUSTRATION PLACEHOLDER */}
             <div className="absolute bottom-0 w-full h-24 bg-pink-50 flex items-end justify-center text-[10px] text-pink-300 pb-2">
                [ Add Stronger Together Image Here ]
             </div>
          </div>
        </aside>

        {/* === CENTER FEED === */}
        <main className="space-y-5">
          {/* Welcome Banner */}
          <div className="bg-[#fdf3fb] rounded-3xl p-6 relative overflow-hidden border border-pink-100 flex items-center">
            <div className="relative z-10 max-w-[60%]">
              <h2 className="font-display text-xl sm:text-2xl font-semibold mb-2 leading-tight">
                Welcome to the Community, <span className="text-pink-500">Neha!</span> 👋
              </h2>
              <p className="text-[13.5px] text-[#7c6a83] font-medium">
                Share, learn, and support each other on your wellness journey. 💗
              </p>
            </div>
            {/* ILLUSTRATION PLACEHOLDER */}
            <div className="absolute right-0 bottom-0 top-0 w-[40%] bg-pink-100/50 flex items-center justify-center text-[12px] text-pink-400 font-bold">
               [ Add Girl Illustration Here ]
            </div>
          </div>

          {/* Topic Filters */}
          <div className="flex items-center justify-between pt-2">
            <h3 className="font-bold text-[15px]">Explore Topics</h3>
            <button className="text-pink-600 text-[13px] font-bold">View All</button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterPill label="All" active />
            <FilterPill label="#HRT" />
            <FilterPill label="#HotFlashes" />
            <FilterPill label="#SleepIssues" />
            <FilterPill label="#MentalHealth" />
            <FilterPill label="#Diet" />
            <button className="w-8 h-8 rounded-full bg-white border border-[#f0e0ea] flex items-center justify-center text-[#7c6a83] flex-shrink-0 hover:border-pink-300">
              ⚙️
            </button>
          </div>

          {/* Post 1: Anonymous with AI Summary */}
          <PostCard 
            avatar="🎭" 
            name="Anonymous Member" 
            time="4 hours ago" 
            subLabel="Anonymous"
            aiSummary="User is experiencing intense night sweats that are affecting sleep and mood. Looking for advice from others who faced the same."
            content="Lately I've been experiencing intense night sweats and it's affecting my sleep so much. I wake up tired and irritated every morning. Has anyone tried something that actually helps? I would love some real advice from women who have been through this."
            tags={["#HotFlashes", "#SleepIssues", "#Perimenopause"]}
            stats={{ hugs: 24, relatable: 18, helpful: 15 }}
          />

          {/* Post 2: Verified Expert */}
          <PostCard 
            isExpert
            avatar="👩‍⚕️" 
            name="Dr. Ananya Sharma" 
            time="6 hours ago" 
            subLabel="Gynecologist"
            content="Estrogen fluctuations during perimenopause can cause disrupted sleep, mood swings, and hot flashes. A consistent sleep routine, magnesium, and stress management can help a lot. Let me know if you have specific questions!"
            tags={["#Perimenopause", "#SleepHealth", "#HormonalBalance"]}
            stats={{ hugs: 32, relatable: 41, helpful: 56 }}
          />

          {/* Post 3: Regular User */}
          <PostCard 
            avatar="PS" 
            avatarColor="bg-[#e0e7ff] text-indigo-500"
            name="Priya S." 
            time="1 day ago" 
            content="Started yoga and reduced caffeine – feeling so much better! Small changes really do help. Stay consistent, ladies! 💪💜"
            tags={["#Lifestyle", "#MentalHealth", "#WellnessJourney"]}
            stats={{ hugs: 19, relatable: 27, helpful: 31 }}
          />
        </main>

        {/* === RIGHT SIDEBAR === */}
        <aside className="space-y-5 hidden lg:block">
          {/* Expert AMA Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm-soft border border-[#f0e0ea] relative overflow-hidden">
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center text-xs font-bold cursor-pointer">?</div>
            <h3 className="font-display font-semibold text-[18px] text-[#3b2440] mb-1">Expert AMA</h3>
            <p className="text-[12.5px] text-[#7c6a83] mb-5 leading-tight">Ask verified experts your health questions.</p>
            
            <div className="flex flex-col items-center text-center">
              {/* EXPERT AVATAR PLACEHOLDER */}
              <div className="w-[72px] h-[72px] rounded-full bg-pink-100 mb-3 border-4 border-white shadow-sm flex items-center justify-center relative">
                <img src="" alt="Dr Riya" className="w-full h-full object-cover hidden" />
                <span className="text-xl">👩‍⚕️</span>
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">✓</span>
              </div>
              <h4 className="font-bold text-[15px]">Dr. Riya Mehta</h4>
              <p className="text-[12px] text-[#7c6a83] mb-2">Endocrinologist</p>
              <div className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">LIVE AMA</div>
              <p className="text-[11.5px] font-semibold text-[#3b2440] mb-4">Friday, 17 May • 5:00 PM</p>
              <button className="w-full py-2.5 rounded-xl text-white font-bold text-[13.5px] bg-[#c026d3] hover:bg-purple-600 transition-colors">
                Ask a Question
              </button>
            </div>
          </div>

          {/* AI Community Highlights */}
          <div className="bg-white rounded-3xl p-5 shadow-sm-soft border border-[#f0e0ea]">
            <h3 className="font-bold text-[14px] text-[#9333ea] flex items-center gap-2 mb-1">
              ✨ AI Community Highlights
            </h3>
            <p className="text-[12px] text-[#7c6a83] mb-4 leading-tight">Top discussions this week summarized by AI</p>
            <div className="space-y-4">
              <HighlightItem icon="🔥" iconBg="bg-orange-50" title="Managing severe hot flashes naturally" replies={23} />
              <HighlightItem icon="🌙" iconBg="bg-indigo-50" title="How to improve sleep during perimenopause?" replies={18} />
              <HighlightItem icon="🧠" iconBg="bg-pink-50" title="Anxiety & mood swings – what really helps?" replies={16} />
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl bg-[#fdf3fb] text-[#a855f7] font-bold text-[12.5px] hover:bg-[#f3e3fb] transition">
              View All Highlights
            </button>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-3xl p-5 shadow-sm-soft border border-[#f0e0ea]">
            <h3 className="font-bold text-[15px] flex items-center gap-2 mb-4">🔥 Trending Topics</h3>
            <div className="space-y-3.5">
              <TrendingItem tag="HotFlashes" count="1.2K" />
              <TrendingItem tag="SleepIssues" count="986" />
              <TrendingItem tag="HRT" count="842" />
              <TrendingItem tag="MentalHealth" count="675" />
              <TrendingItem tag="Diet" count="540" />
            </div>
            <button className="w-full mt-4 text-[#a855f7] font-bold text-[12.5px] hover:underline">
              View All
            </button>
          </div>
        </aside>
      </div>

      {/* --- BOTTOM BANNER --- */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pb-6">
        <div className="rounded-[24px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 grad-bg text-white shadow-soft">
          <div className="flex items-center gap-4">
             {/* SHIELD ICON PLACEHOLDER */}
             <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                🛡️
             </div>
             <div>
                <h4 className="font-bold text-[15px] mb-0.5">This is your safe space. Be kind, be respectful, be you. 🤍</h4>
                <p className="text-[13px] text-white/80">Our AI & moderators are here to keep this community positive and supportive.</p>
             </div>
          </div>
          <button className="bg-white text-purple-600 px-5 py-2.5 rounded-xl font-bold text-[13.5px] shadow-sm hover:scale-105 transition-transform flex-shrink-0">
            Learn Community Guidelines
          </button>
        </div>
      </div>

      {/* --- MOBILE BOTTOM NAV (Optional / visible on small screens like in design) --- */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-[#f0e0ea] flex items-center justify-around py-3 px-2 z-50 lg:hidden shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
        <BottomNavItem icon="🏠" label="Home" />
        <BottomNavItem icon="📋" label="Logs" />
        <BottomNavItem icon="💗" label="Care Plan" />
        <BottomNavItem icon="👥" label="Community" active />
        <BottomNavItem icon="👤" label="Profile" />
      </nav>
    </div>
  );
}

/* ---------------- Sub-Components ---------------- */

function NavItem({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors font-semibold text-[14px] ${active ? 'bg-pink-50 text-pink-600' : 'text-[#7c6a83] hover:bg-[#f8f5f8] hover:text-[#3b2440]'}`}>
      <span className="text-lg">{icon}</span>
      {label}
    </div>
  );
}

function FilterPill({ label, active }) {
  return (
    <button className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors border ${active ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-[#7c6a83] border-[#f0e0ea] hover:border-pink-300'}`}>
      {label}
    </button>
  );
}

function PostCard({ avatar, avatarColor, name, time, subLabel, isExpert, aiSummary, content, tags, stats }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm-soft border border-[#f0e0ea]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* POST AVATAR PLACEHOLDER */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden ${avatarColor || 'bg-purple-100 text-purple-600'}`}>
            <img src="" alt={name} className="w-full h-full object-cover hidden" />
            {avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-[14.5px]">{name}</h4>
              {isExpert && <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">✓</span>}
            </div>
            <div className="text-[12px] text-[#7c6a83] flex items-center gap-1.5">
              {time} • {subLabel || (isExpert ? "Expert" : "Member")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {aiSummary && (
            <div className="hidden sm:flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[11px] font-bold border border-green-100">
              AI Summary ✨
            </div>
          )}
          {isExpert && (
            <div className="hidden sm:flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[11px] font-bold border border-green-100">
              ✓ Verified Expert
            </div>
          )}
          <button className="text-[#c4b5c8] hover:text-[#7c6a83]">•••</button>
        </div>
      </div>

      {/* Body */}
      <p className="text-[14.5px] leading-relaxed mb-4">{content}</p>

      {/* AI Summary Box */}
      {aiSummary && (
        <div className="bg-[#fff0f7] rounded-2xl p-4 mb-4 flex gap-3 border border-pink-100">
          <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex-shrink-0 flex items-center justify-center text-[12px]">✨</div>
          <p className="text-[13px] text-pink-900 leading-relaxed font-medium">
            <span className="font-bold">AI Summary:</span> {aiSummary}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map(t => (
          <span key={t} className="bg-[#f8f5f8] text-[#7c6a83] px-3 py-1 rounded-full text-[12px] font-bold">
            {t}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton icon="🫂" label="Send a Hug" count={stats.hugs} color="text-pink-500" bg="bg-pink-50" />
        <ActionButton icon="✨" label="Relatable" count={stats.relatable} color="text-purple-600" bg="bg-purple-50" />
        <ActionButton icon="💡" label="Helpful" count={stats.helpful} color="text-orange-500" bg="bg-orange-50" />
        <button className="ml-auto w-10 h-10 rounded-full border border-[#f0e0ea] flex items-center justify-center text-[#7c6a83] hover:bg-gray-50 transition">
          🔖
        </button>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, count, color, bg }) {
  return (
    <button className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-bold transition hover:scale-105 border border-transparent hover:border-[#f0e0ea] ${bg} ${color}`}>
      <span>{icon}</span> {label} <span className="ml-1 opacity-70">{count}</span>
    </button>
  );
}

function HighlightItem({ icon, iconBg, title, replies }) {
  return (
    <div className="flex gap-3 items-start cursor-pointer group">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-[13px] text-[#3b2440] leading-tight group-hover:text-pink-600 transition-colors">
          {title}
        </h4>
        <p className="text-[11.5px] text-[#7c6a83] mt-0.5">{replies} replies</p>
      </div>
    </div>
  );
}

function TrendingItem({ tag, count }) {
  return (
    <div className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-400 font-bold flex items-center justify-center text-xs group-hover:bg-pink-100 transition">
          #
        </div>
        <span className="font-bold text-[13.5px] group-hover:text-pink-600 transition">{tag}</span>
      </div>
      <span className="text-[12px] text-[#7c6a83]">{count} posts</span>
    </div>
  );
}

function BottomNavItem({ icon, label, active }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 p-2 w-16 ${active ? 'text-pink-600' : 'text-[#c4b5c8]'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}