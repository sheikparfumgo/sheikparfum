"use client"

import { useState, useEffect } from "react"
import ClubPerfumeCard from "@/components/club/ClubPerfumeCard"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

type Perfume = {
    id: string
    name: string
    image: string
    gender: string
}

export default function ClubeDashboard() {

    const [chosenPerfume, setChosenPerfume] = useState<string | null>(null)
    const [choosing, setChoosing] = useState(false)

    const [male, setMale] = useState<Perfume[]>([])
    const [female, setFemale] = useState<Perfume[]>([])
    const [loading, setLoading] = useState(true)

    const [tab, setTab] = useState<"male" | "female" | "suggestions">("male")
    const [selectedPerfume, setSelectedPerfume] = useState<string | null>(null)

    // 🔥 mês dinâmico bonito
    const monthLabel = new Date()
        .toLocaleDateString("pt-BR", { month: "long" })
        .replace(/^./, c => c.toUpperCase())

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)

                const {
                    data: { session }
                } = await supabase.auth.getSession()

                const res = await fetch("/api/club/monthly", {
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`
                    }
                })

                if (!res.ok) {
                    console.log("STATUS:", res.status)
                    toast.error("Erro ao carregar perfumes do clube")
                    return
                }

                const json = await res.json()

                if (!json.success) {
                    toast.error("Erro ao carregar perfumes do clube")
                    return
                }

                setMale(json.data.male || [])
                setFemale(json.data.female || [])

            } catch (err) {
                toast.error("Erro inesperado ao carregar perfumes")
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    async function handleChoose(perfumeId: string) {

        if (choosing) return
        setChoosing(true)

        const {
            data: { session }
        } = await supabase.auth.getSession()

        const res = await fetch("/api/club/choose", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.access_token}`
            },
            body: JSON.stringify({
                perfume_id: perfumeId
            })
        })

        let data: any = {}

        try {
            data = await res.json()
        } catch { }

        if (!res.ok) {
            toast.error(data.error || "Erro ao escolher perfume")
            setChoosing(false)
            return
        }

        toast.success("Escolha confirmada! 👑")

        setChosenPerfume(perfumeId)
        setSelectedPerfume(null)
        setChoosing(false)
    }

    function Grid({
        perfumes,
        chosenPerfume,
        handleChoose
    }: {
        perfumes: Perfume[]
        chosenPerfume: string | null
        handleChoose: (id: string) => void
    }) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
                {perfumes.map((perfume) => (
                    <ClubPerfumeCard
                        key={perfume.id}
                        id={perfume.id}
                        name={perfume.name}
                        image={perfume.image}
                        selected={
                            chosenPerfume === perfume.id ||
                            selectedPerfume === perfume.id
                        }
                        disabled={
                            !!chosenPerfume
                                ? perfume.id !== chosenPerfume
                                : !!selectedPerfume && selectedPerfume !== perfume.id
                        }
                        onSelect={() => {
                            if (chosenPerfume) return

                            if (selectedPerfume === perfume.id) {
                                setSelectedPerfume(null) // 🔥 DESMARCAR
                            } else {
                                setSelectedPerfume(perfume.id)
                            }
                        }}
                    />
                ))}
            </div>
        )
    }

    function SuggestionsTab() {
        const [suggestion, setSuggestion] = useState("")

        return (
            <div className="space-y-4 mt-4">

                <h3 className="text-lg font-semibold">
                    Sugira um perfume 👇
                </h3>

                <input
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Ex: Asad Lattafa"
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm"
                />

                <button className="
bg-transparent
border border-[#D4AF37]
text-[#D4AF37]
px-4 py-2
rounded-lg
text-sm font-semibold
hover:bg-[#D4AF37]/10
hover:shadow-[0_0_10px_rgba(212,175,55,0.3)]
transition
">
                    Enviar sugestão
                </button>

            </div >
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10">

            {/* HEADER */}

            <div>
                <h1 className="text-3xl font-bold mb-1">
                    Clube do Sheik
                </h1>

                <p className="text-zinc-400 mt-1">
                    Perfumes do mês • {monthLabel}
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
                <div className="flex gap-2 bg-[#1a1a1a] border border-[#2a2a2a] p-1 rounded-xl w-fit mb-6">
                    {[
                        { key: "male", label: "Masculino" },
                        { key: "female", label: "Feminino" },
                        { key: "suggestions", label: "Sugestões" }
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key as any)}
                            className={`
px-4 py-2 text-sm rounded-lg transition-all duration-200
${tab === t.key
                                    ? "border border-[#D4AF37] text-[#D4AF37] bg-[#111]"
                                    : "text-zinc-400 hover:text-white"}
`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                {/* LOADING */}
                {loading && (
                    <p className="text-zinc-400 text-sm">
                        Carregando perfumes...
                    </p>
                )}

                {/* EMPTY */}
                {!loading && male.length === 0 && female.length === 0 && (
                    <p className="text-zinc-500 text-sm">
                        Nenhum perfume disponível este mês.
                    </p>
                )}

                {tab === "male" && <Grid
                    perfumes={male}
                    chosenPerfume={chosenPerfume}
                    handleChoose={handleChoose}
                />}

                {tab === "female" && <Grid
                    perfumes={female}
                    chosenPerfume={chosenPerfume}
                    handleChoose={handleChoose}
                />}

                {tab === "suggestions" && <SuggestionsTab />}

                {selectedPerfume && !chosenPerfume && tab !== "suggestions" && (
                    <div className="mt-6 flex justify-center">

                        <button
                            disabled={choosing}
                            onClick={() => handleChoose(selectedPerfume)}
                            className="
    bg-transparent
    border border-[#D4AF37]
    text-[#D4AF37]
    px-6 py-3
    rounded-xl
    text-sm font-semibold
    hover:bg-[#D4AF37]/10
    transition
    disabled:opacity-50
"
                        >
                            {choosing ? "Confirmando..." : "Confirmar escolha"}
                        </button>

                    </div>
                )}
            </div>

        </div>
    )
}