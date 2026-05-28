"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@base-ui/react";
import { Plus, Link as LinkIcon, Globe, X } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const linkSchema = z.object({
  title: z.string()
    .min(1, "링크 제목을 입력해주세요.")
    .max(50, "제목은 50자 이내로 입력해주세요."),
  url: z.string()
    .min(1, "URL 주소를 입력해주세요.")
    .refine((val) => {
      try {
        const formattedUrl = val.startsWith("http") ? val : `https://${val}`;
        new URL(formattedUrl);
        return true;
      } catch (e) {
        return false;
      }
    }, "올바른 URL 형식이 아닙니다 (예: google.com)."),
});

type LinkFormValues = z.infer<typeof linkSchema>;

interface AddLinkDialogProps {
  onAdd: (link: { title: string; url: string; faviconUrl: string }) => void;
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  
  // Destructure components from Dialog to improve type-checking stability
  const { Root, Trigger, Portal, Backdrop, Popup, Title, Description, Close } = Dialog;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: LinkFormValues) => {
    try {
      const formattedUrl = data.url.startsWith("http") ? data.url : `https://${data.url}`;
      const domain = new URL(formattedUrl).hostname;
      const faviconUrl = `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=64`;

      onAdd({ 
        title: data.title.trim(), 
        url: formattedUrl, 
        faviconUrl 
      });
      
      setOpen(false);
      toast.success("새 링크가 추가되었습니다!");
    } catch (error) {
       console.error("Link processing error:", error);
       toast.error("링크 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger className="w-full rounded-[1.5rem] h-16 px-6 bg-gradient-to-r from-primary to-primary/80 text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 font-bold text-lg border-none group cursor-pointer ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/40">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
            <Plus className="h-5 w-5" />
          </div>
          <span>새로운 링크 추가하기</span>
        </div>
      </Trigger>
      <Portal>
        <Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-[425px] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-background p-8 shadow-2xl border border-primary/20 ring-1 ring-black/5 transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 glass">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <Close className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-secondary/50 text-muted-foreground transition-colors cursor-pointer focus:outline-none">
                <X className="h-5 w-5" />
              </Close>
            </div>
            <Title className="text-2xl font-bold tracking-tight">새 링크 추가</Title>
            <Description className="text-muted-foreground/70">
              방문자들에게 보여줄 새로운 링크 정보를 입력해주세요.
            </Description>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-bold text-primary/60 uppercase tracking-widest pl-1 block">
                링크 제목
              </label>
              <input
                id="title"
                type="text"
                placeholder="예: 인스타그램, 포트폴리오 등"
                {...register("title")}
                className={`w-full rounded-2xl h-12 bg-background/50 border px-4 transition-all focus:outline-none focus:ring-2 ${
                  errors.title ? "border-destructive focus:ring-destructive/20" : "border-primary/10 focus:ring-primary/20"
                }`}
              />
              {errors.title && (
                <p className="text-[11px] font-medium text-destructive pl-2 mt-1 animate-in fade-in slide-in-from-top-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-bold text-primary/60 uppercase tracking-widest pl-1 block">
                URL 주소
              </label>
              <div className="relative group">
                <input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  {...register("url")}
                  className={`w-full rounded-2xl h-12 bg-background/50 border pl-11 pr-4 transition-all focus:outline-none focus:ring-2 ${
                    errors.url ? "border-destructive focus:ring-destructive/20" : "border-primary/10 focus:ring-primary/20"
                  }`}
                />
                <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                  errors.url ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
                }`} />
              </div>
              {errors.url && (
                <p className="text-[11px] font-medium text-destructive pl-2 mt-1 animate-in fade-in slide-in-from-top-1">
                  {errors.url.message}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
              <Close className="rounded-xl h-12 px-6 font-medium bg-transparent hover:bg-secondary/50 transition-colors cursor-pointer focus:outline-none">
                취소
              </Close>
              <button
                type="submit"
                className="rounded-xl h-12 px-8 bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                저장하기
              </button>
            </div>
          </form>
        </Popup>
      </Portal>
    </Root>
  );
}
