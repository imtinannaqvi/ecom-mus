import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  ShieldCheck, 
  Tag, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  UserCheck, 
  Lock, 
  Scale, 
  RefreshCw,
  Mail,
  ArrowUpRight
} from "lucide-react";

const Term = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: ShieldCheck,
      content: "By accessing, browsing, or purchasing from Maurish, you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions. These terms govern your entire relationship with our platform. If you do not agree with any part of these terms, please discontinue using our website."
    },
    {
      id: "pricing",
      title: "2. Products & Pricing",
      icon: Tag,
      content: "We strive for absolute accuracy in our product displays, material descriptions, and pricing. However, typographical or system errors may occasionally occur. Maurish reserves the right to correct pricing discrepancies, update product specifications, and adjust availability at any time without prior notice."
    },
    {
      id: "orders",
      title: "3. Orders & Payments",
      icon: CreditCard,
      content: "All transactions are securely processed and verified. Maurish reserves the absolute right to decline, limit, or cancel any order due to suspected fraudulent activity, stock limitations, or pricing errors. In any event of a cancellation, a full refund will be processed immediately to your original payment method."
    },
    {
      id: "shipping",
      title: "4. Shipping & Delivery",
      icon: Truck,
      content: "Estimated shipping timelines are provided during checkout. While we partner with premium logistics carriers to ensure prompt and secure shipping, Maurish is not liable for unexpected delays caused by customs clearance procedures, extreme weather conditions, or courier operational disruptions."
    },
    {
      id: "returns",
      title: "5. Returns & Refunds",
      icon: RotateCcw,
      content: "We curate our collections with rigorous standards of quality. If you are not fully satisfied with your purchase, you may initiate a return or exchange within our designated return window. Items must remain completely unworn, unwashed, unaltered, and returned in their original packaging with all tags attached."
    },
    {
      id: "user-responsibilities",
      title: "6. User Account & Security",
      icon: UserCheck,
      content: "If you create an account, you are solely responsible for maintaining the confidentiality of your credentials and restricting unauthorized access. You agree to take responsibility for all activities performed under your account and to notify us immediately of any security breaches."
    },
    {
      id: "privacy",
      title: "7. Privacy & Data Protection",
      icon: Lock,
      content: "Your privacy is of paramount importance to us. Any personal details captured during registration, checkout, or browsing are safeguarded using standard encryption. We never rent, sell, or distribute your private contact details to unauthorized third-party platforms."
    },
    {
      id: "intellectual-property",
      title: "8. Intellectual Property",
      icon: Scale,
      content: "All creative assets, brand names, unique designs, photography, site copy, graphics, and layout structures hosted on Maurish are our exclusive intellectual property. Unauthorized reproduction, modification, or distribution of these materials for commercial use is strictly prohibited."
    },
    {
      id: "changes",
      title: "9. Amendments to Terms",
      icon: RefreshCw,
      content: "Maurish reserves the right to modify, update, or restructure these Terms & Conditions at our discretion to match standard industry updates or legal regulations. We highly recommend reviewing this page periodically. Continued use of our store indicates full agreement to our updated policy."
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
        <div className="max-w-2xl mx-auto text-center relative z-10">
         
          <h1 className="text-2xl md:text-xl lg:text-4xl font-bold tracking-tight italic text-gray-900 ">
            Terms & Condition
          </h1>
          
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
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

          {/* Terms Content List */}
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
                  Thank You for Choosing Maurish
                </h3>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                  We appreciate your trust in Maurish. Our priority is to provide an aesthetic, secure, and completely transparent shopping environment. If you have questions regarding these guidelines, our customer support team is always ready to assist.
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

export default Term;