import HeaderAuth from "@/components/header-auth";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Body from "./body";
import ReduxProvider from "@/components/providers/redux-provider";
import Link from "next/link";
import { CosmicMenu } from "@/components/cosmic-menu";
import NewNoteButton from "@/components/sidebar/new-note";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ai-elements/app-sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Z7RBS9TF0F"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z7RBS9TF0F');
        `,
          }}
        />
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
              <SidebarProvider>
                <main className="flex w-full h-full p-2">
                  <div className="w-full mx-auto flex flex-col gap-6">
                    <div className="flex gap-6">
                      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
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
                      </div>
                      <div className="py-2">
                        <SidebarTrigger
                          size="lg"
                          variant="outline"
                          className="w-10 h-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1 max-w-screen-lg mx-auto">
                      {children}
                    </div>
                    <div className="h-2"></div>
                  </div>
                  <AppSidebar />
                </main>
                {/* <main className="w-full mx-auto flex min-h-screen gap-6 flex-col">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-4 p-3">
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
                  </div>

                  <div className="flex-1 p-6 bg-gray-50">
                    <SidebarTrigger />
                    <div className="h-full">{children}</div>
                  </div>
                  <AppSidebar />
                </main> */}
              </SidebarProvider>
            </ThemeProvider>
          </Body>
        </ReduxProvider>
      </body>
    </html>
  );
}
