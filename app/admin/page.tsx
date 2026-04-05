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
        orderBy("createdAt", "desc")
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
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-svh bg-muted/30">
      <AdminHeader />
      
      <main className="container max-w-2xl mx-auto py-10 px-4 space-y-12">
        {/* Profile Section */}
        <section className="bg-background rounded-xl border p-8 space-y-6 shadow-sm">
          <div className="text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</span>
              <InlineEditor
                value={profile.username}
                onSave={(val) => updateProfile("username", val)}
                className="text-3xl font-bold p-0 text-center hover:bg-transparent"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nickname (URL Slug)</span>
              <div className="flex items-center justify-center gap-1 text-muted-foreground font-mono">
                <span>/</span>
                <InlineEditor
                  value={profile.displayName}
                  onSave={(val) => updateProfile("displayName", val)}
                  className="p-0 hover:bg-transparent text-foreground"
                  placeholder="nickname"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio</span>
              <InlineEditor
                value={profile.bio}
                onSave={(val) => updateProfile("bio", val)}
                className="text-muted-foreground p-0 text-center hover:bg-transparent"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        </section>

        {/* Links Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold tracking-tight">Your Links</h2>
            <Button size="sm" onClick={addLink} className="rounded-full shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add Link
            </Button>
          </div>

          <div className="grid gap-3">
            {links.map((link) => (
              <LinkCard key={link.id} userId={user.uid} link={link} />
            ))}
            
            {links.length === 0 && (
              <div className="text-center py-12 bg-background border rounded-xl border-dashed">
                <p className="text-muted-foreground">아직 등록된 링크가 없습니다.</p>
                <p className="text-sm text-muted-foreground/70 mt-1">위의 버튼을 눌러 첫 번째 링크를 추가해보세요!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
