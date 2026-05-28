"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Link as LinkIcon, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
        if (doc.exists()) {
          setDisplayName(doc.data().displayName);
        }
      });
      return () => unsub();
    }
  }, [user]);

  const copyMyUrl = () => {
    const url = `${window.location.origin}/${displayName}`;
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const previewMyPage = () => {
    const url = `${window.location.origin}/${displayName}`;
    window.open(url, "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <LinkIcon className="h-6 w-6 text-primary" />
          <span>MYLINK</span>
          <span className="hidden sm:inline-block font-medium text-muted-foreground text-sm ml-2 px-2 py-1 bg-muted rounded">Dashboard</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyMyUrl} className="hidden sm:flex">
            <Copy className="mr-2 h-4 w-4" />
            Copy URL
          </Button>
          <Button variant="outline" size="sm" onClick={previewMyPage} className="flex">
            <ExternalLink className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
