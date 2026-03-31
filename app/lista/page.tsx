"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { 
    Bookmark, Heart, Wine, Search, 
    Lock, ArrowRight, Loader2, Info
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ListaPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState<any[]>([])

    useEffect(() => {
        async function checkUser() {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            setLoading(false)
        }
        checkUser()
    }, [])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#c9a34a]" size={32} />
            </div>
        )
    }

    // ---------------------------------------------------------
    // ❌ VISÃO DESLOGADA (EXPLICAÇÃO + LOGIN)
    // ---------------------------------------------------------
    if (!user) {
        return (
            <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8 animate-fade-in">
                
                <div className="inline-flex p-4 rounded-3xl bg-[#c9a34a]/10 mb-4">
                    <Bookmark size={40} className="text-[#c9a34a]" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                        Sua Coleção Particular
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        A "Lista do Sheik" é o lugar onde você organiza seus perfumes favoritos, gerencia o que já possui e planeja suas próximas fragrâncias exclusivas.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <Feature 
                        icon={<Heart size={18} />} 
                        title="Favoritos" 
                        desc="Salve as fragrâncias que você amou para não esquecer nunca."
                    />
                    <Feature 
                        icon={<Wine size={18} />} 
                        title="Meu Closet" 
                        desc="Gerencie os perfumes que você já tem em casa."
                    />
                </div>

                <div className="pt-8 space-y-4">
                    <button 
                        onClick={() => router.push("/login")}
                        className="w-full h-14 btn-primary flex items-center justify-center gap-2 group"
                    >
                        Entrar ou Criar Conta
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-zinc-600">
                        É necessário estar logado para acessar sua coleção personalizada.
                    </p>
                </div>

            </div>
        )
    }

    // ---------------------------------------------------------
    // ✅ VISÃO LOGADA (MINHA COLEÇÃO)
    // ---------------------------------------------------------
    return (
        <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 space-y-10 animate-fade-in">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Minha Coleção</h1>
                    <p className="text-zinc-500 text-sm">Gerencie seu arsenal de fragrâncias exclusivas.</p>
                </div>

                <div className="flex gap-2">
                    <Tab active>Todos</Tab>
                    <Tab>Coleção</Tab>
                    <Tab>Favoritos</Tab>
                </div>
            </div>

            {/* Empty State Logado (Temporário até termos a tabela de favoritos pronta) */}
            <div className="py-20 text-center glass border-dashed">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="text-zinc-500" size={24} />
                </div>
                <h3 className="text-white font-bold text-lg">Sua estante está vazia</h3>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">
                    Navegue pela loja e adicione perfumes à sua coleção ou favoritos.
                </p>
                <button 
                    onClick={() => router.push("/loja")}
                    className="mt-6 px-6 py-2 border border-[#c9a34a] text-[#c9a34a] rounded-lg hover:bg-[#c9a34a] hover:text-black transition-all text-sm font-bold"
                >
                    Ir para a Loja
                </button>
            </div>

        </div>
    )
}

function Feature({ icon, title, desc }: any) {
    return (
        <div className="p-5 glass border-[#2a2a2a] hover:border-[#c9a34a]/20 transition-all">
            <div className="text-[#c9a34a] mb-3">{icon}</div>
            <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
        </div>
    )
}

function Tab({ children, active = false }: any) {
    return (
        <button className={`
            px-5 py-2 rounded-full text-xs font-bold transition-all
            ${active 
                ? "bg-[#c9a34a] text-black" 
                : "bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800"
            }
        `}>
            {children}
        </button>
    )
}