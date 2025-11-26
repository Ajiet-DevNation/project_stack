import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/authProvider";
import { ThemeProvider } from "./theme-providers";
import { ClientLayoutShell } from "@/components/ClientLayoutShell";
import { ToastProvider } from "@/components/ui/toast-1";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Project Stack",
    template: "%s | Project Stack",
  },
  description: "Collaborate on projects seamlessly with Project Stack. The ultimate platform for developers and teams.",
  applicationName: "Project Stack",
  authors: [{ name: "Project Stack Team" }],
  generator: "Next.js",
  keywords: ["project management", "collaboration", "developer tools", "teamwork", "productivity", "software development"],
  referrer: "origin-when-cross-origin",
  creator: "Project Stack Team",
  publisher: "Project Stack",
  metadataBase: new URL("https://projectstack-dev.vercel.app"), 
  icons: {
    icon: "/logo.png",
    apple: "/logo.png", 
  },
  openGraph: {
    title: "Project Stack",
    description: "Collaborate on projects seamlessly with Project Stack.",
    url: "https://project-stack.com",
    siteName: "Project Stack",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Project Stack Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Stack",
    description: "Collaborate on projects seamlessly with Project Stack.",
    images: ["/logo.png"],
    creator: "@projectstack", 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Updated favicon configuration



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} antialiased font-poppins text-foreground border-border outline-ring/50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          
        >
          <AuthProvider>
            <ToastProvider>
              <ClientLayoutShell>{children}</ClientLayoutShell>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
