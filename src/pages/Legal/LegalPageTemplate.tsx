import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { contentService } from "../../services";
import type { LegalPageContent, LegalSection } from "../../types";

interface LegalPageTemplateProps {
  slug: string;
  defaultContent: LegalPageContent;
}

const renderSection = (section: LegalSection, index: number) => {
  return (
    <motion.div
      key={`${section.heading}-${index}`}
      className="bg-black border border-gold-primary/20 rounded-xl p-8 hover:border-gold-primary/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <h3 className="text-2xl font-light text-white mb-4">
        {section.heading}
      </h3>
      <div className="space-y-4">
        {section.body.map((paragraph, idx) => (
          <p key={idx} className="text-white/70 leading-relaxed font-light">
            {paragraph}
          </p>
        ))}
      </div>
      {section.list && (
        <div className="mt-6">
          {section.list.title && (
            <p className="text-white/80 font-semibold mb-3">
              {section.list.title}
            </p>
          )}
          <ul className="space-y-2 list-disc list-inside text-white/70 font-light">
            {section.list.items.map((item, itemIdx) => (
              <li key={itemIdx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

const LegalPageTemplate: React.FC<LegalPageTemplateProps> = ({
  slug,
  defaultContent,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["content", "page", slug],
    queryFn: () => contentService.getPage(slug),
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error("Showing the latest available version of this page.");
    }
  }, [isError]);

  const page = data ?? defaultContent;

  return (
    <div className="min-h-screen bg-black">
      <section className="relative py-32 bg-black-soft border-b border-gold-primary/10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.h1
            className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {page.title}
          </motion.h1>
          {page.subtitle && (
            <motion.p
              className="text-xl text-white/70 font-light max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {page.subtitle}
            </motion.p>
          )}
          {(page.updatedAt || isLoading) && (
            <motion.p
              className="text-sm text-white/50 font-light mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isLoading
                ? "Checking for updates..."
                : `Last updated: ${new Date(page.updatedAt ?? "").toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`}
            </motion.p>
          )}
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-black border border-gold-primary/10 rounded-xl p-8 animate-pulse"
                >
                  <div className="h-6 w-64 bg-white/10 rounded mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-11/12 bg-white/5 rounded" />
                    <div className="h-4 w-10/12 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            page.sections.map(renderSection)
          )}
        </div>
      </section>
    </div>
  );
};

export default LegalPageTemplate;


