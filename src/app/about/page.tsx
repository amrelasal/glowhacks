import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Lock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "GlowHacks is a collection of free, private, browser-based tools for skincare, fashion, design and wellness.",
};

const values = [
  { icon: Lock, title: "Private by default", text: "Every tool runs in your browser. We do not run servers that process your entries, and we never ask you to sign up." },
  { icon: Heart, title: "Made for you", text: "Our tools are designed with women and girls in mind, with friendly language, soft visuals, and no pressure." },
  { icon: Sparkles, title: "Simple and beautiful", text: "Each tool does one job well. They load fast, work on any device, and look good enough to screenshot and share." },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">About GlowHacks</h1>
      <p className="mt-4 text-lg leading-relaxed text-glow-ink/85">
        GlowHacks is a growing collection of free online tools for skincare, fashion, design, wellness, and everyday
        organization. We started with a simple idea: the small, practical things that make your day easier should be
        quick to use, pleasant to look at, and respectful of your privacy.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">Our mission</h2>
      <p className="mt-3 leading-relaxed text-glow-ink/85">
        Too many beauty and lifestyle websites bury useful answers under pop-ups, sign-up walls, and endless scrolling.
        We wanted something different: a calm, Pinterest-inspired space where you can check an ingredient list, plan a
        capsule wardrobe, track your water intake, or take a breathing break without handing over personal information.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-glow-pink/40">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-glow-muted">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-semibold">What you will find here</h2>
      <p className="mt-3 leading-relaxed text-glow-ink/85">
        GlowHacks includes thirty tools across five areas: Skincare &amp; Beauty, Fashion &amp; Style, Design &amp;
        Social Media, Health &amp; Wellness, and Life &amp; Organization. From an ingredient checker and a cycle tracker
        to a moodboard canvas and a smart packing list, each tool is built to be useful from the very first click. Every
        tool page also includes a short guide explaining how it works and how to get the most out of it.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">How we protect your privacy</h2>
      <p className="mt-3 leading-relaxed text-glow-ink/85">
        All processing happens on your device. When a tool remembers something, such as your water intake or cycle
        dates, it stores that information in your browser&apos;s local storage, which only you can access. You can
        delete it at any time. Read our{" "}
        <Link href="/privacy" className="font-medium underline decoration-glow-pink decoration-2 underline-offset-4">
          Privacy Policy
        </Link>{" "}
        for the full details.
      </p>

      <h2 className="mt-10 text-2xl font-semibold">A note on health information</h2>
      <p className="mt-3 leading-relaxed text-glow-ink/85">
        GlowHacks tools are for general information and inspiration only. They are not a substitute for professional
        medical, dermatological, or nutritional advice. If you have a health concern, please talk to a qualified
        professional.
      </p>

      <div className="card mt-12 p-6 text-center">
        <p className="text-lg font-semibold">Have an idea for a new tool?</p>
        <p className="mt-1 text-glow-muted">We would love to hear it.</p>
        <Link href="/contact" className="btn-primary mt-4">Contact us</Link>
      </div>
    </main>
  );
}
