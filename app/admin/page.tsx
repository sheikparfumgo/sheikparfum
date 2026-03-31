"use client"

import { useEffect, useState } from "react"
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts"

const COLORS = ["#d4af37", "#22c55e", "#a855f7", "#3b82f6"]

export default function AdminPage() {

    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    async function load() {
        const res = await fetch("/api/admin/orders")
        const data = await res.json()
        setOrders(data)
        setLoading(false)
    }

    useEffect(() => {
        load()
    }, [])

    // 💰 MÉTRICAS
    const totalSales = orders.reduce((acc, o) => acc + (o.total || o.amount || 0), 0)

    const statusCount = [
        { name: "Pagos", value: orders.filter(o => o.status === "paid").length },
        { name: "Enviados", value: orders.filter(o => o.status === "shipped").length },
        { name: "Pendentes", value: orders.filter(o => o.status === "pending").length }
    ]

    return (
        <div className="p-6 space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Dashboard Sheik 👑
                </h1>

                <button
                    onClick={load}
                    className="text-sm text-zinc-400 hover:text-white"
                >
                    Atualizar
                </button>
            </div>

            {/* 📊 MÉTRICAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Card title="Vendas do mês" value={`R$ ${totalSales.toFixed(2)}`} />

                <Card title="Pedidos" value={orders.length} />

                <Card
                    title="A enviar"
                    value={orders.filter(o => o.status === "paid").length}
                />

                <Card
                    title="Entregues"
                    value={orders.filter(o => o.status === "delivered").length}
                />

            </div>

            {/* 📈 GRÁFICO */}
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">

                <p className="text-sm text-zinc-400 mb-4">
                    Distribuição de pedidos
                </p>

                <div className="h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={statusCount}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                            >
                                {statusCount.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* 📦 PEDIDOS */}
            <div className="space-y-3">

                <h2 className="text-lg font-semibold">
                    Pedidos recentes
                </h2>

                {orders.map((o) => (
                    <div
                        key={o.id}
                        className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800"
                    >

                        <div>
                            <p className="font-medium">
                                Pedido #{o.id}
                            </p>
                            <p className="text-xs text-zinc-400">
                                {o.status}
                            </p>
                        </div>

                        <div className="flex gap-2 mt-2 md:mt-0">

                            <button
                                onClick={() => updateStatus(o.id, "preparing")}
                                className="btn-admin"
                            >
                                Preparando
                            </button>

                            <button
                                onClick={() => updateStatus(o.id, "shipped")}
                                className="btn-admin"
                            >
                                Enviado
                            </button>

                            <button
                                onClick={() => updateStatus(o.id, "delivered")}
                                className="btn-admin"
                            >
                                Entregue
                            </button>

                        </div>

                    </div>
                ))}

            </div>

            {/* 📦 ESTOQUE RÁPIDO */}
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">

                <h2 className="text-lg font-semibold">
                    Atualizar estoque
                </h2>

                <div className="flex gap-2">

                    <input
                        placeholder="ID do produto"
                        className="input-admin"
                        id="productId"
                    />

                    <input
                        placeholder="Quantidade"
                        className="input-admin"
                        id="stock"
                    />

                    <button
                        onClick={updateStock}
                        className="btn-primary"
                    >
                        Atualizar
                    </button>

                </div>

            </div>

            {/* 👑 CLUBE DO SHEIK */}
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">

                <h2 className="text-lg font-semibold">
                    Clube do Sheik (Top 5)
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">

                    {[1, 2, 3, 4, 5].map((i) => (
                        <input
                            key={i}
                            placeholder={`Perfume ${i}`}
                            className="input-admin"
                        />
                    ))}

                </div>

                <button className="btn-primary">
                    Salvar seleção
                </button>

            </div>

        </div>
    )

    async function updateStatus(id: string, status: string) {
        await fetch("/api/orders/update-status", {
            method: "POST",
            body: JSON.stringify({ orderId: id, status })
        })
        load()
    }

    async function updateStock() {
        const id = (document.getElementById("productId") as any).value
        const stock = (document.getElementById("stock") as any).value

        await fetch("/api/products/update-stock", {
            method: "POST",
            body: JSON.stringify({ id, stock })
        })

        alert("Estoque atualizado")
    }
}

/* COMPONENTES */

function Card({ title, value }: any) {
    return (
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <p className="text-xs text-zinc-400">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    )
}