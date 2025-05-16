import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "../components/header";
import { Toaster } from "sonner";
import { Github, Linkedin, Send } from "lucide-react";

export const metadata = {
  title: "Skill Edge AI ",
  description:
    "An AI-powered platform that helps job seekers with mock interviews.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">
              {children}
              <Toaster />
            </main>
          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
