"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

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
            用 30 天 POC 看見真實治理成果
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            從一個金融 CBOM/PQC demo 開始，延伸到 SAST、Quality Gate 與主管審核。
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mb-12">
            <Link
              href="/trial?track=CODE"
              className="inline-flex items-center justify-center rounded-lg bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0F766E]"
            >
              申請 Code POC
            </Link>
            <Link
              href="/trial?track=SURFACE"
              className="inline-flex items-center justify-center rounded-lg border border-sky-400/40 px-6 py-3 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
            >
              預約 Surface 諮詢
            </Link>
          </div>

          <p className="text-gray-600 text-sm">
            AegisCode 由宜路科技股份有限公司開發與營運
          </p>
        </motion.div>
      </div>
    </section>
  );
}
