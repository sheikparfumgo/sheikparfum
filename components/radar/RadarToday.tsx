"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export default function RadarToday({ perfume }: { perfume: any }) {

    const router = useRouter()

    if (!perfume) return null

    const videoUrl = perfume.youtube_url || perfume.instagram_url

    return (
        <div className="
            border border-zinc-800
            rounded-xl
            bg-zinc-900/80
            backdrop-blur
            p-4
            max-w-[900px]
        ">

            <div className="flex gap-4 items-center">

                {/* THUMB */}
                <div className="
                    relative
                    w-28 h-28
                    rounded-lg
                    overflow-hidden
                    flex-shrink-0
                ">
                    <Image
                        src={perfume.thumbnail_url || perfume.image_main}
                        alt={perfume.perfume_name}
                        fill
                        className="object-cover"
                    />

                    {/* BADGE */}
                    <div className="
                        absolute top-2 left-2
                        text-[10px]
                        px-2 py-1
                        rounded
                        bg-black/70
                    ">
                        HOJE
                    </div>
                </div>

                {/* INFO */}
                <div className="flex-1 space-y-2">

                    <div>
                        <p className="text-[10px] uppercase text-zinc-500 tracking-wider">
                            Hoje no radar
                        </p>

                        <h2 className="text-sm font-semibold leading-tight">
                            {perfume.perfume_name}
                        </h2>

                        <p className="text-xs text-zinc-400">
                            {perfume.brand}
                        </p>
                    </div>

                    {/* CUPOM */}
                    <div className="
                        text-[11px]
                        px-2 py-1
                        rounded-md
                        bg-[#d4af37]/10
                        border border-[#d4af37]/20
                        inline-block
                    ">
                        Cupom: <span className="text-[#d4af37] font-semibold">REVIEWDAY10</span>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-2 pt-1">

                        <button
                            onClick={() => videoUrl && window.open(videoUrl, "_blank")}
                            disabled={!videoUrl}
                            className={`
                                text-xs px-3 py-1.5 rounded-md
                                border transition
                                ${videoUrl
                                    ? "border-zinc-700 hover:bg-zinc-800"
                                    : "border-zinc-800 text-zinc-600 cursor-not-allowed"}
                            `}
                        >
                            Ver review
                        </button>

                        <button
                            onClick={() => router.push(`/perfume/${perfume.slug}`)}
                            className="
                                text-xs px-3 py-1.5 rounded-md
                                bg-[#d4af37]
                                text-black
                                font-semibold
                                hover:opacity-90
                            "
                        >
                            Comprar
                        </button>

                    </div>

                </div>

            </div>

        </div>
    )
}