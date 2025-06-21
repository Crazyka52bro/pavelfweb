import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/Header"
import FacebookPosts from "./components/FacebookPosts"
import Footer from "./components/Footer"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Bc. Pavel Fišer | Zastupitel MČ Praha 4",
  description: "Oficiální stránky Bc. Pavla Fišera, zastupitele MČ Praha 4 a manažera s vášní pro komunitní rozvoj",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="84zli94h1aqmrsxj4u3bgxzuum7kzd" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main>{children}</main>
          <FacebookPosts />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

