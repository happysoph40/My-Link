"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@base-ui/react";
import { Trash2, GripVertical, Globe, ExternalLink, X } from "lucide-react";
import { InlineEditor } from "./inline-editor";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface LinkCardProps {
  userId: string;
  link: {
    id: string;
    title: string;
    url: string;
    faviconUrl: string;
  };
}

export function LinkCard({ userId, link }: LinkCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Destructure components for stable type-checking
  const { Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close } = Dialog;

  const updateLink = async (field: "title" | "url", newValue: string) => {
    if (userId === "demo" || !userId) {
      toast.success("Link updated locally (Demo Mode)");
      return;
    }
    
    try {
      const linkRef = doc(db, "users", userId, "links", link.id);
      const updates: any = { [field]: newValue };

      if (field === "url") {
        const domain = new URL(newValue.startsWith("http") ? newValue : `https://${newValue}`).hostname;
        updates.faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=64`;
      }

      await updateDoc(linkRef, updates);
      toast.success("Link updated!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update failed. Check URL format.");
    }
  };

  const deleteLink = async () => {
    if (userId === "demo" || !userId || link.id.startsWith("local-")) {
      toast.success("Link deleted locally (Demo Mode)");
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      const linkRef = doc(db, "users", userId, "links", link.id);
      await deleteDoc(linkRef);
      toast.success("Link deleted!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete failed.");
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm rounded-2xl">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex-shrink-0 flex items-center gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground/20 cursor-grab active:cursor-grabbing" />
          <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center overflow-hidden border border-primary/5 shadow-inner group-hover:bg-primary/5 transition-colors duration-300">
            {link.faviconUrl ? (
              <img src={link.faviconUrl} alt="" className="h-6 w-6" />
            ) : (
              <Globe className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex-grow min-w-0 space-y-1.5 pl-2">
          <InlineEditor
            value={link.title}
            onSave={(val) => updateLink("title", val)}
            placeholder="Link Title"
            className="font-semibold text-lg p-0 hover:bg-transparent tracking-tight text-foreground/90"
          />
          <div className="flex items-center gap-2">
            <InlineEditor
              value={link.url}
              onSave={(val) => updateLink("url", val)}
              placeholder="URL (e.g., https://...)"
              className="text-sm text-muted-foreground/70 p-0 hover:bg-transparent truncate max-w-[200px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all cursor-pointer focus:outline-none"
            onClick={() => {
              const url = link.url.startsWith("http") ? link.url : `https://${link.url}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </button>

          <Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <Trigger className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer focus:outline-none">
              <Trash2 className="h-5 w-5" />
            </Trigger>
            <Portal>
              <Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
              <Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-background p-8 shadow-2xl border border-primary/20 transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 glass">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <Trash2 className="h-6 w-6 text-destructive" />
                    </div>
                    <Close className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors cursor-pointer focus:outline-none">
                      <X className="h-5 w-5" />
                    </Close>
                  </div>
                  <div className="space-y-2">
                    <Title className="text-xl font-bold tracking-tight">정말 삭제하시겠습니까?</Title>
                    <Description className="text-muted-foreground/70 leading-relaxed">
                      이 링크를 삭제하면 복구할 수 없습니다. 다시 한 번 생각해보세요!
                    </Description>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-8">
                  <Close className="rounded-xl h-11 px-6 font-medium bg-transparent hover:bg-secondary/50 transition-colors cursor-pointer focus:outline-none">
                    아니요, 유지할래요
                  </Close>
                  <button
                    onClick={deleteLink}
                    className="rounded-xl h-11 px-8 bg-destructive text-white shadow-lg shadow-destructive/20 hover:shadow-destructive/40 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-destructive/40"
                  >
                    네, 삭제할게요
                  </button>
                </div>
              </Popup>
            </Portal>
          </Root>
        </div>
      </CardContent>
    </Card>
  );
}
