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

  const handleGetStarted = () => {
    if (session) {
      router.push('/home'); 
    } else {
      setLoginOpen(true); 
    }
  };

  return (
    <>
      <LandingPage 
        onGetStarted={handleGetStarted}
        onExploreProjects={() => router.push('/home')} 
      />
     <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}