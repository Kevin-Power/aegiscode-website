"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ArrowRight } from "lucide-react";

export default function CtaContact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 bg-[#0D1521] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.08)_0%,transparent_60%)]" />

      <div className="max-w-4xl mx-auto px-6 text-center relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            開始保護您的程式碼
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Every line of code, secured.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="mailto:kevin@aegiscode.com"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold transition-all duration-200 hover:shadow-[0_0_30px_rgba(13,148,136,0.3)]"
            >
              <Mail size={18} />
              聯絡我們
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-[#243447] hover:border-[#0D9488] text-gray-300 hover:text-white font-medium transition-all duration-200"
            >
              了解更多
              <ArrowRight size={16} />
            </a>
          </div>

          <p className="text-gray-600 text-sm">
            Crafted by Kevin Hsieh
          </p>
        </motion.div>
      </div>
    </section>
  );
}
