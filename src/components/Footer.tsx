import React, { useState } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { LegalModal } from "./LegalModal";
import PrivacyPolicyContent from "./legal/PrivacyPolicyContent";
import TermsOfUseContent from "./legal/TermsOfUseContent";

export default function Footer() {
    const [activeModal, setActiveModal] = useState<"privacy" | "terms" | null>(null);

    const openModal = (type: "privacy" | "terms") => {
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <>
            <footer className="relative pointer-events-auto" style={{ zIndex: 2 }}>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                <div className="bg-background/30 backdrop-blur-2xl">
                    <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

                        <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12 border-b border-border/20">

                            <div className="flex flex-col gap-4 max-w-xs">
                                <span className="text-xl font-bold tracking-tight text-foreground">
                                    Project<span className="text-primary">Stack</span>
                                </span>
                                <p className="text-sm text-muted-foreground/60 leading-relaxed">
                                    Where students and creators come together to build the next big thing.
                                </p>
                                <div className="flex items-center gap-3">
                                    <a
                                        href="https://github.com/Ajiet-DevNation/project_stack"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/40 hover:border-primary/40 bg-card/40 hover:bg-card/70 backdrop-blur transition-all duration-300 text-muted-foreground/70 hover:text-foreground"
                                        aria-label="GitHub"
                                    >
                                        <Github className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/project-stack"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/40 hover:border-primary/40 bg-card/40 hover:bg-card/70 backdrop-blur transition-all duration-300 text-muted-foreground/70 hover:text-foreground"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
                                    </a>
                                    <a
                                        href="https://instagram.com/projectstack"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-center justify-center w-10 h-10 rounded-full border border-border/40 hover:border-primary/40 bg-card/40 hover:bg-card/70 backdrop-blur transition-all duration-300 text-muted-foreground/70 hover:text-foreground"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-sm">
                                {[
                                    {
                                        heading: "Community",
                                        links: ["DevNation", "Discord"],
                                    },
                                    {
                                        heading: "Legal",
                                        links: ["Privacy Policy", "Terms of Use"],
                                    },
                                ].map(({ heading, links }) => (
                                    <div key={heading} className="flex flex-col gap-4">
                                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
                                            {heading}
                                        </span>
                                        <ul className="flex flex-col gap-3">
                                            {links.map((item) => {
                                                const handleClick = (e: React.MouseEvent) => {
                                                    e.preventDefault();
                                                    if (item === "Privacy Policy") {
                                                        openModal("privacy");
                                                    } else if (item === "Terms of Use") {
                                                        openModal("terms");
                                                    } else if (item === "Discord") {
                                                        window.open("https://discord.gg/nzC2kaRf", "_blank");
                                                    } else if (item === "DevNation") {
                                                        window.open("https://github.com/Ajiet-DevNation", "_blank");
                                                    } else {
                                                        console.log(`Navigate to: ${item}`);
                                                    }
                                                };

                                                return (
                                                    <li key={item}>
                                                        <button
                                                            onClick={handleClick}
                                                            className="text-muted-foreground/60 hover:text-foreground transition-colors duration-200 hover:translate-x-0.5 inline-block text-left w-full cursor-pointer"
                                                        >
                                                            {item}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-8">
                            <p className="text-xs text-muted-foreground/35 tracking-wide">
                                © {new Date().getFullYear()} ProjectStack. All rights reserved.
                            </p>
                            <p className="text-xs text-muted-foreground/35 tracking-wide">
                                A proud initiative under{" "}
                                <span className="text-primary/60 font-medium">DevNation</span>
                            </p>
                        </div>

                    </div>
                </div>
            </footer>

            <LegalModal
                isOpen={activeModal === "privacy"}
                onClose={closeModal}
                title="Privacy Policy"
            >
                <PrivacyPolicyContent />
            </LegalModal>

            <LegalModal
                isOpen={activeModal === "terms"}
                onClose={closeModal}
                title="Terms of Use"
            >
                <TermsOfUseContent />
            </LegalModal>
        </>
    );
}