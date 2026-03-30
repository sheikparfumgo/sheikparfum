"use client"

import { useState, useEffect, useRef } from "react"

const icons: Record<string, string> = {
    // Especiarias
    "Cardamomo": "✦",
    "Pimenta Rosa": "✦",
    "Pimenta": "✦",
    "Especiarias": "✦",
    "Canela": "✦",
    "Noz-moscada": "✦",
    "Cravo": "✦",

    // Amadeirados
    "Oud": "◆",
    "Sândalo": "◆",
    "Vetiver": "◆",
    "Cedro": "◆",
    "Patchouli": "◆",
    "Madeira": "◆",
    "Madeiras": "◆",
    "Madeira clara": "◆",

    // Doces / Gourmand
    "Baunilha": "✦",
    "Tonka": "✦",
    "Âmbar": "◆",
    "Resinas": "◆",
    "Caramelo": "✦",
    "Chocolate": "✦",
    "Mel": "✦",
    "Açúcar": "✦",
    "Coco": "✦",
    "Café": "✦",

    // Cítricos
    "Bergamota": "✧",
    "Limão": "✧",
    "Laranja": "✧",
    "Tangerina": "✧",
    "Grapefruit": "✧",
    "Cítrico": "✧",

    // Florais
    "Rosa": "❀",
    "Jasmim": "❀",
    "Flor de Laranjeira": "❀",
    "Ylang-Ylang": "❀",
    "Lírio": "❀",

    // Verdes / Aromáticos
    "Lavanda": "✧",
    "Notas verdes": "✧",
    "Hortelã": "✧",
    "Alecrim": "✧",
    "Manjericão": "✧",

    // Aquáticos
    "Notas aquáticas": "✧",
    "Aquático": "✧",
    "Marinho": "✧",

    // Musk / Limpo
    "Almíscar": "●",
    "Musk branco": "●",
    "Sabão": "●",

    // Extras
    "Couro": "◆",
    "Fumaça": "◆",
    "Incenso": "◆",
    "Frutas vermelhas": "✦"
}

const descriptions: Record<string, string> = {
    // Especiarias
    "Cardamomo": "Especiaria fresca e sofisticada, com leve toque aromático e elegante.",
    "Pimenta Rosa": "Picante suave e refinada, trazendo leve calor e modernidade.",
    "Pimenta": "Especiada e levemente picante, adiciona intensidade.",
    "Especiarias": "Acorde quente e envolvente, trazendo profundidade.",
    "Canela": "Quente e doce, com sensação aconchegante.",
    "Noz-moscada": "Especiada e levemente adocicada, sofisticada.",
    "Cravo": "Intenso e quente, com personalidade marcante.",

    // Amadeirados
    "Oud": "Madeira nobre, intensa e profunda, com assinatura luxuosa.",
    "Sândalo": "Amadeirado cremoso e elegante.",
    "Vetiver": "Terroso e seco, com frescor sofisticado.",
    "Cedro": "Seco e elegante, com sensação limpa.",
    "Patchouli": "Terroso e intenso, com profundidade marcante.",
    "Madeira": "Base que traz estrutura e sofisticação.",
    "Madeiras": "Acorde amadeirado que traz elegância.",
    "Madeira clara": "Amadeirado leve e limpo.",

    // Doces
    "Baunilha": "Doçura cremosa e envolvente.",
    "Tonka": "Doce com nuances abaunilhadas.",
    "Âmbar": "Quente e resinoso, com profundidade.",
    "Resinas": "Densas e envolventes.",
    "Caramelo": "Doce e quente, extremamente envolvente.",
    "Chocolate": "Intenso e indulgente.",
    "Mel": "Doce natural e rico.",
    "Açúcar": "Doçura leve e jovial.",
    "Coco": "Cremoso e tropical.",
    "Café": "Aromático e envolvente.",

    // Cítricos
    "Bergamota": "Fresca e luminosa.",
    "Limão": "Ácido e extremamente refrescante.",
    "Laranja": "Cítrica e levemente doce.",
    "Tangerina": "Doce e suculenta.",
    "Grapefruit": "Cítrico com leve amargor sofisticado.",
    "Cítrico": "Fresco e vibrante.",

    // Florais
    "Rosa": "Elegante e clássica.",
    "Jasmim": "Floral intenso e sensual.",
    "Flor de Laranjeira": "Floral fresco e luminoso.",
    "Ylang-Ylang": "Exótico e cremoso.",
    "Lírio": "Floral limpo e delicado.",

    // Verdes
    "Lavanda": "Aromática e limpa.",
    "Notas verdes": "Remetem à natureza fresca.",
    "Hortelã": "Refrescante e energizante.",
    "Alecrim": "Herbal e elegante.",
    "Manjericão": "Verde e levemente picante.",

    // Aquáticos
    "Notas aquáticas": "Sensação leve e translúcida.",
    "Aquático": "Fresco e limpo.",
    "Marinho": "Remete à brisa do mar.",

    // Limpo
    "Almíscar": "Limpo e suave.",
    "Musk branco": "Sensação de pele limpa.",
    "Sabão": "Limpeza pura.",

    // Extras
    "Couro": "Intenso e sofisticado.",
    "Fumaça": "Denso e misterioso.",
    "Incenso": "Resinoso e profundo.",
    "Frutas vermelhas": "Doces e levemente ácidas."
}

const category: Record<string, string> = {
    // Especiarias
    "Cardamomo": "Especiado",
    "Pimenta Rosa": "Especiado",
    "Pimenta": "Especiado",
    "Canela": "Especiado",
    "Cravo": "Especiado",
    "Noz-moscada": "Especiado",

    // Amadeirados
    "Oud": "Amadeirado",
    "Sândalo": "Amadeirado",
    "Vetiver": "Amadeirado",
    "Cedro": "Amadeirado",
    "Patchouli": "Amadeirado",

    // Doces
    "Baunilha": "Gourmand",
    "Tonka": "Gourmand",
    "Caramelo": "Gourmand",
    "Chocolate": "Gourmand",
    "Mel": "Gourmand",
    "Coco": "Gourmand",
    "Café": "Gourmand",

    // Cítricos
    "Limão": "Cítrico",
    "Laranja": "Cítrico",
    "Tangerina": "Cítrico",
    "Grapefruit": "Cítrico",
    "Bergamota": "Cítrico",

    // Florais
    "Rosa": "Floral",
    "Jasmim": "Floral",
    "Ylang-Ylang": "Floral",
    "Flor de Laranjeira": "Floral",
    "Lírio": "Floral",

    // Verdes
    "Lavanda": "Aromático",
    "Hortelã": "Aromático",
    "Alecrim": "Aromático",
    "Manjericão": "Aromático",

    // Aquáticos
    "Notas aquáticas": "Aquático",
    "Marinho": "Aquático",

    // Limpo
    "Almíscar": "Musk",
    "Musk branco": "Musk",

    // Extras
    "Couro": "Couro",
    "Incenso": "Resinoso",
    "Fumaça": "Resinoso"
}

type Props = {
    top: string[]
    heart: string[]
    base: string[]
}

export default function FragrancePyramid({ top, heart, base }: Props) {

    const [activeNote, setActiveNote] = useState<string | null>(null)
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [hoveredNote, setHoveredNote] = useState<string | null>(null)

    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasAnimated(true)
        }, 800)

        return () => clearTimeout(timer)
    }, [])
    // Detecta mobile
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()

        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    // Fecha ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setActiveNote(null)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const Bubble = ({
        note
    }: {
        note: string
    }) => {

        const isOpen = isMobile
            ? activeNote === note
            : hoveredNote === note

        return (
            <div
                className="relative inline-block"
                data-mobile={isMobile}
                onMouseEnter={() => {
                    if (!isMobile) setHoveredNote(note)
                }}
                onMouseLeave={() => {
                    if (!isMobile) setHoveredNote(null)
                }}
            >

                {/* BOTÃO */}
                <div
                    onClick={() => {
                        if (!isMobile) return
                        setActiveNote(isOpen ? null : note)
                    }}
                    className="
                    flex items-center gap-2
                    px-4 py-2
                    rounded-full
                    border border-[#d4af37]/10
                    bg-white/[0.02]
                    text-sm text-zinc-300
                    hover:border-[#d4af37]/40
                    hover:text-white
                    hover:bg-[#d4af37]/10
                    transition-all duration-300
                    cursor-pointer
                "
                >
                    <span className="text-[10px] text-[#d4af37]/70">
                        {icons[note] ?? "✦"}
                    </span>

                    {note}
                </div>

                {/* TOOLTIP */}
                <div
                    onMouseEnter={() => {
                        if (!isMobile) setHoveredNote(note)
                    }}
                    onMouseLeave={() => {
                        if (!isMobile) setHoveredNote(null)
                    }}
                    className={`
                    absolute left-0 bottom-full mb-3
                    w-[220px] max-w-[85vw]
                    px-4 py-3 rounded-xl
                    bg-[#0b0b0c]
                    border border-[#d4af37]/30
                    shadow-2xl shadow-black/80
                    text-xs leading-relaxed
                    transition-all duration-200
                    z-50

                    ${isOpen
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                        }
                `}
                >
                    <p className="text-[11px] text-[#d4af37] font-semibold mb-1">
                        {note}
                    </p>

                    <p className="text-[13px] text-white/90 leading-snug">
                        {descriptions[note] || "Nota olfativa da fragrância."}
                    </p>
                </div>

            </div>
        )
    }

    const Section = ({
        title,
        notes,
        delay
    }: {
        title: string
        notes: string[]
        delay: number
    }) => (
        <div
            className={`
            space-y-3
            transition-all duration-500
            ${!hasAnimated ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
        `}
            style={{
                transitionDelay: `${delay}ms`
            }}
        >
            <p className="text-[11px] uppercase text-zinc-500 tracking-[0.2em]">
                {title}
            </p>

            <div className="flex flex-wrap gap-3">
                {notes?.map(note => (
                    <Bubble key={note} note={note} />
                ))}
            </div>
        </div>
    )

    return (
        <div ref={containerRef} className="space-y-8 max-w-[600px]">

            <Section title="Notas de topo" notes={top} delay={0} />
            <Section title="Notas de coração" notes={heart} delay={200} />
            <Section title="Notas de fundo" notes={base} delay={400} />

            <style jsx>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>

        </div>
    )
}