"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getPerfumesByIds } from "@/services/api"
import PerfumeCard from "@/components/perfume/PerfumeCard"
import { 
    Bookmark, Heart, Wine, ArrowRight, Loader2, ShoppingBag
} from "lucide-react"
import { useRouter } from "next/navigation"

// ─── SKELETON CARD ───────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse">
            <div className="aspect-square bg-zinc-800" />
            <div className="p-3 space-y-2">
                <div className="h-2 bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                <div className="h-8 bg-zinc-800 rounded mt-4" />
            </div>
        </div>
    )
}

export default function ListaPage() {
    const router = useRouter()
    const { user, favorites, loading: authLoading } = useAuth()
    
    const [perfumes, setPerfumes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    async function loadFavorites() {
        if (favorites.length === 0) {
            setPerfumes([])
            setLoading(false)
            return
        }

        try {
            const data = await getPerfumesByIds(favorites)
            setPerfumes(data)
        } catch (error) {
            console.error("Erro ao carregar favoritos:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            loadFavorites()
        }
    }, [favorites, authLoading])

    // ─── LOADING STATE ────────────────────────────────────────
    if (authLoading) {
        return (
            <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 space-y-10">
                <div className="border-b border-zinc-800 pb-8 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-24 animate-pulse" />
                    <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        )
    }

    // ─── VISÃO DESLOGADA ──────────────────────────────────────
    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
                <div className="inline-flex p-5 rounded-3xl bg-[#c9a34a]/10 mb-4 border border-[#c9a34a]/20">
                    <Bookmark size={44} className="text-[#c9a34a]" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        Sua Coleção Particular
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed font-light">
                        A "Lista do Sheik" é onde você organiza seus desejos, perfumes favoritos e gerencia seu arsenal exclusivo.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <Feature 
                        icon={<Heart size={18} />} 
                        title="Desejados" 
                        desc="Salve as fragrâncias que você amou para compras futuras."
                    />
                    <Feature 
                        icon={<Wine size={18} />} 
                        title="Meu Closet" 
                        desc="Mantenha o controle do que já faz parte do seu arsenal."
                    />
                </div>
                <div className="pt-8 space-y-4">
                    <button 
                        onClick={() => router.push("/login")}
                        className="w-full h-14 bg-gradient-to-r from-[#d4af37] to-[#c9a34a] text-black font-bold rounded-xl flex items-center justify-center gap-2 group hover:scale-[1.02] transition-all shadow-lg shadow-[#c9a34a]/20"
                    >
                        Entrar ou Criar Conta
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-zinc-600">Acesso exclusivo para membros autenticados.</p>
                </div>
            </div>
        )
    }

    // ─── VISÃO LOGADA ─────────────────────────────────────────
    return (
        <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 space-y-10 animate-fade-in">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
                <div>
                    <h2 className="text-[#c9a34a] text-sm font-bold uppercase tracking-widest mb-1">Área do Usuário</h2>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Minha Coleção</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {favorites.length === 0 
                            ? "Seu arsenal particular de fragrâncias exclusivas."
                            : `${favorites.length} perfume${favorites.length !== 1 ? "s" : ""} salvo${favorites.length !== 1 ? "s" : ""} na sua coleção.`
                        }
                    </p>
                </div>

                <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                    <button className="px-6 py-2 rounded-lg text-xs font-bold bg-[#c9a34a] text-black transition-all">Favoritos</button>
                    <button className="px-6 py-2 rounded-lg text-xs font-bold text-zinc-500 hover:text-white transition-all">Minha Coleção</button>
                </div>
            </div>

            {/* LOADING SKELETON (após auth resolver) */}
            {loading && favorites.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {favorites.map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : perfumes.length === 0 ? (
                /* ESTADO VAZIO */
                <div className="py-24 text-center glass border-dashed bg-transparent">
                    <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                        <ShoppingBag className="text-zinc-600" size={32} />
                    </div>
                    <h3 className="text-white font-bold text-xl">Você ainda não adicionou perfumes à sua coleção</h3>
                    <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2 font-light">
                        Explore nossa loja, clique no ❤️ e salve suas fragrâncias favoritas aqui.
                    </p>
                    <button 
                        onClick={() => router.push("/loja")}
                        className="mt-8 px-10 py-3 bg-zinc-900 text-white border border-zinc-700 rounded-xl hover:border-[#c9a34a] hover:text-[#c9a34a] transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        Explorar Perfumes
                    </button>
                </div>
            ) : (
                /* GRID DE FAVORITOS */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {perfumes.map((perfume) => (
                        <div 
                            key={perfume.perfume_id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${perfumes.indexOf(perfume) * 50}ms` }}
                        >
                            <PerfumeCard
                                id={perfume.perfume_id}
                                name={perfume.perfume_name}
                                brand={perfume.brand}
                                image={perfume.image_main || (Array.isArray(perfume.images) ? perfume.images[0] : null) || "/placeholder.png"}
                                href={`/perfume/${perfume.slug}`}
                                hasStock={perfume.has_stock}
                            />
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

function Feature({ icon, title, desc }: any) {
    return (
        <div className="p-6 glass border-[#2a2a2a] hover:border-[#c9a34a]/30 transition-all group">
            <div className="text-[#c9a34a] mb-4 group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
            <p className="text-zinc-500 text-xs leading-relaxed font-light">{desc}</p>
        </div>
    )
}