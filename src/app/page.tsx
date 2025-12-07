"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import { LoginModal } from "@/components/LoginModal";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setLoginOpen(true);
      router.replace("/", { scroll: false });
    }
  }, [searchParams, router]);

  const handleGetStarted = () => {
    setLoginOpen(true);
  };

  const handleExploreProjects = () => {
    router.push("/home");
  };

  return (
    <>
      <LandingPage
        onGetStarted={handleGetStarted}
        onExploreProjects={handleExploreProjects}
      />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
