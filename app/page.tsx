"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      // Redirect to dashboard if logged in
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6 bg-background">
      <div className="flex max-w-md w-full flex-col gap-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">M Y L I N K</h1>
          <p className="text-muted-foreground text-lg">
            하나의 링크로 소통하세요
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full py-6 text-lg" 
            onClick={loginWithGoogle}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
            Login with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
