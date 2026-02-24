import type { Metadata } from "next";
import { Montserrat, Michroma } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
});

const michroma = Michroma({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-michroma",
});

export const metadata: Metadata = {
  title: "UpMentor",
  description: "Aplikacja dla trenerów personalnych i podopiecznych",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${montserrat.className} ${michroma.variable} antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}