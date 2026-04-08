"use client";

export default function CouponsTab({
    couponForm,
    setCouponForm,
    createCoupon,
    creatingCoupon,
    coupons,
    invalidateCoupon,
    groupedProducts
}: any) {

    return (
        <div className="space-y-6">

            {/* CRIAR CUPOM */}
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">

                <h2 className="text-lg font-semibold">
                    Criar Cupom 🎟️
                </h2>

                <div className="grid md:grid-cols-2 gap-3">

                    {/* CODE */}
                    <input
                        placeholder="Código (ex: JE10)"
                        className="input-admin"
                        value={couponForm.code}
                        onChange={(e) =>
                            setCouponForm({ ...couponForm, code: e.target.value })
                        }
                    />

                    {/* DISCOUNT */}
                    <input
                        type="number"
                        placeholder="Desconto (%)"
                        className="input-admin"
                        value={couponForm.discount}
                        onChange={(e) =>
                            setCouponForm({ ...couponForm, discount: e.target.value })
                        }
                    />

                    {/* TYPE */}
                    <select
                        className="input-admin"
                        value={couponForm.type}
                        onChange={(e) =>
                            setCouponForm({ ...couponForm, type: e.target.value })
                        }
                    >
                        <option value="review">Review</option>
                        <option value="club">Clube</option>
                        <option value="influencer">Influencer</option>
                        <option value="global">Global (Black Friday)</option>
                    </select>

                    {/* PERFUME */}
                    {couponForm.type !== "global" && (
                        <select
                            className="input-admin"
                            value={couponForm.perfume_id}
                            onChange={(e) =>
                                setCouponForm({ ...couponForm, perfume_id: e.target.value })
                            }
                        >
                            <option value="">Selecionar perfume</option>

                            {groupedProducts.map((p: any) => (
                                <option key={p.perfume_id} value={p.perfume_id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* INFLUENCER */}
                    {couponForm.type === "influencer" && (
                        <input
                            placeholder="Influencer ID"
                            className="input-admin"
                            value={couponForm.influencer_id}
                            onChange={(e) =>
                                setCouponForm({ ...couponForm, influencer_id: e.target.value })
                            }
                        />
                    )}

                    {/* LIMIT */}
                    <input
                        type="number"
                        placeholder="Limite de uso"
                        disabled={couponForm.unlimited}
                        className="input-admin"
                        value={couponForm.usage_limit}
                        onChange={(e) =>
                            setCouponForm({ ...couponForm, usage_limit: e.target.value })
                        }
                    />

                    {/* DATE */}
                    <input
                        type="datetime-local"
                        className="input-admin"
                        value={couponForm.valid_until}
                        onChange={(e) =>
                            setCouponForm({ ...couponForm, valid_until: e.target.value })
                        }
                    />

                </div>

                {/* CHECKBOX */}
                <div className="flex gap-4 text-sm">

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={couponForm.unlimited}
                            onChange={(e) =>
                                setCouponForm({ ...couponForm, unlimited: e.target.checked })
                            }
                        />
                        Uso infinito
                    </label>

                </div>

                <button
                    onClick={createCoupon}
                    disabled={creatingCoupon}
                    className="btn-primary w-full"
                >
                    {creatingCoupon ? "Criando..." : "Criar Cupom"}
                </button>

            </div>

            {/* LISTA DE CUPONS */}
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">

                <h2 className="text-lg font-semibold">
                    Cupons 🎟️
                </h2>

                <div className="space-y-2">

                    {coupons.map((c: any) => {

                        const expired = new Date(c.valid_until) < new Date()
                        const exhausted = c.usage_limit && c.used_count >= c.usage_limit

                        return (
                            <div
                                key={c.id}
                                className="bg-zinc-800 p-3 rounded flex justify-between items-center"
                            >

                                <div className="text-sm space-y-1">

                                    <p className="font-semibold">
                                        {c.code}
                                    </p>

                                    <p className="text-zinc-400">
                                        {c.discount}% • {c.type}
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Usos: {c.used_count || 0}
                                        {c.usage_limit
                                            ? ` / ${c.usage_limit}`
                                            : " (∞)"}
                                    </p>

                                    {expired && (
                                        <p className="text-red-400 text-xs">
                                            Expirado
                                        </p>
                                    )}

                                    {exhausted && (
                                        <p className="text-yellow-400 text-xs">
                                            Esgotado
                                        </p>
                                    )}

                                </div>

                                <button
                                    onClick={() => invalidateCoupon(c.id)}
                                    className="text-red-400 text-sm hover:underline"
                                >
                                    Invalidar
                                </button>

                            </div>
                        )
                    })}

                    {coupons.length === 0 && (
                        <p className="text-zinc-500 text-sm">
                            Nenhum cupom cadastrado
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}