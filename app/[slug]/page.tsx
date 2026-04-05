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
  orderBy, 
  collectionGroup 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Globe, Loader2, AlertCircle } from "lucide-react";

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
        const linksQuery = query(linksRef, orderBy("createdAt", "desc"));
        
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
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-xl font-bold">{error}</h1>
        <Button variant="outline" onClick={() => window.location.href = "/"}>홈으로 돌아가기</Button>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background flex justify-center">
      <main className="container max-w-2xl w-full py-16 px-6 space-y-12">
        {/* Profile Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{profile.username}</h1>
            <p className="text-muted-foreground max-w-md mx-auto">{profile.bio}</p>
          </div>
          <div className="text-sm font-mono text-muted-foreground">
            mylink.com/{profile.displayName}
          </div>
        </div>

        {/* Links List */}
        <div className="grid gap-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full transition-all hover:-translate-y-1"
            >
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 px-4 justify-start text-lg font-medium border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="h-10 w-10 rounded bg-muted group-hover:bg-primary-foreground/20 flex items-center justify-center overflow-hidden border">
                    {link.faviconUrl ? (
                      <img src={link.faviconUrl} alt="" className="h-6 w-6" />
                    ) : (
                      <Globe className="h-6 w-6" />
                    )}
                  </div>
                  <span className="truncate flex-grow text-left">{link.title}</span>
                </div>
              </Button>
            </a>
          ))}

          {links.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              아직 등록된 링크가 없습니다.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
