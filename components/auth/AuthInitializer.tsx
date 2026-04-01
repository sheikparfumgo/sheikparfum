"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function AuthInitializer() {
    useEffect(() => {
        useAuth.getState().initialize()
    }, [])

    return null
}
