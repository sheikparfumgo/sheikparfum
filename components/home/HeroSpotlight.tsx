import Image from "next/image"
import Link from "next/link"

export default function HeroSpotlight() {
    return (
        <section className="mt-4 md:mt-6">

            <div
                className="
        relative
        w-full
        h-[200px] sm:h-[240px] md:h-[420px]
        rounded-2xl
        overflow-hidden
        border border-[#413a2a]
        "
            >

                <Image
                    src="/banners/malek-hero.png"
                    alt="Malek Fantasy perfume oriental"
                    fill
                    priority
                    className="object-cover md:object-right object-center"
                />

                {/* Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                {/* Conteúdo */}
                <div
                    className="
          absolute
          inset-0
          flex
          flex-col
          justify-center
          px-4 sm:px-5 md:px-12
          max-w-[85%] sm:max-w-[70%] md:max-w-xl
          "
                >

                    <p className="text-[#c9a34a] text-[10px] md:text-xs uppercase tracking-widest font-bold">
                        Lançamento
                    </p>

                    <h2 className="text-white text-lg sm:text-2xl md:text-5xl font-bold leading-tight">
                        Malek Fantasy
                    </h2>

                    <p className="text-gray-300 mt-1 md:mt-2 text-xs sm:text-sm md:text-lg">
                        Perfume oriental intenso
                    </p>

                    <Link
                        href="/perfumes/malek"
                        className="
            mt-3 md:mt-6
            w-fit
            bg-[#c9a34a]
            text-black
            font-bold
            text-xs sm:text-sm md:text-base
            px-4 md:px-7
            py-2 md:py-3
            rounded-xl
            transition-all
            hover:brightness-110
            hover:scale-105
            "
                    >
                        Conhecer perfume
                    </Link>

                </div>

            </div>

        </section>
    )
}