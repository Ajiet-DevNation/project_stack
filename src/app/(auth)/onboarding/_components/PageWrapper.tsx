"use client"

import { useState, useEffect } from "react"
import DemoOne from "@/components/ShaderBackground"
import Loader from "@/components/Loader"

interface PageWrapperProps {
    children: React.ReactNode
}

function PageWrapper({ children }: PageWrapperProps) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Show loader for initial page load
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500) // Adjust timing as needed

        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            <div className="fixed -z-10 h-full w-screen">
                <DemoOne />
            </div>
            {isLoading ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                children
            )}
        </>
    )
}

export default PageWrapper;