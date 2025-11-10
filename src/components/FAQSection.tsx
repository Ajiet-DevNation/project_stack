import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Who is eligible to participate in the hackathon?",
      answer: "All students from colleges and universities are eligible to participate. Both undergraduate and graduate students can join the hackathon."
    },
    {
      question: "Do all team members need to register and pay individually?",
      answer: "Yes, each team member needs to register individually and pay the registration fee separately to secure their spot in the hackathon."
    },
    {
      question: "Can I participate as an individual or do I need a team?",
      answer: "You can participate both as an individual or as part of a team. Teams can have 2-4 members maximum."
    },
    {
      question: "Can students from different colleges be in the same team?",
      answer: "No, all team members must be from the same college or university. Cross-college teams are not allowed."
    },
    {
      question: "Will there be mentors or workshops during the hackathon?",
      answer: "Yes, we will have experienced mentors available throughout the event and conduct workshops on various technologies and development practices."
    },
    {
      question: "What resources will be provided during the hackathon?",
      answer: "We provide WiFi, power outlets, meals, snacks and technical support throughout the event."
    },
    {
      question: "How can I stay informed about event updates and announcements?",
      answer: "Follow our social media channels, join our Discord server, and check your registered email regularly for all updates and announcements."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="py-20 px-4 pt-38 relative">
      {/* Background gradient */}
      <div className="absolute inset-0  from-neutral-900 via-neutral-800 to-neutral-900 opacity-50"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Frequently Asked{' '}
            <span 
              className="text-transparent bg-clip-text"
              style={{backgroundImage: 'linear-gradient(to right, #A7727D, #EDDBC7, #F8EAD8)'}}
            >
              Questions
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about participating
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="backdrop-blur-md border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-white/20"
              style={{
                background: openIndex === index 
                  ? 'linear-gradient(to right, rgba(167, 114, 125, 0.1), rgba(237, 219, 199, 0.05))' 
                  : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-300 group"
              >
                <span 
                  className="text-lg font-semibold transition-colors duration-300"
                  style={{
                    color: openIndex === index ? '#EDDBC7' : '#ffffff'
                  }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-all duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{
                    color: openIndex === index ? '#EDDBC7' : '#9ca3af'
                  }}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div 
                  className="px-6 pb-5 pt-2 border-t"
                  style={{
                    borderColor: 'rgba(237, 219, 199, 0.2)'
                  }}
                >
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Accent line */}
              {openIndex === index && (
                <div 
                  className="h-1 animate-pulse"
                  style={{
                    background: 'linear-gradient(to right, #A7727D, #EDDBC7)'
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Still have questions?
          </p>
          <button 
            className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(to right, #A7727D, #EDDBC7)',
              color: '#1a1a1a',
              boxShadow: '0 10px 40px rgba(167, 114, 125, 0.3)'
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;