"use client";

import { useAuth } from "@/hooks/useAuth";
import { AdminHeader } from "@/components/admin-header";
import { InlineEditor } from "@/components/inline-editor";
import { LinkCard } from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
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
import { motion } from "framer-motion";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Profile listener
      const unsubProfile = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setProfile(doc.data());
        }
        setIsPageLoading(false);
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
      });

      return () => {
        unsubProfile();
        unsubLinks();
      };
    }
  }, [user]);

  const updateProfile = async (field: string, value: string) => {
    if (!user) return;
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

  const addLink = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "links"), {
        title: "New Link",
        url: "",
        faviconUrl: "",
        order: links.length,
        createdAt: serverTimestamp(),
      });
      toast.success("New link added!");
    } catch (error) {
      console.error("Add link failed:", error);
      toast.error("Failed to add link.");
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

  if (!user || !profile) return null;

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
                  {profile.username?.charAt(0) || user.email?.charAt(0).toUpperCase()}
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
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Your Links</h2>
                <p className="text-xs text-muted-foreground/60">링크를 추가하고 드래그하여 순서를 변경하세요.</p>
              </div>
              <Button onClick={addLink} className="rounded-2xl h-11 px-6 bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold">
                <Plus className="mr-2 h-4 w-4" /> Add Link
              </Button>
            </div>

            <div className="grid gap-4">
              {links.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <LinkCard userId={user.uid} link={link} />
                </motion.div>
              ))}
              
              {links.length === 0 && (
                <div className="text-center py-20 glass rounded-[2rem] border border-dashed border-primary/10">
                  <p className="text-muted-foreground font-medium">아직 등록된 링크가 없습니다.</p>
                  <p className="text-sm text-muted-foreground/50 mt-1">첫 번째 링크를 추가하여 프로필을 완성해보세요!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
