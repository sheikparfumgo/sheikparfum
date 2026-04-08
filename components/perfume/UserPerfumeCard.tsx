"use client"

import { useState } from "react"
import { X } from "lucide-react"

type Props = {
    perfume: any
    userId: string
    refresh: () => void
}

export default function UserPerfumeCard({ perfume, userId, refresh }: Props) {

    const [open, setOpen] = useState(false)
    const [data, setData] = useState(perfume)

    async function update(field: any) {
        const updated = { ...data, ...field }
        setData(updated)

        await fetch(`/api/user-collection/${perfume.id}`, {
            method: "PATCH",
            headers: {
                "x-user-id": userId
            },
            body: JSON.stringify(field)
        })

        refresh()
    }

    async function remove() {
        await fetch(`/api/user-collection/${perfume.id}`, {
            method: "DELETE",
            headers: {
                "x-user-id": userId
            }
        })

        setOpen(false)
        refresh()
    }

    return (
        <>
            {/* CARD */}
            <div
                onClick={() => setOpen(true)}
                className="
          bg-[#181818]
          border border-zinc-800
          rounded-xl p-4
          flex flex-col gap-3
          hover:border-[#c9a34a]/40
          transition cursor-pointer
        "
            >

                <div className="relative">

                    {data.is_frequent && (
                        <span className="absolute top-2 left-2 text-xs bg-[#c9a34a] text-black px-2 py-1 rounded">
                            🔥 Frequente
                        </span>
                    )}

                    {data.is_favorite && (
                        <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                            ❤️
                        </span>
                    )}

                    <img
                        src={data.image_url}
                        className="w-full h-32 object-cover rounded-lg"
                    />
                </div>

                <div>
                    <p className="text-white font-semibold text-sm">
                        {data.name}
                    </p>

                    <p className="text-xs text-zinc-400">
                        {data.brand}
                    </p>
                </div>

                {data.personal_rating && (
                    <div className="text-xs text-[#c9a34a]">
                        ⭐ {data.personal_rating}/5
                    </div>
                )}

            </div>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="
            bg-gradient-to-b from-[#111] to-[#0a0a0a]
            border border-zinc-800
            rounded-2xl
            w-full max-w-md p-6 space-y-5
          ">

                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-white font-bold text-lg">
                                {data.name}
                            </h2>

                            <button onClick={() => setOpen(false)}>
                                <X className="text-zinc-400 hover:text-white" />
                            </button>
                        </div>

                        {/* RATING */}
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(n => (
                                <button
                                    key={n}
                                    onClick={() => update({ personal_rating: n })}
                                    className={`text-2xl ${data.personal_rating >= n
                                            ? "text-[#c9a34a]"
                                            : "text-zinc-600"
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        {/* AÇÕES */}
                        <div className="flex flex-col gap-2">

                            <button
                                onClick={() => update({ is_frequent: !data.is_frequent })}
                                className="text-sm text-white"
                            >
                                {data.is_frequent
                                    ? "🔥 Usando frequentemente"
                                    : "Marcar como uso frequente"}
                            </button>

                            <button
                                onClick={() => update({ is_favorite: !data.is_favorite })}
                                className="text-sm text-white"
                            >
                                {data.is_favorite
                                    ? "❤️ Na lista de desejos"
                                    : "Adicionar à lista de desejos"}
                            </button>

                        </div>

                        {/* NOTAS */}
                        <textarea
                            placeholder="Notas pessoais..."
                            className="w-full p-3 bg-zinc-900 rounded text-sm"
                            value={data.notes || ""}
                            onChange={(e) =>
                                setData({ ...data, notes: e.target.value })
                            }
                            onBlur={(e) =>
                                update({ notes: e.target.value })
                            }
                        />

                        {/* DELETE */}
                        <button
                            onClick={remove}
                            className="text-red-500 text-sm"
                        >
                            Deletar perfume
                        </button>

                    </div>

                </div>
            )}
        </>
    )
}