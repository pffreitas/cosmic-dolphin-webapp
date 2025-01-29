import HeaderAuth from "@/components/header-auth";
import { submitPrompt } from "@/app/actions";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";
import ToggleButtonGroup from "@/components/toggle-button-group";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className=" h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>
                      <p className="flex items-center gap-2">
                        <span className="text-2xl">🐬</span> Cosmic Dolphin
                      </p>
                    </Link>
                  </div>
                  <div className="flex gap-2">
                    <HeaderAuth />
                  </div>
                </div>
              </nav>
              <div className="flex flex-col w-full max-w-5xl p-5 pb-[180px] overflow-y-auto">
                {children}
              </div>

              <footer className="bg-white w-full fixed bottom-0 flex border-t text-sm gap-8 px-16 py-8">
                <div className="shadow-md w-full rounded-md p-5">
                  <form className="flex gap-2">
                    <textarea name="prompt" className="w-full max-w focus:outline-none focus:border-0 resize-none" rows={1} placeholder="Type something here"></textarea>
                    <SubmitButton formAction={submitPrompt}>Send</SubmitButton>
                  </form>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
