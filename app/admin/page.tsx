"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

import DashboardTab from "@/components/admin/tabs/DashboardTab"
import StockTab from "@/components/admin/tabs/StockTab"
import CouponsTab from "@/components/admin/tabs/CouponsTab"
import AddPerfumeTab from "@/components/admin/tabs/AddPerfumeTab"
import AddReviewTab from "@/components/admin/tabs/AddReviewTab"
import EditPerfumeTab from "@/components/admin/tabs/EditPerfumeTab"

export default function AdminPageV2() {

    const { user, profile, loading } = useAuth()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState("dashboard")

    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const [selectedPerfume, setSelectedPerfume] = useState<any>(null)
    const [savingId, setSavingId] = useState<string | null>(null)
    const [savedId, setSavedId] = useState<string | null>(null)

    const [products, setProducts] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [coupons, setCoupons] = useState<any[]>([])
    const [perfumes, setPerfumes] = useState<any[]>([])

    const [loadingData, setLoadingData] = useState(false)
    const [initialized, setInitialized] = useState(false)

    const [couponForm, setCouponForm] = useState({
        code: "",
        discount: "",
        type: "review",
        perfume_id: "",
        influencer_id: "",
        usage_limit: "",
        valid_until: "",
        is_global: false,
        unlimited: false
    })

    const [creatingCoupon, setCreatingCoupon] = useState(false)

    async function loadPerfumes() {
        const res = await fetch("/api/admin/perfumes")
        const json = await res.json()

        const sorted = (json.data || []).sort((a: any, b: any) =>
            a.perfume_name.localeCompare(b.perfume_name)
        )

        setPerfumes(sorted)
    }

    // 🔄 LOAD
    async function load(silent = false) {
        if (!silent) setLoadingData(true)

        const res = await fetch("/api/admin/orders")
        const data = await res.json()

        const productsRes = await fetch("/api/products")
        const productsData = await productsRes.json()

        const couponsRes = await fetch("/api/coupons")
        const couponsData = await couponsRes.json()

        setProducts(productsData)
        setOrders(data)
        setCoupons(couponsData)

        setLoadingData(false)
        setInitialized(true)
    }

    useEffect(() => {
        if (loading) return
        if (!user) return

        if (profile?.role !== "admin") {
            router.replace("/")
        }
    }, [user, profile, loading])

    useEffect(() => {
        if (!initialized) load()
    }, [initialized])

    useEffect(() => {
        loadPerfumes()
    }, [])

    // 📊 AGRUPAMENTO (EXATAMENTE IGUAL AO SEU)
    const groupedProducts = Object.values(
        products.reduce((acc: any, item: any) => {

            if (!item.perfume_id) return acc

            if (!acc[item.perfume_id]) {
                acc[item.perfume_id] = {
                    perfume_id: item.perfume_id,
                    name: item.perfume_name,
                    variants: []
                }
            }

            item.products?.forEach((p: any) => {
                acc[item.perfume_id].variants.push({
                    id: p.product_id,
                    size_ml: p.size_ml,
                    stock: p.stock
                })
            })

            return acc

        }, {})
    )

    // 🧠 FUNÇÕES ORIGINAIS

    async function updateStatus(id: string, status: string) {
        await fetch(`/api/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        })

        setOrders(prev =>
            prev.map(o =>
                o.id === id ? { ...o, status } : o
            )
        )
    }

    async function updateStockVariant(variantId: string, stock: number) {

        setSavingId(variantId)

        // 🔥 1. ATUALIZA UI IMEDIATO (optimistic)
        setProducts(prev =>
            prev.map(perfume => ({
                ...perfume,
                products: perfume.products?.map((p: any) =>
                    p.product_id === variantId
                        ? { ...p, stock }
                        : p
                )
            }))
        )

        try {
            const res = await fetch("/api/admin/products/update-stock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: variantId, stock })
            })

            const json = await res.json()

            if (!json.success) {
                throw new Error("Erro ao salvar")
            }

            setSavedId(variantId)

        } catch (err) {

            // ❌ rollback se der erro
            console.error(err)

            alert("Erro ao salvar estoque")

            // aqui você poderia recarregar os dados do banco
        }

        setSavingId(null)

        setTimeout(() => setSavedId(null), 1500)
    }

    async function createCoupon() {
        try {
            setCreatingCoupon(true)

            const res = await fetch("/api/coupons/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...couponForm,
                    discount: Number(couponForm.discount),
                    usage_limit: couponForm.usage_limit
                        ? Number(couponForm.usage_limit)
                        : null
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || "Erro ao criar cupom")
                return
            }

            alert("Cupom criado com sucesso 🎉")

        } finally {
            setCreatingCoupon(false)
        }
    }

    async function invalidateCoupon(id: string) {
        await fetch(`/api/coupons/${id}`, { method: "DELETE" })
        setCoupons(prev => prev.filter(c => c.id !== id))
    }

    // 🔒 PROTEÇÃO
    if (!initialized) {
        return <div className="p-10 text-center">Carregando...</div>
    }

    if (!user) {
        return <div className="p-10 text-center">Você precisa estar logado</div>
    }

    if (profile?.role !== "admin") {
        return <div className="p-10 text-center">Acesso negado</div>
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin 👑</h1>

                <button
                    onClick={() => load(true)}
                    className="text-sm text-zinc-400 hover:text-white"
                >
                    Atualizar
                </button>
            </div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-zinc-800 pb-2">

                {[
                    { id: "dashboard", label: "Dashboard" },
                    { id: "stock", label: "Estoque" },
                    { id: "coupons", label: "Cupons" },
                    { id: "add", label: "Adicionar Perfume" },
                    { id: "reviews", label: "Reviews" },
                    { id: "edit", label: "Editar Perfume" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm rounded-t-lg transition
                            ${activeTab === tab.id
                                ? "bg-zinc-800 text-white"
                                : "text-zinc-400 hover:text-white"}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}

            </div>

            {/* CONTEÚDO */}
            {activeTab === "dashboard" && (
                <DashboardTab
                    orders={orders}
                    setSelectedOrder={setSelectedOrder}
                    updateStatus={updateStatus}
                />
            )}

            {activeTab === "stock" && (
                <StockTab
                    perfumes={perfumes}
                    selectedPerfume={selectedPerfume}
                    setSelectedPerfume={setSelectedPerfume}
                    updateStockVariant={updateStockVariant}
                    savingId={savingId}
                    savedId={savedId}
                />
            )}

            {activeTab === "coupons" && (
                <CouponsTab
                    couponForm={couponForm}
                    setCouponForm={setCouponForm}
                    createCoupon={createCoupon}
                    creatingCoupon={creatingCoupon}
                    coupons={coupons}
                    invalidateCoupon={invalidateCoupon}
                    groupedProducts={groupedProducts}
                />
            )}

            {activeTab === "add" && (
                <AddPerfumeTab />
            )}

            {activeTab === "reviews" && (
                <AddReviewTab />
            )}
            {activeTab === "edit" && (
                <EditPerfumeTab perfumes={perfumes} />
            )}

        </div>
    )
}