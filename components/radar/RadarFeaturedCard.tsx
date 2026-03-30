import Image from "next/image"

type Props = {
    name?: string
    brand?: string
    image?: string
    likes?: number
}

export default function RadarFeaturedCard({
    name = "Perfume em destaque",
    brand = "Marca",
    image = "/perfumes/placeholder.png",
    likes = 0
}: Props) {

    return (
        <div className="relative w-full h-[320px] rounded-2xl overflow-hidden">

            <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

            <div className="absolute bottom-8 left-8 text-white space-y-1">

                <p className="text-xs text-amber-400 uppercase tracking-widest">
                    Perfume em destaque
                </p>

                <h2 className="text-3xl font-bold text-primary">
                    {name}
                </h2>

                <p className="text-sm text-zinc-300">
                    {brand}
                </p>

            </div>

        </div>
    )
}