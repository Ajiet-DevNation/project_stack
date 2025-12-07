import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Who can use this platform?",
      answer: "This platform is exclusively for students of our college. It's designed to help you connect with fellow students, collaborate on projects, and build amazing things together."
    },
    {
      question: "How do I create a project post?",
      answer: "Click on 'Create Project', fill in your project details including title, description, required skills, and whether you need collaborators. Once posted, other students from our college can view and apply to join your project."
    },
    {
      question: "Can I work with students from different departments or years?",
      answer: "Absolutely! This platform encourages cross-department and cross-year collaboration. Connect with students from any branch or year within our college."
    },
    {
      question: "How do I apply to join someone's project?",
      answer: "Browse through available projects posted by your peers, find one that matches your interests and skills, and click 'Apply'. Share why you're interested and what you can contribute to the project."
    },
    {
      question: "Is this platform free to use?",
      answer: "Yes, this platform is completely free for all students of our college. It's a DevNation initiative to foster collaboration and innovation within our campus community."
    },
    {
      question: "What if I have an idea but need teammates with specific skills?",
      answer: "Create a project post and specify the skills you're looking for (like developers, designers, content writers, etc.). Students with matching skills can discover your project and apply to join."
    },
    {
      question: "How do I find projects looking for my skills?",
      answer: "Use the filter and search features to find projects that need your specific skills. You can also browse all active projects to discover opportunities that match your interests."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="py-20 px-4 pt-38 relative ">
      {/* Background gradient */}
      <div className="absolute inset-0  from-background via-muted to-background opacity-50"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about participating
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`backdrop-blur-md border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/30 ${openIndex === index
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-card/50 border-border'
                }`}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center cursor-pointer justify-between text-left transition-all duration-300 group"
              >
                <span
                  className={`text-lg font-semibold transition-colors duration-300 ${openIndex === index ? 'text-secondary-foreground' : 'text-foreground'
                    }`}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-all duration-300 ${openIndex === index ? 'rotate-180 text-secondary-foreground' : 'text-muted-foreground'
                    }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
              >
                <div className="px-6 pb-5 pt-2 border-t border-primary/20">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Accent line */}
              {openIndex === index && (
                <div className="h-1 animate-pulse bg-gradient-to-r from-primary to-secondary"></div>
              )}
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <button className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 cursor-pointer">
            <Link href="/contact">Contact Us</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;