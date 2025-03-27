"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PortfolioPage({ params }) {
  const resolvedParams = use(params);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio/${resolvedParams.slug}`);
        if (!response.ok) {
          notFound();
        }
        const data = await response.json();
        setPortfolio(data.portfolio);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-white hover:text-white/90 transition-colors"
              >
                Fast Resume
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {portfolio.image && (
              <div className="relative w-40 h-40 mx-auto mb-6 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
                <Image
                  src={portfolio.image}
                  alt={portfolio.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold text-white mb-4">
              {portfolio.name}
            </h1>
            <p className="text-xl text-white/90 mb-4">{portfolio.title}</p>
            {portfolio.bio && (
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                {portfolio.bio}
              </p>
            )}
          </motion.div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Social Links */}
            {(portfolio.socialLinks?.github ||
              portfolio.socialLinks?.linkedin ||
              portfolio.socialLinks?.twitter ||
              portfolio.socialLinks?.website) && (
              <div className="space-y-3">
                {portfolio.socialLinks.github && (
                  <a
                    href={portfolio.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-center py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    GitHub
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a
                    href={portfolio.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-center py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-.88-.06-1.601-1-1.601-1 0-1.16.781-1.16 1.601v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                        clipRule="evenodd"
                      />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {portfolio.socialLinks.twitter && (
                  <a
                    href={portfolio.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-center py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter
                  </a>
                )}
                {portfolio.socialLinks.website && (
                  <a
                    href={portfolio.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-center py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            )}

            {/* Experience Links */}
            {portfolio.experience?.map((exp, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="block w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-center py-4 px-6 rounded-xl transition-all duration-200"
              >
                <div className="text-left">
                  <h3 className="font-medium text-lg">{exp.title}</h3>
                  <p className="text-white/80">{exp.company}</p>
                  <p className="text-sm text-white/60">
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : "Present"}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-white/80 text-sm whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.a>
            ))}

            {/* Education Links */}
            {portfolio.education?.map((edu, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="block w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-center py-4 px-6 rounded-xl transition-all duration-200"
              >
                <div className="text-left">
                  <h3 className="font-medium text-lg">{edu.school}</h3>
                  <p className="text-white/80">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-sm text-white/60">
                    {new Date(edu.startDate).toLocaleDateString()} -{" "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString()
                      : "Present"}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-white/80 text-sm whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.a>
            ))}

            {/* Skills */}
            {portfolio.skills?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <h2 className="text-xl font-medium text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
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
