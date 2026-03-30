import Image from "next/image"
import { Perfume } from "@/types/perfume"

type Props = {
    perfume: Perfume
}

export default function ClosetCard({ perfume }: Props) {

    return (
        <div className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-[#2a2a2a]">

            <div className="relative aspect-[4/5]">

                <Image
                    src={perfume.image}
                    alt={perfume.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                />

            </div>

            <div className="p-3 space-y-1">

                <h3 className="font-semibold text-sm">
                    {perfume.name}
                </h3>

                <p className="text-xs text-[#c9a34a]">
                    {perfume.brand}
                </p>

            </div>

        </div>
    )
}