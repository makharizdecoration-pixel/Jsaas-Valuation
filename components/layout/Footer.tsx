// components/layout/Footer.tsx
import Link from 'next/link';

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
}

export function Footer({ footerTitle, footerDescription, footerLogoUrl, footerLogoAlt, quickLinks, contactInfo, isRTL }: FooterProps) {
  return (
    <footer className="bg-jassas-footer-bg py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className={`text-xl font-bold text-static-white mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {footerTitle}
            </h3>
            <p className={`text-static-white/80 mb-4 ${isRTL ? "font-arabic" : "font-normal"}`}>
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
            <h3 className={`text-xl font-bold text-static-white mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {isRTL ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`text-static-white hover:text-jassas-accent-red transition-colors ${isRTL ? "font-arabic" : "font-normal"}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-xl font-bold text-static-white mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </h3>
            {contactInfo && (
              <div className="space-y-2">
                <p className={`text-static-white ${isRTL ? "font-arabic" : "font-normal"}`}>
                  {contactInfo.email}
                </p>
                <p className={`text-static-white ${isRTL ? "font-arabic" : "font-normal"}`}>
                  {contactInfo.phone}
                </p>
                <p className={`text-static-white ${isRTL ? "font-arabic" : "font-normal"}`}>
                  {contactInfo.unified}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className={`text-text-secondary/70 ${isRTL ? "font-arabic" : "font-normal"}`}>
            {isRTL ? `© ${new Date().getFullYear()} جساس للمقاولات. جميع الحقوق محفوظة.` : `© ${new Date().getFullYear()} Jsaas Contracting. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}