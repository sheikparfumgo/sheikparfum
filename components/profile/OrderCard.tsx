"use client"

import { Package, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    paid:      { label: "Pago",      color: "bg-green-500/10 text-green-400 border-green-500/20" },
    shipped:   { label: "Enviado",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    delivered: { label: "Entregue",  color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    pending:   { label: "Pendente",  color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
    cancelled: { label: "Cancelado", color: "bg-red-500/10 text-red-400 border-red-500/20" },
}

type OrderCardProps = {
    id: string
    createdAt: string
    amount: number
    status: string
}

export default function OrderCard({ id, createdAt, amount, status }: OrderCardProps) {
    const router = useRouter()
    const statusInfo = STATUS_MAP[status] || { label: status, color: "bg-zinc-800 text-zinc-400 border-zinc-700" }

    return (
        <div
            onClick={() => router.push(`/pedido/${id}`)}
            className="p-4 glass hover:border-[#c9a34a]/40 transition-all flex items-center justify-between group cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-[#c9a34a]/20 transition">
                    <Package size={16} className="text-zinc-500" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">#{id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-[10px] text-zinc-500">
                        {new Date(createdAt).toLocaleDateString("pt-BR", { 
                            day: "2-digit", month: "short", year: "numeric" 
                        })}
                    </p>
                </div>
            </div>
            <div className="text-right flex items-center gap-3">
                <div>
                    <p className="text-sm font-bold text-[#c9a34a]">
                        R$ {Number(amount || 0).toFixed(2)}
                    </p>
                    <span className={`text-[9px] uppercase font-bold tracking-tighter px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.label}
                    </span>
                </div>
                <ExternalLink 
                    size={14} 
                    className="text-zinc-700 group-hover:text-[#c9a34a] transition-all group-hover:translate-x-0.5" 
                />
            </div>
        </div>
    )
}
