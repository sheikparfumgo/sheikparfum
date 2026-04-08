"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import {
    User, Package, MapPin, Heart, Crown,
    Settings, LogOut, ChevronRight, Plus,
    Loader2, ShoppingBag, CreditCard, Camera, Trash2,
    CheckCircle2, Save, ExternalLink, Star, Pencil
} from "lucide-react"
import AddressModal from "@/components/profile/AddressModal"

type OrderItem = {
    name?: string
    quantity?: number
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    paid: { label: "Pago", color: "bg-green-500/10 text-green-400" },
    shipped: { label: "Enviado", color: "bg-blue-500/10 text-blue-400" },
    delivered: { label: "Entregue", color: "bg-emerald-500/10 text-emerald-400" },
    pending: { label: "Pendente", color: "bg-orange-500/10 text-orange-400" },
    canceled: { label: "Cancelado", color: "bg-red-500/10 text-red-400" },
}

export default function ProfilePage() {
    const router = useRouter()
    const { user, profile, updateProfile, signOut, favorites, loading: authLoading } = useAuth()

    const [orders, setOrders] = useState<any[]>([])
    const [addresses, setAddresses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [savingName, setSavingName] = useState(false)

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)
    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState("")


    const fileInputRef = useRef<HTMLInputElement>(null)

    async function loadData() {
        if (!user) return

        // 📦 Buscar Pedidos por user_id (não email)
        const { data: oData, error: oErr } = await supabase
            .from("orders")
            .select("id, created_at, amount, status, items_json")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10)

        if (!oErr && oData) setOrders(oData)

        // 🏠 Buscar Endereços
        const { data: aData, error: aErr } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("is_default", { ascending: false })

        if (!aErr && aData) setAddresses(aData)

        setLoading(false)
    }

    useEffect(() => {

        if (authLoading) return

        if (!user) return

        loadData()

        if (profile) {
            setNewName(profile.full_name || "")
        }

    }, [user, profile, authLoading])

    const handleSaveAddress = async (formData: any) => {
        if (!user) return

        const payload = { ...formData, user_id: user.id }

        if (formData.is_default) {
            await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
        }

        if (editingAddress?.id) {
            const { error } = await supabase.from("addresses").update(payload).eq("id", editingAddress.id)
            if (error) { toast.error("Erro ao atualizar endereço"); return }
            toast.success("Endereço atualizado!")
        } else {
            const { error } = await supabase.from("addresses").insert([payload])
            if (error) { toast.error("Erro ao adicionar endereço"); return }
            toast.success("Endereço adicionado!")
        }

        await loadData()
    }

    const handleDeleteAddress = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este endereço?")) return
        await supabase.from("addresses").delete().eq("id", id)
        toast.success("Endereço removido")
        loadData()
    }

    const handleSetDefault = async (id: string) => {
        await supabase.from("addresses").update({ is_default: false }).eq("user_id", user!.id)
        await supabase.from("addresses").update({ is_default: true }).eq("id", id)
        loadData()
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true })

            if (uploadError) {
                // Fallback: tentar bucket 'avatar' (singular)
                const { error: uploadError2 } = await supabase.storage
                    .from('avatar')
                    .upload(fileName, file, { upsert: true })

                if (uploadError2) throw uploadError2

                const { data: { publicUrl } } = supabase.storage.from('avatar').getPublicUrl(fileName)
                await updateProfile({ avatar_url: publicUrl })
            } else {
                const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
                await updateProfile({ avatar_url: publicUrl })
            }

            toast.success("Avatar atualizado!")
        } catch (error: any) {
            toast.error("Erro ao enviar imagem: " + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleUpdateName = async () => {
        if (!newName.trim()) return
        setSavingName(true)
        await updateProfile({ full_name: newName.trim() })
        setSavingName(false)
        setIsEditingName(false)
        toast.success("Nome atualizado!")
    }

    if (authLoading) return null
    if (!user) return null

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#c9a34a]" size={32} />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10 animate-fade-in">

            {/* ───────────────────────────────
                1. CABEÇALHO EDITÁVEL
            ─────────────────────────────── */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 glass border-[#c9a34a]/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User size={120} className="text-[#c9a34a]" />
                </div>

                {/* Avatar */}
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img
                        src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-2 border-[#c9a34a] shadow-[0_0_20px_rgba(201,163,74,0.3)] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploading
                            ? <Loader2 className="animate-spin text-white" size={20} />
                            : <Camera size={22} className="text-white" />
                        }
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                    />
                </div>

                {/* Nome + Email */}
                <div className="flex-1 text-center md:text-left space-y-2 relative z-10">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleUpdateName()}
                                    className="bg-zinc-900 border border-[#c9a34a] rounded-lg px-3 py-1.5 text-white outline-none text-lg font-bold"
                                />
                                <button
                                    onClick={handleUpdateName}
                                    disabled={savingName}
                                    className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition"
                                >
                                    {savingName
                                        ? <Loader2 size={18} className="animate-spin" />
                                        : <CheckCircle2 size={18} />
                                    }
                                </button>
                                <button
                                    onClick={() => setIsEditingName(false)}
                                    className="p-1.5 text-zinc-500 hover:text-white transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-white">
                                    {profile?.full_name || "Usuário Sheik"}
                                </h1>
                                <button
                                    onClick={() => { setIsEditingName(true); setNewName(profile?.full_name || "") }}
                                    className="p-1 text-zinc-600 hover:text-[#c9a34a] transition rounded"
                                    title="Editar nome"
                                >
                                    <Pencil size={14} />
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-zinc-400 text-sm">{user?.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                        <div className="inline-flex px-3 py-1 rounded-full bg-[#c9a34a]/10 border border-[#c9a34a]/20 text-[10px] uppercase font-bold text-[#c9a34a] tracking-wider">
                            Membro do Clube
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] uppercase font-bold text-pink-400 tracking-wider">
                            <Heart size={10} fill="currentColor" />
                            {favorites.length} favoritos
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* ───────────────────────────────
                    2. MEUS PEDIDOS
                ─────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest text-[#c9a34a]">
                            <Package size={20} />
                            Meus Pedidos
                        </h2>
                        {orders.length > 0 && (
                            <span className="text-xs text-zinc-500">{orders.length} pedido{orders.length !== 1 ? "s" : ""}</span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            // Skeleton
                            [1, 2, 3].map(i => (
                                <div key={i} className="p-4 glass animate-pulse flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-zinc-800 rounded w-3/4" />
                                        <div className="h-3 bg-zinc-800 rounded w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : orders.length === 0 ? (
                            <div className="p-10 glass border-dashed bg-transparent text-center">
                                <ShoppingBag className="mx-auto mb-3 text-zinc-700" size={36} />
                                <p className="text-sm text-zinc-500 mb-4">Ainda não há pedidos.</p>
                                <button
                                    onClick={() => router.push("/loja")}
                                    className="text-xs text-[#c9a34a] hover:brightness-125 font-bold uppercase tracking-widest"
                                >
                                    Explorar loja →
                                </button>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: "bg-zinc-800 text-zinc-400" }
                                const items: OrderItem[] = order.items_json || []
                                const firstItem = items[0]

                                const totalItems = items.reduce(
                                    (acc, item) => acc + (item.quantity || 1),
                                    0
                                )
                                return (
                                    <div
                                        key={order.id}
                                        onClick={() => router.push(`/pedido/${order.id}`)}
                                        className="p-4 glass hover:border-[#c9a34a]/40 transition-all flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                                                <Package size={16} className="text-zinc-500" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-white">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </p>

                                                {/* 🔥 NOME DO PRODUTO (AQUI) */}
                                                <p className="text-[10px] text-zinc-500">
                                                    {firstItem?.name || "Produto"} {items.length > 1 && `+${items.length - 1}`}
                                                </p>

                                                {/* 🔥 QUANTIDADE */}
                                                <p className="text-[10px] text-zinc-500">
                                                    {totalItems} item{totalItems > 1 ? "s" : ""}
                                                </p>

                                                <p className="text-[10px] text-zinc-500">
                                                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <div>
                                                <p className="text-sm font-bold text-[#c9a34a]">
                                                    R$ {Number(order.amount || 0).toFixed(2)}
                                                </p>
                                                <span className={`text-[9px] uppercase font-bold tracking-tighter px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <ExternalLink size={14} className="text-zinc-700 group-hover:text-[#c9a34a] transition" />
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>

                {/* ───────────────────────────────
                    3. ENDEREÇOS (CRUD REAL)
                ─────────────────────────────── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest text-[#c9a34a]">
                            <MapPin size={20} />
                            Endereços
                        </h2>
                        <button
                            onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                            className="flex items-center gap-1.5 text-xs text-[#c9a34a] hover:brightness-125 font-bold uppercase tracking-widest transition"
                        >
                            <Plus size={14} />
                            Novo
                        </button>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            [1, 2].map(i => (
                                <div key={i} className="p-5 glass animate-pulse flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-zinc-800 rounded w-1/2" />
                                        <div className="h-3 bg-zinc-800 rounded w-3/4" />
                                    </div>
                                </div>
                            ))
                        ) : addresses.length === 0 ? (
                            <div className="p-10 glass border-dashed bg-transparent text-center">
                                <MapPin className="mx-auto mb-3 text-zinc-700" size={36} />
                                <p className="text-sm text-zinc-500 mb-4">Nenhum endereço salvo.</p>
                                <button
                                    onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                                    className="text-xs text-[#c9a34a] hover:brightness-125 font-bold uppercase tracking-widest"
                                >
                                    + Adicionar endereço
                                </button>
                            </div>
                        ) : (
                            addresses.map((addr) => (
                                <div key={addr.id} className="p-5 glass flex items-start gap-4 relative group hover:border-[#c9a34a]/30 transition-all">
                                    <div className={`p-2.5 rounded-xl border flex-shrink-0 ${addr.is_default ? 'bg-[#c9a34a] text-black border-[#c9a34a]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1 space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-white">{addr.name}</p>
                                            {addr.is_default && (
                                                <span className="text-[9px] bg-[#c9a34a]/10 text-[#c9a34a] px-2 py-0.5 rounded-full font-bold">PADRÃO</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-400 truncate">
                                            {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ""}
                                        </p>
                                        <p className="text-[10px] text-zinc-500">
                                            {addr.neighborhood && `${addr.neighborhood} · `}{addr.city} - {addr.state} · CEP {addr.zip_code}
                                        </p>
                                        {!addr.is_default && (
                                            <button
                                                onClick={() => handleSetDefault(addr.id)}
                                                className="text-[10px] text-zinc-600 hover:text-[#c9a34a] transition font-medium mt-1"
                                            >
                                                Definir como padrão
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => { setEditingAddress(addr); setIsAddressModalOpen(true); }}
                                            className="text-zinc-500 hover:text-white transition p-1"
                                            title="Editar"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="text-zinc-700 hover:text-red-500 transition p-1"
                                            title="Excluir"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>

            {/* ───────────────────────────────
                4. ATALHOS RÁPIDOS
            ─────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => router.push("/lista")}
                    className="flex flex-col items-center gap-3 p-8 glass hover:border-[#c9a34a]/60 group transition-all h-full"
                >
                    <div className="relative">
                        <Heart className="text-[#c9a34a] group-hover:scale-110 transition-transform" size={28} />
                        {favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a34a] text-black text-[9px] rounded-full flex items-center justify-center font-bold">
                                {favorites.length > 9 ? "9+" : favorites.length}
                            </span>
                        )}
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-widest block">Minha Coleção</span>
                        <span className="text-[10px] text-zinc-500 mt-0.5 block">{favorites.length} perfume{favorites.length !== 1 ? "s" : ""}</span>
                    </div>
                </button>
                <button
                    onClick={() => router.push("/clube")}
                    className="flex flex-col items-center gap-3 p-8 glass border-[#c9a34a]/30 hover:border-[#c9a34a]/60 group transition-all h-full"
                >
                    <Crown className="text-[#c9a34a] group-hover:scale-110 transition-transform" size={28} />
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-widest block text-[#c9a34a]">Clube Sheik</span>
                        <span className="text-[10px] text-zinc-500 mt-0.5 block">Benefícios exclusivos</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-3 p-8 glass opacity-40 cursor-not-allowed h-full">
                    <CreditCard className="text-zinc-500" size={28} />
                    <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-widest block text-zinc-500">Pagamentos</span>
                        <span className="text-[10px] text-zinc-600 mt-0.5 block">Em breve</span>
                    </div>
                </button>
            </div>

            {/* LOGOUT */}
            <div className="pt-6 flex justify-center">
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-10 py-4 rounded-2xl border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all font-bold text-xs uppercase tracking-[0.2em]"
                >
                    <LogOut size={16} />
                    Encerrar Sessão
                </button>
            </div>

            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                initialData={editingAddress}
                onSave={handleSaveAddress}
            />

        </div>
    )
}
