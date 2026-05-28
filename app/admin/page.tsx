"use client";

import { useAuth } from "@/hooks/useAuth";
import { AdminHeader } from "@/components/admin-header";
import { InlineEditor } from "@/components/inline-editor";
import { LinkCard } from "@/components/link-card";
import { AddLinkDialog } from "@/components/add-link-dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  updateDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { dummyLinks } from "@/data/links";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // For demonstration when server is not connected
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // In demo mode, we might want to stay on the page even if not logged in
      // But for this project, we'll follow the rule.
      // If the user wants "local state", we'll just mock the profile if needed.
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Profile listener
      const unsubProfile = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        } else {
          // Mock profile for local testing if not in DB
          setProfile({
             username: user.displayName || "GUEST",
             displayName: user.email?.split('@')[0] || "guest",
             bio: "Link in bio 서비스 '마이링크'에 오신 것을 환영합니다!"
          });
        }
        setIsPageLoading(false);
      }, (error) => {
        // Fallback to local if Firebase fails
        console.warn("Firebase profile access denied, using demo data");
        setProfile({
            username: "Demo User",
            displayName: "demo",
            bio: "현재 로컬 상태로 데모를 진행 중입니다."
        });
        setIsPageLoading(false);
        setIsDemoMode(true);
      });

      // Links listener
      const linksQuery = query(
        collection(db, "users", user.uid, "links"),
        orderBy("order", "asc")
      );
      const unsubLinks = onSnapshot(linksQuery, (snapshot) => {
        const linksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLinks(linksData);
      }, (error) => {
        console.warn("Firebase links access denied, using dummy data");
        setLinks(dummyLinks);
        setIsDemoMode(true);
      });

      return () => {
        unsubProfile();
        unsubLinks();
      };
    } else if (!loading) {
        // Mock data when not logged in (to satisfy "local state" request)
        setProfile({
            username: "방문자",
            displayName: "visitor",
            bio: "로그인 전에는 로컬 데이터를 보여줍니다."
        });
        setLinks(dummyLinks);
        setIsPageLoading(false);
        setIsDemoMode(true);
    }
  }, [user, loading]);

  const updateProfile = async (field: string, value: string) => {
    if (isDemoMode || !user) {
      setProfile((prev: any) => ({ ...prev, [field]: value }));
      toast.success("Profile updated locally!");
      return;
    }
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [field]: value
      });
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Update failed.");
    }
  };

  const handleAddLink = async ({ title, url, faviconUrl }: { title: string; url: string; faviconUrl: string }) => {
    const newLink = {
      title,
      url,
      faviconUrl,
      order: links.length,
      createdAt: new Date().toISOString(),
    };

    // 즉각적인 UX를 위해 로컬 상태 업데이트
    setLinks(prev => [...prev, { id: `local-${Date.now()}`, ...newLink }]);

    const targetUid = user?.uid || "anonymous";

    try {
      await addDoc(collection(db, "users", targetUid, "links"), {
        title: newLink.title,
        url: newLink.url,
        faviconUrl: newLink.faviconUrl,
        order: newLink.order,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Add link failed:", error);
      toast.error("데이터베이스 저장에 실패했습니다.");
    }
  };

  if (loading || isPageLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">대시보드를 준비하는 중...</p>
        </motion.div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="relative min-h-svh bg-background overflow-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg absolute inset-0 opacity-30 dark:opacity-10" />
      
      <AdminHeader />
      
      <main className="relative z-10 container max-w-2xl mx-auto py-12 px-6 space-y-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="space-y-12"
        >
          {/* Profile Section */}
          <section className="glass rounded-[2rem] border-primary/10 p-10 space-y-8 shadow-2xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-white text-3xl font-bold shadow-xl transition-transform group-hover:scale-105 duration-300">
                  {profile.username?.charAt(0) || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-md">
                   <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>

              <div className="space-y-6 w-full">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">Profile Name</span>
                  <InlineEditor
                    value={profile.username}
                    onSave={(val) => updateProfile("username", val)}
                    className="text-3xl font-bold p-0 text-center hover:bg-transparent tracking-tight"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">Public Handle</span>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-mono bg-secondary/30 py-1.5 px-4 rounded-full w-fit mx-auto border border-primary/5">
                    <span className="text-primary/40">mylink.com/</span>
                    <InlineEditor
                      value={profile.displayName}
                      onSave={(val) => updateProfile("displayName", val)}
                      className="p-0 hover:bg-transparent text-foreground font-semibold"
                      placeholder="nickname"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">Bio</span>
                  <InlineEditor
                    value={profile.bio}
                    onSave={(val) => updateProfile("bio", val)}
                    className="text-muted-foreground/80 p-0 text-center hover:bg-transparent leading-relaxed"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Links Section */}
          <div className="space-y-8">
            <div className="px-2">
              <AddLinkDialog onAdd={handleAddLink} />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold tracking-tight">Your Links</h2>
                  <p className="text-xs text-muted-foreground/60">등록된 링크를 관리하고 순서를 변경하세요.</p>
                </div>
              </div>

              <div className="grid gap-4 min-h-[100px]">
                <AnimatePresence initial={false}>
                  {links.map((link, index) => (
                    <motion.div
                      key={link.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: -20 }}
                      transition={{ 
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        layout: { duration: 0.3 }
                      }}
                    >
                      <LinkCard userId={user?.uid || "demo"} link={link} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {links.length === 0 && (
                  <div className="text-center py-20 glass rounded-[2rem] border border-dashed border-primary/10">
                    <p className="text-muted-foreground font-medium">아직 등록된 링크가 없습니다.</p>
                    <p className="text-sm text-muted-foreground/50 mt-1">첫 번째 링크를 추가하여 프로필을 완성해보세요!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
