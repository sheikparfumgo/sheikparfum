"use client"

import Image from "next/image"

type Props = {
    id: string
    name: string
    brand: string
    image: string
    thumbnail_url?: string
    youtube_url?: string
    instagram_url?: string
    onOpen: () => void
}

export default function RadarPerfumeCard({
    name,
    brand,
    image,
    thumbnail_url,
    youtube_url,
    instagram_url,
    onOpen
}: Props) {

    const imageToUse =
        thumbnail_url && thumbnail_url.trim() !== ""
            ? thumbnail_url
            : image

    const hasVideo =
        (youtube_url && youtube_url.trim() !== "") ||
        (instagram_url && instagram_url.trim() !== "")

    return (
        <div
            onClick={onOpen}
            className="
                w-[240px]
                flex-shrink-0
                bg-zinc-900
                border border-zinc-800
                rounded-xl
                overflow-hidden
                cursor-pointer
                hover:scale-[1.04]
                transition
                group
            "
        >

            {/* IMAGEM */}
            <div className="relative aspect-square overflow-hidden">

                <Image
                    src={imageToUse || "/placeholder.png"}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                />

                {/* BADGE VIDEO */}
                {hasVideo && (
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-xs rounded">
                        ▶ Review
                    </div>
                )}

            </div>

            {/* INFO */}
            <div className="p-3 space-y-1">

                <p className="text-[10px] text-zinc-400 uppercase">
                    {brand}
                </p>

                <h3 className="text-sm font-medium leading-tight line-clamp-2">
                    {name}
                </h3>

                {/* CTA */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onOpen()
                    }}
                    className="
                        mt-2 w-full py-2 text-xs rounded-lg
                        bg-[#d4af37] text-black font-semibold
                        hover:scale-[1.02]
                        transition
                    "
                >
                    Ver review
                </button>

            </div>

        </div>
    )
}