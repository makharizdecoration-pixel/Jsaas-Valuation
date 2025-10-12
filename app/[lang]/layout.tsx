// app/[lang]/layout.tsx

import type { Metadata } from "next";
import localFont from 'next/font/local'; 
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientLayout from "./ClientLayout";

const loewNextArabic = localFont({
  src: [
    {
      path: '../fonts/ArbFONTS-Loew-Next-Arabic-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/ArbFONTS-Loew-Next-Arabic-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/ArbFONTS-Loew-Next-Arabic-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "مجموعة جسّاس للمقاولات | Jsaas Contracting Group",
  description: "رواد في قطاع المقاولات والبنية التحتية في المملكة العربية السعودية",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'ar' | 'en' };
}) {
  const isRTL = params.lang === 'ar';
  
  return (
    <html lang={params.lang} dir={isRTL ? 'rtl' : 'ltr'} className={`${loewNextArabic.variable}`} suppressHydrationWarning>
      {/* === التعديل هنا === */}
      <body className="font-sans">
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