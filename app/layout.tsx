import { Outfit, Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit' 
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "MyLink - 나만의 소중한 링크 모음",
  description: "크리에이터를 위한 세상에서 가장 아름다운 링크-인-바이오(Link-in-bio) 서비스, 마이링크입니다.",
  openGraph: {
    title: "MyLink - 나만의 소중한 링크 모음",
    description: "크리에이터를 위한 세상에서 가장 아름다운 링크-인-바이오(Link-in-bio) 서비스, 마이링크입니다.",
    url: "https://mylink.vercel.app",
    siteName: "MyLink",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "MyLink Preview Image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 나만의 소중한 링크 모음",
    description: "크리에이터를 위한 세상에서 가장 아름다운 링크-인-바이오(Link-in-bio) 서비스, 마이링크입니다.",
    images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", outfit.variable, inter.variable, "font-sans")}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
