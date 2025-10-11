// components/layout/Header.tsx
"use client";

import { useState } from "react";
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Download } from "lucide-react";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  logoUrl: string;
  logoAlt: string;
  navItems: NavItem[];
  lang: 'ar' | 'en';
  alternates?: Record<string, string>;
  profilePdfUrl?: string; 
}

export function Header({ logoUrl, logoAlt, navItems, lang, alternates, profilePdfUrl }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isRTL = lang === "ar";

  const getSwitchedLanguagePath = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    if (alternates && alternates[newLang]) {
      if (pathname.includes('/services/')) {
        return `/${newLang}/services/${alternates[newLang]}`;
      }
    }
    if (pathname.startsWith(`/${lang}`)) {
      return pathname.replace(`/${lang}`, `/${newLang}`);
    }
    return `/${newLang}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-jassas-footer-bg border-b-2 border-jassas-accent-red">
      <div className="container mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between w-full h-full">
          
          <motion.div 
            className="flex-shrink-0" 
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Link href={`/${lang}`} aria-label="Go to homepage">
              <img src={logoUrl} alt={logoAlt} className="h-10 w-auto" />
            </Link>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-x-8 whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label + index}
                href={`${item.href.startsWith('#') ? '' : `/${lang}`}${item.href}`}
                className={`text-static-white hover:text-jassas-accent-red transition-colors xl:text-base lg:text-sm ${isRTL ? 'font-arabic font-bold' : 'font-semibold'}`}
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-x-4">
             {profilePdfUrl && (
                <a
                  href={profilePdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isRTL ? "تحميل ملف الشركة" : "Download Company Profile"}
                  className="text-static-white hover:text-jassas-accent-red transition-colors"
                >
                  <Download className="w-5 h-5" />
                </a>
             )}
             <Link href={getSwitchedLanguagePath()} passHref>
                <motion.div
                  className="flex items-center gap-x-2 px-3 py-1 rounded-lg font-semibold bg-jassas-accent-red text-static-white hover:bg-static-white hover:text-jassas-accent-red transition-colors cursor-pointer" 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{lang === "ar" ? "EN" : "AR"}</span>
                </motion.div>
              </Link>
              <ThemeToggleButton />
          </div>

          <div className="lg:hidden flex items-center gap-4">
             {/* ✨ تم إضافة أيقونة التحميل هنا أيضاً لتظهر بجانب زر القائمة في الموبايل ✨ */}
             {profilePdfUrl && (
                <a
                  href={profilePdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={isRTL ? "تحميل ملف الشركة" : "Download Company Profile"}
                  className="text-static-white hover:text-jassas-accent-red transition-colors"
                >
                  <Download className="w-5 h-5" />
                </a>
             )}
            <ThemeToggleButton />
            <motion.button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-static-white hover:opacity-80" whileTap={{ scale: 0.95 }}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden bg-white dark:bg-jassas-footer-bg border-t border-gray-200 dark:border-gray-700" 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={`px-4 py-2 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={`${item.href.startsWith('#') ? '' : `/${lang}`}${item.href}`} 
                  className={`block py-2 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors ${isRTL ? 'font-arabic font-bold' : 'font-semibold'}`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href={getSwitchedLanguagePath()} className="flex items-center gap-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Globe className="w-4 h-4" />
                <span className={`${isRTL ? 'mr-2' : 'ml-2'}`}>{lang === "ar" ? "English" : "العربية"}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}