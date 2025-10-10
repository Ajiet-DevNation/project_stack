"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { LoginModal } from "@/components/LoginModal";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);
  console.log(session);
  return (
    <>
      <LandingPage
        onGetStarted={() => setLoginOpen(true)}
        onExploreProjects={() => router.push('/projects')}
      />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}