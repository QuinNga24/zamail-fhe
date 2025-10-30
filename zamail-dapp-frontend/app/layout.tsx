import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_Display, Noto_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const notoSerif = Noto_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Zamail - Digital Calligraphy",
  description: "Fully encrypted email system on blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof global === 'undefined') {
                window.global = window;
              }
            `,
          }}
        />
      </head>
      <body className={`${notoSerif.variable} ${notoSans.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
