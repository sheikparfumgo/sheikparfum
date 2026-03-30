"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"

import { getPerfumeBySlug, getRecommendedPerfumes } from "@/services/api"

import FragrancePyramid from "@/components/perfume/FragrancePyramid"
import ScentRadar from "@/components/perfume/ScentRadar"
import PerfumeCard from "@/components/perfume/PerfumeCard"
import NotifyModal from "@/components/ui/NotifyModal"
import { useCart } from "@/store/cart";
import LiveViewers from "@/components/ui/LiveViewers"
import RecentPurchaseBadge from "@/components/ui/RecentPurchaseBadge"
import ReviewForm from "@/components/perfume/ReviewForm"
import ReviewsList from "@/components/perfume/ReviewsList"

export default function PerfumePage() {

    const params = useParams()
    const slug = params?.slug as string

    const [recommended, setRecommended] = useState<any[]>([])
    const [perfume, setPerfume] = useState<any>(null)
    const [selected, setSelected] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [showNotifyModal, setShowNotifyModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const cartTotal = useCart((state) => state.getTotal())
    const [quantity, setQuantity] = useState(1)
    const [canReview, setCanReview] = useState(false)
    const [cep, setCep] = useState("")
    const [shipping, setShipping] = useState<any[]>([])
    const [loadingShipping, setLoadingShipping] = useState(false)
    const [selectedShipping, setSelectedShipping] = useState<any>(null)
    const setShippingGlobal = useCart((state) => state.setShipping)
    const totalWithShipping = useCart((state) => state.getTotalWithShipping())
    const addToCart = useCart((state) => state.addItem)


    async function calculateShipping() {
        if (cep.length < 8) return

        setLoadingShipping(true)

        try {
            const res = await fetch("/api/shipping", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cep,
                    items: [
                        {
                            size: selected?.size_ml,
                            quantity
                        }
                    ]
                })
            })

            const data = await res.json()
            setShipping(data.shipping || [])
            const cheapest = data.shipping?.find((s: any) => s.isCheapest)
            if (cheapest) {
                setSelectedShipping(cheapest)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingShipping(false)
        }
    }

    const [ratingData, setRatingData] = useState({
        average: 0,
        total: 0
    })

    useEffect(() => {

        if (!slug) return

        async function load() {
            try {
                setLoading(true)

                const data = await getPerfumeBySlug(slug)

                if (!data) {
                    setError(true)
                    return
                }

                const products =
                    typeof data.products === "string"
                        ? JSON.parse(data.products)
                        : data.products || []

                data.products = products

                setPerfume(data)

                const recs = await getRecommendedPerfumes(data)

                const baseName =
                    data.perfume_name?.toLowerCase().split(" ")[0] || ""

                const cleaned = (recs || [])
                    .filter((p: any) => p.slug !== data.slug)
                    .filter((p: any, index: number, self: any[]) =>
                        index === self.findIndex((x) => x.perfume_id === p.perfume_id)
                    )

                // 🔥 PRIORIDADE 1 — mesmo nome (asad, khamrah...)
                const byName = cleaned.filter((p: any) =>
                    p.perfume_name?.toLowerCase().includes(baseName)
                )

                // 🏷️ PRIORIDADE 2 — mesma marca
                const byBrand = cleaned.filter((p: any) =>
                    p.brand === data.brand
                )

                // 🧠 PRIORIDADE 3 — mesma família
                const byFamily = cleaned.filter((p: any) =>
                    p.olfactive_family === data.olfactive_family
                )

                // 🔁 combina sem duplicar
                const combined = [
                    ...byName,
                    ...byBrand,
                    ...byFamily,
                    ...cleaned
                ].filter((p, index, self) =>
                    index === self.findIndex(x => x.perfume_id === p.perfume_id)
                )

                // 🎯 garante 4
                setRecommended(combined.slice(0, 4))

                const validProduct =
                    products.find((p: any) =>
                        p.price !== null && p.price !== undefined
                    )
                    || products[0]
                    || null

                setSelected(validProduct)

                // ⭐ buscar média das avaliações
                try {
                    const res = await fetch(`/api/reviews/list?perfume_id=${data.perfume_id}`)
                    const result = await res.json()

                    const reviews = result.reviews || []

                    const total = reviews.length
                    const average =
                        total > 0
                            ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / total
                            : 0

                    setRatingData({
                        average,
                        total
                    })

                } catch (err) {
                    console.error("Erro ao buscar rating", err)
                }

                // 🔥 verificar se pode avaliar
                try {
                    const { createClient } = await import("@supabase/supabase-js")

                    const supabase = createClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                    )

                    const { data: session } = await supabase.auth.getSession()

                    if (session?.session?.access_token) {
                        const res = await fetch(`/api/reviews/can-review?perfume_id=${data.perfume_id}`, {
                            headers: {
                                Authorization: `Bearer ${session.session.access_token}`
                            }
                        })

                        const result = await res.json()
                        setCanReview(result.canReview)
                    }

                } catch (err) {
                    console.error("Erro ao verificar review", err)
                }

            } catch (err) {
                console.error(err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        load()

    }, [slug])

    if (loading) {
        return (
            <div className="p-10 text-center text-zinc-500 animate-pulse">
                Carregando perfume...
            </div>
        )
    }

    if (error || !perfume) {
        return (
            <div className="p-10 text-center text-red-400">
                Erro ao carregar perfume
            </div>
        )
    }

    // 💰 DADOS
    const unitPrice = Number(selected?.price || 0)
    const totalPrice = unitPrice * quantity
    const price = totalPrice
    const size = Number(selected?.size_ml || 0)
    const stock = selected?.stock ?? 0

    // 🚚 FRETE GRÁTIS INTELIGENTE
    const isDecant = size <= 30
    const isFull = size >= 100
    const cepPrefix = cep?.slice(0, 2) || ""

    const isCheapRegion = [
        "01", "02", "03", "04", "05", "08", "09", "10", // SP
        "20", "22", "24", // RJ
        "30", "31", "32", "33" // MG
    ].includes(cepPrefix)

    const freeShippingRule =
        isDecant
            ? 150
            : isCheapRegion
                ? 200
                : 300

    const missingForFree = Math.max(0, freeShippingRule - totalPrice)
    const hasFreeShipping = totalPrice >= freeShippingRule

    const MIN_INSTALLMENT = 150

    const canInstallments =
        size === 100 || price >= MIN_INSTALLMENT

    // 🔥 AGORA SIM (depois do price)
    const totalWithCurrent = cartTotal + totalPrice

    const badgePerfumes = [
        perfume,
        perfume,
        ...recommended
    ].filter(Boolean)

    // 🔥 FRETES CURADOS (MOSTRAR SÓ OS MELHORES)
    const cheapest = shipping.find(s => s.isCheapest)
    const fastest = shipping.find(s => s.isFastest)

    // remove duplicados
    const curated = [cheapest, fastest].filter(
        (v, i, arr) => v && arr.findIndex(x => x.id === v.id) === i
    )

    // pega mais 2 opções relevantes
    const others = shipping
        .filter(s => !curated.find(c => c.id === s.id))
        .slice(0, 2)

    // lista final enxuta
    const finalShippingList = [...curated, ...others]

    return (

        <div className="w-full px-4 md:px-6 py-6 md:py-10">

            {/* TOPO */}
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">

                {/* IMAGENS E GALERIA */}
                <div className="flex flex-col gap-4">

                    {/* FOTO PRINCIPAL */}
                    <div className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 shadow-xl">
                        <Image
                            src={
                                selectedImage ||
                                perfume.image_main ||
                                (Array.isArray(perfume.images) ? perfume.images[0] : null) ||
                                "/placeholder.png"
                            }
                            alt={perfume.perfume_name || "Perfume"}
                            fill
                            className="
                                object-contain 
                                p-4 
                                scale-110 
                                group-hover:scale-115 
                                transition-all duration-500
                            "
                        />
                    </div>

                    {/* MINI GALERIA */}
                    {perfume.images && Array.isArray(perfume.images) && perfume.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {perfume.images.map((img: string, i: number) => {
                                const isSelected = selectedImage === img || (!selectedImage && img === perfume.image_main && i === 0);
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square relative rounded-xl overflow-hidden border-2 transition-all bg-zinc-900 ${isSelected
                                            ? "border-[#d4af37] shadow-lg shadow-[#d4af37]/20"
                                            : "border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={img} alt={`Gallery ${i}`} fill className="object-contain p-2" />
                                    </button>
                                )
                            })}
                        </div>
                    )}

                </div>

                {/* INFO */}
                <div className="space-y-8">

                    <div className="space-y-2">
                        <p className="text-xs tracking-widest text-zinc-500 uppercase font-semibold">
                            {perfume.brand || "Marca"}
                        </p>

                        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                            {perfume.perfume_name || "Perfume"}
                        </h1>
                    </div>

                    {/* ⭐ avaliações */}
                    {ratingData.total > 0 ? (
                        <div className="flex items-center gap-2 mt-2">

                            <div className="text-[#d4af37] text-sm">
                                {"★".repeat(Math.round(ratingData.average))}
                                {"☆".repeat(5 - Math.round(ratingData.average))}
                            </div>

                            <span className="text-sm text-white font-medium">
                                {ratingData.average.toFixed(1)}
                            </span>

                            <span className="text-xs text-zinc-500">
                                ({ratingData.total} avaliações)
                            </span>

                        </div>
                    ) : (
                        <span className="text-xs text-zinc-500 mt-2 block">
                            Ainda sem avaliações
                        </span>
                    )}

                    {/* VARIAÇÕES */}
                    <div className="space-y-3">

                        <p className="text-sm text-zinc-400">
                            Escolha o volume
                        </p>

                        <div className="flex gap-3 flex-wrap">

                            {perfume.products?.map((p: any) => (

                                <button
                                    key={`${p.size_ml}-${p.price}`}
                                    onClick={() => {
                                        setSelected(p)
                                        setQuantity(1)
                                    }}
                                    className={`
                                        flex-1 py-3 px-4 rounded-lg border transition

                                        ${selected?.size_ml === p.size_ml
                                            ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                                            : "border-zinc-700 hover:border-zinc-500"}
                                    `}
                                >
                                    {p.size_ml}ml
                                </button>

                            ))}

                        </div>

                    </div>

                    <p className="text-xs text-zinc-400">
                        💡 Recomendamos experimentar primeiro com um{" "}
                        <span className="text-primary font-medium">decant</span>.
                    </p>

                    {/* PREÇO */}
                    {selected?.price !== null && selected?.price !== undefined ? (
                        <div className="space-y-1">

                            <div className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                                R$ {price.toFixed(2)}
                            </div>

                            {/* 👇 AQUI (POSIÇÃO PREMIUM) */}
                            {selected?.in_stock && <LiveViewers />}

                            <p className="text-green-400 text-sm md:text-base font-semibold">
                                R$ {(price * 0.9).toFixed(2)} à vista
                            </p>

                            {canInstallments && (
                                <p className="text-xs md:text-sm text-zinc-400">
                                    ou 3x de R$ {(price / 3).toFixed(2)} sem juros
                                </p>
                            )}
                            {size !== 100 && totalWithCurrent >= 150 && (
                                <p className="text-xs text-green-400 font-medium">
                                    💳 Parcelamento liberado! Pague em até 3x sem juros 🎉
                                </p>
                            )}
                            {totalWithCurrent < 150 && (
                                <p className="text-xs text-zinc-400">
                                    💳 Com este item, faltam{" "}
                                    <span className="text-white font-semibold">
                                        R$ {Math.max(0, 150 - totalWithCurrent).toFixed(2).replace(".", ",")}
                                    </span>{" "}
                                    para parcelar em 3x sem juros
                                </p>
                            )}

                        </div>
                    ) : (
                        <div className="text-sm text-red-400">
                            Preço indisponível
                        </div>
                    )}

                    {/* ESTOQUE */}
                    {selected?.in_stock && (
                        <div className="space-y-1">

                            {stock <= 3 ? (
                                <p className="text-sm font-semibold text-red-400 animate-pulse">
                                    🔥 Últimas {stock} unidades — alta demanda hoje
                                </p>
                            ) : (
                                <p className="text-sm text-zinc-400">
                                    {stock} disponíveis em estoque
                                </p>
                            )}

                        </div>
                    )}
                    {/* QUANTIDADE */}
                    {selected?.in_stock && (
                        <div className="flex items-center gap-3 mt-2">

                            <span className="text-xs text-zinc-400">
                                Quantidade
                            </span>

                            <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">

                                <button
                                    onClick={() =>
                                        setQuantity((q) => Math.max(1, q - 1))
                                    }
                                    className="px-3 py-1 hover:bg-zinc-800"
                                >
                                    -
                                </button>

                                <span className="px-4 text-sm font-semibold">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity((q) => Math.min(stock, q + 1))
                                    }
                                    className="px-3 py-1 hover:bg-zinc-800"
                                >
                                    +
                                </button>

                            </div>
                        </div>
                    )}

                    {/* 🚀 FRETE GRÁTIS */}
                    <div className="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/5 p-3 space-y-1">

                        {hasFreeShipping ? (
                            <p className="text-sm text-green-400 font-semibold">
                                👑 Você ganhou frete grátis!
                            </p>
                        ) : (
                            <>
                                <p className="text-xs text-zinc-400">
                                    {isDecant ? "✨ Frete grátis em decants acima de R$150" : "👑 Frete grátis em perfumes acima de R$200"}
                                </p>

                                <p className="text-sm text-white font-medium">
                                    Faltam R$ {missingForFree.toFixed(2)} para liberar
                                </p>

                                {/* 🔥 BARRA DE PROGRESSO */}
                                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#d4af37] transition-all"
                                        style={{
                                            width: `${Math.min(100, (totalPrice / freeShippingRule) * 100)}%`
                                        }}
                                    />
                                </div>
                            </>
                        )}

                    </div>

                    {/* 🚚 FRETE */}
                    <div className="space-y-2 mt-4">

                        <p className="text-xs text-zinc-400">
                            Calcular frete
                        </p>

                        <div className="flex gap-2">

                            <input
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                placeholder="Digite seu CEP"
                                className="
                flex-1 px-3 py-2 rounded-lg
                bg-zinc-900 border border-zinc-700
                text-sm text-white
                focus:outline-none focus:border-[#d4af37]
            "
                            />

                            <button
                                onClick={calculateShipping}
                                className="
                px-4 py-2 rounded-lg
                bg-[#d4af37] text-black text-sm font-semibold
                hover:bg-[#e0bd4f]
                transition
            "
                            >
                                OK
                            </button>

                        </div>

                        {loadingShipping && (
                            <p className="text-xs text-zinc-500">
                                Calculando...
                            </p>
                        )}
                        {finalShippingList.map((s, i) => {

                            const isCheapestOption = s.isCheapest

                            const finalPrice =
                                hasFreeShipping && isCheapestOption
                                    ? 0
                                    : s.price

                            const isFreeLabel = finalPrice === 0

                            return (
                                <div
                                    key={i}
                                    onClick={() => {
                                        setSelectedShipping(s)
                                        setShippingGlobal({
                                            ...s,
                                            price: finalPrice
                                        })
                                    }}
                                    className={`
                p-3 rounded-lg border cursor-pointer transition-all

                ${selectedShipping?.id === s.id ? "ring-2 ring-[#d4af37]" : ""}

                ${s.isCheapest ? "border-green-500/40 bg-green-500/5" : ""}
                ${s.isFastest ? "border-purple-500/40 bg-purple-500/5" : ""}
                ${isFreeLabel ? "border-[#d4af37]/40 bg-[#d4af37]/5" : "border-zinc-800"}
            `}
                                >
                                    <div className="flex justify-between items-center">

                                        <div className="flex flex-col">

                                            <span className="text-sm text-white font-medium">
                                                {s.name}
                                            </span>

                                            <span className="text-xs text-zinc-400">
                                                {s.deadline} dias
                                            </span>

                                            {/* BADGES */}
                                            <div className="flex gap-2 mt-1">

                                                {s.isCheapest && !isFreeLabel && (
                                                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                                        💰 Mais barato
                                                    </span>
                                                )}

                                                {s.isFastest && (
                                                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                                        ⚡ Mais rápido
                                                    </span>
                                                )}

                                                {isFreeLabel && (
                                                    <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded">
                                                        👑 Frete grátis
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                        <span className="text-white font-semibold">
                                            {finalPrice === 0 ? "Grátis" : `R$ ${finalPrice.toFixed(2)}`}
                                        </span>

                                    </div>
                                </div>
                            )
                        })}

                    </div>

                    <div className="rounded-xl border border-zinc-800 p-3 space-y-1 mt-4">

                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Subtotal</span>
                            <span>R$ {totalPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Frete</span>
                            <span>
                                {selectedShipping
                                    ? (
                                        hasFreeShipping && selectedShipping.isCheapest
                                            ? "Grátis"
                                            : `R$ ${selectedShipping.price.toFixed(2)}`
                                    )
                                    : "--"}
                            </span>
                        </div>

                        <div className="flex justify-between text-lg font-semibold text-white border-t border-zinc-800 pt-2">
                            <span>Total</span>
                            <span>
                                R$ {
                                    (
                                        price +
                                        (
                                            hasFreeShipping && selectedShipping?.isCheapest
                                                ? 0
                                                : (selectedShipping?.price || 0)
                                        )
                                    ).toFixed(2)
                                }
                            </span>
                        </div>

                    </div>

                    {/* BOTÕES */}
                    <div className="flex flex-col md:flex-row gap-3">

                        {selected?.in_stock ? (
                            <>
                                <button
                                    onClick={() => {
                                        if (!selected) return

                                        const unitPrice = Number(selected.price)

                                        addToCart({
                                            id: `${perfume.perfume_id}-${selected.size_ml}`,
                                            name: perfume.perfume_name,
                                            price: unitPrice,
                                            quantity: quantity,
                                            image:
                                                selectedImage ||
                                                perfume.image_main ||
                                                "/placeholder.png",
                                            size: selected.size_ml
                                        })
                                    }}
                                    className="flex-1 border border-zinc-700 py-3 rounded-lg transition hover:bg-white hover:text-black"
                                >
                                    Adicionar ao carrinho
                                </button>

                                <button
                                    onClick={() => {
                                        console.log("comprar", {
                                            perfume: perfume.perfume_name,
                                            size,
                                            quantity
                                        })
                                    }}
                                    className={`
        flex-1 bg-[#d4af37] text-black py-3 rounded-lg font-semibold
        transition
        shadow-lg shadow-[#d4af37]/20
        hover:bg-[#e0bd4f]
        hover:scale-[1.02]

        ${stock <= 3 ? "animate-cta-pulse" : ""}
    `}
                                >
                                    Comprar agora
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowNotifyModal(true)}
                                className="w-full border border-[#d4af37] text-[#d4af37] py-3 rounded-lg font-semibold hover:bg-[#d4af37] hover:text-black transition"
                            >
                                Avise-me quando chegar
                            </button>
                        )}

                    </div>

                </div>

            </div>

            {/* PIRÂMIDE */}
            <div className="max-w-[1200px] mx-auto mt-16 space-y-6">

                <h3 className="text-sm font-semibold text-primary uppercase">
                    Pirâmide olfativa
                </h3>

                <FragrancePyramid
                    top={perfume.top_notes || []}
                    heart={perfume.heart_notes || []}
                    base={perfume.base_notes || []}
                />

            </div>

            {/* DESCRIÇÃO */}
            {
                perfume.description && (
                    <div className="max-w-[1200px] mx-auto mt-12 space-y-4">

                        <h3 className="text-sm font-semibold text-primary uppercase">
                            Sobre o perfume
                        </h3>

                        <p className="text-sm text-zinc-300 leading-relaxed max-w-[800px]">
                            {perfume.description}
                        </p>

                    </div>
                )
            }

            {/* RADAR */}
            <div className="max-w-[1200px] mx-auto mt-16 space-y-6">

                <h3 className="text-sm font-semibold text-primary uppercase">
                    Perfil olfativo
                </h3>

                <ScentRadar
                    top={perfume.top_notes || []}
                    heart={perfume.heart_notes || []}
                    base={perfume.base_notes || []}
                />
                <ReviewsList perfume_id={perfume.perfume_id} />

                {canReview && (
                    <ReviewForm perfume_id={perfume.perfume_id} />
                )}

                {/* RECOMENDADOS */}
                {recommended.length > 0 && (

                    <div className="max-w-[1200px] mx-auto mt-20 space-y-6">

                        <div className="flex items-center justify-between">

                            <h3 className="text-sm font-semibold text-primary uppercase">
                                Quem gostou também comprou
                            </h3>

                            <span className="text-xs text-zinc-500">
                                Baseado em fragrâncias similares
                            </span>

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">

                            {recommended.map((p) => {

                                const parsedProducts = (() => {
                                    try {
                                        return typeof p.products === "string"
                                            ? JSON.parse(p.products)
                                            : p.products || []
                                    } catch {
                                        return []
                                    }
                                })()

                                return (
                                    <PerfumeCard
                                        key={p.perfume_id}
                                        name={p.perfume_name}
                                        brand={p.brand}
                                        image={
                                            p.image_main ||
                                            (Array.isArray(p.images) ? p.images[0] : null) ||
                                            "/placeholder.png"
                                        }
                                        images={p.images || []}
                                        href={`/perfume/${p.slug}`}
                                        products={parsedProducts}
                                        hasStock={p.has_stock}
                                    />
                                )

                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <NotifyModal
                open={showNotifyModal}
                onClose={() => setShowNotifyModal(false)}
                perfumeName={perfume.perfume_name}
            />
            <RecentPurchaseBadge perfumes={badgePerfumes} />
        </div >
    )
}