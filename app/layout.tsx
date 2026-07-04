import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SICEPU - Sistem Informasi Pelaporan Kerusakan Fasilitas Kampus",
  description: "Platform pelaporan kerusakan fasilitas kampus yang cepat, transparan, dan real-time",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#D4A853",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "SICEPU - Sistem Informasi Pelaporan Kerusakan Fasilitas Kampus",
    description: "Platform pelaporan kerusakan fasilitas kampus yang cepat, transparan, dan real-time",
    type: "website",
    locale: "id_ID",
    siteName: "SICEPU",
  },
  twitter: {
    card: "summary_large_image",
    title: "SICEPU - Sistem Informasi Pelaporan Kerusakan Fasilitas Kampus",
    description: "Platform pelaporan kerusakan fasilitas kampus yang cepat, transparan, dan real-time",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <I18nProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className: "font-sans",
              }}
            />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
