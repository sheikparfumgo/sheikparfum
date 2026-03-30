"use client"

import Image from "next/image"
import { useRecentPurchase } from "@/hooks/useRecentPurchase"

type Perfume = {
    perfume_name?: string
    image_main?: string
}

type Props = {
    perfumes?: Perfume[]
}

export default function RecentPurchaseBadge({ perfumes = [] }: Props) {
    const { visible, data } = useRecentPurchase(perfumes)

    if (!visible || !data) return null

    return (
        <div
            className="
                fixed bottom-4 left-1/2 -translate-x-1/2
md:bottom-6 md:left-6 md:translate-x-0 z-50
                flex items-center gap-3
                bg-zinc-900/95 backdrop-blur-md
                border border-zinc-700/80
                rounded-xl px-3 py-2
                shadow-2xl
                animate-slide-up
                max-w-[300px]
            "
        >

            {/* IMAGEM */}
            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                <Image
                    src={data.image || "/placeholder.png"}
                    alt={data.perfume || "Perfume"}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                />
            </div>

            {/* TEXTO */}
            <div className="flex flex-col text-xs leading-tight">

                <span className="text-zinc-400">
                    <span className="text-white font-semibold">
                        {data.name}
                    </span>{" "}
                    de {data.city}
                </span>

                <span className="text-white">
                    comprou{" "}
                    <span className="text-[#d4af37] font-medium">
                        {data.perfume}
                    </span>
                </span>

                <span className="text-zinc-500 text-[11px] flex items-center gap-1">
                    {data.size} • {data.time}
                </span>

            </div>
        </div>
    )
}