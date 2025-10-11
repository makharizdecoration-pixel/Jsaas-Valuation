// app/[lang]/[slug]/page.tsx

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InteractiveServiceViewer } from "@/components/sections/InteractiveServiceViewer";
import { notFound } from 'next/navigation';

// --- واجهات البيانات (Interfaces) ---
interface ImageNode { sourceUrl: string; altText: string; }

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
interface SiteOptionsFields { logo: { node: ImageNode }; }
interface ContactInfo { emailAddress: string; phoneNumber: string; unifiedNumber: string; }

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

interface GenericSubService {
    title: string;
    coreServiceDetails?: {
        subServiceTitle?: string;
        subServiceDescription: string;
        subServiceImages: string;
    };
}
interface MainCategoryData {
    name: string;
    translations?: {
        slug: string;
        language: {
            code: string;
        };
    }[];
    serviceGroupFields: {
        categoryDescription: string;
    };
    contentNodes: {
        nodes: GenericSubService[];
    };
}

interface PageData {
    serviceGroups: { nodes: MainCategoryData[] };
    page: {
        siteOptions: SiteOptions;
        siteOptionsFields: SiteOptionsFields;
        contactInfo: ContactInfo;
    };
    headerMenu: Menu;
    footerMenu: Menu;
}


async function getServicePageData(homepageId: string, categorySlug: string, headerMenuName: string, footerMenuName: string): Promise<PageData> {
    const response = await fetch(process.env.WORDPRESS_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
            query: `
                query GetServicePageData(
                    $homepageId: ID!, 
                    $categorySlug: [String],
                    $headerMenuName: ID!,
                    $footerMenuName: ID!
                ) {
                    serviceGroups(where: { slug: $categorySlug }) {
                        nodes {
                            name
                            translations {
                                slug
                                language { code }
                            }
                            serviceGroupFields {
                                categoryDescription
                            }
                            contentNodes {
                                nodes {
                                    ... on NodeWithTitle { title }
                                    ... on WithAcfCoreServiceDetails {
                                        coreServiceDetails { subServiceTitle subServiceDescription subServiceImages }
                                    }
                                }
                            }
                        }
                    }
                    page(id: $homepageId, idType: DATABASE_ID) {
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
                        siteOptionsFields { logo { node { sourceUrl altText } } }
                        contactInfo { emailAddress phoneNumber unifiedNumber }
                    }
                    headerMenu: menu(id: $headerMenuName, idType: NAME) {
                        menuItems { nodes { id label url path } }
                    }
                    footerMenu: menu(id: $footerMenuName, idType: NAME) {
                        menuItems { nodes { id label url path } }
                    }
                }
            `,
            variables: { homepageId, categorySlug, headerMenuName, footerMenuName }
        })
    });
    const json = await response.json();
    if (json.errors) {
        console.error("GraphQL Errors:", json.errors);
        throw new Error("Failed to fetch data from WordPress.");
    }
    return json.data;
}

export default async function ServicePage({ params }: { params: { lang: 'ar' | 'en', slug: string } }) {
    const { lang, slug } = params;
    const isRTL = lang === 'ar';
    const homepageId = isRTL ? "87" : "64";

    const headerMenuName = isRTL ? 'Header Menu AR' : 'Header Menu EN';
    const footerMenuName = isRTL ? 'Footer Menu AR' : 'Footer Menu EN';
    
    const data = await getServicePageData(homepageId, slug, headerMenuName, footerMenuName);

    if (!data || !data.serviceGroups?.nodes || data.serviceGroups.nodes.length === 0 || !data.headerMenu || !data.footerMenu) {
        notFound();
    }
    
    const pageInfo = data.serviceGroups.nodes[0];
    
    const languageAlternates = pageInfo.translations?.reduce((acc, translation) => {
        const langKey = translation.language.code.toLowerCase().startsWith('en') ? 'en' : 'ar';
        acc[langKey] = translation.slug;
        return acc;
    }, {} as Record<string, string>);

    const subServices = pageInfo.contentNodes.nodes
      .filter(node => node && node.coreServiceDetails)
      .map(node => ({
        title: node.coreServiceDetails!.subServiceTitle || node.title,
        subServiceDescription: node.coreServiceDetails!.subServiceDescription,
        subServiceGallery: node.coreServiceDetails!.subServiceImages, 
    }));
    
    const { siteOptions, siteOptionsFields, contactInfo } = data.page;
    const { headerMenu, footerMenu } = data;

    const headerNavItems = headerMenu.menuItems.nodes.map(item => ({ label: item.label, href: item.path }));
    const footerNavItems = footerMenu.menuItems.nodes.map(item => ({ label: item.label, href: item.path }));

    return (
        <div className="min-h-screen bg-background text-text-primary">
            <Header 
                logoUrl={siteOptionsFields.logo.node.sourceUrl}
                logoAlt={siteOptionsFields.logo.node.altText || "Jassas Logo"}
                navItems={headerNavItems}
                lang={lang}
                profilePdfUrl={siteOptions?.profilePdf?.node?.mediaItemUrl}
            />
            <main className="pt-24 pb-16">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className={`text-4xl md:text-5xl font-bold text-text-primary mb-6 ${isRTL ? "font-arabic font-bold" : "font-bold"}`}>
                            {pageInfo.name}
                        </h1>
                        {pageInfo.serviceGroupFields?.categoryDescription && (
                            <div
                                className={`max-w-3xl mx-auto text-lg leading-relaxed text-text-secondary prose dark:prose-invert ${isRTL ? "font-arabic" : "font-normal"}`}
                                dangerouslySetInnerHTML={{ __html: pageInfo.serviceGroupFields.categoryDescription }}
                            />
                        )}
                    </div>
                    
                    {subServices.length > 0 ? (
                        <InteractiveServiceViewer subServices={subServices} isRTL={isRTL} />
                    ) : (
                        <div className="text-center text-text-secondary py-10">
                            <p>لا توجد خدمات فرعية لعرضها في هذا القسم حاليًا.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer
              footerTitle={siteOptions.footerTitle}
              footerDescription={siteOptions.footerDescription}
              footerLogoUrl={siteOptions.footerLogo.node.sourceUrl}
              footerLogoAlt={siteOptions.footerLogo.node.altText || "Footer Logo"}
              quickLinks={footerNavItems}
              contactInfo={{
                email: contactInfo.emailAddress,
                phone: contactInfo.phoneNumber,
                unified: contactInfo.unifiedNumber
              }}
              isRTL={isRTL}
              // ✨ --- هذا هو السطر الذي تمت إضافته --- ✨
              profilePdfUrl={siteOptions?.profilePdf?.node?.mediaItemUrl}
            />
        </div>
    );
}