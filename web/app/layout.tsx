import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Arshiya Sayyed | Backend Engineer",
    template: "%s | Arshiya Sayyed",
  },
  description:
    "Backend engineer at Lyft. Python, TypeScript, AWS: APIs and distributed systems across healthcare, geospatial, and mobility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
