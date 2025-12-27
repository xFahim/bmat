"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ZoomIn, X } from "lucide-react";

export function HowToSection() {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      <section className="relative py-12 sm:py-16">
        <div className="relative mx-auto flex flex-col items-center gap-12 px-4 sm:px-6 lg:px-10 max-w-5xl">
          <motion.div
            className="space-y-4 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h3 className="text-3xl sm:text-4xl font-black">Is it hard? NO.</h3>
            <p className="text-base sm:text-lg text-zinc-300">
              Check the meme, write{" "}
              <span className="font-semibold">3–4 lines</span> of{" "}
              <span className="font-semibold">Context + Explanation</span>.
            </p>
            <p className="text-sm text-zinc-400">
              That&apos;s it. No essays, no poetry, no thesis defense. Just
              explain what&apos;s happening, who it&apos;s about, and why
              it&apos;s funny/sad/chaotic.
            </p>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Card className="bg-zinc-900/80 border-zinc-700/80">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold">
                  Literally just do this.
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  This is what a great annotation looks like.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div
                  className="relative w-full overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-900 cursor-zoom-in group"
                  onClick={() => setIsZoomed(true)}
                >
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-full bg-zinc-900/90 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-zinc-700">
                      <ZoomIn className="h-4 w-4" />
                      Click to Zoom
                    </div>
                  </div>
                  <div className="relative aspect-auto min-h-[500px] w-full">
                    <Image
                      src="/example_meme.png"
                      alt="Example meme annotation"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="w-full space-y-3 text-left">
                  <p className="text-lg sm:text-xl font-semibold text-zinc-50">
                    Just do it like this.
                  </p>
                  <p className="text-sm sm:text-base text-zinc-300">
                    Notice how it explains the{" "}
                    <span className="font-semibold">scene</span>, the{" "}
                    <span className="font-semibold">text</span>, and the{" "}
                    <span className="font-semibold">context / joke</span> in a
                    few clear lines.
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-400">
                    Your job: copy this energy in your own words for every meme.
                    3–4 lines, no overthinking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-full w-full max-w-7xl overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute right-4 top-4 z-50 rounded-full bg-zinc-900/50 p-2 text-white hover:bg-zinc-900 transition-colors"
                aria-label="Close zoom modal"
              >
                <X className="h-6 w-6" />
              </button>
              <Image
                src="/example_meme.png"
                alt="Example meme annotation full"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
