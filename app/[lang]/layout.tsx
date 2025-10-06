// app/[lang]/layout.tsx

import type { Metadata } from "next";
import { Poppins, Almarai } from "next/font/google";
import "./globals.css";
// تم تصحيح المسار هنا
import { ThemeProvider } from "next-themes"; 
import ClientLayout from "./ClientLayout";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Jasas Group",
  description: "High-end furniture and decor manufacturer",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'ar' | 'en' };
}) {
  return (
    <html lang={params.lang} dir={params.lang === 'ar' ? 'rtl' : 'ltr'} className={`${almarai.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}