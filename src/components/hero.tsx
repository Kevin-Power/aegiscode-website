"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.12)_0%,transparent_70%)]" />

      {/* Animated dots/particles */}
      <div className="absolute inset-0 bg-dots opacity-40" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#243447] bg-[#1A2332]/60 text-xs text-gray-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
            SAST-in-the-Loop, CBOM & Taiwan Compliance Evidence
          </div>

          {/* Main heading */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold tracking-tight mb-6 gradient-text glow-teal">
            AegisCode
          </h1>

          {/* Chinese tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-medium mb-3">
            從程式碼弱點到加密資產，一次產出可稽核的治理證據
          </p>

          {/* English tagline */}
          <p className="text-base sm:text-lg text-gray-500 mb-10">
            SAST, VULNFORGE AI review, CBOM/PQC inventory, SBOM/SCA, and executive-ready evidence in one platform.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/trial"
            className="px-8 py-3.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold text-base transition-all duration-200 hover:shadow-[0_0_30px_rgba(13,148,136,0.3)]"
          >
            Book CBOM Demo · 預約展示
          </a>
          <a
            href="#product-proof"
            className="px-8 py-3.5 rounded-lg border border-[#243447] hover:border-[#0D9488] text-gray-300 hover:text-white font-medium text-base transition-all duration-200"
          >
            See Product Proof · 查看實證
          </a>
        </motion.div>

        {/* Bottom fade gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="mt-20 flex justify-center"
        >
          <div className="w-px h-20 bg-gradient-to-b from-[#0D9488]/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
