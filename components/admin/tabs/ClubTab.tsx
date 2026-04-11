"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

type Perfume = {
    id: string
    perfume_name: string
    image_main: string
    gender: string
}

export default function ClubTab() {

    const [perfumes, setPerfumes] = useState<Perfume[]>([])
    const [searchMap, setSearchMap] = useState<Record<string, string>>({})
    const [openIndex, setOpenIndex] = useState<string | null>(null)

    const [male, setMale] = useState<(Perfume | null)[]>(Array(5).fill(null))
    const [female, setFemale] = useState<(Perfume | null)[]>(Array(5).fill(null))
    const [history, setHistory] = useState<any>({})

    const [tab, setTab] = useState<"atual" | "historico">("atual")

    useEffect(() => {
        async function loadHistory() {
            const res = await fetch("/api/admin/club/history")
            const json = await res.json()

            if (!json.success) return

            setHistory(json.data)
        }

        loadHistory()
    }, [])

    useEffect(() => {
        async function loadMonth() {

            const res = await fetch("/api/admin/club/monthly")
            const json = await res.json()

            if (!json.success) return

            const maleData = json.data.filter((p: any) => p.gender === "male")
            const femaleData = json.data.filter((p: any) => p.gender === "female")

            const maleArr = Array(5).fill(null)
            const femaleArr = Array(5).fill(null)

            maleData.forEach((p: any) => {
                maleArr[p.position - 1] = {
                    id: p.perfumes.id,
                    perfume_name: p.perfumes.name,
                    image_main: p.perfumes.image_main,
                    gender: p.perfumes.gender
                }
            })

            femaleData.forEach((p: any) => {
                femaleArr[p.position - 1] = {
                    id: p.perfumes.id,
                    perfume_name: p.perfumes.name,
                    image_main: p.perfumes.image_main,
                    gender: p.perfumes.gender
                }
            })

            setMale(maleArr)
            setFemale(femaleArr)
        }

        loadMonth()
    }, [])
    // 🔥 LOAD CORRETO
    useEffect(() => {
        async function load() {
            const res = await fetch("/api/admin/perfumes")
            const json = await res.json()

            if (!json.success) return

            setPerfumes(json.data)
        }

        load()
    }, [])

    function alreadySelected(id: string) {
        return [...male, ...female].some(p => p?.id === id)
    }

    function selectPerfume(p: Perfume, index: number, type: "male" | "female") {

        if (alreadySelected(p.id)) {
            toast.error("Perfume já selecionado")
            return
        }

        if (type === "male") {
            const updated = [...male]
            updated[index] = p
            setMale(updated)
        }

        if (type === "female") {
            const updated = [...female]
            updated[index] = p
            setFemale(updated)
        }

        const slotId = `${type}-${index}`

        setOpenIndex(null)

        setSearchMap(prev => ({
            ...prev,
            [slotId]: ""
        }))
    }

    async function save() {

        if (male.some(p => !p) || female.some(p => !p)) {
            toast.error("Preencha todos os 10 perfumes")
            return
        }

        const {
            data: { session }
        } = await supabase.auth.getSession()

        if (!session) {
            toast.error("Usuário não autenticado")
            return
        }

        const res = await fetch("/api/admin/club/monthly", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                male: male.map(p => p!.id),
                female: female.map(p => p!.id)
            })
        })

        const text = await res.text()

        let data: any = {}

        try {
            data = text ? JSON.parse(text) : {}
        } catch {
            toast.error("Resposta inválida da API")
            return
        }

        if (!res.ok) {
            toast.error(data.error || "Erro ao salvar")
            return
        }

        toast.success("Clube atualizado com sucesso 👑")
    }

    function renderSlot(item: Perfume | null, index: number, type: "male" | "female") {

        const id = `${type}-${index}`
        const currentSearch = searchMap[id] || ""

        const filtered = perfumes.filter(p => {

            const matchName = p.perfume_name
                ?.toLowerCase()
                .includes(currentSearch.toLowerCase())

            const isAllowed =
                type === "male"
                    ? p.gender === "male" || p.gender === "unisex"
                    : p.gender === "female" || p.gender === "unisex"

            return matchName && isAllowed
        })

        return (
            <div className="relative">

                <p className="text-xs text-zinc-500 mb-1">
                    Perfume {index + 1}
                </p>

                {/* SLOT */}
                <div
                    onClick={() => setOpenIndex(id)}
                    className={`
                        border rounded-xl p-3 cursor-pointer transition
                        ${item ? "border-[#d4af37]" : "border-zinc-800"}
                        hover:border-[#d4af37]
                    `}
                >
                    {item ? (
                        <div className="flex items-center gap-2">
                            <img
                                src={item.image_main || "/placeholder.png"}
                                className="w-10 h-10 rounded"
                            />
                            <span className="text-sm font-medium">
                                {item.perfume_name}
                            </span>
                        </div>
                    ) : (
                        <span className="text-zinc-500 text-sm">
                            Selecionar
                        </span>
                    )}
                </div>

                {/* DROPDOWN */}
                {openIndex === id && (
                    <div className="absolute z-50 bg-zinc-900 border border-zinc-800 mt-2 w-full rounded-xl p-2 max-h-64 overflow-y-auto shadow-xl">

                        <input
                            placeholder="Buscar perfume..."
                            value={searchMap[id] || ""}
                            onChange={(e) =>
                                setSearchMap(prev => ({
                                    ...prev,
                                    [id]: e.target.value
                                }))
                            }
                            className="w-full mb-2 px-3 py-2 bg-zinc-800 rounded text-sm outline-none"
                        />

                        {filtered.map(p => (
                            <div
                                key={p.id}
                                onClick={() => selectPerfume(p, index, type)}
                                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded cursor-pointer"
                            >
                                <img
                                    src={p.image_main || "/placeholder.png"}
                                    className="w-8 h-8 rounded"
                                />
                                <span className="text-sm">
                                    {p.perfume_name}
                                </span>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        )
    }

    return (
        <div className="space-y-10">

            <h2 className="text-xl font-semibold">
                Configuração do Clube 👑
            </h2>

            <div className="mt-4 space-y-6">

                {/* TABS */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab("atual")}
                        className={`
                px-4 py-2 rounded-lg text-sm transition
                ${tab === "atual"
                                ? "bg-[#d4af37] text-black"
                                : "bg-zinc-800 text-zinc-300"}
            `}
                    >
                        Atual
                    </button>

                    <button
                        onClick={() => setTab("historico")}
                        className={`
                px-4 py-2 rounded-lg text-sm transition
                ${tab === "historico"
                                ? "bg-[#d4af37] text-black"
                                : "bg-zinc-800 text-zinc-300"}
            `}
                    >
                        Histórico
                    </button>
                </div>

                {/* CONTEÚDO */}
                {tab === "atual" && (
                    <>
                        {/* MASCULINO */}
                        <div>
                            <h3 className="mb-3 text-zinc-300">Masculinos</h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {male.map((item, i) => (
                                    <div key={`male-${i}`}>
                                        {renderSlot(item, i, "male")}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FEMININO */}
                        <div>
                            <h3 className="mb-3 text-zinc-300">Femininos</h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {female.map((item, i) => (
                                    <div key={`female-${i}`}>
                                        {renderSlot(item, i, "female")}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BOTÃO CENTRALIZADO */}
                        <div className="flex justify-end">
                            <button
                                onClick={save}
                                className="
                        bg-[#d4af37]
                        text-black
                        px-6 py-3
                        rounded-xl
                        font-semibold
                        hover:scale-[1.02]
                        transition
                    "
                            >
                                Salvar configuração do mês
                            </button>
                        </div>
                    </>
                )}

                {tab === "historico" && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Histórico do Clube
                        </h3>

                        {Object.entries(history).map(([month, perfumes]: any) => (
                            <div key={month} className="mb-6">

                                <p className="text-sm text-zinc-400 mb-2">
                                    {new Date(month)
                                        .toLocaleDateString("pt-BR", {
                                            month: "long",
                                            year: "numeric"
                                        })
                                        .replace(/^./, (c) => c.toUpperCase())
                                    }
                                </p>

                                <div className="space-y-6">

                                    {/* 🔹 MASCULINOS */}
                                    <div>
                                        <h4 className="text-sm text-zinc-400 mb-3">
                                            Perfumes Masculinos
                                        </h4>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {perfumes.male.map((p: any, i: number) => (
                                                <div
                                                    key={`m-${i}`}
                                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"
                                                >
                                                    <img
                                                        src={p.image || "/placeholder.png"}
                                                        className="w-full h-24 object-cover rounded mb-2"
                                                    />
                                                    <p className="text-xs">{p.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 🔸 FEMININOS */}
                                    <div>
                                        <h4 className="text-sm text-zinc-400 mb-3">
                                            Perfumes Femininos
                                        </h4>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {perfumes.female.map((p: any, i: number) => (
                                                <div
                                                    key={`f-${i}`}
                                                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2"
                                                >
                                                    <img
                                                        src={p.image || "/placeholder.png"}
                                                        className="w-full h-24 object-cover rounded mb-2"
                                                    />
                                                    <p className="text-xs">{p.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}
