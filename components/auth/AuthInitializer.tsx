"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function AuthInitializer() {
    const initialize = useAuth((state) => state.initialize)
    const initialized = useAuth((state) => state.initialized)

    useEffect(() => {
        if (!initialized) {
            initialize()
        }
    }, [initialize, initialized])

    return null
}