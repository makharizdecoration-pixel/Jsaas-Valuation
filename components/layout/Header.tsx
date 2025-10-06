// components/layout/Header.tsx
"use client";

import { useState } from "react";
import { usePathname } from 'next/navigation'; // استيراد hook جديد
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
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
}

export function Header({ logoUrl, logoAlt, navItems, lang }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isRTL = lang === "ar";

  // دالة لتوليد الرابط باللغة الأخرى
  const getSwitchedLanguagePath = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    // يزيل اللغة الحالية من الرابط ويضيف الجديدة
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    return newPath;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-jassas-footer-bg border-b-2 border-jassas-accent-red">
      <div className="container mx-auto max-w-7xl h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          <motion.div 
            className="flex-shrink-0" 
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Link href={`/${lang}`} aria-label="Go to homepage">
              <img src={logoUrl} alt={logoAlt} className="h-10 w-auto" />
            </Link>
          </motion.div>

          <div className="hidden lg:flex items-center justify-end flex-grow gap-6">
            <div className={`flex items-center xl:space-x-8 lg:space-x-4 whitespace-nowrap ${isRTL ? "space-x-reverse" : ""}`}>
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  // الروابط الآن تأخذ اللغة في الاعتبار
                  href={`/${lang}${item.href}`}
                  className="text-static-white hover:text-jassas-accent-red font-semibold transition-colors xl:text-base lg:text-sm"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* زر اللغة الآن هو رابط <Link> */}
              <Link href={getSwitchedLanguagePath()} passHref>
                <motion.div
                  className="flex items-center space-x-2 px-3 py-1 rounded-lg font-semibold bg-jassas-accent-red text-static-white hover:bg-static-white hover:text-jassas-accent-red transition-colors cursor-pointer" 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{lang === "ar" ? "EN" : "AR"}</span>
                </motion.div>
              </Link>
              <ThemeToggleButton />
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
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
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={`/${lang}${item.href}`} className="block py-2 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href={getSwitchedLanguagePath()} className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-accent transition-colors" onClick={() => setIsMenuOpen(false)}>
                <Globe className="w-4 h-4" />
                <span>{lang === "ar" ? "English" : "العربية"}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}