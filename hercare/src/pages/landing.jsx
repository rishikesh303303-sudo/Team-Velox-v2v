import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// ---------------------------------------------------------
// Ambient background: animated gradient + particle field
// ---------------------------------------------------------
function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, particles, rafId;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function initParticles() {
      const count = Math.floor((w * h) / 9000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        tw: Math.random() * Math.PI * 2,
        tws: 0.01 + Math.random() * 0.02,
        color: Math.random() > 0.5 ? "236,72,153" : "168,85,247",
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += p.tws;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const alpha = 0.3 + Math.sin(p.tw) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${Math.max(alpha, 0.05)})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(168,85,247,${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    }
    resize();
    initParticles();
    draw();
    const onResize = () => {
      resize();
      initParticles();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at 78% 55%, rgba(217,70,160,0.28), transparent 45%), radial-gradient(circle at 85% 75%, rgba(139,92,246,0.15), transparent 50%), #060509",
        }}
      />
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
    </>
  );
}

// ---------------------------------------------------------
// Cursor glow
// ---------------------------------------------------------
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const move = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="fixed w-[400px] h-[400px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 blur-[10px] z-0"
      style={{
        left: "50%",
        top: "50%",
        background:
          "radial-gradient(circle, rgba(236,72,153,0.15), rgba(168,85,247,0.08) 40%, transparent 70%)",
      }}
    />
  );
}

// ---------------------------------------------------------
// Real SVG circular progress ring
// ---------------------------------------------------------
function ScoreRing({ score = 85, size = 76 }) {
  const [animated, setAnimated] = useState(false);
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto mt-2" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 76 76" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{ transition: "stroke-dashoffset 1.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <b className="text-lg text-pink-300">{score}</b>
        <small className="text-[10px] text-gray-400">/100</small>
      </div>
    </div>
  );
}

const features = [
  {
    icon: "📋",
    title: "Smart Onboarding",
    text: "AI-driven health assessment to understand your hormonal patterns, symptoms, and goals.",
  },
  {
    icon: "🧠",
    title: "AI Insights & Care Plan",
    text: "Personalized diet, lifestyle, and supplement plans designed just for you.",
  },
  {
    icon: "👥",
    title: "Community Support",
    text: "AI-moderated, anonymous, and safe space to share, learn, and grow together.",
  },
  {
    icon: "🩺",
    title: "Doctor Consultations",
    text: "Book 1:1 consultations with verified specialists for expert care and guidance.",
  },
];

const steps = [
  { icon: "📋", num: "1", title: "Assessment", text: "Answer a few questions about your health, symptoms & lifestyle." },
  { icon: "🧠", num: "2", title: "AI Analysis", text: "Our AI analyzes your data to detect patterns and hormonal imbalances." },
  { icon: "📅", num: "3", title: "Personalized Care Plan", text: "Get a tailored plan with diet, lifestyle, supplements & wellness recommendations." },
  { icon: "🤝", num: "4", title: "Ongoing Support", text: "Track progress, connect with experts & community, and feel your best." },
];

const trust = [
  { icon: "🛡️", title: "Safe & Private", text: "Your data is 100% private and secure. We never share your information." },
  { icon: "⚙️", title: "AI-Personalized", text: "Advanced AI adapts to your unique needs and evolves with your journey." },
  { icon: "🏅", title: "Verified Experts", text: "Connect with certified doctors and specialists you can trust." },
];

const LandingPage = () => {
   const navigate = useNavigate(); 
  return (
    <div className="bg-[#060509] text-white overflow-hidden relative min-h-screen" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      {/* 🔽 This loads "Playfair Display" — the elegant serif font from the
          screenshot — from Google Fonts. "Lora" is loaded too, for smaller
          body text where a full display serif looks heavy. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Lora:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 0%, 100% 0%, 50% 100%, 0% 50%; }
          50% { background-position: 100% 100%, 0% 100%, 50% 0%, 100% 50%; }
          100% { background-position: 0% 0%, 100% 0%, 50% 100%, 0% 50%; }
        }
        .font-body { font-family: 'Lora', Georgia, serif; }
      `}</style>

      <AmbientBackground />
      <CursorGlow />

      {/* NAVBAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex justify-between items-center px-10 py-6 backdrop-blur-md border-b border-white/5"
      >
        <h1 className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          HerWellness
        </h1>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#" className="text-pink-400">Home</a>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#">Community</a>
          <a href="#">About Us</a>
        </div>

        <div className="flex gap-3">
          <button
          onClick={() => navigate("/login")} 
           className="px-4 py-2 border border-gray-600 rounded-full text-sm">
            Log In
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg shadow-pink-500/30 text-sm"
          >
            Start Assessment
          </motion.button>
        </div>
      </motion.div>

      {/* HERO */}
      <div className="relative z-10 grid md:grid-cols-2 items-center px-10 md:px-20 py-16 gap-10">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Personalized <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Hormonal Wellness.
            </span>{" "}
            <br />
            Just for You.
          </h1>

          <p className="mt-6 text-gray-400 max-w-lg">
            AI-powered insights, expert care, and a supportive community —
            everything you need to balance your hormones and feel your best.
          </p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="mt-8 px-7 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-lg shadow-pink-500/30"
          >
            Start Your Assessment →
          </motion.button>

          <div className="flex items-center gap-3 mt-8">
            <div className="flex">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#07070c] bg-gradient-to-br from-pink-400 to-purple-500 inline-block"
                  style={{ marginLeft: i === 0 ? 0 : -10 }}
                />
              ))}
            </div>
            <div>
              <div className="text-yellow-400 text-sm">★★★★★</div>
              <small className="text-gray-400 text-xs">Trusted by 50,000+ women</small>
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <div className="relative flex justify-center mt-16 md:mt-0">
          <div className="absolute w-[350px] h-[350px] bg-pink-500 blur-[120px] opacity-30 rounded-full"></div>

          {/* 🔽 PUT YOUR IMAGE HERE.
              Delete this placeholder div and use, for example:
              <motion.img
                src="/hero.png"
                alt="hero"
                className="relative w-[320px] z-10 rounded-[50%_50%_45%_45%/55%_55%_45%_45%] object-cover"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              /> */}
         <motion.img
    src="/assets/landing.jpg" // Agar Step 2 mein import kiya hai, to ye variable use karein
    // src="/hero-image.png" // Agar image 'public' folder mein hai, to direct path dein
    alt="Hormonal wellness support"
    className="relative w-[320px] h-[380px] z-10 rounded-[50%_50%_45%_45%/55%_55%_45%_45%] object-cover shadow-2xl shadow-purple-500/20"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute top-10 right-0 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl w-48 z-20"
          >
            <p className="text-sm text-gray-200 font-medium">🧠 AI Insight</p>
            <p className="text-xs text-gray-400 mt-2">
              Your hormones are unique. So is your care plan.
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute bottom-0 left-0 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl w-48 z-20"
          >
            <p className="text-sm text-gray-200 font-medium">💗 Care Plan</p>
            <p className="text-xs text-gray-400 mt-2">
              Personalized diet, lifestyle & supplement recommendations.
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-10 right-5 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl w-40 text-center z-20"
          >
            <p className="text-sm text-gray-200 font-medium">Wellness Score</p>
            <ScoreRing score={85} />
            <p className="text-xs text-pink-300 mt-1">Great Progress! 🎉</p>
          </motion.div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="relative z-10 px-10 md:px-20 py-20">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center text-xs tracking-widest text-pink-300 uppercase mb-3"
        >
          Key Features
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center text-3xl md:text-4xl font-bold mb-12"
        >
          Everything You Need for{" "}
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Holistic Wellness
          </span>
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05, y: -6 }}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-pink-400/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 bg-gradient-to-br from-pink-500 to-purple-600">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{f.text}</p>
              <a href="#" className="text-pink-400 text-sm font-medium">Learn more →</a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" className="relative z-10 px-10 md:px-20 py-10">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 backdrop-blur-xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center text-xs tracking-widest text-pink-300 uppercase mb-3"
          >
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center text-3xl md:text-4xl font-bold mb-14"
          >
            Your{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Wellness Journey
            </span>
            , Simplified
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl bg-[#120a1f] border border-white/10">
                    {s.icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#120a1f]">
                    {s.num}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* TRUST */}
      <div className="relative z-10 px-10 md:px-20 py-20">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center text-xs tracking-widest text-pink-300 uppercase mb-3"
        >
          Trusted By Thousands
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center text-3xl md:text-4xl font-bold mb-12"
        >
          Your Health.{" "}
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Our Priority.
          </span>
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {trust.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl flex gap-4 items-start"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br from-pink-500 to-purple-600 flex-shrink-0">
                {t.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-1">{t.title}</h4>
                <p className="text-sm text-gray-400">{t.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 mx-10 md:mx-20 my-20 p-10 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 flex flex-wrap justify-between items-center gap-6"
      >
        <div className="flex items-center gap-6">
          <div className="text-5xl">🧘‍♀️</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to take charge of your wellness?</h2>
            <p className="text-white/90 max-w-md text-sm">
              Start your personalized assessment today and take the first step towards a healthier you.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-white text-purple-700 rounded-full font-semibold whitespace-nowrap"
        >
          Start Your Assessment →
        </motion.button>
      </motion.div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-10 md:px-20 py-14 text-sm">
        <div className="grid md:grid-cols-5 gap-10 mb-10">
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">
              HerWellness
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered hormonal health and wellness platform for every stage of womanhood.
            </p>
            <div className="flex gap-3 mt-4">
              {["📷", "📘", "🐦", "▶️"].map((s, i) => (
                <span key={i} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <FooterCol title="Quick Links" items={["Home", "Features", "How It Works", "Community", "About Us"]} />
          <FooterCol title="Resources" items={["Blog", "Hormonal Health Guide", "FAQ", "Privacy Policy", "Terms of Service"]} />
          <FooterCol title="Support" items={["Contact Us", "Help Center", "Careers", "Press Kit"]} />

          <div>
            <h5 className="font-semibold mb-3">Newsletter</h5>
            <p className="text-gray-400 text-sm mb-3">Stay updated with wellness tips and latest updates.</p>
            <div className="flex border border-white/10 rounded-full overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-gray-500"
              />
              <button className="w-10 bg-gradient-to-r from-pink-500 to-purple-500">➤</button>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs border-t border-white/10 pt-6">
          © 2025 HerWellness. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

function FooterCol({ title, items }) {
  return (
    <div>
      <h5 className="font-semibold mb-3">{title}</h5>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingPage;