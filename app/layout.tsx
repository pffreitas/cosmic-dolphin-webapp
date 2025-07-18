import HeaderAuth from "@/components/header-auth";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Sidebar from "@/components/sidebar/sidebar";
import Body from "./body";
import ReduxProvider from "@/components/providers/redux-provider";
import Link from "next/link";
import { CosmicMenu } from "@/components/cosmic-menu";
import NewNoteButton from "@/components/sidebar/new-note";

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
      <body className="bg-background bg-gray-50 text-foreground">
        <ReduxProvider>
          <Body>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <main className="w-full max-w-screen-lg mx-auto flex min-h-screen gap-6 flex-col">
                <header className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-4 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex">
                      <Link href="/" className="flex gap-2 items-center">
                        <div className="text-2xl">🐬</div>
                        <div
                          className={`transition-all duration-300 ease-in-out overflow-hidden ${"w-auto opacity-100"}`}
                        >
                          <h2 className="font-noto text-lg font-normal text-gray-800 whitespace-nowrap">
                            Cosmic Dolphin
                          </h2>
                        </div>
                      </Link>
                      <CosmicMenu />
                    </div>
                    <div className="flex-1 flex justify-end">
                      <div className="flex items-center space-x-2">
                        <NewNoteButton />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HeaderAuth />
                    </div>
                  </div>
                </header>

                <main className="flex-1 p-6 bg-gray-50">
                  <div className="h-full">{children}</div>
                </main>
              </main>
            </ThemeProvider>
          </Body>
        </ReduxProvider>
      </body>
    </html>
  );
}
