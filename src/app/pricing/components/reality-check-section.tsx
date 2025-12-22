"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

export function RealityCheckSection() {
  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <motion.p
        className="text-2xl sm:text-3xl lg:text-4xl font-semibold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Sounds too little? 🤨
      </motion.p>

      <motion.p
        className="text-lg sm:text-2xl text-zinc-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
      >
        Imagine 250 memes...
      </motion.p>

      <motion.div
        className="mt-4 text-zinc-400"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ArrowDown className="h-8 w-8 sm:h-10 sm:w-10 animate-bounce" />
      </motion.div>
    </section>
  );
}
