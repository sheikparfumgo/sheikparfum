"use client"

import { useState } from "react"

type Props = {
    open: boolean
    onClose: () => void
    perfumeName: string
    perfumeId?: string
}

export default function NotifyModal({
    open,
    onClose,
    perfumeName,
    perfumeId
}: Props) {

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    if (!open) return null

    function isValidEmail(email: string) {
        return /\S+@\S+\.\S+/.test(email)
    }

    async function handleSubmit() {
        setError("")

        if (!email || !isValidEmail(email)) {
            setError("Digite um e-mail válido")
            return
        }

        try {
            setLoading(true)

            const res = await fetch("/api/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    perfume_name: perfumeName,
                    perfume_id: perfumeId
                })
            })

            if (!res.ok) {
                throw new Error("Erro ao salvar")
            }

            setSuccess(true)

        } catch (err) {
            console.error(err)
            setError("Erro ao salvar. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">

            <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6 shadow-2xl">

                {/* FECHAR */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white text-sm"
                >
                    ✕
                </button>

                {!success ? (
                    <>
                        {/* HEADER (SÓ ANTES DO ENVIO) */}
                        <div className="space-y-2 mb-4">

                            <h2 className="text-xl font-semibold text-white">
                                Avise-me quando chegar
                            </h2>

                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Receba um aviso exclusivo quando{" "}
                                <span className="text-white font-medium">
                                    {perfumeName}
                                </span>{" "}
                                voltar ao estoque.
                            </p>

                        </div>

                        <div className="space-y-4">

                            <div className="space-y-1">
                                <input
                                    type="email"
                                    placeholder="Digite seu melhor e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`
                                    w-full px-4 py-3 rounded-lg bg-black border 
                                    ${error ? "border-red-500" : "border-zinc-700"}
                                    text-white placeholder:text-zinc-500
                                    focus:outline-none focus:border-[#d4af37]
                                    transition
                                `}
                                />

                                {error && (
                                    <p className="text-xs text-red-400">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="
                                w-full py-3 rounded-lg font-semibold tracking-wide
                                bg-gradient-to-r from-[#d4af37] to-[#c9a34a]
                                text-black
                                shadow-lg shadow-[#d4af37]/20
                                hover:brightness-110 hover:shadow-[#d4af37]/40
                                transition
                                disabled:opacity-50
                            "
                            >
                                {loading ? "Salvando..." : "Quero ser avisado"}
                            </button>

                            <p className="text-[11px] text-zinc-500 text-center">
                                🔒 Não enviamos spam. Apenas avisos importantes.
                            </p>

                        </div>
                    </>
                ) : (
                    /* ✅ ESTADO PREMIUM LIMPO */
                    <div className="space-y-4 text-center py-6">

                        <div className="text-3xl">✨</div>

                        <p className="text-green-400 font-semibold text-lg">
                            Você será avisado!
                        </p>

                        <p className="text-sm text-zinc-400">
                            Assim que o produto voltar ao estoque,
                            você receberá um aviso no seu e-mail.
                        </p>

                        <button
                            onClick={onClose}
                            className="
                            mt-2 text-sm font-medium
                            text-zinc-400 hover:text-white
                            transition
                        "
                        >
                            Fechar
                        </button>

                    </div>
                )}

            </div>
        </div>
    )
}