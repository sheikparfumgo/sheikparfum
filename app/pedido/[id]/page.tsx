"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function OrderPage() {

    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    async function fetchOrder() {
        try {
            const res = await fetch(`/api/orders/${id}`)
            const data = await res.json()

            if (!res.ok) throw new Error()

            data.items = typeof data.items_json === "string"
                ? JSON.parse(data.items_json)
                : data.items_json

            setOrder(data)

        } catch (err) {
            console.error("Erro ao buscar pedido")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrder()

        const interval = setInterval(() => {
            fetchOrder()
        }, 8000)

        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="p-10 text-center text-zinc-500 animate-pulse">
                Carregando pedido...
            </div>
        )
    }

    if (!order) {
        return (
            <div className="p-10 text-center text-red-400">
                Pedido não encontrado
            </div>
        )
    }

    // 🎯 STATUS CONFIG
    const steps = [
        { key: "pending", label: "Pedido recebido" },
        { key: "paid", label: "Pagamento aprovado" },
        { key: "shipped", label: "Enviado" },
        { key: "delivered", label: "Entregue" }
    ]

    const currentIndex = steps.findIndex(s => s.key === order.status)

    const progress = ((currentIndex + 1) / steps.length) * 100

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

            {/* HEADER */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">
                    Acompanhamento do pedido
                </h1>

                <p className="text-sm text-zinc-400">
                    Pedido #{order.id}
                </p>
            </div>

            {/* STATUS PREMIUM */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">

                <div className="flex justify-between items-center">

                    <span className="text-sm text-zinc-400">
                        Status atual
                    </span>

                    <span className="text-sm text-[#d4af37] font-semibold capitalize">
                        {order.status}
                    </span>

                </div>

                {/* 🔥 PROGRESS BAR */}
                <div className="space-y-2">
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#d4af37] transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-xs text-zinc-500">
                        {steps[currentIndex]?.label}
                    </p>
                </div>

            </div>

            {/* TIMELINE */}
            <div className="space-y-4">
                {steps.map((step, i) => {
                    const active = i <= currentIndex

                    return (
                        <div key={step.key} className="flex items-center gap-3">

                            <div className={`
                                w-4 h-4 rounded-full
                                ${active ? "bg-[#d4af37]" : "bg-zinc-700"}
                            `} />

                            <p className={active ? "text-white" : "text-zinc-500"}>
                                {step.label}
                            </p>

                        </div>
                    )
                })}
            </div>

            {/* ITENS */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">

                <p className="text-sm text-zinc-400">
                    Itens do pedido
                </p>

                {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-center">

                        <img
                            src={item.image}
                            className="w-12 h-12 rounded-lg bg-white"
                        />

                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                {item.name}
                            </p>

                            <p className="text-xs text-zinc-400">
                                {item.size}ml • x{item.quantity}
                            </p>
                        </div>

                        <span className="text-[#d4af37] text-sm font-semibold">
                            R$ {(item.price * item.quantity).toFixed(2)}
                        </span>

                    </div>
                ))}

            </div>

            {/* CTA */}
            <div className="space-y-3">

                <button
                    onClick={() => router.push("/loja")}
                    className="
                        w-full bg-[#d4af37] text-black py-3 rounded-lg font-semibold
                        hover:bg-[#e0bd4f]
                        transition
                    "
                >
                    Continuar comprando
                </button>

            </div>

        </div>
    )
}