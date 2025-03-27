"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import PortfolioForm from "../components/PortfolioForm";
import { motion } from "framer-motion";

export default function DashboardClient({ user }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [backgroundStyle, setBackgroundStyle] = useState({
    useGradient: user.portfolio.useGradient,
    backgroundColor: user.portfolio.backgroundColor,
    gradientStart: user.portfolio.gradientStart,
    gradientEnd: user.portfolio.gradientEnd,
  });

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio");
      }

      router.push(`/${formData.slug}`);
    } catch (error) {
      console.error("Error saving portfolio:", error);
    }
  };

  const handleBackgroundChange = (style) => {
    setBackgroundStyle(style);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
      style={{
        background: backgroundStyle.useGradient
          ? `linear-gradient(135deg, ${backgroundStyle.gradientStart} 0%, ${backgroundStyle.gradientEnd} 100%)`
          : backgroundStyle.backgroundColor,
      }}
    >
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-white font-bold text-xl hover:text-white/90 transition-colors"
          >
            Fast Resume
          </a>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <PortfolioForm
              portfolio={user.portfolio}
              onSubmit={handleSubmit}
              onBackgroundChange={handleBackgroundChange}
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-white/60 text-sm">
          <p>© 2024 Fast Resume. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
