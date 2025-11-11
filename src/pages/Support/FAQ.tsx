import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import toast from "react-hot-toast";
import { contentService } from "../../services";
import type { FAQItem } from "../../types";

const fallbackFaqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I enter a competition?",
    answer:
      "Choose the competition you wish to enter, answer the qualifying question, select the number of tickets you want, and complete checkout. You will receive an email confirmation with your ticket numbers.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "How are winners selected?",
    answer:
      "We use verified random draw software to select winning ticket numbers. Draws are broadcast live on our social channels and winners are contacted immediately afterwards.",
    category: "Draws",
  },
  {
    id: "faq-3",
    question: "What happens if I answer the question incorrectly?",
    answer:
      "Only correct answers are entered into the draw. If your answer is incorrect, your entry will be removed and your ticket price refunded within 3-5 working days.",
    category: "Entries",
  },
  {
    id: "faq-4",
    question: "Can I get a refund?",
    answer:
      "We can only offer refunds in exceptional circumstances, such as competition cancellation or system errors. Please contact support with your order details for assistance.",
    category: "Payments",
  },
  {
    id: "faq-5",
    question: "How will I receive my prize?",
    answer:
      "Our team will arrange prize delivery or collection directly with you. Cash alternatives are paid via bank transfer once ID and eligibility checks are completed.",
    category: "Prizes",
  },
];

const FAQ: React.FC = () => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["content", "faqs"],
    queryFn: () => contentService.getFaqs(),
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error("Unable to load the latest FAQs. Showing the standard list.");
    }
  }, [isError]);

  const faqs = data?.faqs ?? fallbackFaqs;

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="py-32 bg-black-soft border-b border-gold-primary/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="text-xl text-white/70 font-light max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find quick answers about entering competitions, watching the draws, and
            claiming your prize.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-0">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-black border border-gold-primary/10 rounded-xl p-6 animate-pulse"
                >
                  <div className="h-5 w-3/4 bg-white/10 rounded mb-3" />
                  <div className="h-4 w-full bg-white/5 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    className="border border-gold-primary/20 rounded-xl overflow-hidden bg-black-soft"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <button
                      onClick={() => toggle(faq.id)}
                      className="w-full flex items-center justify-between text-left px-6 py-5 md:px-8 md:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/50"
                    >
                      <div>
                        <p className="text-sm uppercase text-gold-primary/80 tracking-wide font-semibold mb-1">
                          {faq.category ?? "General"}
                        </p>
                        <h3 className="text-xl font-light text-white">
                          {faq.question}
                        </h3>
                      </div>
                      <span className="ml-4 text-gold-primary flex-shrink-0">
                        {isOpen ? <FaMinus /> : <FaPlus />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          className="px-6 pb-6 md:px-8 md:pb-8"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <p className="text-white/70 leading-relaxed font-light border-t border-gold-primary/10 pt-6">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQ;


