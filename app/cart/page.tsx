"use client"

import { useCart } from "@/store/cart"

export default function CartPage() {

    const items = useCart((state) => state.items)
    const shipping = useCart((state) => state.shipping)
    const total = useCart((state) => state.getTotal())
    const totalWithShipping = useCart((state) => state.getTotalWithShipping())
    const removeItem = useCart((state) => state.removeItem)
    const updateQuantity = useCart((state) => state.updateQuantity)

    return (
        <div className="max-w-[900px] mx-auto px-4 py-10">

            <h1 className="text-2xl font-bold mb-6">
                Seu carrinho
            </h1>

            {items.length === 0 ? (
                <div className="flex flex-col items-center gap-4 mt-6">

                    <p className="text-zinc-400">
                        Seu carrinho está vazio
                    </p>

                    <button
                        onClick={() => window.location.href = "/loja"}
                        className="px-6 py-2 rounded-lg bg-[#d4af37] text-black font-semibold hover:brightness-110 transition"
                    >
                        Ir para a loja
                    </button>

                </div>
            ) : (
                <div className="space-y-4">

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border border-zinc-800 p-4 rounded-lg"
                        >

                            {/* INFO */}
                            <div>
                                <p className="text-white font-medium">
                                    {item.name}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {item.size}ml
                                </p>
                            </div>

                            {/* CONTROLES */}
                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2"
                                >
                                    +
                                </button>

                            </div>

                            {/* PREÇO */}
                            <p className="text-[#d4af37] font-semibold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                            </p>

                            {/* REMOVER */}
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-400 text-sm"
                            >
                                Remover
                            </button>

                        </div>
                    ))}

                    {/* RESUMO */}
                    <div className="border border-zinc-800 p-4 rounded-lg space-y-2">

                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Subtotal</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Frete</span>
                            <span>
                                {shipping?.price === 0
                                    ? "Grátis"
                                    : `R$ ${shipping?.price?.toFixed(2) || "0.00"}`
                                }
                            </span>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-white border-t border-zinc-800 pt-2">
                            <span>Total</span>
                            <span>R$ {totalWithShipping.toFixed(2)}</span>
                        </div>

                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => window.location.href = "/checkout"}
                        className="w-full mt-4 py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:brightness-110 transition"
                    >
                        Finalizar compra
                    </button>

                </div>
            )}

        </div>
    )
}