"use client";

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#d4af37", "#22c55e", "#a855f7", "#3b82f6"];

export default function DashboardTab({
    orders,
    setSelectedOrder,
    updateStatus
}: any) {

    // ✅ IGUAL AO SEU ADMIN ORIGINAL
    const totalSales = orders.reduce(
        (acc: number, o: any) => acc + (o.amount || 0),
        0
    );

    const statusCount = [
        { name: "Pagos", value: orders.filter((o: any) => o.status === "paid").length },
        { name: "Preparando", value: orders.filter((o: any) => o.status === "preparing").length },
        { name: "Enviados", value: orders.filter((o: any) => o.status === "shipped").length },
        { name: "Pendentes", value: orders.filter((o: any) => o.status === "pending").length }
    ];

    function Card({ title, value }: any) {
        return (
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-400">{title}</p>
                <p className="text-lg font-semibold">{value}</p>
            </div>
        )
    }

    function StatusBadge({ status }: any) {

        const map: any = {
            pending: "bg-yellow-500",
            paid: "bg-green-500",
            preparing: "bg-blue-500",
            shipped: "bg-purple-500",
            delivered: "bg-gray-500"
        }

        return (
            <span className={`px-2 py-1 text-xs rounded text-black ${map[status]}`}>
                {status}
            </span>
        )
    }

    return (
        <>
            {/* MÉTRICAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Card title="Vendas do mês" value={`R$ ${totalSales.toFixed(2)}`} />

                <Card title="Pedidos" value={orders.length} />

                <Card
                    title="A enviar"
                    value={orders.filter((o: any) => o.status === "paid").length}
                />

                <Card
                    title="Entregues"
                    value={orders.filter((o: any) => o.status === "delivered").length}
                />

            </div>

            {/* GRÁFICO */}
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
                                {statusCount.map((_: any, i: number) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* PEDIDOS */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">

                <table className="w-full text-sm">

                    <thead className="bg-zinc-800 text-zinc-400">
                        <tr>
                            <th className="p-3 text-left">Pedido</th>
                            <th className="p-3 text-left">Valor</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Ação</th>
                        </tr>
                    </thead>

                    <tbody>

                        {orders.map((o: any) => (
                            <tr
                                key={o.id}
                                className="border-t border-zinc-800 hover:bg-zinc-800/40 cursor-pointer transition"
                                onClick={() => setSelectedOrder(o)}
                            >

                                <td className="p-3 font-medium">#{o.id}</td>

                                <td className="p-3">
                                    R$ {o.amount || 0}
                                </td>

                                <td className="p-3">
                                    <StatusBadge status={o.status} />
                                </td>

                                <td className="p-3">
                                    <select
                                        value={o.status}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => updateStatus(o.id, e.target.value)}
                                        className="bg-zinc-800 px-2 py-1 rounded"
                                    >
                                        <option value="pending">Pendente</option>
                                        <option value="paid">Pago</option>
                                        <option value="preparing">Preparando</option>
                                        <option value="shipped">Enviado</option>
                                        <option value="delivered">Entregue</option>
                                    </select>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>
        </>
    );
}