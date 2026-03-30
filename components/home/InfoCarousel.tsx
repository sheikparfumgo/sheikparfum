"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type Slide = {
    title?: string
    subtitle?: string
    description?: string
    image: string
    href: string
    cta?: string
    overlay?: boolean
}

const slides: Slide[] = [
    {
        title: "Descubra perfumes que combinam com você",
        subtitle: "Teste olfativo",
        description: "Faça o teste e encontre fragrâncias ideais para seu estilo.",
        image: "/banners/teste-olfativo.png",
        href: "/teste",
        cta: "Fazer teste",
        overlay: true
    },
    {
        title: "Receba perfumes exclusivos todo mês",
        subtitle: "Clube do Sheik",
        description: "Assine o clube e explore novas fragrâncias todos os meses.",
        image: "/banners/clube-do-sheik.png",
        href: "/clube",
        cta: "Conhecer o clube",
        overlay: true
    },
    {
        title: "Experimente antes de comprar",
        subtitle: "Decants",
        description: "Teste perfumes exclusivos antes de investir no frasco.",
        image: "/banners/decants.png",
        href: "/decants",
        cta: "Explorar decants",
        overlay: true
    }
]

export default function HeroCarousel() {

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
    }, [emblaApi, onSelect])

    useEffect(() => {
        if (!emblaApi) return
        const autoplay = setInterval(() => emblaApi.scrollNext(), 6000)
        return () => clearInterval(autoplay)
    }, [emblaApi])

    return (
        <section className="mt-6">

            <div className="overflow-hidden rounded-2xl w-full" ref={emblaRef}>
                <div className="flex w-full max-w-full">

                    {slides.map((slide, i) => (
                        <Link
                            key={i}
                            href={slide.href}
                            className="relative flex-[0_0_100%] h-[180px] sm:h-[220px] md:h-[260px]"
                        >

                            <Image
                                src={slide.image}
                                alt={slide.title ?? slide.subtitle ?? "Banner Sheik Parfum"}
                                fill
                                priority={i === 0}
                                className="object-cover object-center md:object-[60%_center]"
                            />

                            {slide.overlay && (
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-4 sm:px-6 md:px-8 max-w-[85%] md:max-w-xl">

                                    {slide.subtitle && (
                                        <p className="text-[10px] sm:text-sm text-[#c9a34a] uppercase tracking-widest">
                                            {slide.subtitle}
                                        </p>
                                    )}

                                    {slide.title && (
                                        <h2 className="text-lg sm:text-2xl md:text-4xl font-bold text-white leading-tight">
                                            {slide.title}
                                        </h2>
                                    )}

                                    {slide.description && (
                                        <p className="text-gray-300 text-xs sm:text-sm md:text-base mt-1 md:mt-2">
                                            {slide.description}
                                        </p>
                                    )}

                                    {slide.cta && (
                                        <span className="mt-2 md:mt-4 bg-[#c9a34a] text-black font-bold text-xs sm:text-sm md:text-base px-4 md:px-5 py-2 rounded-xl w-fit hover:brightness-110 transition">
                                            {slide.cta}
                                        </span>
                                    )}

                                </div>
                            )}

                        </Link>
                    ))}

                </div>
            </div>

            {/* DOTS */}
            <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => emblaApi?.scrollTo(i)}
                        className={`h-2 rounded-full transition-all ${selectedIndex === i
                                ? "w-6 bg-[#c9a34a]"
                                : "w-2 bg-gray-600"
                            }`}
                    />
                ))}
            </div>

        </section>
    )
}