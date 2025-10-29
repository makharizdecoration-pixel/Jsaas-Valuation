// app/[lang]/page.tsx
"use client";

import { useState, useEffect, Suspense, FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Eye, Target, Heart, CheckCircle, Mail, Phone, Building, MapPin, QrCode, ArrowUp, Loader2 } from "lucide-react";
import { parse } from 'node-html-parser';
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { HeroSlider, type Slide } from "@/components/ui/HeroSlider";
import { AccreditationsSection } from "@/components/sections/AccreditationsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DivisionsSection } from "@/components/sections/DivisionsSection";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandStatementSection } from "@/components/sections/BrandStatementSection";
import { TeamSliderSection } from "@/components/sections/TeamSliderSection";
import { ValuationPurposesSection } from "@/components/sections/ValuationPurposesSection";
// --- 🎨 تمت الإضافة هنا ---
import { ValuationStepsSection } from "@/components/sections/ValuationStepsSection";

// DYNAMIC IMPORTS
const ImageSwiper = dynamic(() => import("@/components/ui/image-swiper").then(mod => mod.ImageSwiper), { ssr: false, loading: () => <div className="w-full h-full min-h-[400px] bg-background-secondary rounded-lg animate-pulse" /> });
const CircularGallery = dynamic(() => import("@/components/ui/circular-gallery").then(mod => mod.CircularGallery), { ssr: false, loading: () => <div className="w-full h-[80vh] bg-background-secondary rounded-lg animate-pulse" /> });
const EquipmentImageSwiper = dynamic(() => import("@/components/ui/equipment-image-swiper").then(mod => mod.EquipmentImageSwiper), { ssr: false, loading: () => <div className="w-[320px] h-[400px] bg-background-secondary rounded-lg animate-pulse" /> });

interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
}

interface Menu {
  menuItems: {
    nodes: MenuItem[];
  };
}

// TYPESCRIPT INTERFACES
interface ImageNode { sourceUrl: string; altText: string; }
interface SiteOptionsFields { logo: { node: ImageNode }; }

interface SiteOptions {
  footerTitle: string;
  footerDescription: string;
  footerLogo: { node: ImageNode };
  profilePdf?: {
    node: {
      mediaItemUrl: string;
    }
  }
}

interface CeoData { ceoSectionTitle: string; ceoName: string; ceoMessage: string; ceoJobTitle: string; ceoImage: { node: ImageNode }; }
interface AboutData { aboutSectionTitle: string; aboutSectionContent: string; visionTitle: string; visionContent: string; missionTitle: string; missionContent: string; valuesTitle: string; valuesContent: string; vision2030Image: { node: ImageNode }; vision2030Title: string; vision2030Tagline: string; }
interface ServicesSectionTitles { servicesMainTitle: string; servicesSubtitle: string; }
interface DivisionsSectionTitles { divisionsMainTitle: string; divisionsSubtitle: string; }
interface TeamSectionTitles { teamSectionTitle: string; teamSectionSubtitle: string; }
interface PurposesSectionTitles { valuationPurposesTitle: string; }
// --- 🎨 تمت الإضافة هنا ---
interface ValuationStepsSectionTitles {
  stepsSectionTitle: string;
}
interface EquipmentSection { equipmentMainTitle: string; equipmentSubtitle: string; equipmentGallery: string; }
interface QualityPolicySection { qualityTitle: string; qualityContent: string; qualityCommitments: string; }
interface WhyUsSection { whyUsTitle: string; whyUsSubtitle: string; whyUsList: string; }
interface PortfolioSectionTitle { portfolioTitle: string; portfolioSubtitle: string; }
interface Service { id: string; title: string; slug: string; serviceDetails: { serviceDescription: string; serviceImage: { node: ImageNode }; }; }
interface Division { id: string; title: string; content: string; divisionDetails: { divisionIcon: string; }; }
interface PortfolioItem { id: string; title: string; portfolioItemDetails: { commonText: string; binomialText: string; photo: { node: ImageNode; }; }; }
interface TeamMember {
  id: string;
  title: string;
  teamMemberDetails: {
    designation: string;
    description: string;
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
}
interface Purpose {
  id: string;
  title: string;
  content: string; 
  purposeDetails: {
    iconPathSvgD: string;
  };
}
// --- 🎨 تمت الإضافة هنا ---
interface ValuationStep {
  id: string;
  title: string;
  stepDetails: {
    iconPathSvgD: string;
  };
}
interface ContactInfoData { contactSectionTitle: string; contactSectionSubtitle: string; emailAddress: string; phoneNumber: string; unifiedNumber: string; branchesAddress: string; qrCodeImage: { node: { sourceUrl: string; altText: string; } }; qrCodeText: string; }
interface BrandStatementData { sideTitle: string; paragraphs: string; quote: string; }

interface HeroSlideNode {
  title: string;
  heroSlideacf: {
    subtitle: string;
    image: {
      node: {
        sourceUrl: string;
        altText: string;
      }
    }
  }
}
interface AccreditationsSectionData {
  accreditationsTitle: string;
  accreditationsSubtitle: string;
  accreditationsGallery: string;
}

// --- 🎨 تم التعديل هنا ---
interface PageData {
  page: {
    homepageCeo: CeoData;
    aboutUs: AboutData;
    accreditationsSection: AccreditationsSectionData;
    servicesSectionTitles: ServicesSectionTitles;
    divisionsSectionTitles: DivisionsSectionTitles;
    homepageTeamSection?: TeamSectionTitles;
    purposesSection?: PurposesSectionTitles;
    stepsSection?: ValuationStepsSectionTitles; // <-- تمت الإضافة
    equipmentSectionTitles: EquipmentSection;
    qualityPolicySection: QualityPolicySection;
    whyUsSection: WhyUsSection;
    portfolioSectionTitle: PortfolioSectionTitle;
    contactInfo: ContactInfoData;
    siteOptionsFields: SiteOptionsFields;
    siteOptions: SiteOptions;
    brandStatementSection?: BrandStatementData;
  };
  heroSlides: {
    nodes: HeroSlideNode[]
  };
  services: { nodes: Service[] };
  divisions: { nodes: Division[] };
  teamMembers: { nodes: TeamMember[] };
  purposes: { nodes: Purpose[] };
  valuationSteps: { nodes: ValuationStep[] }; // <-- تمت الإضافة
  portfolioItems: { nodes: PortfolioItem[] };
  headerMenu: Menu;
  footerMenu: Menu;
}

export default function Home({ params }: { params: { lang: 'ar' | 'en' } }) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { lang } = params;
  const isRTL = lang === 'ar';

  const t = {
    ar: { contact: { form: { name: "الاسم", email: "البريد الإلكتروني", phone: "رقم الهاتف", message: "الرسالة", submit: "إرسال", submitting: "جاري الإرسال...", success: "شكرًا لك! تم استلام رسالتك بنجاح.", error: "حدث خطأ. الرجاء المحاولة مرة أخرى." } } },
    en: { contact: { form: { name: "Name", email: "Email", phone: "Phone", message: "Message", submit: "Send", submitting: "Sending...", success: "Thank you! Your message has been received.", error: "An error occurred. Please try again." } } }
  }[lang];


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionStatus('submitting');
    const formData = new FormData();
    formData.append('your-name', formState.name);
    formData.append('your-email', formState.email);
    formData.append('your-phone', formState.phone);
    formData.append('your-message', formState.message);
    try {
      const response = await fetch('/api/contact',
        { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        setSubmissionStatus('success')
        setFormState({ name: '', email: '', phone: '', message: '' })
      } else {
        console.error('API Submission Error:', result.error)
        setSubmissionStatus('error')
      }

    } catch (error) {
      console.error('Fetch Error:', error);
      setSubmissionStatus('error');
    }
  };

  useEffect(() => {
    async function fetchAllData() {
      setIsLoading(true);
      setError(null);
      const langCode = isRTL ? 'AR' : 'EN';
      const pageId = isRTL ? "87" : "64";

      const headerMenuName = isRTL ? 'Header Menu AR' : 'Header Menu EN';
      const footerMenuName = isRTL ? 'Footer Menu AR' : 'Footer Menu EN';

      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({
            // --- 🎨 تم التعديل هنا ---
            query: `
                  query GetEverything(
                    $language: LanguageCodeFilterEnum!, 
                    $pageId: ID!, 
                    $headerMenuName: ID!, 
                    $footerMenuName: ID!
                  ) {
                    heroSlides(first: 5, where: {language: $language}) { nodes { title heroSlideacf { subtitle image { node { sourceUrl altText } } } } }
                    page(id: $pageId, idType: DATABASE_ID) {
                      homepageCeo { ceoSectionTitle ceoName ceoMessage ceoJobTitle ceoImage { node { sourceUrl altText } } }
                      aboutUs { aboutSectionTitle aboutSectionContent visionTitle visionContent missionTitle missionContent valuesTitle valuesContent vision2030Image { node { sourceUrl altText } } vision2030Title vision2030Tagline }
                      accreditationsSection { accreditationsTitle accreditationsSubtitle accreditationsGallery }
                      servicesSectionTitles { servicesMainTitle servicesSubtitle }
                      divisionsSectionTitles { divisionsMainTitle divisionsSubtitle }
                      homepageTeamSection { teamSectionTitle teamSectionSubtitle }
                      purposesSection { valuationPurposesTitle } 
                      stepsSection { stepsSectionTitle } # <-- تمت الإضافة
                      equipmentSectionTitles { equipmentMainTitle equipmentSubtitle equipmentGallery }
                      qualityPolicySection { qualityTitle qualityContent qualityCommitments }
                      whyUsSection { whyUsTitle whyUsSubtitle whyUsList }
                      portfolioSectionTitle { portfolioTitle portfolioSubtitle }
                      contactInfo { contactSectionTitle contactSectionSubtitle emailAddress phoneNumber unifiedNumber branchesAddress qrCodeImage { node { sourceUrl altText } } qrCodeText }
                      siteOptionsFields { logo { node { sourceUrl altText } } }
                      siteOptions { 
                        footerTitle 
                        footerDescription 
                        footerLogo { node { sourceUrl altText } }
                        profilePdf {
                          node {
                            mediaItemUrl
                          }
                        }
                      }
                      brandStatementSection { sideTitle paragraphs quote }
                    }
                    services(first: 10, where: {language: $language}) { nodes { id title(format: RENDERED) slug serviceDetails { serviceDescription serviceImage { node { sourceUrl altText } } } } }
                    divisions(first: 10, where: {language: $language}) { nodes { id title(format: RENDERED) content(format: RENDERED) divisionDetails { divisionIcon } } }
                    teamMembers(first: 10, where: {language: $language, orderby: {field: MENU_ORDER, order: ASC}}) {
                      nodes {
                        id
                        title(format: RENDERED)
                        featuredImage { node { sourceUrl altText } }
                        teamMemberDetails { designation description }
                      }
                    }
                    purposes(first: 20, where: {language: $language, orderby: {field: MENU_ORDER, order: ASC}}) {
                      nodes {
                        id
                        title(format: RENDERED)
                        content(format: RENDERED)
                        purposeDetails {
                          iconPathSvgD
                        }
                      }
                    }
                    # --- 🎨 تمت الإضافة هنا ---
                    valuationSteps(first: 3, where: {language: $language, orderby: {field: MENU_ORDER, order: ASC}}) {
                      nodes {
                        id
                        title(format: RENDERED)
                        stepDetails {
                          iconPathSvgD
                        }
                      }
                    }
                    # -------------------------------
                    portfolioItems(first: 20, where: {language: $language}) { nodes { id title portfolioItemDetails { commonText binomialText photo { node { sourceUrl altText } } } } }
                    headerMenu: menu(id: $headerMenuName, idType: NAME) {
                      menuItems { nodes { id label url path } }
                    }
                    footerMenu: menu(id: $footerMenuName, idType: NAME) {
                      menuItems { nodes { id label url path } }
                    }
                  }
              `,
            variables: {
              language: langCode,
              pageId: pageId,
              headerMenuName: headerMenuName,
              footerMenuName: footerMenuName
            }
          }),
        });
        if (!response.ok) { const errorText = await response.text(); throw new Error(`API route failed: ${errorText}`); }
        const json = await response.json();
        if (json.errors) { console.error("GraphQL Errors from WordPress:", json.errors); throw new Error(`GraphQL query failed: ${JSON.stringify(json.errors)}`); }
        if (!json.data.page) { throw new Error(`Page with ID "${pageId}" not found.`); }
        setPageData(json.data);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllData();
  }, [lang, isRTL]);

  useEffect(() => {
    const handleScroll = () => { setShowScrollTop(window.scrollY > 500); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parseImageUrlsFromHtml = (htmlContent: string): string[] => {
    if (!htmlContent) return [];
    const root = parse(htmlContent);
    const images = root.querySelectorAll('img');
    return images.map(img => img.getAttribute('src') || '').filter(Boolean);
  };

  const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: "easeOut" }, };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1, }, }, };

  if (isLoading) {
    return <div className="min-h-screen bg-background text-text-primary flex justify-center items-center"><p>جاري تحميل محتوى الموقع...</p></div>;
  }

  if (error || !pageData || !pageData.heroSlides || !pageData.headerMenu || !pageData.footerMenu) {
    return <div className="min-h-screen bg-background text-text-primary flex justify-center items-center text-center p-4"><div><h2 className="text-red-500 text-2xl mb-4">خطأ في تحميل البيانات</h2><p>لم يتم العثور على القوائم. تأكد من تعيين القوائم لمواقعها الصحيحة في ووردبريس (Header Menu AR/EN و Footer Menu AR/EN).</p><p className="text-left text-sm bg-background-secondary p-4 rounded-md font-mono whitespace-pre-wrap">{error}</p></div></div>;
  }

  // --- 🎨 تم التعديل هنا ---
  const { page, services, divisions, teamMembers, purposes, valuationSteps, portfolioItems, heroSlides, headerMenu, footerMenu } = pageData;
  const portfolioGalleryItems = portfolioItems.nodes.map((item: PortfolioItem) => ({ id: item.id, common: item.portfolioItemDetails.commonText, binomial: item.portfolioItemDetails.binomialText, photo: { url: item.portfolioItemDetails.photo.node.sourceUrl, text: item.portfolioItemDetails.photo.node.altText || item.title, pos: "center", by: "Makharez Team" } }));
  const equipmentImageUrls = parseImageUrlsFromHtml(page.equipmentSectionTitles.equipmentGallery);
  const whyUsListItems = page.whyUsSection.whyUsList.split('\n').filter(item => item.trim() !== '');
  const qualityCommitmentsList = page.qualityPolicySection.qualityCommitments.split('\n').filter(item => item.trim() !== '');

  const brandStatementData = page.brandStatementSection;
  const paragraphsArray = brandStatementData && brandStatementData.paragraphs
    ? brandStatementData.paragraphs.split('\n').filter(p => p.trim() !== '')
    : [];

  const slides: Slide[] = heroSlides.nodes
    .filter(node => node?.heroSlideacf?.image?.node?.sourceUrl)
    .map(node => ({
      image: node.heroSlideacf.image.node.sourceUrl,
      title: node.title,
      subtitle: node.heroSlideacf.subtitle
    }));

  const headerNavItems = headerMenu.menuItems.nodes.map(item => ({ label: item.label, href: item.path }));
  const footerNavItems = footerMenu.menuItems.nodes.map(item => ({ label: item.label, href: item.path }));

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Header
        logoUrl={page.siteOptionsFields.logo.node.sourceUrl}
        logoAlt={page.siteOptionsFields.logo.node.altText || "Jassas Logo"}
        navItems={headerNavItems}
        lang={lang}
        profilePdfUrl={page.siteOptions?.profilePdf?.node?.mediaItemUrl}
      />

      <main key={lang}>
        <HeroSlider className="h-screen" slides={slides} />

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
                  className={`text-2xl md:text-3xl font-bold mb-4 text-accent ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
                >
                  {page.homepageCeo.ceoSectionTitle}
                </motion.h2>
                <motion.h3
                  className={`text-2xl md:text-3xl font-semibold mb-8 text-text-primary ${isRTL ? "font-arabic font-bold" : "font-semibold"}`}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
                >
                  {page.homepageCeo.ceoName}
                </motion.h3>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }} viewport={{ once: true }}
                >
                  <motion.p
                    className={`text-lg md:text-xl leading-relaxed text-text-secondary italic relative z-10 ${isRTL ? "font-arabic" : "font-normal"}`}
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
                    className={`text-accent font-semibold ${isRTL ? "font-arabic font-bold" : "font-semibold"}`}
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
                className={`text-2xl md:text-3xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
              >
                {page.aboutUs.aboutSectionTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-arabic" : "font-normal"} whitespace-pre-wrap`}
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
                      <motion.h3 className={`text-xl font-semibold text-text-primary ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                        {page.aboutUs.visionTitle}
                      </motion.h3>
                    </motion.div>
                    <motion.p className={`text-text-secondary leading-relaxed ${isRTL ? "font-arabic" : "font-normal"}`}>
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
                      <motion.h3 className={`text-xl font-semibold text-text-primary ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                        {page.aboutUs.missionTitle}
                      </motion.h3>
                    </motion.div>
                    <motion.p className={`text-text-secondary leading-relaxed ${isRTL ? "font-arabic" : "font-normal"}`}>
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
                      <motion.h3 className={`text-xl font-semibold text-text-primary ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                        {page.aboutUs.valuesTitle}
                      </motion.h3>
                    </motion.div>
                    <motion.p className={`text-text-secondary leading-relaxed ${isRTL ? "font-arabic" : "font-normal"}`}>
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
                        <span className={`text-accent font-bold text-lg mb-1 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                          {page.aboutUs.vision2030Title}
                        </span>
                        <p className={`text-text-secondary text-sm ${isRTL ? "font-arabic" : "font-normal"}`}>
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
                className={`text-2xl md:text-3xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
              >
                {page.servicesSectionTitles.servicesMainTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-12 ${isRTL ? "font-arabic" : "font-normal"}`}
              >
                {page.servicesSectionTitles.servicesSubtitle}
              </p>
            </motion.div>

            <ServicesSection services={services.nodes} lang={lang} />

          </div>
        </section>

        <DivisionsSection
          divisions={divisions.nodes}
          mainTitle={page.divisionsSectionTitles.divisionsMainTitle}
          subtitle={page.divisionsSectionTitles.divisionsSubtitle}
        />

        <TeamSliderSection
          mainTitle={page.homepageTeamSection?.teamSectionTitle}
          subtitle={page.homepageTeamSection?.teamSectionSubtitle}
          members={teamMembers.nodes}
          isRTL={isRTL}
        />

        <section id="whyus" className="py-20 bg-background hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
              >
                {page.whyUsSection.whyUsTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-arabic" : "font-normal"}`}
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
                  <span className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section id="quality" className="py-20 bg-background hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-xl md:text-2xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
              >
                {page.qualityPolicySection.qualityTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-arabic" : "font-normal"}`}
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
                  <span className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>{commitment}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section id="portfolio" className="py-20 bg-background-secondary/30 hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
              >
                {page.portfolioSectionTitle.portfolioTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-arabic" : "font-normal"}`}
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
              <p className={`text-sm text-text-secondary/70 ${isRTL ? "font-arabic" : "font-normal"}`}>
                {isRTL
                  ? "قم بالتمرير لتدوير المعرض واستكشاف أعمالنا"
                  : "Scroll to rotate the gallery and explore our work"}
              </p>
            </motion.div>
          </div>
        </section>

        {brandStatementData && (
          <div className="hidden">
            <BrandStatementSection
              sideTitle={brandStatementData.sideTitle}
              paragraphs={paragraphsArray}
              quote={brandStatementData.quote}
              isRTL={isRTL}
            />
          </div>
        )}

        <section id="equipment" className="py-20 bg-background-secondary/30 hidden">
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
                  className={`text-xl md:text-2xl leading-relaxed font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
                >
                  {page.equipmentSectionTitles.equipmentMainTitle}
                </h2>
                <div
                  className={`prose prose-lg dark:prose-invert max-w-none [&_p]:text-text-secondary ${isRTL ? "[&_p]:font-arabic" : "[&_p]:font-normal"}`}
                  dangerouslySetInnerHTML={{ __html: page.equipmentSectionTitles.equipmentSubtitle || '' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <ValuationPurposesSection
          mainTitle={page.purposesSection?.valuationPurposesTitle}
          purposes={purposes.nodes}
          centerLogoUrl={page.siteOptions.footerLogo.node.sourceUrl}
          isRTL={isRTL}
        />

        {/* --- 🎨 تمت الإضافة هنا --- */}
        <ValuationStepsSection
          mainTitle={page.stepsSection?.stepsSectionTitle}
          steps={valuationSteps.nodes}
          isRTL={isRTL}
        />
        {/* ------------------------ */}

        <AccreditationsSection
          title={page.accreditationsSection.accreditationsTitle}
          subtitle={page.accreditationsSection.accreditationsSubtitle}
          galleryHtml={page.accreditationsSection.accreditationsGallery}
        />

        <section id="contact" className="py-20 bg-background">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}
              >
                {page.contactInfo.contactSectionTitle}
              </h2>
              <p
                className={`text-lg leading-relaxed text-text-secondary mb-8 ${isRTL ? "font-arabic" : "font-normal"}`}
              >
                {page.contactInfo.contactSectionSubtitle}
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                className="bg-background-secondary p-8 rounded-2xl border border-border"
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-arabic" : "font-normal"}`}>
                      {t.contact.form.name}
                    </label>
                    <input
                      type="text"
                      name="your-name"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors"
                      placeholder={t.contact.form.name}
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-arabic" : "font-normal"}`}>
                      {t.contact.form.email}
                    </label>
                    <input
                      type="email"
                      name="your-email"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors"
                      placeholder={t.contact.form.email}
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-arabic" : "font-normal"}`}>
                      {t.contact.form.phone}
                    </label>
                    <input
                      type="tel"
                      name="your-phone"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors"
                      placeholder={t.contact.form.phone}
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-text-secondary mb-2 ${isRTL ? "font-arabic" : "font-normal"}`}>
                      {t.contact.form.message}
                    </label>
                    <textarea
                      name="your-message"
                      rows={5}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary focus:border-accent focus:outline-none transition-colors resize-none"
                      placeholder={t.contact.form.message}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  {(submissionStatus === 'idle' || submissionStatus === 'submitting') && (
                    <button
                      type="submit"
                      disabled={submissionStatus === 'submitting'}
                      className="w-full bg-accent text-accent-text py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors font-semibold flex items-center justify-center disabled:opacity-50"
                    >
                      {submissionStatus === 'submitting' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.contact.form.submitting}
                        </>
                      ) : (
                        t.contact.form.submit
                      )}
                    </button>
                  )}

                  {submissionStatus === 'success' && (
                    <div className="text-green-700 bg-green-100 p-4 rounded-lg text-center font-semibold">
                      {t.contact.form.success}
                    </div>
                  )}
                  {submissionStatus === 'error' && (
                    <div className="text-red-700 bg-red-100 p-4 rounded-lg text-center font-semibold">
                      {t.contact.form.error}
                    </div>
                  )}
                </form>
              </motion.div>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-background-secondary p-8 rounded-2xl border border-border">
                  <h3 className={`text-2xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                    {isRTL ? "معلومات التواصل" : "Contact Information"}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                        {page.contactInfo.emailAddress}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Phone className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                        {page.contactInfo.phoneNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Building className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                        {page.contactInfo.unifiedNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-accent" />
                      <span className={`text-text-secondary ${isRTL ? "font-arabic" : "font-normal"}`}>
                        {page.contactInfo.branchesAddress}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-background-secondary p-8 rounded-2xl border border-border text-center">
                  <h3 className={`text-xl font-bold text-text-primary mb-4 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                    {isRTL ? "المستندات الرسمية" : "Official Documents"}
                  </h3>
                  <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center p-2">
                    {page.contactInfo.qrCodeImage?.node?.sourceUrl && (
                      <img
                        src={page.contactInfo.qrCodeImage.node.sourceUrl}
                        alt={page.contactInfo.qrCodeImage.node.altText || 'Official Documents QR Code'}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <p className={`text-sm text-text-secondary/80 ${isRTL ? "font-arabic" : "font-normal"}`}>
                    {page.contactInfo.qrCodeText}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      <Footer
        footerTitle={page.siteOptions.footerTitle}
        footerDescription={page.siteOptions.footerDescription}
        footerLogoUrl={page.siteOptions.footerLogo.node.sourceUrl}
        footerLogoAlt={page.siteOptions.footerLogo.node.altText}
        quickLinks={footerNavItems}
        contactInfo={{
          email: page.contactInfo.emailAddress,
          phone: page.contactInfo.phoneNumber,
          unified: page.contactInfo.unifiedNumber
        }}
        isRTL={isRTL}
        profilePdfUrl={page.siteOptions?.profilePdf?.node?.mediaItemUrl}
      />

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