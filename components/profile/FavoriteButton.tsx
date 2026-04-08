"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

type FavoriteButtonProps = {
    productId: string
    size?: number
    className?: string
}

export default function FavoriteButton({ productId, size = 18, className = "" }: FavoriteButtonProps) {
    const { user, favorites, toggleFavorite } = useAuth()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const isFavorite = favorites.includes(productId)

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) return

        setLoading(true)
        await toggleFavorite(productId)
        setLoading(false)
    }

    return (
        <button
            onClick={handleClick}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className={`
                relative group
                p-2 rounded-full backdrop-blur-md shadow-lg
                transition-all duration-300 active:scale-90
                ${isFavorite
                    ? "bg-[#d4af37] text-black scale-110"
                    : "bg-black/50 text-[#d4af37] hover:bg-[#d4af37]/20"
                }
                ${className}
            `}
        >
            {loading ? (
                <Loader2 size={size} className="animate-spin" />
            ) : (
                <Heart
                    size={size}
                    fill={isFavorite ? "currentColor" : "none"}
                    className={`transition-transform duration-300 ${isFavorite ? "scale-110 animate-bounce-once" : "scale-100"}`}
                />
            )}
        </button>
    )
}
