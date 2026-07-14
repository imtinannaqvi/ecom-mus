import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Eye,
  Database,
  Lock,
  Cookie,
  Share2,
  UserCheck,
  ShieldAlert,
  RefreshCw,
  Mail,
  ArrowUpRight
} from "lucide-react";

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      icon: Database,
      content: "We collect information necessary to provide you with a seamless shopping experience. This includes personal identifiers (such as your name, email address, shipping/billing address, and phone number), transaction details, device metadata (IP address, browser type, and operating system), and browsing behavior collected via tracking technologies."
    },
    {
      id: "usage",
      title: "2. How We Use Your Data",
      icon: Eye,
      content: "Your data is used to process and fulfill your orders, verify payments, manage your user profile, and communicate transactional updates. We also utilize aggregated, non-identifiable data to improve website functionality, personalize product recommendations, and occasionally distribute curated promotional newsletters if you have opted in."
    },
    {
      id: "security",
      title: "3. Data Security & Protection",
      icon: Lock,
      content: "At Maurish, safeguarding your information is a core priority. We implement industry-standard administrative, physical, and digital security measures—including Secure Socket Layer (SSL) encryption—to protect your personal details from unauthorized access, loss, misuse, or alteration."
    },
    {
      id: "cookies",
      title: "4. Cookies & Tracking Technologies",
     icon: Cookie,
      content: "We use cookies, web beacons, and local storage elements to retain your browsing preferences, keep your shopping cart active across sessions, and understand site interaction patterns. You can adjust your browser settings to decline cookies; however, doing so may limit your access to certain critical features of the Maurish store."
    },
    {
      id: "third-party",
      title: "5. Third-Party Sharing",
      icon: Share2,
      content: "Maurish does not sell, rent, or lease your private personal data to external parties. We only share essential information with trusted operational partners—such as secure payment processing networks, specialized delivery couriers, and analytics providers—solely to perform services on our behalf."
    },
    {
      id: "rights",
      title: "6. Your Privacy Rights",
      icon: UserCheck,
      content: "Depending on your region, you have specific rights regarding your personal information. These include the right to access the data we hold, correct inaccurate details, request the complete deletion of your customer profile, or opt out of direct marketing communications. To exercise any of these rights, please contact our privacy compliance team."
    },
    {
      id: "children",
      title: "7. Children's Privacy",
      icon: ShieldAlert,
      content: "The Maurish e-commerce platform is strictly designed and intended for use by adult consumers. We do not knowingly collect, store, or request personal data from individuals under the age of 18. If we discover that we have inadvertently gathered minor details, we will immediately delete them from our database records."
    },
    {
      id: "changes",
      title: "8. Amendments to This Policy",
      icon: RefreshCw,
      content: "Maurish reserves the right to update this Privacy Policy at any time to align with technological advances, business updates, or shifting regulatory mandates. Every update will be marked with a new 'Last Updated' date at the top of this page. Your continued use of our site after updates indicates consent to the modified terms."
    }
  ];

  // Highlight sidebar item as user scrolls down the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Leaves space for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-black selection:text-white">
      <Header />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100 py-10 px-6">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          <h1 className="text-2xl md:text-3l lg:text-4xl font-bold italic tracking-tight text-gray-900 ">
            Privacy Policy
          </h1>
         
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar Navigation (Hidden on Mobile) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 pl-3">
                Table of Contents
              </p>
              <nav className="space-y-1 border-l border-gray-200">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 text-left py-2.5 px-3 -ml-[1px] text-xs font-semibold rounded-r-lg border-l-2 transition-all duration-200 ${
                        activeSection === section.id
                          ? "border-black text-black bg-gray-100/70"
                          : "border-transparent text-gray-400 hover:text-gray-900 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={14} className="shrink-0" />
                      <span className="truncate">{section.title.split(". ")[1]}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Privacy Content List */}
          <main className="lg:col-span-3 space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-sm transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 border border-gray-100">
                      <Icon size={18} />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed pl-1">
                    {section.content}
                  </p>
                </article>
              );
            })}

            {/* Footer Callout Card */}
            <div className="relative overflow-hidden bg-black rounded-2xl p-8 md:p-12 text-center text-white mt-12">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Have Privacy Concerns?
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  We are fully committed to protecting your right to privacy and being completely transparent about our compliance standards. If you have any questions or wish to delete your data footprint, contact our support desk immediately.
                </p>
                <div className="pt-2">
                  <a
                    href="/contact-us"
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                  >
                    <Mail size={14} />
                    Contact Support
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;