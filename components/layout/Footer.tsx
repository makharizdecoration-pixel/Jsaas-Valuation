// components/layout/Footer.tsx
import Link from 'next/link';
import { Download } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface FooterProps {
  footerTitle: string;
  footerDescription: string;
  footerLogoUrl: string;
  footerLogoAlt: string;
  quickLinks: NavItem[];
  contactInfo: {
    email: string;
    phone: string;
    unified: string;
  };
  isRTL: boolean;
  profilePdfUrl?: string;
}

export function Footer({ footerTitle, footerDescription, footerLogoUrl, footerLogoAlt, quickLinks, contactInfo, isRTL, profilePdfUrl }: FooterProps) {
  const lang = isRTL ? 'ar' : 'en';

  return (
    // --- 🎨 تم استخدام كلاسات Tailwind الديناميكية ---
    <footer className="bg-background-secondary py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            {/* 🎨 استخدام لون النص الأساسي هنا (غالباً أبيض أو فاتح على خلفية داكنة) */}
            <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {footerTitle}
            </h3>
             {/* 🎨 استخدام لون النص الثانوي هنا */}
            <p className={`text-text-secondary mb-4 ${isRTL ? "font-arabic" : "font-normal"}`}>
              {footerDescription}
            </p>
            <div className="flex">
              {footerLogoUrl && (
                <img
                  src={footerLogoUrl}
                  alt={footerLogoAlt}
                  className="h-12 w-auto"
                />
              )}
            </div>
          </div>

          <div>
             {/* 🎨 استخدام لون النص الأساسي */}
            <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`${item.href.startsWith('#') ? '' : `/${lang}`}${item.href}`}
                     // --- 🎨 تم استخدام كلاسات Tailwind الديناميكية ---
                    className={`text-text-secondary hover:text-accent transition-colors ${isRTL ? "font-arabic" : "font-normal"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {profilePdfUrl && (
                <li>
                  <a
                      href={profilePdfUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      // --- 🎨 تم استخدام كلاسات Tailwind الديناميكية ---
                      className={`flex items-center gap-x-2 text-text-secondary hover:text-accent transition-colors ${isRTL ? "font-arabic" : "font-normal"}`}
                  >
                      <Download className="w-4 h-4" />
                      <span>{isRTL ? "تحميل ملف الشركة" : "Download Profile"}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            {/* 🎨 استخدام لون النص الأساسي */}
            <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </h3>
             {/* 🎨 استخدام لون النص الثانوي */}
            {contactInfo && (
              <div className="space-y-2">
                <p className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                  {contactInfo.email}
                </p>
                <p className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                  {contactInfo.phone}
                </p>
                <p className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                  {contactInfo.unified}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center"> {/* 🎨 استخدام border-border */}
          <p className={`text-text-secondary/70 ${isRTL ? "font-arabic" : "font-normal"}`}> {/* لون مناسب */}
            {isRTL ? `© ${new Date().getFullYear()} جساس للتقييم. جميع الحقوق محفوظة.` : `© ${new Date().getFullYear()} Jsaas Valuation. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}