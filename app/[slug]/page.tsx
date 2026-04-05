"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  onSnapshot, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Globe, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("존재하지 않는 페이지입니다.");
          setLoading(false);
          return;
        }

        const userData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;
        setProfile(userData);

        // Fetch links
        const linksRef = collection(db, "users", userId, "links");
        const linksQuery = query(linksRef, orderBy("order", "asc"));
        
        const unsubLinks = onSnapshot(linksQuery, (snapshot) => {
          const linksData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setLinks(linksData);
          setLoading(false);
        });

        return () => unsubLinks();
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("페이지를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">프로필을 불러오는 중...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{error}</h1>
          <p className="text-muted-foreground">주소를 다시 확인하거나 홈으로 돌아가주세요.</p>
        </div>
        <Button size="lg" className="rounded-2xl" onClick={() => window.location.href = "/"}>홈으로 돌아가기</Button>
      </div>
    );
  }

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
          {/* Profile Header */}
          <div className="space-y-4 w-full">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {profile.username?.charAt(0) || slug?.toString().charAt(0).toUpperCase()}
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
            <AnimatePresence initial={false}>
              {links.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
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

            {links.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass rounded-3xl border border-dashed"
              >
                <p className="text-muted-foreground">아직 등록된 링크가 없네요.</p>
              </motion.div>
            )}
          </div>
          
          <footer className="pt-12">
            <a 
              href="/" 
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
