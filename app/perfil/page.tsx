"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { 
    User, Package, MapPin, Heart, Crown, 
    Settings, LogOut, ChevronRight, Plus, 
    Loader2, ShoppingBag, CreditCard
} from "lucide-react"

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [addresses, setAddresses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    async function loadData() {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
            router.push("/login")
            return
        }

        const currentUser = session.user
        setUser(currentUser)

        // 📦 Buscar Pedidos
        const { data: oData } = await supabase
            .from("orders")
            .select("*")
            .eq("customer_email", currentUser.email)
            .order("created_at", { ascending: false })
        
        if (oData) setOrders(oData)

        // 🏠 Buscar Endereços
        const { data: aData } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("is_default", { ascending: false })
        
        if (aData) setAddresses(aData)

        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#c9a34a]" size={32} />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10 animate-fade-in">
            
            {/* 1. CABEÇALHO DO USUÁRIO */}
            <div className="flex items-center gap-6 p-8 glass border-[#c9a34a]/20">
                <div className="relative">
                    <img 
                        src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email} 
                        alt="Avatar" 
                        className="w-20 h-20 rounded-full border-2 border-[#c9a34a] shadow-[0_0_15px_rgba(201,163,74,0.3)]"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#c9a34a] p-1.5 rounded-full shadow-lg">
                        <Crown size={12} className="text-black" />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        {user?.user_metadata?.full_name || "Usuário Sheik"}
                    </h1>
                    <p className="text-zinc-400 text-sm">{user?.email}</p>
                    <div className="inline-flex mt-2 px-3 py-1 rounded-full bg-[#c9a34a]/10 border border-[#c9a34a]/20 text-[10px] uppercase font-bold text-[#c9a34a] tracking-wider">
                        Membro do Clube
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 2. MEUS PEDIDOS (Últimos 3) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Package size={20} className="text-[#c9a34a]" />
                            Meus Pedidos
                        </h2>
                        <button className="text-xs text-[#c9a34a] hover:underline">Ver todos</button>
                    </div>

                    <div className="space-y-3">
                        {orders.length === 0 ? (
                            <div className="p-6 glass border-dashed bg-transparent text-center">
                                <ShoppingBag className="mx-auto mb-2 text-zinc-500" size={24} />
                                <p className="text-sm text-zinc-500">Nenhum pedido realizado ainda.</p>
                            </div>
                        ) : (
                            orders.slice(0, 3).map((order) => (
                                <div key={order.id} className="p-4 glass hover:border-[#c9a34a]/40 transition-all flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Pedido #{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#c9a34a]">R$ {order.amount.toFixed(2)}</p>
                                        <span className={`text-[10px] uppercase font-bold ${
                                            order.status === 'paid' ? 'text-green-500' : 'text-zinc-500'
                                        }`}>
                                            {order.status === 'paid' ? 'Pago' : 'Pendente'}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-[#c9a34a] ml-2" />
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 3. ENDEREÇOS */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <MapPin size={20} className="text-[#c9a34a]" />
                            Endereços
                        </h2>
                        <button className="flex items-center gap-1 text-xs text-[#c9a34a] hover:underline">
                            <Plus size={12} />
                            Novo
                        </button>
                    </div>

                    <div className="space-y-3">
                        {addresses.length === 0 ? (
                            <div className="p-6 glass border-dashed bg-transparent text-center">
                                <MapPin className="mx-auto mb-2 text-zinc-500" size={24} />
                                <p className="text-sm text-zinc-500">Nenhum endereço cadastrado.</p>
                            </div>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr.id} className="p-4 glass flex items-start gap-3 relative overflow-hidden group">
                                    {addr.is_default && (
                                        <div className="absolute top-0 right-0 bg-[#c9a34a] text-black text-[8px] font-bold px-2 py-0.5 rounded-bl">
                                            PADRÃO
                                        </div>
                                    )}
                                    <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{addr.name}</p>
                                        <p className="text-xs text-zinc-400 line-clamp-1">
                                            {addr.street}, {addr.number} - {addr.city}
                                        </p>
                                    </div>
                                    <button className="text-[10px] text-zinc-500 hover:text-white mt-1">Editar</button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>

            {/* 4. ATALHOS RÁPIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <button 
                    onClick={() => router.push("/lista")}
                    className="flex flex-col items-center gap-2 p-6 glass hover:border-[#c9a34a]/60 group transition-all"
                >
                    <div className="p-3 rounded-2xl bg-zinc-900 group-hover:bg-[#c9a34a]/10 transition-colors">
                        <Heart className="text-[#c9a34a]" size={24} />
                    </div>
                    <span className="text-sm font-bold">Minha Coleção</span>
                    <span className="text-[10px] text-zinc-500">Ver perfumes salvos</span>
                </button>

                <button 
                    onClick={() => router.push("/clube")}
                    className="flex flex-col items-center gap-2 p-6 glass border-[#c9a34a]/30 hover:border-[#c9a34a]/60 group transition-all"
                >
                    <div className="p-3 rounded-2xl bg-[#c9a34a]/10 group-hover:bg-[#c9a34a]/20 transition-colors">
                        <Crown className="text-[#c9a34a]" size={24} />
                    </div>
                    <span className="text-sm font-bold">Clube Sheik</span>
                    <span className="text-[10px] text-zinc-500 text-green-500 font-semibold">Assinar agora</span>
                </button>

                <button className="flex flex-col items-center gap-2 p-6 glass hover:border-zinc-600 group transition-all opacity-50 cursor-not-allowed">
                    <div className="p-3 rounded-2xl bg-zinc-900">
                        <Settings className="text-zinc-500" size={24} />
                    </div>
                    <span className="text-sm font-bold text-zinc-400">Configurações</span>
                    <span className="text-[10px] text-zinc-600">Em breve</span>
                </button>

            </div>

            {/* 5. LOGOUT */}
            <div className="pt-6 border-t border-zinc-800 flex justify-center">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm uppercase tracking-widest"
                >
                    <LogOut size={16} />
                    Sair da conta
                </button>
            </div>

        </div>
    )
}
