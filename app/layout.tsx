import HeaderAuth from "@/components/header-auth";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@/utils/supabase/server";
import Body from "./body";
import ReduxProvider from "@/components/providers/redux-provider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground">
        <ReduxProvider>
          <Body>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <main className="flex min-h-screen bg-gray-50">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                  <header className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 flex"></div>
                      <div className="flex items-center space-x-4">
                        <HeaderAuth />
                      </div>
                    </div>
                  </header>

                  <main className="flex-1 p-6 bg-gray-50">
                    <div className="h-full">{children}</div>
                  </main>
                </div>
              </main>
            </ThemeProvider>
          </Body>
        </ReduxProvider>
      </body>
    </html>
  );
}
