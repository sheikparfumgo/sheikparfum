"use client";

import { useState } from "react"

type Props = {
    brand: string | null
    setBrand: (value: string | null) => void

    hideOutOfStock: boolean
    setHideOutOfStock: React.Dispatch<React.SetStateAction<boolean>>

    profile: string | null
    setProfile: (value: string | null) => void
}

export default function StoreFilters({
    brand,
    setBrand,
    hideOutOfStock,
    setHideOutOfStock,
    profile,
    setProfile
}: Props) {

    const [open, setOpen] = useState(false)

    const brands = [
        "Lattafa",
        "Maison Alhambra",
        "Afnan",
        "Armaf",
        "Al Haramain",
        "Orientica",
        "Bharara",
        "French Avenue"
    ]

    const profiles = [
        "Doce",
        "Amadeirado",
        "Intenso",
        "Fresco"
    ]

    return (
        <>
            {/* 🔥 BOTÃO MOBILE */}
            <button
                onClick={() => setOpen(true)}
                className="
                    md:hidden
                    fixed bottom-6 right-6 z-40
                    bg-[#d4af37] text-black
                    px-4 py-3 rounded-full
                    shadow-lg
                    text-sm font-semibold
                "
            >
                Filtros
            </button>

            {/* 🔥 DRAWER MOBILE */}
            {open && (
                <div className="fixed inset-0 z-[999] md:hidden">

                    {/* OVERLAY */}
                    <div
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* SIDEBAR */}
                    <div className="
                        absolute right-0 top-0 h-full w-[85%] max-w-[320px]
                        bg-zinc-900
                        border-l border-zinc-800
                        p-4 overflow-y-auto
                        animate-slide-in
                    ">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-white">
                                Filtros
                            </h3>

                            <button
                                onClick={() => setOpen(false)}
                                className="text-zinc-400 text-sm"
                            >
                                Fechar
                            </button>
                        </div>

                        {/* CONTEÚDO */}
                        <div className="space-y-6">

                            {/* MARCAs */}
                            <div className="space-y-2">
                                <p className="text-xs text-zinc-500 uppercase">
                                    Marcas
                                </p>

                                <div className="space-y-1">
                                    <button
                                        onClick={() => setBrand(null)}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800"
                                    >
                                        Todas
                                    </button>

                                    {brands.map((b) => (
                                        <button
                                            key={b}
                                            onClick={() => setBrand(b)}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800"
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PERFIL */}
                            <div className="space-y-2">
                                <p className="text-xs text-zinc-500 uppercase">
                                    Perfil
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {profiles.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setProfile(p)}
                                            className="px-3 py-1.5 rounded-full text-xs bg-zinc-800 text-zinc-400"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* DISPONIBILIDADE */}
                            <div className="space-y-3">
                                <p className="text-xs text-zinc-500">
                                    Disponibilidade
                                </p>

                                <div
                                    onClick={() => setHideOutOfStock(prev => !prev)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <span className="text-sm text-zinc-300">
                                        Apenas disponíveis
                                    </span>

                                    <div className={`
                                        w-12 h-6 flex items-center rounded-full p-1 transition
                                        ${hideOutOfStock ? "bg-[#d4af37]" : "bg-zinc-700"}
                                    `}>
                                        <div className={`
                                            w-4 h-4 bg-white rounded-full transition
                                            ${hideOutOfStock ? "translate-x-6" : ""}
                                        `} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* 💻 DESKTOP NORMAL */}
            <aside className="
                hidden md:block
                space-y-6
                bg-zinc-900/60
                backdrop-blur-sm
                border border-zinc-800
                rounded-xl
                p-4
                h-fit
            ">

                {/* ================== DISPONIBILIDADE ================== */}
                <div className="mt-6 space-y-3">

                    <p className="text-xs text-zinc-500">
                        Disponibilidade
                    </p>

                    <div
                        onClick={() => setHideOutOfStock(prev => !prev)}
                        className="flex items-center justify-between cursor-pointer"
                    >

                        <span className="text-sm text-zinc-300">
                            Apenas disponíveis
                        </span>

                        {/* TOGGLE */}
                        <div
                            className={`
                w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300
                ${hideOutOfStock ? "bg-[#d4af37]" : "bg-zinc-700"}
            `}
                        >
                            <div
                                className={`
                    w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-300
                    ${hideOutOfStock ? "translate-x-6" : "translate-x-0"}
                `}
                            />
                        </div>

                    </div>

                    {/* LABEL DINÂMICO */}
                    <p className="text-[11px] text-zinc-500">
                        {hideOutOfStock
                            ? "Mostrando apenas perfumes disponíveis"
                            : "Incluindo perfumes esgotados"}
                    </p>

                </div>

                <h3 className="text-xs font-semibold text-zinc-500 uppercase">
                    Filtros
                </h3>

                {/* ================== MARCAS ================== */}
                <div className="space-y-2">

                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                        Marca
                    </p>

                    <div className="space-y-1">

                        <button
                            onClick={() => setBrand(null)}
                            className={`
                            w-full text-left px-3 py-2 rounded-lg text-sm transition
                            ${!brand
                                    ? "bg-zinc-800 text-white border border-zinc-700"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"}
                        `}
                        >
                            Todas
                        </button>

                        {brands.map((b) => {
                            const isActive = brand === b

                            return (
                                <button
                                    key={b}
                                    onClick={() => setBrand(b)}
                                    className={`
                                    w-full text-left px-3 py-2 rounded-lg text-sm transition
                                    ${isActive
                                            ? "bg-zinc-800 text-white border border-zinc-700"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"}
                                `}
                                >
                                    {b}
                                </button>
                            )
                        })}

                    </div>

                </div>

                {/* ================== PERFIL OLFATIVO ================== */}
                <div className="space-y-2 pt-4 border-t border-zinc-800">

                    <p className="text-xs text-zinc-500 uppercase tracking-wider">
                        Perfil
                    </p>

                    <div className="flex flex-wrap gap-2">

                        <button
                            onClick={() => setProfile(null)}
                            className={`
                            px-3 py-1.5 rounded-full text-xs transition
                            ${!profile
                                    ? "bg-[#d4af37] text-black"
                                    : "bg-zinc-800 text-zinc-400 hover:text-white"}
                        `}
                        >
                            Todos
                        </button>

                        {profiles.map((p) => {
                            const isActive = profile === p

                            return (
                                <button
                                    key={p}
                                    onClick={() => setProfile(p)}
                                    className={`
                                    px-3 py-1.5 rounded-full text-xs transition
                                    ${isActive
                                            ? "bg-[#d4af37] text-black"
                                            : "bg-zinc-800 text-zinc-400 hover:text-white"}
                                `}
                                >
                                    {p}
                                </button>
                            )
                        })}

                    </div>

                </div>
            </aside>
        </>
    )
}