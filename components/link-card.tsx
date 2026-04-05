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
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0 flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden border">
            {link.faviconUrl ? (
              <img src={link.faviconUrl} alt="" className="h-6 w-6" />
            ) : (
              <Globe className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="flex-grow min-w-0 space-y-1">
          <InlineEditor
            value={link.title}
            onSave={(val) => updateLink("title", val)}
            placeholder="Link Title"
            className="font-medium text-base p-0 hover:bg-transparent"
          />
          <InlineEditor
            value={link.url}
            onSave={(val) => updateLink("url", val)}
            placeholder="URL (e.g., https://...)"
            className="text-sm text-muted-foreground p-0 hover:bg-transparent truncate"
          />
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
              <DialogDescription>
                이 링크를 삭제하면 복구할 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>취소</Button>
              <Button variant="destructive" onClick={deleteLink}>삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
