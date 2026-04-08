"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getPerfumesByIds } from "@/services/api"
import PerfumeCard from "@/components/perfume/PerfumeCard"
import { supabase } from "@/lib/supabase/client"
import {
    Bookmark, Heart, Wine, ArrowRight, ShoppingBag, Plus, X
} from "lucide-react"
import { useRouter } from "next/navigation"
import UserPerfumeCard from "@/components/perfume/UserPerfumeCard"

type UserPerfume = {
    id: string
    name: string
    brand: string
    image_url: string
    olfactive_family: string[]
    youtube_url?: string
    instagram_url?: string
}

export default function ListaPage() {
    const router = useRouter()
    const { user, favorites, loading: authLoading } = useAuth()

    const [tab, setTab] = useState<"favorites" | "collection">("favorites")

    const [perfumes, setPerfumes] = useState<any[]>([])
    const [collection, setCollection] = useState<UserPerfume[]>([])

    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const score = Math.min(100, collection.length * 10)

    const families = collection.flatMap((p) => p.olfactive_family || [])

    const mostUsed = families.reduce((acc: Record<string, number>, f: string) => {
        acc[f] = (acc[f] || 0) + 1
        return acc
    }, {})

    const topFamilies = Object.entries(mostUsed)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    const [form, setForm] = useState({
        name: "",
        brand: "",
        image_url: "",
        olfactive_family: [] as string[],
        occasions: [] as string[],
        intensity: "",
        personal_rating: 0
    })

    const [suggestions, setSuggestions] = useState([])

    async function handleSearch(value: string) {
        setForm({ ...form, name: value })

        if (value.length < 2) return

        const res = await fetch(`/api/perfumes/search?q=${value}`)
        const data = await res.json()
        setSuggestions(data)
    }

    async function handleUpload(e: any) {
        const file = e.target.files[0]
        if (!file) return

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { data, error } = await supabase
            .storage
            .from("user-perfumes")
            .upload(fileName, file)

        if (error) {
            console.error(error)
            return
        }

        const { data: urlData } = supabase
            .storage
            .from("user-perfumes")
            .getPublicUrl(fileName)

        setForm(prev => ({
            ...prev,
            image_url: urlData.publicUrl
        }))
    }

    async function loadFavorites() {
        if (favorites.length === 0) {
            setPerfumes([])
            return
        }
        const data = await getPerfumesByIds(favorites)
        setPerfumes(data)
    }

    async function loadCollection() {
        const res = await fetch("/api/user-collection")
        const data = await res.json()
        setCollection(data)
    }

    async function handleCreate() {
        await fetch("/api/user-collection", {
            method: "POST",
            body: JSON.stringify(form)
        })

        setOpenModal(false)
        setForm({
            name: "",
            brand: "",
            image_url: "",
            olfactive_family: [],
            occasions: [],
            intensity: "",
            personal_rating: 0
        })

        loadCollection()
    }

    useEffect(() => {
        if (!authLoading && user) {
            loadFavorites()
            loadCollection()
            setLoading(false)
        }
    }, [user, authLoading])

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-16 text-center">
                <h1 className="text-3xl text-white">Faça login para acessar seu arsenal</h1>
                <button
                    onClick={() => router.push("/login")}
                    className="mt-6 px-6 py-3 bg-[#c9a34a] text-black rounded-lg"
                >
                    Entrar
                </button>
            </div>
        )
    }

    return (
        <div className="
  max-w-[1400px] mx-auto py-8 px-4 space-y-10
  bg-gradient-to-b from-black to-[#0a0a0a]
">


            {/* HEADER */}
            <div className="
  flex flex-col gap-6 pb-6
  bg-[#0f0f0f]
  border border-zinc-800
  rounded-2xl
  p-6
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
">

                {/* TÍTULO */}
                <div>
                    <h1 className="text-4xl text-white font-bold">Seu Arsenal</h1>
                    <p className="text-zinc-500 text-sm max-w-md">
                        Organize sua coleção, descubra novas fragrâncias e construa um estilo único.
                    </p>

                    <p className="text-xs text-zinc-600 mt-2">
                        {collection.length} perfumes na sua coleção
                    </p>
                </div>
            </div>

            <div className="
  bg-gradient-to-r from-[#c9a34a]/10 to-transparent
  border border-[#c9a34a]/20
  rounded-2xl p-5
  flex flex-col gap-4
">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-xs text-[#c9a34a] uppercase font-semibold">
                            Seu perfil olfativo
                        </p>

                        <h3 className="text-white font-bold text-lg">
                            Seu estilo dominante
                        </h3>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-zinc-500">Score</p>
                        <p className="text-xl font-bold text-[#c9a34a]">
                            {score}%
                        </p>
                    </div>

                </div>

                {/* BARRA */}
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#c9a34a]"
                        style={{ width: `${score}%` }}
                    />
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2">

                    {topFamilies.map(([name]) => (
                        <span
                            key={name}
                            className="px-3 py-1 bg-zinc-800 text-xs rounded-full text-white"
                        >
                            {name}
                        </span>
                    ))}

                    <div className="mt-2 text-xs text-zinc-500">
                        Baseado nos perfumes que você adicionou
                    </div>

                </div>

            </div>
            {/* TABS */}
            <div className="
  flex gap-2
  bg-[#111]
  border border-zinc-800
  p-1 rounded-xl
  w-fit
">
                <button
                    onClick={() => setTab("favorites")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${tab === "favorites"
                        ? "bg-[#c9a34a] text-black"
                        : "text-zinc-400 hover:text-white transition"
                        }`}
                >
                    Lista de Desejos
                </button>

                <button
                    onClick={() => setTab("collection")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${tab === "collection"
                        ? "bg-[#c9a34a] text-black"
                        : "text-zinc-400"
                        }`}
                >
                    Minha Coleção
                </button>
            </div>

            {/* GRID */}
            <div className="
  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5
  bg-[#0f0f0f]
  border border-zinc-800
  rounded-2xl
  p-6
">

                {tab === "favorites" && (
                    perfumes.length === 0 ? (

                        <div className="
  col-span-full flex flex-col items-center justify-center
  py-20 text-center space-y-6
  bg-gradient-to-b from-[#111] to-[#0a0a0a]
  border border-zinc-800
  rounded-2xl
">

                            <div className="w-20 h-20 rounded-full bg-[#c9a34a]/10 flex items-center justify-center">
                                <Heart className="text-[#c9a34a]" size={32} />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-white">
                                    Sua lista ainda está vazia
                                </h2>

                                <p className="text-zinc-400 text-sm max-w-md">
                                    Descubra fragrâncias exclusivas e comece a montar seu arsenal pessoal.
                                </p>
                            </div>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => router.push("/loja")}
                                    className="flex items-center gap-2 px-5 py-3 bg-[#c9a34a] text-black rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition"
                                >
                                    <ShoppingBag size={18} />
                                    Explorar perfumes
                                </button>

                            </div>

                        </div>

                    ) : (

                        perfumes.map((p) => (
                            <PerfumeCard
                                key={p.perfume_id}
                                id={p.perfume_id}
                                name={p.perfume_name}
                                brand={p.brand}
                                image={p.image_main}
                                href={`/perfume/${p.slug}`}
                                youtube_url={p.youtube_url}
                                instagram_url={p.instagram_url}
                            />
                        ))

                    )
                )}

                {tab === "collection" && collection.length === 0 && (

                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-6">

                        <div className="w-20 h-20 rounded-full bg-[#c9a34a]/10 flex items-center justify-center">
                            <Wine className="text-[#c9a34a]" size={32} />
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            Sua coleção está vazia
                        </h2>

                        <p className="text-zinc-400 text-sm max-w-md">
                            Adicione perfumes que você já usa e desbloqueie recomendações personalizadas
                        </p>

                        <div className="flex gap-3">

                            <button
                                onClick={() => setOpenModal(true)}
                                className="
      flex items-center gap-2
      px-5 py-3
      bg-[#c9a34a]
      text-black
      rounded-xl
      font-bold
      hover:brightness-110
      transition
    "
                            >
                                <Plus size={16} />
                                Adicionar primeiro perfume
                            </button>

                        </div>

                    </div>

                )}

                {tab === "collection" && collection.length > 0 && (

                    collection.map((p: any) => (
                        <div key={p.id} className="min-w-[220px] max-w-[220px]">
                            <UserPerfumeCard
                                key={p.id}
                                perfume={p}
                                userId={user.id}
                                refresh={loadCollection}
                            />
                        </div>
                    ))

                )}

            </div>

            {/* BANNER QUIZ */}
            <div className="
  bg-gradient-to-r from-[#c9a34a]/15 via-[#c9a34a]/5 to-transparent
  border border-[#c9a34a]/20
  rounded-2xl p-6
  flex flex-col md:flex-row md:items-center md:justify-between gap-4
  shadow-[0_0_30px_rgba(201,163,74,0.08)]
">

                <div>
                    <p className="text-[#c9a34a] text-xs font-semibold uppercase">
                        Seu perfil olfativo
                    </p>

                    <h3 className="text-white font-bold text-lg">
                        Descubra fragrâncias que combinam com você
                    </h3>

                    <p className="text-zinc-400 text-sm">
                        Faça seu teste e receba recomendações personalizadas
                    </p>
                </div>

                <button
                    onClick={() => {
                        window.dispatchEvent(new Event("openQuiz"))
                    }}
                    className="px-5 py-3 bg-[#c9a34a] text-black rounded-xl font-bold hover:scale-[1.03] transition"
                >
                    Fazer meu teste
                </button>

            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="
  bg-gradient-to-b from-[#111] to-[#0a0a0a]
  border border-[#2a2a2a]
  rounded-2xl
  w-full max-w-lg p-6 space-y-5
  shadow-[0_20px_80px_rgba(0,0,0,0.9)]
">

                        {/* HEADER */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h2 className="text-white font-semibold text-lg">
                                    Adicionar à sua coleção
                                </h2>
                                <p className="text-xs text-zinc-500 max-w-xs">
                                    Registre perfumes que você já possui e melhore suas recomendações
                                </p>
                            </div>

                            <button
                                onClick={() => setOpenModal(false)}
                                className="p-2 rounded-lg hover:bg-zinc-800 transition"
                            >
                                <X className="text-zinc-400 hover:text-white" />
                            </button>
                        </div>

                        {/* IMAGE UPLOAD */}
                        <div className="space-y-2">

                            <label className="text-xs text-zinc-500">
                                Foto do perfume
                            </label>

                            <label className="cursor-pointer group">

                                <div className="
      w-full h-44 rounded-2xl
      border border-zinc-800
      bg-gradient-to-br from-zinc-900 to-zinc-800
      flex flex-col items-center justify-center
      gap-2
      hover:border-[#c9a34a]/40
      transition
      relative
      overflow-hidden
    ">

                                    {form.image_url ? (
                                        <img
                                            src={form.image_url}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-[#c9a34a]/10 flex items-center justify-center">
                                                📸
                                            </div>

                                            <span className="text-xs text-zinc-400">
                                                Tirar foto ou enviar imagem
                                            </span>
                                        </>
                                    )}

                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleUpload}
                                />

                            </label>

                        </div>

                        {/* INPUTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <input
                                placeholder="Nome do perfume"
                                className="input"
                                value={form.name}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {suggestions.length > 0 && (
                                <div className="bg-zinc-900 border border-zinc-800 rounded-lg mt-2 max-h-40 overflow-auto">

                                    {suggestions.map((s: any) => (
                                        <div
                                            key={s.perfume_name}
                                            onClick={() => {
                                                setForm({
                                                    ...form,
                                                    name: s.perfume_name,
                                                    brand: s.brand,
                                                    olfactive_family: s.olfactive_family?.split(",")
                                                })
                                                setSuggestions([])
                                            }}
                                            className="px-3 py-2 hover:bg-zinc-800 cursor-pointer text-sm"
                                        >
                                            {s.perfume_name} — {s.brand}
                                        </div>
                                    ))}

                                </div>
                            )}

                            <input
                                placeholder="Marca"
                                className="input"
                                value={form.brand}
                                onChange={e => setForm({ ...form, brand: e.target.value })}
                            />

                        </div>

                        {/* INTENSIDADE */}
                        <div className="space-y-2">
                            <label className="text-xs text-zinc-500">Intensidade</label>

                            <div className="flex gap-2">
                                {["leve", "moderado", "forte"].map(i => (
                                    <button
                                        key={i}
                                        onClick={() => setForm({ ...form, intensity: i })}
                                        className={`px-3 py-1 rounded-lg text-xs ${form.intensity === i
                                            ? "bg-[#c9a34a] text-black"
                                            : "bg-zinc-800 text-zinc-400"
                                            }`}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* BOTÃO */}
                        <div className="flex justify-end pt-2">

                            <button
                                onClick={handleCreate}
                                className="
      px-6 py-2.5
      bg-[#c9a34a]
      text-black
      rounded-xl
      font-semibold
      text-sm
      hover:brightness-110
      transition
    "
                            >
                                Salvar
                            </button>

                        </div>

                    </div>
                </div>
            )
            }
            {tab === "collection" && collection.length > 0 && (
                <button
                    onClick={() => setOpenModal(true)}
                    className="
fixed bottom-6 right-6 z-50
flex items-center gap-2
px-5 py-3
bg-gradient-to-r from-[#c9a34a] to-[#e6c26b]
text-black
rounded-full
shadow-[0_20px_60px_rgba(0,0,0,0.9)]
font-semibold
hover:scale-[1.05]
active:scale-[0.95]
transition-all
"
                >
                    <Plus size={18} />
                    Adicionar
                </button>
            )}
        </div >
    )
}