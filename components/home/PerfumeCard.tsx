import { Heart, PlayCircle } from "lucide-react";
import Image from "next/image";

type PerfumeCardProps = {
    name: string;
    brand: string;
    image: string;
    notes: string[];
    rating: number;
    reviews: number;
    decantPrice: number;
    bottlePrice: number;
    viral?: boolean;
};

export default function PerfumeCard({
    name,
    brand,
    image,
    notes,
    rating,
    reviews,
    decantPrice,
    bottlePrice,
    viral,
}: PerfumeCardProps) {
    return (
        <div
            className="
  w-[200px]
  sm:w-[220px]
  md:w-full
  flex-shrink-0
  bg-[#2B2B2B]
  rounded-2xl
  border border-[#413a2a]
  overflow-hidden
  flex flex-col
  transition
  hover:border-[#c9a34a]/40
  hover:shadow-lg
  "
        >
            {/* Image area */}
            <div className="relative h-40 sm:h-44 md:h-48 flex items-center justify-center bg-black p-4 sm:p-6">

                {viral && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full">
                        🔥 Viral no TikTok
                    </span>
                )}

                <button className="absolute top-3 right-3 bg-black/70 hover:bg-black p-2 rounded-full transition">
                    <Heart size={18} className="text-[#c9a34a]" />
                </button>

                <Image
                    src={image}
                    alt={name}
                    width={150}
                    height={150}
                    className="object-contain h-full w-auto"
                />
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">

                <span className="text-[#c9a34a] text-[10px] sm:text-xs font-bold uppercase">
                    {brand}
                </span>

                <h3 className="text-white font-bold text-sm sm:text-lg leading-tight">
                    {name}
                </h3>

                {/* Notes */}
                <div className="flex gap-2 mt-2 flex-wrap">
                    {notes.map((note) => (
                        <span
                            key={note}
                            className="text-[10px] sm:text-xs bg-black px-2 py-1 rounded text-gray-400"
                        >
                            {note}
                        </span>
                    ))}
                </div>

                {/* Rating */}
                <div className="mt-3 text-xs sm:text-sm text-gray-400">
                    ⭐ {rating} ({reviews} avaliações)
                </div>

                {/* Review button */}
                <button className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#c9a34a] hover:opacity-80 transition">
                    <PlayCircle size={18} />
                    Assistir review
                </button>

                {/* Actions */}
                <div className="mt-4 flex flex-col gap-2">

                    <button className="bg-[#c9a34a]/10 border border-[#c9a34a] text-[#c9a34a] font-semibold py-2 rounded-lg flex justify-between px-3 text-sm hover:bg-[#c9a34a]/20 transition">
                        <span>Testar (5ml)</span>
                        <span>R$ {decantPrice}</span>
                    </button>

                    <button className="bg-[#c9a34a] text-black font-semibold py-2 rounded-lg flex justify-between px-3 text-sm hover:brightness-110 transition">
                        <span>Frasco</span>
                        <span>R$ {bottlePrice}</span>
                    </button>

                    <button className="border border-[#413a2a] text-white py-2 rounded-lg text-xs sm:text-sm hover:bg-[#1c1c1c] transition">
                        ❤️ Salvar na Lista do Sheik
                    </button>

                </div>
            </div>
        </div>
    );
}