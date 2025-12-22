"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function TheGoalSection() {
  return (
    <section className="relative border-y border-zinc-900/80 bg-zinc-900/60 py-12 sm:py-16 text-center">
      <GridPattern className="opacity-20" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-10">
        <motion.div
          className="relative w-full max-w-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full rounded-3xl shadow-[0_0_50px_-12px_rgba(255,255,255,0.35)] border border-zinc-700/80 overflow-hidden bg-zinc-900/80">
            <Image
              src="/500taka.jpg"
              alt="500 taka note"
              width={1200}
              height={500}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="relative max-w-xl space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            BOOM. 500 Taka.
          </h2>
          <p className="text-base sm:text-lg text-zinc-300">
            It adds up fast. 250 memes is nothing. You scroll that much in the
            bathroom anyway.
          </p>

          <div className="pt-6">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-base font-bold bg-white text-black hover:bg-zinc-200"
            >
              <Link href="/">
                Start Right Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
