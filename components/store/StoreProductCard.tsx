import Image from "next/image"
import Link from "next/link"

type Props = {
    slug: string
    brand: string
    name: string
    price: string
    image: string
}

export default function StoreProductCard({
    slug,
    brand,
    name,
    price,
    image
}: Props) {
    return (

        <Link href={`/perfume/${slug}`}>

            <div className="flex flex-col rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-primary/40 transition cursor-pointer">

                <div className="aspect-[3/4] relative bg-zinc-950">

                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain p-4"
                    />

                </div>

                <div className="p-3 space-y-1">

                    <p className="text-[10px] text-primary uppercase font-bold">
                        {brand}
                    </p>

                    <h3 className="text-sm font-semibold line-clamp-2">
                        {name}
                    </h3>

                    <p className="text-primary font-bold text-sm">
                        {price}
                    </p>

                </div>

            </div>

        </Link>

    )
}