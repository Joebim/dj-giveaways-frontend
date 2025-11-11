import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaQuestionCircle, FaTrophy, FaRegSmile, FaPlay } from "react-icons/fa";
import Button from "../../components/common/Button/Button";

const steps = [
  {
    icon: FaQuestionCircle,
    title: "1. Choose Your Competition",
    description:
      "Browse our live competitions and pick the prize that excites you most. Each listing shows ticket price, guaranteed draw date, odds, and cash alternatives.",
  },
  {
    icon: FaTicketAlt,
    title: "2. Answer the Skill Question",
    description:
      "Every entry includes a multiple-choice question. Select the correct answer to qualify. Only correct entries make it into the final draw.",
  },
  {
    icon: FaPlay,
    title: "3. Watch the Live Draw",
    description:
      "We host every draw live on social media. Tickets are assigned unique numbers and picked using independent random draw software.",
  },
  {
    icon: FaTrophy,
    title: "4. Claim Your Prize",
    description:
      "Winners receive an immediate call from the DJ Giveaways team. We arrange delivery, collection, or cash alternative within days.",
  },
];

const features = [
  {
    title: "Low Odds, High Excitement",
    body: "Every competition has a capped ticket count so you always know the odds before you enter.",
  },
  {
    title: "Guaranteed Draw Dates",
    body: "We never extend a draw. If a competition sells out early we bring the draw forward.",
  },
  {
    title: "Transparent Winners",
    body: "We publish every winner with their ticket number, location, and prize for complete transparency.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="py-32 bg-black-soft border-b border-gold-primary/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.h1
            className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h1>
          <motion.p
            className="text-xl text-white/70 font-light max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Entering a DJ Giveaway takes less than two minutes. Follow the four simple steps below to put
            yourself in the frame for our next luxury prize reveal.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-black">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="bg-black-soft border border-gold-primary/20 rounded-2xl p-8 hover:border-gold-primary/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gold-primary/10 border border-gold-primary/40 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-gold-primary" />
                  </div>
                  <h3 className="text-2xl font-light text-white mb-4">{step.title}</h3>
                  <p className="text-white/70 font-light leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-black-soft border-y border-gold-primary/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-light text-white mb-6">Why thousands choose DJ Giveaways</h2>
            <p className="text-white/70 font-light leading-relaxed mb-4">
              Since 2020 we've awarded over £65 million in prizes, from dream cars and cash jackpots to five-star
              getaways. Our players stay with us because we run honest, transparent competitions with unbeatable prizes.
            </p>
            <p className="text-white/70 font-light leading-relaxed">
              Every draw is streamed live with independent adjudication, and our support team is here seven days a week
              to help with entries or prize claims.
            </p>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-black border border-gold-primary/20 rounded-xl p-6 hover:border-gold-primary/40 transition-all duration-300"
              >
                <h3 className="text-xl font-light text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 font-light leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <motion.div
            className="bg-black-soft border border-gold-primary/30 rounded-2xl p-12 shadow-lg shadow-gold-primary/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FaRegSmile className="w-12 h-12 text-gold-primary mx-auto mb-4" />
            <h3 className="text-3xl font-light text-white mb-4">Ready to become our next champion?</h3>
            <p className="text-white/70 font-light mb-8">
              Dive into our latest competitions and secure your entries before the draw closes. Good luck!
            </p>
            <Link to="/competitions" className="block max-w-xs mx-auto">
              <Button variant="primary" size="lg" fullWidth withBrackets>
                Browse Live Competitions
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
