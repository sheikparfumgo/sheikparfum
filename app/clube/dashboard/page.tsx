"use client"

import { useState } from "react"
import PerfumeCard from "@/components/perfume/PerfumeCard"

type Plan = "explorador" | "connaisseur" | "sheikh"

type Perfume = {
    id: number
    name: string
    brand: string
    image: string
    hype?: boolean
    level?: number
}

export default function ClubeDashboard() {

    const userPlan: Plan = "connaisseur"

    const [chosenPerfume, setChosenPerfume] = useState<number | null>(null)

    const perfumes: Perfume[] = [
        {
            id: 1,
            name: "Layton",
            brand: "Parfums de Marly",
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539",
            hype: true
        },
        {
            id: 2,
            name: "Stronger With You",
            brand: "Armani",
            image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad"
        },
        {
            id: 3,
            name: "Le Male Le Parfum",
            brand: "Jean Paul Gaultier",
            image: "https://images.unsplash.com/photo-1619994403073-b7a4ba5fcccd"
        },
        {
            id: 4,
            name: "Eros Flame",
            brand: "Versace",
            image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
        },
        {
            id: 5,
            name: "The One",
            brand: "Dolce & Gabbana",
            image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
        }
    ]

    function canChoose(perfume: Perfume) {
        if (perfume.hype && userPlan !== "sheikh") {
            return false
        }
        return true
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10">

            {/* HEADER */}

            <div>

                <h1 className="text-3xl font-bold mb-1">
                    Clube do Sheik
                </h1>

                <p className="text-sm text-primary font-semibold">
                    Plano atual: {userPlan}
                </p>

                <p className="text-zinc-400 mt-1">
                    Perfumes do mês • Maio
                </p>

            </div>

            {/* STATUS */}

            <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#161617] space-y-3">

                {chosenPerfume === null ? (

                    <>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                            <p className="text-yellow-400 font-medium">
                                Escolha pendente
                            </p>
                        </div>

                        <p className="text-sm text-zinc-400">
                            Você pode escolher <span className="text-primary font-semibold">1 perfume</span> este mês.
                        </p>
                    </>

                ) : (

                    <>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full" />
                            <p className="text-green-400 font-medium">
                                Escolha confirmada
                            </p>
                        </div>

                        <p className="text-sm text-zinc-400">
                            Envio previsto em até 5 dias.
                        </p>
                    </>

                )}

            </div>

            {/* PERFUMES */}

            <div>

                <h2 className="text-xl font-bold mb-2">
                    Perfumes do mês
                </h2>

                <p className="text-sm text-zinc-400 mb-6">
                    Escolha <span className="text-primary font-semibold">sua fragrância</span> para experimentar este mês.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">

                    {perfumes.map((perfume) => {

                        const locked = !canChoose(perfume)

                        return (

                            <PerfumeCard
                                key={perfume.id}
                                name={perfume.name}
                                brand={perfume.brand}
                                image={perfume.image}
                                hype={perfume.hype}
                                locked={locked}
                                selected={chosenPerfume === perfume.id}
                                featured={perfume.id === 2}
                                actionLabel="Escolher"
                                onAction={() => setChosenPerfume(perfume.id)}
                            />

                        )

                    })}

                </div>

            </div>

            {/* PULAR MÊS */}

            <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#161617] space-y-3">

                <h2 className="text-lg font-semibold">
                    Pular mês
                </h2>

                <p className="text-sm text-zinc-400 leading-relaxed">

                    Caso você não queira escolher um perfume este mês, pode pular a escolha.

                    No mês seguinte você poderá escolher mais fragrâncias:

                </p>

                <ul className="text-sm text-zinc-400 list-disc ml-5 space-y-1">

                    <li>
                        Plano Connaisseur: até <span className="text-primary font-semibold">4 perfumes</span>
                    </li>

                    <li>
                        Plano Sheikh: até <span className="text-primary font-semibold">5 perfumes</span>
                    </li>

                    <li>
                        Não é permitido escolher mais de 1 unidade do mesmo perfume.
                    </li>

                </ul>

                <p className="text-xs text-zinc-500">

                    O objetivo do clube é conhecer novas fragrâncias e expandir sua coleção olfativa.

                </p>

                <button
                    className="
          mt-3
          bg-zinc-800
          border border-zinc-700
          text-sm
          px-4
          py-2
          rounded-lg
          hover:border-primary
          transition
          "
                >
                    Pular este mês
                </button>

            </div>

            {/* HISTÓRICO */}

            <div>

                <h2 className="text-xl font-bold mb-4">
                    Histórico
                </h2>

                <div className="border border-[#2a2a2a] rounded-xl p-6 bg-[#161617] space-y-1">

                    <p className="text-zinc-400 text-sm">
                        Março • Layton
                    </p>

                    <p className="text-zinc-400 text-sm">
                        Abril • Le Male Le Parfum
                    </p>

                </div>

            </div>

        </div>
    )
}