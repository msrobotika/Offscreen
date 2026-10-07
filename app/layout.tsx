import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offscreen — a pocket-sized reason to go outside",
  description: "Three little outdoor missions, chosen by an open model on your device. Made by MS ROBOTIKA.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
