"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, User, MessageSquare, Send } from "lucide-react";
import DemoOne from "@/components/ShaderBackground";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "../../../actions/contact";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            const result = await sendContactEmail(data);

            if (!result.success) {
                if (result.rateLimited) {
                    toast.error(result.message, {
                        duration: 5000,
                    });
                } else {
                    toast.error(result.message);
                }
                return;
            }

            toast.success("Message sent successfully! We'll get back to you soon.");
            reset();
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Contact form error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="fixed -z-10 h-full w-screen">
                <DemoOne />
            </div>
            <main className="relative mb-20 z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Have a question or want to work together? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2 animate-in slide-in-from-left-2 duration-500 delay-200">
                                <label
                                    htmlFor="name"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <User className="h-4 w-4 text-primary" />
                                    Your Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    placeholder="John Doe"
                                    className={cn(
                                        "w-full px-4 py-3 bg-background/50 border-2 border-border rounded-lg",
                                        "transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                                        "text-foreground placeholder:text-muted-foreground",
                                        errors.name && "border-destructive focus:border-destructive focus:ring-destructive/20"
                                    )}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 animate-in slide-in-from-left-2 duration-500 delay-300">
                                <label
                                    htmlFor="email"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <Mail className="h-4 w-4 text-primary" />
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="john@example.com"
                                    className={cn(
                                        "w-full px-4 py-3 bg-background/50 border-2 border-border rounded-lg",
                                        "transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                                        "text-foreground placeholder:text-muted-foreground",
                                        errors.email && "border-destructive focus:border-destructive focus:ring-destructive/20"
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 animate-in slide-in-from-left-2 duration-500 delay-400">
                                <label
                                    htmlFor="subject"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    {...register("subject")}
                                    placeholder="How can we help you?"
                                    className={cn(
                                        "w-full px-4 py-3 bg-background/50 border-2 border-border rounded-lg",
                                        "transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                                        "text-foreground placeholder:text-muted-foreground",
                                        errors.subject && "border-destructive focus:border-destructive focus:ring-destructive/20"
                                    )}
                                />
                                {errors.subject && (
                                    <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                                        {errors.subject.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 animate-in slide-in-from-left-2 duration-500 delay-500">
                                <label
                                    htmlFor="message"
                                    className="flex items-center gap-2 text-sm font-semibold text-foreground"
                                >
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    {...register("message")}
                                    placeholder="Tell us more about your inquiry..."
                                    rows={6}
                                    className={cn(
                                        "w-full px-4 py-3 bg-background/50 border-2 border-border rounded-lg resize-none",
                                        "transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                                        "text-foreground placeholder:text-muted-foreground",
                                        errors.message && "border-destructive focus:border-destructive focus:ring-destructive/20"
                                    )}
                                />
                                {errors.message && (
                                    <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>

                            <div className="animate-in slide-in-from-bottom-2 duration-500 delay-600">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full cursor-pointer px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold",
                                        "transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]",
                                        "flex items-center justify-center gap-2 shadow-lg shadow-primary/20",
                                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
                        <p>
                            We typically respond within 24-48 hours. For urgent matters, please reach out directly.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
