"use client"

import { useState, useEffect } from "react"
import Loader from "@/components/Loader"
import ProfileContent from "./ProfileContent";

interface ProfilePageWrapperProps {
  profileId?: string
}

function ProfilePageWrapper({ profileId }: ProfilePageWrapperProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return <ProfileContent profileId={profileId} />
}

export default ProfilePageWrapper;