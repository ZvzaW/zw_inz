import type { Metadata } from "next"
import { Mina, Michroma } from "next/font/google"
import { Toaster }  from "@/components/ui/sonner"
import "./globals.css"

const mina = Mina({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mina",
  weight: "400",
})

const michroma = Michroma({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-michroma",
})

export const metadata: Metadata = {
  title: "UpMentor",
  description: "Aplikacja dla trenerów personalnych i podopiecznych",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pl">
      <body
        className={`${mina.className} ${michroma.variable} overflow-x-hidden antialiased`}
      >
        {children}
        <Toaster richColors  position="top-right"  />
      </body>
    </html>
  )
}

//richColors