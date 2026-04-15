"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  inView: boolean;
}

function CountUp({ target, suffix = "", prefix = "", inView }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const statsData = [
  { target: 13, suffix: "", label: "企業級專案" },
  { target: 5000, suffix: "+", label: "問題已修復" },
  { target: 10, suffix: "+", label: "程式語言支援" },
  { target: 100, suffix: "%", label: "Quality Gate 通過率" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#0F1923]">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-[#14B8A6] mb-2">
                <CountUp
                  target={stat.target}
                  suffix={stat.suffix}
                  inView={isInView}
                />
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
