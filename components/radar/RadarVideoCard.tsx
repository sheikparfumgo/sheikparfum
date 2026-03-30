"use client"

import Image from "next/image"
import { Play, Heart } from "lucide-react"

type Props = {
    name: string
    brand: string
    notes: string[]
    decantPrice: string
    bottlePrice: string
    image: string
    likes: string
}

export default function RadarVideoCard({
    name,
    brand,
    notes,
    decantPrice,
    bottlePrice,
    image,
    likes
}: Props) {
    return (
        <article
            className="
      bg-[#161616]
      border border-[#2a2a2a]
      rounded-xl
      overflow-hidden
      transition
      hover:scale-[1.04]
      hover:border-[#c9a34a]/40
      "
        >

            {/* Thumbnail */}

            <div className="relative aspect-[3/4]">

                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                />

                {/* Play Button */}

                <div className="absolute inset-0 flex items-center justify-center">

                    <div className="bg-black/50 rounded-full p-3 backdrop-blur">
                        <Play size={20} />
                    </div>

                </div>

                {/* Likes */}

                <div className="absolute top-2 right-2 flex items-center gap-1 text-white text-xs">

                    <Heart size={14} />
                    {likes}

                </div>

            </div>

            {/* Info */}

            <div className="p-3 space-y-2">

                <h3 className="text-sm font-semibold leading-tight line-clamp-2">
                    {name}
                </h3>

                <p className="text-xs text-[#c9a34a]">
                    {brand}
                </p>

                <div className="text-[11px] text-gray-400 line-clamp-1">
                    {notes.join(" • ")}
                </div>

                <div className="flex justify-between text-xs pt-1">

                    <span className="text-gray-400">
                        Decant
                        <br />
                        <span className="text-white font-semibold">
                            {decantPrice}
                        </span>
                    </span>

                    <span className="text-gray-400 text-right">
                        Frasco
                        <br />
                        <span className="text-white font-semibold">
                            {bottlePrice}
                        </span>
                    </span>

                </div>

            </div>

        </article>
    )
}