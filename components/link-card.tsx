"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, Globe } from "lucide-react";
import { InlineEditor } from "./inline-editor";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const updateLink = async (field: "title" | "url", newValue: string) => {
    try {
      const linkRef = doc(db, "users", userId, "links", link.id);
      const updates: any = { [field]: newValue };

      if (field === "url") {
        // Update favicon if URL changes
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
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                <Trash2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-primary/20 glass">
              <DialogHeader>
                <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 링크를 삭제하면 복구할 수 없습니다. 다시 한 번 생각해보세요!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" className="rounded-2xl" onClick={() => setIsDeleteDialogOpen(false)}>아니요, 유지할래요</Button>
                <Button variant="destructive" className="rounded-2xl" onClick={deleteLink}>네, 삭제할게요</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
