"use client"

import { useRouter } from "next/navigation"

type Props = {
    open: boolean
    onClose: () => void
    perfume: any
}

export default function ReviewModal({ open, onClose, perfume }: Props) {

    const router = useRouter()

    if (!open || !perfume) return null

    const hasYoutube = !!perfume.youtube_url?.trim()
    const hasInstagram = !!perfume.instagram_url?.trim()

    const videoUrl = hasYoutube
        ? perfume.youtube_url.replace("watch?v=", "embed/")
        : null

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={onClose}
        >

            <div
                className="
                    w-full max-w-md
                    bg-zinc-900
                    rounded-2xl
                    p-4
                    space-y-4
                    border border-zinc-800
                    shadow-xl
                "
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}
                <div>
                    <p className="text-[10px] text-zinc-500 uppercase">
                        {perfume.brand}
                    </p>

                    <h2 className="text-base font-semibold leading-tight">
                        {perfume.perfume_name}
                    </h2>
                </div>

                {/* VIDEO (SÓ SE YOUTUBE) */}
                {hasYoutube && (
                    <iframe
                        src={videoUrl}
                        className="w-full aspect-video rounded-lg"
                        allowFullScreen
                    />
                )}

                {/* PIRÂMIDE */}
                <div className="text-xs text-zinc-400 space-y-1">
                    <p><strong>Topo:</strong> {perfume.top_notes?.join(", ")}</p>
                    <p><strong>Coração:</strong> {perfume.heart_notes?.join(", ")}</p>
                    <p><strong>Base:</strong> {perfume.base_notes?.join(", ")}</p>
                </div>

                {/* CTA PRINCIPAL */}
                <button
                    onClick={() => router.push(`/perfume/${perfume.slug}`)}
                    className="
                        w-full py-2.5 rounded-lg text-sm font-semibold
                        bg-[#d4af37] text-black
                        hover:scale-[1.02]
                        transition
                    "
                >
                    Comprar perfume
                </button>

                {/* AÇÕES */}
                <div className="grid grid-cols-2 gap-2">

                    {/* YOUTUBE */}
                    <button
                        disabled={!hasYoutube}
                        onClick={() => window.open(perfume.youtube_url, "_blank")}
                        className={`
                            py-2 rounded-lg text-xs border transition
                            ${hasYoutube
                                ? "border-zinc-700 hover:bg-zinc-800"
                                : "border-zinc-800 text-zinc-600 cursor-not-allowed"
                            }
                        `}
                    >
                        Review completo
                    </button>

                    {/* INSTAGRAM */}
                    <button
                        disabled={!hasInstagram}
                        onClick={() => window.open(perfume.instagram_url, "_blank")}
                        className={`
                            py-2 rounded-lg text-xs border transition
                            ${hasInstagram
                                ? "border-zinc-700 hover:bg-zinc-800"
                                : "border-zinc-800 text-zinc-600 cursor-not-allowed"
                            }
                        `}
                    >
                        Review curto
                    </button>

                </div>

                {/* FECHAR */}
                <button
                    onClick={onClose}
                    className="
                        w-full py-2 rounded-lg text-xs
                        border border-zinc-800
                        hover:bg-zinc-800 transition
                    "
                >
                    Fechar
                </button>

            </div>

        </div>
    )
}