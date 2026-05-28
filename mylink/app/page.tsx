"use client";

import { useEffect, useState } from "react";
import { dummyLinks } from "@/data/links";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Settings, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { isFirebaseConfigured, db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, orderBy } from "firebase/firestore";

export default function Page() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    username: "happysoph40",
    bio: "안녕하세요! 저의 마이링크 공간에 오신 것을 환영합니다. 아래 링크를 통해 제 포트폴리오와 소셜 미디어를 확인하실 수 있습니다.",
    displayName: "happysoph40"
  });
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clickCounts, setClickCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const storedClicks = localStorage.getItem("mylink_clicks");
    if (storedClicks) {
      try {
        setClickCounts(JSON.parse(storedClicks));
      } catch (e) {
        console.error(e);
      }
    }

    const loadData = async () => {
      if (isFirebaseConfigured) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("displayName", "==", "happysoph40"));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const userId = querySnapshot.docs[0].id;
            setProfile({
              username: userData.username || "happysoph40",
              bio: userData.bio || "자기소개가 비어 있습니다.",
              displayName: userData.displayName || "happysoph40"
            });

            const linksRef = collection(db, "users", userId, "links");
            const linksQuery = query(linksRef, orderBy("order", "asc"));
            const linksSnapshot = await getDocs(linksQuery);
            const linksData = linksSnapshot.docs.map(doc => ({
              id: doc.id,
              userId,
              ...doc.data()
            }));
            setLinks(linksData);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Firestore 연동 중 오류 발생, 로컬 데이터로 대체합니다:", err);
        }
      }

      setLinks(dummyLinks);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleLinkClick = async (link: any) => {
    const newCounts = {
      ...clickCounts,
      [link.id]: (clickCounts[link.id] || 0) + 1
    };
    setClickCounts(newCounts);
    localStorage.setItem("mylink_clicks", JSON.stringify(newCounts));

    if (isFirebaseConfigured && link.userId && !link.id.startsWith('link-')) {
      try {
        const linkRef = doc(db, "users", link.userId, "links", link.id);
        await updateDoc(linkRef, {
          clickCount: increment(1)
        });
      } catch (err) {
        console.error("클릭 수 DB 업데이트 실패:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">마이링크를 구성하는 중...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh bg-background flex justify-center overflow-x-hidden">
      <div className="mesh-bg absolute inset-0 opacity-40 dark:opacity-20" />

      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-background/30 backdrop-blur-md border border-border/40 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
          onClick={() => router.push("/admin")}
          title="관리자 설정 이동"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <main className="relative z-10 container max-w-xl w-full py-20 px-6 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          <div className="space-y-5 w-full">
            <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl border-4 border-background/60">
              {profile.username?.charAt(0).toUpperCase() || "H"}
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center shadow-md">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{profile.username}</h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">{profile.bio}</p>
            </div>
            
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/50 px-3.5 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm border shadow-inner">
               @ {profile.displayName}
            </div>
          </div>

          <div className="grid gap-4.5 w-full pt-6">
            <AnimatePresence initial={false}>
              {links.map((link, index) => {
                const isLocalDummy = link.id.startsWith('link-');
                const displayCount = isLocalDummy 
                  ? (clickCounts[link.id] || 0) 
                  : (link.clickCount || 0) + (clickCounts[link.id] || 0);

                return (
                  <motion.a
                    key={link.id}
                    href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group block w-full"
                  >
                    <Button 
                      variant="ghost" 
                      className="glass relative w-full h-auto py-5 px-5 justify-start text-base font-semibold border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:bg-primary/5 hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="h-11 w-11 rounded-xl bg-background/50 flex items-center justify-center shadow-inner group-hover:bg-primary/10 transition-colors">
                          {link.faviconUrl ? (
                            <img src={link.faviconUrl} alt="" className="h-6 w-6" />
                          ) : (
                            <Globe className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div className="flex-grow text-left">
                          <span className="truncate block text-foreground/90 group-hover:text-primary transition-colors">{link.title}</span>
                          <span className="text-[11px] text-muted-foreground/60 font-medium">클릭 수: {displayCount}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </Button>
                  </motion.a>
                );
              })}
            </AnimatePresence>

            {links.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass rounded-3xl border border-dashed border-border"
              >
                <p className="text-muted-foreground font-medium">등록된 링크가 존재하지 않습니다.</p>
              </motion.div>
            )}
          </div>
          
          <footer className="pt-16">
            <a 
              href="/admin" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground/60 hover:text-primary transition-colors"
            >
              <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
                 <span className="text-[10px] text-primary">M</span>
              </div>
              Create your own MyLink
            </a>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}
