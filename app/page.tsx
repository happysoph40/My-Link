"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Globe, Share2, MousePointer2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">세상을 연결하는 중...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Animated Background Elements */}
      <div className="mesh-bg absolute inset-0 opacity-50 dark:opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background" />

      {/* Floating Icons Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              y: [-20, 20, -20],
              x: [-10, 10, -10]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute rounded-full bg-primary/20 p-4 blur-xl"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex max-w-2xl w-full flex-col items-center gap-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            <span>세상의 모든 링크를 하나로</span>
          </div>
          
          <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              M Y L I N K
            </span>
          </h1>
          
          <p className="mx-auto max-w-lg text-lg text-muted-foreground sm:text-xl">
            크리에이터를 위한 가장 아름답고 세련된 링크 관리 도구. 
            당신의 모든 가치를 하나의 완성된 페이지에 담아보세요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button 
            size="lg" 
            className="group relative h-14 w-full overflow-hidden rounded-2xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:shadow-primary/25 sm:w-auto"
            onClick={loginWithGoogle}
          >
            <div className="relative z-10 flex items-center gap-3">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              구글로 3초 만에 시작하기
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="h-14 w-full rounded-2xl border-2 px-8 text-lg font-semibold transition-all hover:bg-secondary sm:w-auto"
            onClick={() => router.push("/links/sophie")} // Preview link
          >
            둘러보기
          </Button>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-3"
        >
          {[
            { icon: Globe, text: "나만의 고유 주소" },
            { icon: Share2, text: "간편한 소셜 공유" },
            { icon: MousePointer2, text: "인라인 편집 지원" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary transition-transform hover:rotate-6">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="relative z-10 mt-20 text-sm text-muted-foreground">
        &copy; 2024 MyLink. Everything connected.
      </footer>
    </div>
  );
}
