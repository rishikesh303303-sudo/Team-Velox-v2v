import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const whyItems = [
  {
    icon: "🛡️",
    title: "Safe & Private",
    text: "Your data is 100% secure and completely confidential.",
  },
  {
    icon: "🧠",
    title: "AI-Personalized",
    text: "Smart insights and care plans tailored just for your body.",
  },
  {
    icon: "👥",
    title: "Supportive Community",
    text: "Connect, share, and grow together in a safe space.",
  },
  {
    icon: "🏅",
    title: "Verified Experts",
    text: "Access trusted doctors and specialists anytime.",
  },
];

export default function LoginPage() {
   const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="bg-[#060509] text-white min-h-screen relative overflow-hidden"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Load the same elegant serif font used across the site */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Lora:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Ambient glow background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 20% 35%, rgba(217,70,160,0.18), transparent 45%), radial-gradient(circle at 70% 15%, rgba(139,92,246,0.15), transparent 50%), #060509",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid md:grid-cols-2 gap-14 items-start">
        {/* ---------------- LEFT SIDE ---------------- */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Logo */}
          <motion.div variants={fadeUp} className="flex items-center gap-2 mb-10">
            <span className="text-2xl">🪷</span>
            <span className="text-xl font-semibold">
              Her<span className="text-pink-400">Wellness</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Your Wellness.
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Personalized for You.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-gray-400 max-w-sm mb-8" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            AI-powered insights, expert care, and a supportive community — all in one place
            for your hormonal health journey.
          </motion.p>

          {/* 🔽 PUT YOUR IMAGE HERE.
              Replace this placeholder div with something like:
              <motion.img
                src="/hero-portrait.png"
                alt="hero"
                className="w-full max-w-sm rounded-full mx-auto"
              /> */}
          <motion.div
            variants={fadeUp}
            className="relative w-full max-w-sm aspect-[4/5] mx-auto mb-10 rounded-[45%_55%_50%_50%/55%_50%_50%_45%] border border-dashed border-white/20 flex items-center justify-center text-center text-gray-500 text-base px-6"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(217,70,160,0.15), transparent 65%)",
            }}
          >
            Apni image yahan lagao
          </motion.div>

          {/* Why HerWellness */}
          <motion.div
            variants={fadeUp}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold mb-5">
              Why Her<span className="text-pink-400">Wellness</span>?
            </h3>
            <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
              {whyItems.map((item, i) => (
                <motion.div variants={fadeUp} key={i} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg bg-pink-500/10 border border-pink-500/30 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            variants={fadeUp}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <p className="text-pink-400 text-2xl leading-none mb-2">&ldquo;</p>
            <p className="text-gray-300 text-sm mb-4" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              HerWellness helped me understand my body better and feel in control again.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#060509] bg-gradient-to-br from-pink-400 to-purple-500 inline-block"
                    style={{ marginLeft: i === 0 ? 0 : -10 }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Trusted by <span className="text-pink-400 font-semibold">50,000+</span> women
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ---------------- RIGHT SIDE (LOGIN CARD) ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
            <div className="flex justify-center mb-6">
              <div className="text-5xl drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">🪷</div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">
              Welcome <span className="text-pink-400">Back!</span> 👋
            </h2>
            <p className="text-center text-gray-400 mb-8" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Login to continue your wellness journey
            </p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400/60 transition-colors">
                  <span className="text-pink-400">✉️</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent outline-none flex-1 text-sm placeholder:text-gray-500"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/15 rounded-xl px-4 py-3 focus-within:border-pink-400/60 transition-colors">
                  <span className="text-pink-400">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="bg-transparent outline-none flex-1 text-sm placeholder:text-gray-500"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-gray-400 text-sm"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <a href="#" className="text-pink-400 text-sm hover:underline">
                  Forgot Password?
                </a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                 onClick={() => navigate("/onboarding")}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30"
              >
                Log In <span>→</span>
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-7">
              <button className="flex items-center justify-center gap-2 border border-white/15 rounded-xl py-3 text-sm hover:bg-white/5 transition-colors">
                <span>🔴</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-white/15 rounded-xl py-3 text-sm hover:bg-white/5 transition-colors">
                <span></span> Apple
              </button>
              <button className="flex items-center justify-center gap-2 border border-white/15 rounded-xl py-3 text-sm hover:bg-white/5 transition-colors">
                <span>🔵</span> Facebook
              </button>
            </div>

            <p className="text-center text-sm text-gray-400" style={{ fontFamily: "'Lora', Georgia, serif" }}>
              Don't have an account?{" "}
              <a href="#" className="text-pink-400 font-semibold hover:underline">
                Sign up
              </a>
            </p>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-4 mt-8 px-2">
            <div className="w-14 h-14 rounded-full border border-pink-500/40 flex items-center justify-center text-2xl flex-shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.35)]">
              🛡️
            </div>
            <div>
              <p className="text-pink-400 font-semibold mb-1">We prioritize your privacy.</p>
              <p className="text-gray-400 text-sm" style={{ fontFamily: "'Lora', Georgia, serif" }}>
                Your health data is encrypted and never shared without your consent.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-10 pt-6 border-t border-white/10">
            <div className="flex justify-center gap-8 text-sm text-gray-400 mb-4">
              <a href="#" className="hover:text-pink-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-pink-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-pink-400 transition-colors">
                Help Center
              </a>
            </div>
            <p className="text-gray-600 text-xs">© 2025 HerWellness. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}