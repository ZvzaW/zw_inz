import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; 
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
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
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}