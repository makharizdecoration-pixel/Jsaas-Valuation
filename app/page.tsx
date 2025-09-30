"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Menu, X, ChevronRight, Globe, Eye, Target, Heart, CheckCircle, Mail, Phone, Building, MapPin, QrCode, ArrowUp,
} from "lucide-react"
import { parse } from 'node-html-parser'
import { ServicesCarousel } from "@/components/ui/services-carousel";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"

// DYNAMIC IMPORTS
const ImageSwiper = dynamic(() => import("@/components/ui/image-swiper").then(mod => mod.ImageSwiper), { ssr: false, loading: () => <div className="w-full h-full min-h-[400px] bg-background-secondary rounded-lg animate-pulse" /> });
const CircularGallery = dynamic(() => import("@/components/ui/circular-gallery").then(mod => mod.CircularGallery), { ssr: false, loading: () => <div className="w-full h-[80vh] bg-background-secondary rounded-lg animate-pulse" /> });
const EquipmentImageSwiper = dynamic(() => import("@/components/ui/equipment-image-swiper").then(mod => mod.EquipmentImageSwiper), { ssr: false, loading: () => <div className="w-[320px] h-[400px] bg-background-secondary rounded-lg animate-pulse" /> });

// TYPESCRIPT INTERFACES FROM WORDPRESS
interface ImageNode { sourceUrl: string; altText: string; }

interface SiteOptionsFields {
  logo: { node: ImageNode };
}

// This is the new group for the footer fields
interface SiteOptions {
  footerTitle: string;
  footerDescription: string;
  footerLogo: { node: ImageNode };
}


interface HeroData { headline: string; subtext: string; primaryButtonText: string; secondaryButtonText: string; heroImage?: { node: ImageNode }; }
interface CeoData { ceoSectionTitle: string; ceoName: string; ceoMessage: string; ceoJobTitle: string; ceoImage: { node: ImageNode }; }
interface AboutData { aboutSectionTitle: string; aboutSectionContent: string; visionTitle: string; visionContent: string; missionTitle: string; missionContent: string; valuesTitle: string; valuesContent: string; vision2030Image: { node: ImageNode }; vision2030Title: string; vision2030Tagline: string; }
interface ServicesSectionTitles { servicesMainTitle: string; servicesSubtitle: string; }
interface DivisionsSectionTitles { divisionsMainTitle: string; divisionsSubtitle: string; }
interface EquipmentSection { equipmentMainTitle: string; equipmentSubtitle: string; equipmentGallery: string; }
interface QualityPolicySection { qualityTitle: string; qualityContent: string; qualityCommitments: string; }
interface WhyUsSection { whyUsTitle: string; whyUsSubtitle: string; whyUsList: string; }
interface PortfolioSectionTitle { portfolioTitle: string; portfolioSubtitle: string; }
interface Service { id: string; title: string; serviceDetails: { serviceDescription: string; serviceImage: { node: ImageNode }; }; }
interface Division {
  id: string;
  title: string;
  content: string;
  divisionDetails: {
    divisionIcon: string;
  };
}
interface PortfolioItem { id: string; title: string; portfolioItemDetails: { commonText: string; binomialText: string; photo: { node: ImageNode; }; }; }
interface ContactInfoData { contactSectionTitle: string; contactSectionSubtitle: string; emailAddress: string; phoneNumber: string; unifiedNumber: string; branchesAddress: string; qrCodeImage: { node: { sourceUrl: string; altText: string; } }; qrCodeText: string; }

interface PageData {
  page: {
    acfHomepageHero: HeroData;
    homepageCeo: CeoData;
    aboutUs: AboutData;
    servicesSectionTitles: ServicesSectionTitles;
    divisionsSectionTitles: DivisionsSectionTitles;
    equipmentSectionTitles: EquipmentSection;
    qualityPolicySection: QualityPolicySection;
    whyUsSection: WhyUsSection;
    portfolioSectionTitle: PortfolioSectionTitle;
    contactInfo: ContactInfoData;
    siteOptionsFields: SiteOptionsFields;
    siteOptions: SiteOptions;

  };
  services: { nodes: Service[] };
  divisions: { nodes: Division[] };
  portfolioItems: { nodes: PortfolioItem[] };
}

// STATIC CONTENT FOR CONTACT FORM
const staticContent = {
  ar: {
    nav: { items: [{ label: "الرئيس التنفيذي", href: "#ceo" }, { label: "من نحن", href: "#about" }, { label: "خدماتنا", href: "#services" }, { label: "أقسامنـا", href: "#divisions" }, { label: "لماذا نحن", href: "#whyus" }, { label: "معداتنا", href: "#equipment" }, { label: "سياسة الجودة", href: "#quality" }, { label: "معرض الأعمال", href: "#portfolio" }, { label: "تواصل معنا", href: "#contact" }] },
    contact: { title: "تواصل معنا", form: { name: "الاسم", email: "البريد الإلكتروني", phone: "رقم الهاتف", message: "الرسالة", submit: "إرسال" }, info: { email: "info@makhariz-deco.com", phone: "00966 500 66 80 89", unified: "920011931-ext:5", branches: "المملكة العربية السعودية — فروعنا: الطائف - الرياض" }, qr: "للإطلاع على المستندات الرسمية والتراخيص الخاصة بنا، يرجى مسح الرمز الإلكتروني الموحد (QR Code)، والذي يتيح الوصول السريع إلى أحدث الملفات المعتمدة." },
  },
  en: {
    nav: { items: [{ label: "CEO", href: "#ceo" }, { label: "About Us", href: "#about" }, { label: "Services", href: "#services" }, { label: "Divisions", href: "#divisions" }, { label: "Why Us", href: "#whyus" }, { label: "Equipment", href: "#equipment" }, { label: "Quality Policy", href: "#quality" }, { label: "Portfolio", href: "#portfolio" }, { label: "Contact Us", href: "#contact" }] },
    contact: { title: "Contact Us", form: { name: "Name", email: "Email", phone: "Phone", message: "Message", submit: "Send" }, info: { email: "info@makhariz-deco.com", phone: "00966 500 66 80 89", unified: "920011931-ext:5", branches: "Kingdom of Saudi Arabia — Our Branches: Riyadh – Taif" }, qr: "Scan the unified QR Code to access the latest approved documents." },
  }
};

export default function Home() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [activeService, setActiveService] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeDivision, setActiveDivision] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  // --- START: NEW CODE FOR SCALABLE NAV ---
  const [navScale, setNavScale] = useState(1);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const idealNavWidth = 1100;
      const currentWidth = container.offsetWidth;
      const newScale = Math.min(1, currentWidth / idealNavWidth);
      setNavScale(newScale);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  // --- END: NEW CODE FOR SCALABLE NAV ---

  const isRTL = language === "ar";
  const t = staticContent[language] || staticContent.ar;

  const handleServiceButtonClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
    }
  };

  const handleSlideChange = (index: number) => {
    setActiveService(index);
  };

  const sanitizeUrl = (url: string | undefined | null): string => {
    if (!url) return "";
    return url.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  };

  useEffect(() => {
    const arabicHomepageId = "87";
    const englishHomepageId = "64";

    async function fetchAllData() {
      setIsLoading(true);
      setError(null);

      const langParam = isRTL ? 'AR' : 'EN';
      const pageId = isRTL ? arabicHomepageId : englishHomepageId;

      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({
            query: `
                        query GetEverything($language: LanguageCodeFilterEnum!, $pageId: ID!) {
                        page(id: $pageId, idType: DATABASE_ID) {
                          acfHomepageHero { headline subtext primaryButtonText secondaryButtonText heroImage { node { sourceUrl altText } } }
                          homepageCeo { ceoSectionTitle ceoName ceoMessage ceoJobTitle ceoImage { node { sourceUrl altText } } }
                          aboutUs { aboutSectionTitle aboutSectionContent visionTitle visionContent missionTitle missionContent valuesTitle valuesContent vision2030Image { node { sourceUrl altText } } vision2030Title vision2030Tagline }
                          servicesSectionTitles { servicesMainTitle servicesSubtitle }
                          divisionsSectionTitles { divisionsMainTitle divisionsSubtitle }
                          equipmentSectionTitles { equipmentMainTitle equipmentSubtitle equipmentGallery }
                          qualityPolicySection { qualityTitle qualityContent qualityCommitments }
                          whyUsSection { whyUsTitle whyUsSubtitle whyUsList }
                          portfolioSectionTitle { portfolioTitle portfolioSubtitle }
                          contactInfo { contactSectionTitle contactSectionSubtitle emailAddress phoneNumber unifiedNumber branchesAddress qrCodeImage { node { sourceUrl altText } } qrCodeText }
                          
                          # This now queries both groups correctly
                          siteOptionsFields { 
                            logo { node { sourceUrl altText } } 
                          }
                          siteOptions {
                            footerTitle
                            footerDescription
                            footerLogo { node { sourceUrl altText } }
                          }
                        }

                        services(first: 10, where: {language: $language}) { nodes { id title(format: RENDERED) serviceDetails { serviceDescription serviceImage { node { sourceUrl altText } } } } }
                        divisions(first: 10, where: {language: $language}) { nodes { id title(format: RENDERED) content(format: RENDERED) divisionDetails { divisionIcon } } }
                        portfolioItems(first: 20, where: {language: $language}) { nodes { id title portfolioItemDetails { commonText binomialText photo { node { sourceUrl altText } } } } }
                      }
            `,
            variables: {
              language: langParam,
              pageId: pageId
            }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API route failed with status ${response.status}: ${errorText}`);
        }

        const json = await response.json();

        if (json.errors) {
          console.error("🔴 GraphQL Errors received in browser:", json.errors);
          throw new Error(`GraphQL query failed: ${JSON.stringify(json.errors)}`);
        }

        if (!json.data.page) {
          throw new Error(`Page with ID "${pageId}" not found. Please check if the ID is correct and that it is a 'Page' post type.`);
        }

        setPageData(json.data);

      } catch (err: any) {
        console.error("🔴 Failed to fetch data via proxy:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllData();
  }, [isRTL]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parseImageUrlsFromHtml = (htmlContent: string): string[] => {
    if (!htmlContent) return [];
    const root = parse(htmlContent);
    const images = root.querySelectorAll('img');
    return images.map(img => img.getAttribute('src') || '').filter(Boolean);
  };

  const removeGalleryFromHtml = (htmlContent: string): string => {
    if (!htmlContent) return '';
    const root = parse(htmlContent);
    const gallery = root.querySelector('.wp-block-gallery');
    if (gallery) {
      gallery.remove();
    }
    return root.toString();
  };

  const getServiceFeatures = (index: number) => {
    const desc = pageData?.services?.nodes[index]?.serviceDetails?.serviceDescription || "";
    return desc.split('\n').slice(1).filter(line => line.trim() !== '');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background text-text-primary flex justify-center items-center"><p>جاري تحميل محتوى الموقع...</p></div>;
  }

  if (error || !pageData) {
    return <div className="min-h-screen bg-background text-text-primary flex justify-center items-center text-center p-4"><div><h2 className="text-red-500 text-2xl mb-4">خطأ في تحميل البيانات</h2><p className="text-left text-sm bg-background-secondary p-4 rounded-md font-mono whitespace-pre-wrap">{error}</p></div></div>;
  }

  const { page, services, divisions, portfolioItems } = pageData;

  const portfolioGalleryItems = portfolioItems.nodes.map((item: PortfolioItem) => ({
    id: item.id,
    common: item.portfolioItemDetails.commonText,
    binomial: item.portfolioItemDetails.binomialText,
    photo: { url: item.portfolioItemDetails.photo.node.sourceUrl, text: item.portfolioItemDetails.photo.node.altText || item.title, pos: "center", by: "Makharez Team" }
  }));

  const equipmentImageUrls = parseImageUrlsFromHtml(page.equipmentSectionTitles.equipmentGallery);
  const whyUsListItems = page.whyUsSection.whyUsList.split('\n').filter(item => item.trim() !== '');
  const qualityCommitmentsList = page.qualityPolicySection.qualityCommitments.split('\n').filter(item => item.trim() !== '');

  return (
    <div className={`min-h-screen bg-background text-text-primary ${isRTL ? "font-almarai-regular" : "font-sans"}`}>

      {/* ==================== START: CORRECTED NAV SECTION ==================== */}
      <nav
        ref={navContainerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
      >
        <div className="container mx-auto max-w-7xl h-16 flex items-center px-4 sm:px-6 lg:px-8">
          {/* This inner div is the scalable unit */}
          <div
            className="flex items-center justify-between w-full"
            style={{
              transform: `scale(${navScale})`,
              transformOrigin: isRTL ? 'right center' : 'left center',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* --- Right Side: Logo (Protected from shrinking) --- */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                {pageData.page.siteOptionsFields?.logo?.node?.sourceUrl && (
                  <img
                    src={pageData.page.siteOptionsFields.logo.node.sourceUrl}
                    alt={pageData.page.siteOptionsFields.logo.node.altText || "Makharez Logo"}
                    className="h-10 w-auto"
                  />
                )}
              </div>
            </motion.div>

            {/* --- Left Side: Desktop Menu Group (Links & Buttons) --- */}
            <div className="hidden lg:flex items-center justify-end flex-grow gap-6">
              {/* Nav Links Section */}
              <div className={`flex items-center space-x-8 whitespace-nowrap ${isRTL ? "space-x-reverse" : ""}`}>
                {t.nav.items.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="text-gray-600 hover:text-accent transition-colors duration-200 text-[clamp(0.8rem,1.2vw,1rem)]"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              {/* Buttons Section (Language & Theme) */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <motion.button
                  onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                  className="flex items-center space-x-2 px-3 py-1 rounded-lg text-accent hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{language === "ar" ? "EN" : "AR"}</span>
                </motion.button>
                <ThemeToggleButton />
              </div>
            </div>

            {/* --- Mobile Elements (Hamburger Menu) --- */}
            <div className="lg:hidden flex items-center gap-4">
              <ThemeToggleButton />
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-accent"
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* --- Mobile Menu Dropdown (Remains the same) --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-white border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-2 space-y-2">
                {t.nav.items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-gray-600 hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setLanguage(language === "ar" ? "en" : "ar");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 py-2 text-gray-600 hover:text-accent transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "ar" ? "English" : "العربية"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* ==================== END: CORRECTED NAV SECTION ==================== */}


      <main key={language}>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {page.acfHomepageHero.heroImage?.node?.sourceUrl && (
            <img
              src={page.acfHomepageHero.heroImage.node.sourceUrl}
              alt={page.acfHomepageHero.heroImage.node.altText || 'Background'}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <div className="relative z-20 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              className="max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h1
                variants={fadeInUp}
                className={`text-4xl md:text-6xl lg:text-5xl font-bold mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"} text-white leading-tight`}
              >
                {page.acfHomepageHero.headline}
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className={`text-xl md:text-2xl mb-8 text-zinc-200 max-w-3xl mx-auto leading-relaxed ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.acfHomepageHero.subtext}
              </motion.p>
              {/* START: COPY FROM HERE */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24"
                variants={fadeInUp}
              >
                <motion.a
                  href="#services"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-text font-semibold px-8 py-3 rounded-xl animate-pulse-glow"
                  >
                    {page.acfHomepageHero.primaryButtonText}
                    <ChevronRight className={`w-5 h-5 ml-2 ${isRTL ? "rotate-180" : ""}`} />
                  </Button>
                </motion.a>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-text px-8 py-3 rounded-xl bg-transparent"
                  >
                    {page.acfHomepageHero.secondaryButtonText}
                  </Button>
                </motion.a>
              </motion.div>
              {/* END: COPY UNTIL HERE */}
            </motion.div>
          </div>
        </section>

        <section id="ceo" className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className={`relative ${isRTL ? "lg:order-2" : "lg:order-1"}`}
                initial={{ opacity: 0, scale: 0.8, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-3xl blur-xl"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-3xl ... border border-border"
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={page.homepageCeo.ceoImage.node.sourceUrl} alt={page.homepageCeo.ceoImage.node.altText} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/60 via-transparent to-transparent" />
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                className={`text-center lg:text-${isRTL ? "right" : "left"} ${isRTL ? "lg:order-1" : "lg:order-2"}`}
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.h2
                  className={`text-3xl md:text-4xl font-bold mb-4 text-accent ${isRTL ? "font-almarai-bold" : "font-bold"}`}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                >
                  {page.homepageCeo.ceoSectionTitle}
                </motion.h2>
                <motion.h3
                  className={`text-2xl md:text-3xl font-semibold mb-8 text-text-primary ${isRTL ? "font-almarai-bold" : "font-semibold"}`}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
                >
                  {page.homepageCeo.ceoName}
                </motion.h3>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} viewport={{ once: true }}
                >
                  <motion.p
                    className={`text-lg md:text-xl leading-relaxed text-text-secondary italic relative z-10 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
                  >
                    {`"${page.homepageCeo.ceoMessage}"`}
                  </motion.p>
                </motion.div>
                <motion.div
                  className="mt-8 pt-6 border-t border-accent/20"
                  initial={{ opacity: 0, width: 0 }} whileInView={{ opacity: 1, width: "100%" }} transition={{ duration: 0.8, delay: 1.4 }} viewport={{ once: true }}
                >
                  <motion.p
                    className={`text-accent font-semibold ${isRTL ? "font-almarai-bold" : "font-semibold"}`}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}
                  >
                    {page.homepageCeo.ceoJobTitle}
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="py-20 bg-background/30">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.aboutUs.aboutSectionTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-almarai-regular" : "font-normal"} whitespace-pre-wrap`}
              >
                {page.aboutUs.aboutSectionContent}
              </p>
            </motion.div>

            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="space-y-6" variants={fadeInUp}>
                <motion.div
                  className="relative bg-background-secondary p-6 rounded-2xl border border-border overflow-hidden group"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px var(--color-accent)" }}
                  transition={{ duration: 0.3 }}
                  variants={fadeInUp}
                >
                  <div className="relative z-10">
                    <motion.div className="flex items-center gap-4 mb-4" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <motion.div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center" whileHover={{ scale: 1.1, backgroundColor: "rgba(253, 154, 1, 0.3)", rotate: 5 }} transition={{ duration: 0.2 }}>
                        <Eye className="w-6 h-6 text-accent" />
                      </motion.div>
                      <motion.h3 className={`text-xl font-semibold text-text-primary ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                        {page.aboutUs.visionTitle}
                      </motion.h3>
                    </motion.div>
                    <motion.p className={`text-text-secondary leading-relaxed ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {page.aboutUs.visionContent}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative bg-background-secondary p-6 rounded-2xl border border-border overflow-hidden group"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px var(--color-accent)" }}
                  transition={{ duration: 0.3 }}
                  variants={fadeInUp}
                >
                  <div className="relative z-10">
                    <motion.div className="flex items-center gap-4 mb-4" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <motion.div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center" whileHover={{ scale: 1.1, backgroundColor: "rgba(253, 154, 1, 0.3)", rotate: 5 }} transition={{ duration: 0.2 }}>
                        <Target className="w-6 h-6 text-accent" />
                      </motion.div>
                      <motion.h3 className={`text-xl font-semibold text-text-primary ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                        {page.aboutUs.missionTitle}
                      </motion.h3>
                    </motion.div>
                    <motion.p className={`text-text-secondary leading-relaxed ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {page.aboutUs.missionContent}
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="relative bg-background-secondary p-6 rounded-2xl border border-border overflow-hidden group"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px var(--color-accent)" }}
                  transition={{ duration: 0.3 }}
                  variants={fadeInUp}
                >
                  <div className="relative z-10">
                    <motion.div className="flex items-center gap-4 mb-4" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <motion.div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center" whileHover={{ scale: 1.1, backgroundColor: "rgba(253, 154, 1, 0.3)", rotate: 5 }} transition={{ duration: 0.2 }}>
                        <Heart className="w-6 h-6 text-accent" />
                      </motion.div>
                      <motion.h3 className={`text-xl font-semibold text-text-primary ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                        {page.aboutUs.valuesTitle}
                      </motion.h3>
                    </motion.div>
                    <motion.p className={`text-text-secondary leading-relaxed ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {page.aboutUs.valuesContent}
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className={`relative ${isRTL ? "lg:order-first" : ""}`}
                variants={fadeInUp}
                initial={{ opacity: 0, scale: 0.8, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <motion.div
                    className="relative aspect-square max-w-lg mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-background-secondary/80 to-background-secondary border-2 border-accent/30"
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={page.aboutUs.vision2030Image.node.sourceUrl} alt={page.aboutUs.vision2030Image.node.altText} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/40 via-transparent to-transparent" />
                    <motion.div
                      className="absolute bottom-6 left-6 right-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <div className="bg-background-secondary/80 backdrop-blur-sm rounded-xl p-4 border border-accent/20">
                        <span className={`text-accent font-bold text-lg mb-1 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                          {page.aboutUs.vision2030Title}
                        </span>
                        <p className={`text-text-secondary text-sm ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                          {page.aboutUs.vision2030Tagline}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="services" className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.servicesSectionTitles.servicesMainTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-12 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.servicesSectionTitles.servicesSubtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="relative w-full max-w-lg mx-auto aspect-[4/3] rounded-3xl bg-background-secondary">
                    {services.nodes.map((service, index) => (
                      <div
                        key={service.id}
                        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                        style={{
                          opacity: activeService === index ? 1 : 0,
                          zIndex: activeService === index ? 10 : 1,
                        }}
                      >
                        <img
                          src={service.serviceDetails.serviceImage.node.sourceUrl}
                          alt={service.serviceDetails.serviceImage.node.altText || service.title}
                          className="w-full h-full object-cover rounded-3xl"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-secondary/60 via-transparent to-transparent rounded-3xl" />
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                          <h3
                            className={`text-xl font-bold text-text-primary mb-2 ${isRTL ? "font-almarai-bold text-right" : "font-bold text-left"}`}
                          >
                            {service.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-wrap gap-3 mb-8">
                    {services.nodes.map((service, index) => (
                      <button
                        key={service.id}
                        onClick={() => setActiveService(index)}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeService === index
                          ? "bg-accent text-accent-text shadow-lg shadow-accent/25"
                          : "bg-background-secondary text-text-secondary hover:bg-background-secondary/80"
                          } ${isRTL ? "font-almarai-regular" : "font-normal"}`}
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeService}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3
                        className={`text-3xl font-bold text-text-primary ${isRTL ? "font-almarai-bold text-right" : "font-bold text-left"}`}
                      >
                        {services.nodes[activeService]?.title}
                      </h3>
                      <p
                        className={`text-lg text-text-secondary leading-relaxed ${isRTL ? "font-almarai-regular text-right" : "font-normal text-left"}`}
                      >
                        {(services.nodes[activeService]?.serviceDetails.serviceDescription || "").split('\n')[0]}
                      </p>
                      <div className="space-y-3">
                        {getServiceFeatures(activeService).map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                            <span
                              className={`text-text-secondary ${isRTL ? "font-almarai-regular text-right" : "font-normal text-left"}`}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ======================= DIVISIONS SECTION START ======================= */}
        <section id="divisions" className="py-20 bg-background-secondary/30">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.divisionsSectionTitles.divisionsMainTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.divisionsSectionTitles.divisionsSubtitle}
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-3 gap-6 mb-16"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {divisions.nodes.map((division, index) => (
                <motion.button
                  key={division.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${activeDivision === index
                    ? "bg-accent/20 border-accent shadow-lg shadow-accent/20"
                    : "bg-background-secondary/50 border-border hover:border-accent/50"
                    }`}
                  variants={fadeInUp}
                  onClick={() => setActiveDivision(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-3xl mb-3">{division.divisionDetails.divisionIcon}</div>
                  <h3 className={`text-xl font-bold text-text-primary ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                    {division.title}
                  </h3>
                  <div
                    className={`w-full h-1 mt-4 rounded-full transition-all duration-300 ${activeDivision === index ? "bg-accent" : "bg-text-secondary/50"
                      }`}
                  />
                </motion.button>
              ))}
            </motion.div>

            {/* This is the main grid for image and content */}
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Column 1: Image Carousel - Pulls images from content */}
              <Suspense fallback={<div className="w-full h-full min-h-[400px] bg-background-secondary rounded-lg animate-pulse"></div>}>
                <div className="relative">
                  <div className="flex justify-center">
                    <ImageSwiper
                      images={parseImageUrlsFromHtml(divisions.nodes[activeDivision]?.content || '').join(",")}
                      cardWidth={320}
                      cardHeight={400}
                      className="drop-shadow-2xl"
                    />
                  </div>
                </div>
              </Suspense>

              {/* Column 2: Dynamic Content - Displays content AFTER removing images */}
              <motion.div
                key={activeDivision}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="prose prose-lg dark:prose-invert max-w-none [&_h4]:text-accent [&_h4]:font-almarai-bold [&_p]:text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: removeGalleryFromHtml(divisions.nodes[activeDivision]?.content || '') }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
        {/* ======================= DIVISIONS SECTION END ======================= */}

        <section id="whyus" className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.whyUsSection.whyUsTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.whyUsSection.whyUsSubtitle}
              </p>
            </motion.div>

            <motion.ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {whyUsListItems.map((item, index) => (
                <motion.li
                  key={index}
                  className="bg-background-secondary p-6 rounded-2xl border border-border flex items-center space-x-4"
                  variants={fadeInUp}
                >
                  <CheckCircle className="w-6 h-6 text-accent" />
                  <span className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section id="equipment" className="py-20 bg-background-secondary/30">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid lg:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative flex justify-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Suspense fallback={<div className="w-[320px] h-[400px] bg-background-secondary rounded-lg animate-pulse"></div>}>
                  <EquipmentImageSwiper
                    images={equipmentImageUrls.join(",")}
                    cardWidth={320}
                    cardHeight={400}
                    autoAdvanceDelay={3000}
                    className="mx-auto"
                  />
                </Suspense>
              </motion.div>

              <motion.div
                className={`${isRTL ? "text-right" : "text-left"}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2
                  className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
                >
                  {page.equipmentSectionTitles.equipmentMainTitle}
                </h2>
                <div
                  className={`prose prose-lg dark:prose-invert max-w-none [&_p]:text-text-secondary ${isRTL ? "[&_p]:font-almarai-regular" : "[&_p]:font-normal"}`}
                  dangerouslySetInnerHTML={{ __html: page.equipmentSectionTitles.equipmentSubtitle || '' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="quality" className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.qualityPolicySection.qualityTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.qualityPolicySection.qualityContent}
              </p>
            </motion.div>

            <motion.ul
              className="grid md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {qualityCommitmentsList.map((commitment, index) => (
                <motion.li
                  key={index}
                  className="bg-background-secondary p-6 rounded-2xl border border-border flex items-center space-x-4"
                  variants={fadeInUp}
                >
                  <CheckCircle className="w-6 h-6 text-accent" />
                  <span className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>{commitment}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section id="portfolio" className="py-20 bg-background-secondary/30">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.portfolioSectionTitle.portfolioTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.portfolioSectionTitle.portfolioSubtitle}
              </p>
            </motion.div>

            <Suspense fallback={<div className="w-full h-[80vh] bg-background-secondary rounded-lg animate-pulse"></div>}>
              <div className="w-full h-[80vh] relative">
                <CircularGallery
                  items={portfolioGalleryItems}
                  radius={400}
                  className="h-full"
                />
              </div>
            </Suspense>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className={`text-sm text-text-secondary/70 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                {isRTL
                  ? "قم بالتمرير لتدوير المعرض واستكشاف أعمالنا"
                  : "Scroll to rotate the gallery and explore our work"}
              </p>
            </motion.div>
          </div>
        </section>

        {/* START: COPY THE FULL SECTION FROM HERE */}
        <section id="contact" className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Title and Subtitle are now DYNAMIC from WordPress */}
              <h2
                className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}
              >
                {page.contactInfo.contactSectionTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-almarai-regular" : "font-normal"}`}
              >
                {page.contactInfo.contactSectionSubtitle}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* The Contact Form (as it was originally) */}
              <motion.div
                className="bg-background-secondary p-8 rounded-2xl border border-border"
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <form className="space-y-6">
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors"
                      placeholder={t.contact.form.name}
                    />
                  </div>
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors"
                      placeholder={t.contact.form.email}
                    />
                  </div>
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {t.contact.form.phone}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors"
                      placeholder={t.contact.form.phone}
                    />
                  </div>
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                      {t.contact.form.message}
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors resize-none"
                      placeholder={t.contact.form.message}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-accent text-accent-text py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors font-semibold"
                  >
                    {t.contact.form.submit}
                  </button>
                </form>
              </motion.div>

              {/* The Info and QR Code side */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Contact info block is now DYNAMIC from WordPress */}
                <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                  <h3 className={`text-2xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                    {isRTL ? "معلومات التواصل" : "Contact Information"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                        {page.contactInfo.emailAddress}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                        {page.contactInfo.phoneNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Building className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                        {page.contactInfo.unifiedNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                        {page.contactInfo.branchesAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code block (as it was originally) */}
                {/* QR Code block is now DYNAMIC from WordPress */}
                <div className="bg-background-secondary p-8 rounded-2xl border border-border text-center">
                  <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                    {isRTL ? "المستندات الرسمية" : "Official Documents"}
                  </h3>
                  <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center p-2">
                    {/* Accessing the image through the correct ".node" path */}
                    {page.contactInfo.qrCodeImage?.node?.sourceUrl && (
                      <img
                        src={page.contactInfo.qrCodeImage.node.sourceUrl}
                        alt={page.contactInfo.qrCodeImage.node.altText || 'Official Documents QR Code'}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <p className={`text-sm text-text-secondary/80 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                    {page.contactInfo.qrCodeText}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        {/* END: COPY UNTIL HERE */}

      </main>

      {/* ==================== START: FOOTER REPLACEMENT ==================== */}
      {/* ==================== FINAL CORRECTED FOOTER ==================== */}
      <footer className="bg-gray-200 dark:bg-zinc-950 border-t border-gray-300 dark:border-zinc-800 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            
            {/* --- Column 1: Reads from the correct "siteOptions" group --- */}
            <div>
              <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                {page.siteOptions.footerTitle}
              </h3>
              <p className={`text-text-secondary/80 mb-4 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                {page.siteOptions.footerDescription}
              </p>
              <div className="flex">
                {page.siteOptions.footerLogo?.node?.sourceUrl && (
                  <img 
                    src={page.siteOptions.footerLogo.node.sourceUrl} 
                    alt={page.siteOptions.footerLogo.node.altText || 'Footer Logo'}
                    className="h-12 w-auto"
                  />
                )}
              </div>
            </div>

            {/* --- Column 2: Quick Links (No change) --- */}
            <div>
              <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                {isRTL ? "روابط سريعة" : "Quick Links"}
              </h3>
              <ul className="space-y-2">
                {t.nav.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`text-text-secondary hover:text-accent transition-colors ${isRTL ? "font-almarai-regular" : "font-normal"}`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- Column 3: Contact Info (No change) --- */}
            <div>
              <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </h3>
              {page.contactInfo && (
                <div className="space-y-2">
                  <p className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                    {page.contactInfo.emailAddress}
                  </p>
                  <p className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                    {page.contactInfo.phoneNumber}
                  </p>
                  <p className={`text-text-secondary ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
                    {page.contactInfo.unifiedNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-zinc-700 pt-8 text-center">
            <p className={`text-text-secondary/70 ${isRTL ? "font-almarai-regular" : "font-normal"}`}>
              {isRTL ? "© 2024 مخارز للديكور. جميع الحقوق محفوظة." : "© 2024 Makharez Decoration. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
      {/* ====================================================================== */}
      {/* ==================== END: FOOTER REPLACEMENT ==================== */}

      <motion.button
        className="fixed bottom-8 right-8 bg-accent text-accent-text p-3 rounded-full shadow-lg hover:bg-accent/90 transition-colors z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </div>
  )
}