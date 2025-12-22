"use client";

import { motion } from "motion/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function TheRulesSection() {
  return (
    <section className="relative border-y border-zinc-900/80 bg-zinc-900/60 py-12 sm:py-16">
      {/* Patterns removed per user request */}

      <div className="relative mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h3 className="text-3xl sm:text-4xl font-black mb-2">
            The Fine Print (aka: The Rules)
          </h3>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">
            We like memes. We also like structure. Here&apos;s how it actually
            works behind the scenes.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:gap-6 sm:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Card 1 - Status */}
          <Card className="bg-zinc-900/80 border-zinc-700/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Pending First
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Status: Pending → Approved / Rejected
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300 space-y-2">
              <p>
                Every meme you submit starts as{" "}
                <span className="font-semibold">Pending</span>.
              </p>
              <p>
                We check your work. Good ={" "}
                <span className="font-semibold">Money</span>. Bad ={" "}
                <span className="font-semibold">🗑️</span>.
              </p>
              <p className="text-xs text-zinc-500">
                You only get paid for{" "}
                <span className="font-semibold">Approved</span> annotations.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 - The Veto */}
          <Card className="bg-zinc-900/80 border-zinc-700/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                The Supreme Court
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Final judgment on your memes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300 space-y-2">
              <p>
                If we reject it, it&apos;s rejected.{" "}
                <span className="font-semibold">We are not questionable.</span>
              </p>
              <p>No appeals, no debate thread, no &quot;but actually&quot;.</p>
              <p className="text-xs text-zinc-500">
                We simply don&apos;t have capacity to explain every single
                rejection. Sorry, not sorry.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 - Payout */}
          <Card className="bg-zinc-900/80 border-zinc-700/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Show me the Money
              </CardTitle>
              <CardDescription className="text-zinc-400">
                When the 2 takas become 500.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300 space-y-2">
              <p>
                We review your memes in batches once you hit{" "}
                <span className="font-semibold">50+ Pending</span>.
              </p>
              <p>
                Usually every <span className="font-semibold">1–2 days</span>,
                depending on how many memes the universe throws at us.
              </p>
              <p className="text-xs text-zinc-500">
                There&apos;s no fixed SLA. Just vibes and regular batch checks.
              </p>
            </CardContent>
          </Card>

          {/* Card 4 - Contact */}
          <Card className="bg-zinc-900/80 border-zinc-700/80">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Confused?</CardTitle>
              <CardDescription className="text-zinc-400">
                Talk to a human (not a meme).
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300 space-y-2">
              <p>
                If something still doesn&apos;t make sense, or you&apos;re
                stuck, just email us:
              </p>
              <p className="text-sm font-semibold">
                <a
                  href="mailto:xfahim9@gmail.com"
                  className="underline underline-offset-4 decoration-zinc-400 hover:text-zinc-100"
                >
                  xfahim9@gmail.com
                </a>
              </p>
              <p className="text-xs text-zinc-500">
                No spam, no auto-replies, just people who stare at memes
                professionally.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
