"use client";

import { dummyLinks } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoProfilePage() {
  const profile = {
    username: "더미 사용자 (데모)",
    bio: "이 페이지는 MyLink의 디자인 리뉴얼 결과물을 미리 볼 수 있는 데모 페이지입니다. 실제 환경에서는 Firebase 데이터베이스와 연동됩니다.",
    displayName: "demo-user"
  };

  return (
    <div className="relative min-h-svh bg-background flex justify-center overflow-x-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg absolute inset-0 opacity-40 dark:opacity-20" />
      
      <main className="relative z-10 container max-w-xl w-full py-20 px-6 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Demo Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>DEMO PREVIEW</span>
          </div>

          {/* Profile Header */}
          <div className="space-y-4 w-full">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
               D
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{profile.username}</h1>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{profile.bio}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm border">
               @ {profile.displayName}
            </div>
          </div>

          {/* Links List */}
          <div className="grid gap-4 w-full pt-4">
            <AnimatePresence>
              {dummyLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group block w-full"
                >
                  <Button 
                    variant="ghost" 
                    className="glass relative w-full h-auto py-5 px-5 justify-start text-base font-semibold border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/5 hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="h-12 w-12 rounded-xl bg-background/50 flex items-center justify-center shadow-inner group-hover:bg-primary/10 transition-colors">
                        {link.faviconUrl ? (
                          <img src={link.faviconUrl} alt="" className="h-6 w-6" />
                        ) : (
                          <Globe className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <span className="truncate flex-grow text-left text-foreground/90 group-hover:text-primary transition-colors">{link.title}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  </Button>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
          
          <footer className="pt-12">
            <Button 
               variant="outline" 
               className="rounded-2xl"
               onClick={() => window.location.href = "/"}
            >
               메인으로 돌아가기
            </Button>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
