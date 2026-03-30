"use client"

import { useLiveViewers } from "@/hooks/useLiveViewers"

export default function LiveViewers() {
    const viewers = useLiveViewers()

    return (
        <div className="
            flex items-center gap-2
            text-xs md:text-sm
            text-zinc-400
            mt-2
        ">
            <span className="text-[#d4af37]">👀</span>

            <span>
                <span className="text-white font-semibold">
                    {viewers}
                </span>{" "}
                pessoas analisando este perfume agora
            </span>
        </div>
    )
}