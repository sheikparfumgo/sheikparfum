"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import NotifyModal from "@/components/ui/NotifyModal"

type Product = {
    size_ml: number
    price: number | string | null
    in_stock: boolean
}

type PerfumeCardProps = {
    name: string
    brand: string
    image: string
    images?: string[]
    href?: string
    tags?: string[]
    products?: Product[]
    hasStock?: boolean

    hype?: boolean
    locked?: boolean
    selected?: boolean
    featured?: boolean
    actionLabel?: string
    onAction?: () => void
}

export default function PerfumeCard({
    name,
    brand,
    image,
    images = [],
    tags = [],
    href,
    products = [],
    hasStock = true,
}: PerfumeCardProps) {

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [showNotify, setShowNotify] = useState(false)
    const [selectedSize, setSelectedSize] = useState<number | null>(null)
    const [added, setAdded] = useState(false)

    const sizes = [5, 10, 100]

    const allImages =
        images.length > 0 ? images : [image].filter(Boolean)

    useEffect(() => {
        if (!isHovered || allImages.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === allImages.length - 1 ? 0 : prev + 1
            )
        }, 1200)

        return () => clearInterval(interval)
    }, [isHovered, allImages])

    useEffect(() => {
        if (!isHovered) setCurrentIndex(0)
    }, [isHovered])

    const getProduct = (size: number) =>
        products.find(p => Number(p.size_ml) === size)

    const selectedProduct = selectedSize
        ? getProduct(selectedSize)
        : getProduct(100)

    const price =
        selectedProduct?.price !== null
            ? Number(selectedProduct?.price)
            : null

    function handleBuy(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        if (!selectedProduct) return

        setAdded(true)

        console.log("comprar", {
            perfume: name,
            size: selectedProduct.size_ml
        })

        setTimeout(() => {
            setAdded(false)
        }, 1500)
    }

    const card = (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="
                group flex flex-col h-full
                rounded-xl overflow-hidden bg-zinc-900
                border border-zinc-800
                transition-all duration-300 hover:scale-[1.02]
                hover:border-[#d4af37]/40
            "
        >

            {/* IMAGE */}
            <div className="aspect-square relative bg-zinc-950 overflow-hidden">

                <Image
                    src={allImages[currentIndex] || "/placeholder.png"}
                    alt={name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                />

                {!hasStock && (
                    <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center text-xs text-white">
                        Esgotado
                    </div>
                )}

                {/* TAMANHOS */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-30">
                    {sizes.map(size => {
                        const p = getProduct(size)
                        const active = selectedSize === size

                        return (
                            <button
                                key={size}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setSelectedSize(size)
                                }}
                                className={`
                                    text-[10px] px-2 py-1 rounded-md min-w-[52px]
                                    transition
                                    ${active
                                        ? "bg-[#d4af37] text-black"
                                        : p?.in_stock
                                            ? "bg-[#d4af37]/20 text-[#d4af37]"
                                            : "bg-zinc-800 text-zinc-500"}
                                `}
                            >
                                {size}ml
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* INFO */}
            <div className="p-3 flex flex-col flex-1 justify-between">

                <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500 uppercase">
                        {brand}
                    </p>

                    <p className="text-sm font-semibold text-white line-clamp-2">
                        {name}
                    </p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* PREÇO + CTA */}
                <div className="mt-3 space-y-2">

                    {price ? (
                        <>
                            <p className="text-xs text-zinc-500">
                                {selectedProduct?.size_ml}ml
                            </p>

                            <p className={`
            text-lg font-bold
            ${!selectedProduct?.in_stock
                                    ? "line-through text-zinc-500"
                                    : "text-white"}
        `}>
                                R$ {price.toFixed(2)}
                            </p>

                            {selectedProduct?.in_stock && (
                                <>
                                    <p className="text-xs text-green-400">
                                        R$ {(price * 0.9).toFixed(2)} à vista
                                    </p>

                                    <p className="text-xs text-zinc-400">
                                        ou 3x de R$ {(price / 3).toFixed(2)}
                                    </p>
                                </>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-zinc-500">
                            —
                        </p>
                    )}

                    {selectedProduct?.in_stock ? (
                        <button
                            onClick={handleBuy}
                            className={`
                                w-full py-2.5 rounded-lg text-sm font-bold
                                transition-all duration-300
                                relative z-50

                                ${added
                                    ? "bg-green-500 text-black"
                                    : "bg-gradient-to-r from-[#d4af37] to-[#c9a34a] text-black hover:scale-[1.03]"
                                }
                            `}
                        >
                            {added
                                ? "✓ Adicionado"
                                : `Comprar • ${selectedProduct.size_ml}ml`}
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowNotify(true)
                            }}
                            className="
                                w-full py-2.5 rounded-lg text-sm font-bold
                                bg-zinc-800 text-zinc-300 border border-zinc-700
                                hover:bg-zinc-700
                                transition
                                relative z-50
                            "
                        >
                            Avise-me quando chegar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <>
            {href ? <Link href={href}>{card}</Link> : card}

            <NotifyModal
                open={showNotify}
                perfumeName={name}
                onClose={() => setShowNotify(false)}
            />
        </>
    )
}