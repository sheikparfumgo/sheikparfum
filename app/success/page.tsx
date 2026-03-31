"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const fireConfetti = async () => {
    if (typeof window === "undefined") return

    const confettiModule = await import("canvas-confetti")
    const confetti = confettiModule.default || confettiModule

    confetti({ particleCount: 80, spread: 60, origin: { x: 0 } })
    confetti({ particleCount: 80, spread: 60, origin: { x: 1 } })

    setTimeout(() => {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } })
    }, 300)
}

function SuccessContent() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = searchParams.get("order_id")

        if (!id) return

        async function loadOrder() {
            try {
                const res = await fetch(`/api/orders/${id}`)
                const data = await res.json()

                if (!res.ok) throw new Error()

                data.items = typeof data.items === "string"
                    ? JSON.parse(data.items)
                    : data.items

                setOrder(data)

            } catch (err) {
                console.error("Erro ao carregar pedido")
            } finally {
                setLoading(false)
            }
        }

        loadOrder()
        fireConfetti()

    }, [searchParams])

    const totalItems =
        order?.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">

            <div className="max-w-xl w-full space-y-6">

                {/* HEADER PREMIUM */}
                <div className="text-center space-y-3">
                    <div className="text-6xl animate-bounce">🎉</div>

                    <h1 className="text-3xl font-bold">
                        Pedido confirmado!
                    </h1>

                    <p className="text-sm text-zinc-400">
                        Estamos preparando tudo com cuidado 💫
                    </p>
                </div>

                {/* CARD PRINCIPAL */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-lg">

                    {/* ID + STATUS */}
                    <div className="flex justify-between items-center">

                        <div>
                            <p className="text-xs text-zinc-500">
                                Pedido
                            </p>
                            <p className="text-lg font-semibold text-[#d4af37]">
                                #{order?.id || "—"}
                            </p>
                        </div>

                        <span className="
                            text-xs px-3 py-1 rounded-full
                            bg-yellow-500/10 text-yellow-400
                        ">
                            Em preparação
                        </span>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="space-y-2">
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#d4af37] w-[30%]" />
                        </div>

                        <p className="text-xs text-zinc-500">
                            Separando seu pedido
                        </p>
                    </div>

                </div>

                {/* ITENS */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">

                    <div className="flex justify-between text-sm text-zinc-400">
                        <span>Itens ({totalItems})</span>
                        <span>
                            R$ {(order?.total || order?.amount || 0).toFixed(2)}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-2">
                            <div className="h-12 bg-zinc-800 animate-pulse rounded" />
                            <div className="h-12 bg-zinc-800 animate-pulse rounded" />
                        </div>
                    ) : (
                        order?.items?.map((item: any) => (
                            <div key={item.id} className="flex gap-3 items-center">

                                <img
                                    src={item.image}
                                    className="w-12 h-12 rounded-lg bg-white"
                                    alt={item.name}
                                />

                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {item.name}
                                    </p>

                                    <p className="text-xs text-zinc-400">
                                        {item.size}ml • x{item.quantity}
                                    </p>
                                </div>

                                <span className="text-sm text-[#d4af37] font-semibold">
                                    R$ {(item.price * item.quantity).toFixed(2)}
                                </span>

                            </div>
                        ))
                    )}

                </div>

                {/* RECOMPRA + CUPOM */}
                <div className="bg-gradient-to-r from-[#d4af37]/10 to-[#f1d27a]/10 border border-[#d4af37]/30 rounded-2xl p-5 space-y-2">

                    <p className="text-sm font-semibold text-[#d4af37]">
                        💬 Ganhe R$30 de desconto
                    </p>

                    <p className="text-xs text-zinc-400">
                        Avalie seu perfume após receber e receba um cupom exclusivo.
                    </p>

                </div>

                {/* STATUS LOGÍSTICO */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 text-sm">

                    <p>📦 Separação em andamento</p>
                    <p>🚚 Envio em até 1-2 dias úteis</p>
                    <p>📩 Atualizações por e-mail</p>

                </div>

                {/* CTA */}
                <div className="space-y-3">

                    <button
                        onClick={() => router.push(`/pedido/${order?.id}`)}
                        className="
                            w-full border border-zinc-700 py-3 rounded-lg
                            hover:bg-white hover:text-black transition
                        "
                    >
                        Acompanhar pedido
                    </button>

                    <button
                        onClick={() => router.push("/loja")}
                        className="
                            w-full bg-[#d4af37] text-black py-3 rounded-lg font-semibold
                            hover:bg-[#e0bd4f]
                            shadow-lg shadow-[#d4af37]/20
                            hover:scale-[1.02]
                        "
                    >
                        Continuar comprando
                    </button>

                </div>

                {/* TRUST */}
                <p className="text-xs text-zinc-500 text-center">
                    🔒 Pagamento seguro via Mercado Pago
                </p>

            </div>

        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-500 animate-pulse">Carregando...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}