// app/[lang]/services/core/page.tsx

import { InteractiveServiceViewer } from "@/components/sections/InteractiveServiceViewer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// --- واجهات البيانات ---
interface ImageNode { sourceUrl: string; altText: string; }
interface SiteOptions { footerTitle: string; footerDescription: string; footerLogo: { node: ImageNode }; }
interface SiteOptionsFields { logo: { node: ImageNode }; }
interface SubService { subServiceTitle: string; subServiceDescription: string; subServiceImages: string; }
interface ContactInfo { emailAddress: string; phoneNumber: string; unifiedNumber: string; }
interface CoreServicesData { nodes: { title: string; coreServiceDetails: Omit<SubService, 'subServiceTitle'> & { subServiceTitle?: string }; }[]; }
interface PageNodeForOptions { siteOptions: SiteOptions; siteOptionsFields: SiteOptionsFields; contactInfo: ContactInfo; }
interface MainServiceData {
    title: string;
    serviceDetails: {
        serviceDescription: string;
    };
}
interface PageData { 
    coreServices: CoreServicesData; 
    service: MainServiceData;
    page: PageNodeForOptions;
}

// بيانات القوائم الثابتة
const staticNavItems = {
  ar: [{ label: "الرئيس التنفيذي", href: "/#ceo" }, { label: "من نحن", href: "/#about" }, { label: "خدماتنا", href: "/#services" }, { label: "أقسامنـا", href: "/#divisions" }, { label: "لماذا نحن", href: "/#whyus" }, { label: "معداتنا", href: "/#equipment" }, { label: "سياسة الجودة", href: "/#quality" }, { label: "معرض الأعمال", href: "/#portfolio" }, { label: "تواصل معنا", href: "/#contact" }],
  en: [{ label: "CEO", href: "/#ceo" }, { label: "About Us", href: "/#about" }, { label: "Services", href: "/#services" }, { label: "Divisions", href: "/#divisions" }, { label: "Why Us", href: "/#whyus" }, { label: "Equipment", href: "/#equipment" }, { label: "Quality Policy", href: "/#quality" }, { label: "Portfolio", href: "/#portfolio" }, { label: "Contact Us", href: "/#contact" }]
};

// دالة جلب البيانات
async function getCoreServicesPageData(language: 'AR' | 'EN', homepageId: string, serviceUri: string): Promise<PageData> {
    const response = await fetch(process.env.WORDPRESS_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
            query: `
                query GetCoreServicesPageData($language: LanguageCodeFilterEnum!, $homepageId: ID!, $serviceUri: ID!) {
                    service(id: $serviceUri, idType: URI) {
                        title(format: RENDERED)
                        serviceDetails {
                            serviceDescription
                        }
                    }
                    coreServices(where: { language: $language }) {
                        nodes {
                            title(format: RENDERED)
                            coreServiceDetails { 
                                subServiceTitle 
                                subServiceDescription 
                                subServiceImages 
                            }
                        }
                    }
                    page(id: $homepageId, idType: DATABASE_ID) {
                        siteOptions { footerTitle footerDescription footerLogo { node { sourceUrl altText } } }
                        siteOptionsFields { logo { node { sourceUrl altText } } }
                        contactInfo { emailAddress phoneNumber unifiedNumber }
                    }
                }
            `,
            variables: { language, homepageId, serviceUri }
        })
    });
    const json = await response.json();
    if (json.errors) { throw new Error("Failed to fetch data from WordPress."); }
    return json.data;
}

// المكون الرئيسي للصفحة
export default async function CoreServicesPage({ params }: { params: { lang: 'ar' | 'en' } }) {
    const { lang } = params;
    const isRTL = lang === 'ar';
    const langCode = isRTL ? 'AR' : 'EN';
    const homepageId = isRTL ? "87" : "64";
    // <<< تم وضع الـ slugs الصحيحة هنا >>>
    const serviceUri = isRTL ? "الخدمات-الأساسية" : "core-services"; 
    
    const data = await getCoreServicesPageData(langCode, homepageId, serviceUri);

    if (!data || !data.coreServices || !data.service || !data.page) {
        return <div className="min-h-screen flex items-center justify-center">Failed to load services data for language: {lang}. Check if slugs are correct.</div>;
    }
    
    const pageInfo = data.service;
    const subServices = data.coreServices.nodes.map(node => ({
        title: node.coreServiceDetails.subServiceTitle || node.title,
        subServiceDescription: node.coreServiceDetails.subServiceDescription,
        subServiceGallery: node.coreServiceDetails.subServiceImages, 
    }));
    
    const { siteOptions, siteOptionsFields, contactInfo } = data.page;
    const navItems = isRTL ? staticNavItems.ar : staticNavItems.en;

    return (
        <div className={`min-h-screen bg-background text-text-primary ${isRTL ? "font-almarai-regular" : "font-sans"}`}>
            <Header 
                logoUrl={siteOptionsFields.logo.node.sourceUrl}
                logoAlt={siteOptionsFields.logo.node.altText || "Jassas Logo"}
                navItems={navItems}
                lang={lang}
            />
            <main className="pt-24 pb-16">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-almarai-bold" : "font-bold"}`}>
                            {pageInfo.title}
                        </h1>
                        {pageInfo.serviceDetails?.serviceDescription && (
                            <div
                                className={`max-w-3xl mx-auto text-lg leading-relaxed text-text-secondary prose dark:prose-invert ${isRTL ? "font-almarai-regular" : "font-normal"}`}
                                dangerouslySetInnerHTML={{ __html: pageInfo.serviceDetails.serviceDescription }}
                            />
                        )}
                    </div>
                    <InteractiveServiceViewer subServices={subServices} isRTL={isRTL} />
                </div>
            </main>
            <Footer
              footerTitle={siteOptions.footerTitle}
              footerDescription={siteOptions.footerDescription}
              footerLogoUrl={siteOptions.footerLogo.node.sourceUrl}
              footerLogoAlt={siteOptions.footerLogo.node.altText || "Footer Logo"}
              quickLinks={navItems}
              contactInfo={{
                email: contactInfo.emailAddress,
                phone: contactInfo.phoneNumber,
                unified: contactInfo.unifiedNumber
              }}
              isRTL={isRTL}
            />
        </div>
    );
}