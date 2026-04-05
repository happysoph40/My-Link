"use client";

import { dummyLinks } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-20 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-6 shadow-xl ring-4 ring-white dark:ring-slate-900" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">나의 링크 목록</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm">
          저의 소셜 미디어와 프로젝트를 한곳에서 확인해 보세요.
        </p>
      </div>

      {/* Links List */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {dummyLinks
          .sort((a, b) => a.order - b.order)
          .map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
            >
              <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative w-10 h-10 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:border-indigo-400 transition-colors">
                    <img
                      src={link.faviconUrl}
                      alt={`${link.title} 아이콘`}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {link.title}
                    </h2>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                </CardContent>
              </Card>
            </a>
          ))}
      </div>

      {/* Footer */}
      <footer className="mt-20 text-slate-400 text-sm font-medium tracking-wide">
        MYLINK로 제작됨
      </footer>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-500/5 blur-[120px]" />
      </div>
    </div>
  );
}
