"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center gap-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-zinc-400">
          BMAT PRICING &amp; POLICY
        </p>

        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl sm:text-7xl lg:text-8xl font-black leading-none">
            GET
          </div>

          <motion.div
            className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48"
            initial={{ y: 0, rotate: -4 }}
            animate={{ y: [0, -10, 0], rotate: [-4, 3, -4] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
            style={{ willChange: "transform" }}
          >
            <Image
              src="/2taka.png"
              alt="2 taka coin"
              fill
              className="object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          <div className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none">
            PER MEME
          </div>
        </div>

        <p className="text-sm sm:text-base text-zinc-400">
          Yes, literally. Every. Single. Meme.
        </p>
      </motion.div>
    </section>
  );
}
