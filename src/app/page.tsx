"use client";

import { useState } from "react";
import { Waves, Crown, Palette, Code, Database, Zap, Moon, Sun, Sparkles, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState("features");

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#012a4a]/5 to-[#ffd500]/5 dark:from-[#89c2d9]/5 dark:to-[#fdc500]/5" />
        <div className="relative">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to Dudoxx Convex
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            A modern Next.js 15 starter with Convex backend, featuring beautiful Ocean and Royal color themes with full dark mode support.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 inline-flex"
            >
              <UserPlus className="h-5 w-5" />
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-border hover:bg-accent/50 transition-colors inline-flex items-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Showcase */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Theme Showcase</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ocean Theme Card */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2c7da0]/20 text-[#2c7da0] dark:bg-[#89c2d9]/20 dark:text-[#89c2d9]">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Ocean Theme</h3>
            </div>
            <p className="text-muted-foreground">
              Inspired by the depths of the ocean, featuring a soothing blue palette that transitions from deep prussian blue to light sky blue.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-12 rounded-lg bg-[#012a4a]" title="prussian" />
              <div className="w-12 h-12 rounded-lg bg-[#013a63]" title="indigo-dye" />
              <div className="w-12 h-12 rounded-lg bg-[#2a6f97]" title="ucla" />
              <div className="w-12 h-12 rounded-lg bg-[#2c7da0]" title="cerulean" />
              <div className="w-12 h-12 rounded-lg bg-[#89c2d9]" title="sky" />
              <div className="w-12 h-12 rounded-lg bg-[#a9d6e5]" title="light" />
            </div>
          </div>

          {/* Royal Theme Card */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#ffd500]/20 text-[#00509d] dark:bg-[#fdc500]/20 dark:text-[#ffd500]">
                <Crown className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Royal Theme</h3>
            </div>
            <p className="text-muted-foreground">
              A regal combination of deep blues and golden yellows, perfect for creating a luxurious and professional appearance.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="w-12 h-12 rounded-lg bg-[#00296b]" title="blue-traditional" />
              <div className="w-12 h-12 rounded-lg bg-[#003f88]" title="marian-blue" />
              <div className="w-12 h-12 rounded-lg bg-[#00509d]" title="polynesian-blue" />
              <div className="w-12 h-12 rounded-lg bg-[#fdc500]" title="mikado-yellow" />
              <div className="w-12 h-12 rounded-lg bg-[#ffd500]" title="gold" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <div className="border-b mb-6">
          <div className="flex gap-6">
            {["features", "tech", "themes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {activeTab === "features" && (
            <>
              <FeatureCard
                icon={<Code className="h-6 w-6" />}
                title="Next.js 15"
                description="Built with the latest Next.js featuring App Router and React Server Components"
              />
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Convex Backend"
                description="Real-time database with TypeScript schemas and reactive queries"
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Turbopack"
                description="Lightning-fast development with Turbopack bundler"
              />
            </>
          )}

          {activeTab === "tech" && (
            <>
              <FeatureCard
                icon={<Code className="h-6 w-6" />}
                title="TypeScript"
                description="Full type safety across frontend and backend"
              />
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                title="Tailwind CSS"
                description="Utility-first CSS with custom design system"
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Shadcn/ui"
                description="Beautiful, accessible components ready to customize"
              />
            </>
          )}

          {activeTab === "themes" && (
            <>
              <FeatureCard
                icon={<Sun className="h-6 w-6" />}
                title="Light Mode"
                description="Clean and bright interface for daytime use"
              />
              <FeatureCard
                icon={<Moon className="h-6 w-6" />}
                title="Dark Mode"
                description="Easy on the eyes for night-time coding"
              />
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                title="Custom Themes"
                description="Switch between Ocean and Royal color palettes"
              />
            </>
          )}
        </div>
      </section>

      {/* Color Gradients Showcase */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Gradient Showcase</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Ocean Gradient</h3>
            <div className="h-32 rounded-xl bg-gradient-to-br from-[#012a4a] via-[#2a6f97] to-[#a9d6e5]" />
            <div className="h-32 rounded-xl bg-[radial-gradient(ellipse_at_center,_#012a4a,_#2a6f97,_#a9d6e5)]" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Royal Gradient</h3>
            <div className="h-32 rounded-xl bg-gradient-to-br from-[#00296b] via-[#00509d] to-[#ffd500]" />
            <div className="h-32 rounded-xl bg-[radial-gradient(ellipse_at_center,_#00296b,_#00509d,_#ffd500)]" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-primary/10 to-accent/10">
        <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start building your next project with this powerful stack. Everything is configured and ready to go!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity inline-block"
          >
            Start Building
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg border border-border hover:bg-accent/50 transition-colors inline-block"
          >
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
