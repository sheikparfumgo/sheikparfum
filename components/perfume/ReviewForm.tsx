"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ReviewForm({ perfume_id }: { perfume_id: string }) {
    const [rating, setRating] = useState(5)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        setLoading(true)

        const { data } = await supabase.auth.getSession()

        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.session?.access_token}`
            },
            body: JSON.stringify({
                perfume_id,
                rating,
                comment
            })
        })

        const result = await res.json()

        setLoading(false)

        if (result.error) {
            alert(result.error)
            return
        }

        alert(`🎉 Cupom gerado: ${result.coupon}`)
    }

    return (
        <div className="mt-14 max-w-[600px] space-y-5">

            {/* HEADER */}
            <div>
                <h3 className="text-lg font-semibold text-white">
                    Avalie este perfume
                </h3>

                <p className="text-sm text-zinc-400">
                    Sua opinião ajuda outras pessoas — e você ganha um bônus 🎁
                </p>
            </div>

            {/* ⭐ ESTRELAS */}
            <div className="flex gap-1 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className={`
              transition
              ${(hover || rating) >= star
                                ? "text-[#d4af37]"
                                : "text-zinc-600"}
            `}
                    >
                        ★
                    </button>
                ))}
            </div>

            {/* TEXTAREA */}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte como foi sua experiência com esse perfume..."
                className="
          w-full min-h-[100px]
          bg-zinc-900 border border-zinc-700
          rounded-xl p-3 text-sm text-white
          focus:outline-none focus:border-[#d4af37]
          transition
        "
            />

            {/* INCENTIVO */}
            <div className="
        bg-[#d4af37]/10 border border-[#d4af37]/30
        rounded-xl p-3 text-xs text-[#d4af37]
      ">
                🎁 Avalie e ganhe <b>R$30 OFF</b> em perfumes 100ml
            </div>

            {/* BOTÃO */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="
          w-full py-3 rounded-xl font-semibold
          bg-gradient-to-r from-[#d4af37] to-[#c9a34a]
          text-black
          hover:scale-[1.02]
          transition
          shadow-lg shadow-[#d4af37]/20
        "
            >
                {loading ? "Enviando..." : "Enviar avaliação"}
            </button>

        </div>
    )
}