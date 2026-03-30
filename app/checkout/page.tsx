"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/store/cart"
import { useRouter } from "next/navigation"
import { initMercadoPago } from "@mercadopago/sdk-react"
import { CardPayment } from "@mercadopago/sdk-react"

export default function CheckoutPage() {

    useEffect(() => {
        initMercadoPago("TEST-5a159cae-c246-4771-a4e6-eba136843219")
    }, [])

    const router = useRouter()

    const [timeLeft, setTimeLeft] = useState(0)
    const items = useCart((s) => s.items)
    const total = useCart((s) => s.getTotalWithShipping())
    const safeTotal = Math.round(Number(total) * 100) / 100
    const subtotal = useCart((s) => s.getTotal())

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [pixData, setPixData] = useState<any>(null)
    const [error, setError] = useState("")

    const savedAddress = useCart((s) => s.address)
    const setAddressGlobal = useCart((s) => s.setAddress)
    const maxInstallments = getInstallmentLimit(items, safeTotal)
    const [orderId, setOrderId] = useState<string | null>(null)

    const [address, setAddress] = useState({
        cep: savedAddress?.cep || "",
        street: savedAddress?.street || "",
        city: savedAddress?.city || "",
        state: savedAddress?.state || "",
        number: savedAddress?.number || "",
        complement: savedAddress?.complement || "",
    })

    const [loadingCep, setLoadingCep] = useState(false)
    const shipping = useCart((s) => s.shipping)

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        cpf: ""
    })

    useEffect(() => {
        const STORAGE_KEY = "checkout_timer_session"

        let endTime = sessionStorage.getItem(STORAGE_KEY)

        if (!endTime) {
            // 🔥 novo acesso → cria novo timer (10 min)
            const newEnd = Date.now() + 10 * 60 * 1000
            sessionStorage.setItem(STORAGE_KEY, String(newEnd))
            endTime = String(newEnd)
        }

        const updateTimer = () => {
            const remaining = Math.max(
                0,
                Math.floor((Number(endTime) - Date.now()) / 1000)
            )

            setTimeLeft(remaining)
        }

        updateTimer()

        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (savedAddress?.cep && !address.cep) {
            handleCep(savedAddress.cep)
        }
    }, [savedAddress])

    useEffect(() => {
        if (savedAddress) {
            setAddress({
                cep: savedAddress.cep || "",
                street: savedAddress.street || "",
                city: savedAddress.city || "",
                state: savedAddress.state || "",
                number: savedAddress.number || "",
                complement: savedAddress.complement || "",
            })
        }
    }, [savedAddress])

    function formatTime(seconds: number) {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    }

    function getTimerColor() {
        if (timeLeft > 300) return "green"
        if (timeLeft > 120) return "orange"
        return "red"
    }

    const color = getTimerColor()

    async function createOrder(paymentMethod: string) {
        // 🔒 evita criar pedido duplicado
        if (orderId) return orderId

        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: safeTotal,
                items,
                user,
                shipping,
                payment_method: paymentMethod // ✅ AGORA DINÂMICO
            })
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || "Erro ao criar pedido")
        }

        setOrderId(data.id)

        return data.id
    }
    async function handlePix() {
        if (!user.email || !user.cpf || !user.name) {
            setError("Preencha seus dados antes de pagar")
            return
        }

        try {
            setLoading(true)
            setError("")

            // 🔥 1. cria pedido
            const id = await createOrder("pix")

            // 🔥 2. chama pagamento COM order_id
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: id,
                    amount: safeTotal,
                    payment_method_id: "pix",
                    cpf: user.cpf,
                    email: user.email,
                    first_name: user.name.split(" ")[0],
                    last_name: user.name.split(" ").slice(1).join(" ") || "Cliente"
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Erro ao gerar PIX")
            }

            setPixData(data)
            // 🔥 redireciona após gerar PIX
            router.push(`/success?order_id=${id}`)

        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    async function handleCep(value: string) {
        const cep = value.replace(/\D/g, "")

        // atualiza campo digitado
        setAddress((prev) => ({ ...prev, cep: value }))
        useCart.getState().setShipping(null)

        if (cep.length !== 8) return

        try {
            setLoadingCep(true)

            // 🔎 busca endereço
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await res.json()

            if (data.erro) return

            const newAddress = {
                cep: value,
                street: data.logradouro || "",
                city: data.localidade || "",
                state: data.uf || "",
                number: address.number || "",
                complement: address.complement || "",
            }

            setAddress(newAddress)
            setAddressGlobal(newAddress)

        } catch (err) {
            console.error("Erro ao buscar CEP")
        } finally {
            setLoadingCep(false)
        }
    }

    function getInstallmentLimit(items: any[], total: number) {
        const hasDecant = items.some(item => item.size <= 10)

        if (hasDecant) {
            return total >= 150 ? 3 : 1
        }

        return total >= 200 ? 3 : 1
    }

    function ShippingSelector({ cep, items }: any) {

        const [options, setOptions] = useState<any[]>([])
        const [loading, setLoading] = useState(false)

        console.log("TOTAL ORIGINAL:", total)
        console.log("TOTAL ENVIADO:", safeTotal)

        async function fetchShipping() {
            if (!cep || cep.length < 8) return

            try {
                setLoading(true)

                const res = await fetch("/api/shipping", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cep, items })
                })

                const data = await res.json()
                setOptions(data.shipping || [])

            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        useEffect(() => {
            fetchShipping()
        }, [cep])

        if (!cep) {
            return (
                <p className="text-xs text-zinc-500">
                    Digite o CEP para calcular o frete
                </p>
            )
        }

        if (loading) {
            return (
                <div className="space-y-2">
                    <div className="h-14 bg-zinc-800 animate-pulse rounded-lg" />
                    <div className="h-14 bg-zinc-800 animate-pulse rounded-lg" />
                </div>
            )
        }

        if (!options.length) return null

        // 🔥 CURADORIA (4 OPÇÕES)
        const cheapest = options.find(s => s.isCheapest)
        const fastest = options.find(s => s.isFastest)

        const curated = [cheapest, fastest].filter(
            (v, i, arr) => v && arr.findIndex(x => x.id === v.id) === i
        )

        const others = options
            .filter(s => !curated.find(c => c.id === s.id))
            .slice(0, 2)

        const finalList = [...curated, ...others]



        return (
            <div className="space-y-2">

                <p className="text-xs text-zinc-400">
                    Escolha o frete
                </p>

                {finalList.map((s) => (
                    <div
                        key={s.id}
                        onClick={() => useCart.getState().setShipping(s)}
                        className={`
                        p-3 rounded-lg border cursor-pointer transition-all

                        ${s.isFreeShipping ? "border-[#d4af37]/40 bg-[#d4af37]/5" : ""}
                        ${s.isFastest ? "border-purple-500/30 bg-purple-500/5" : ""}
                        ${!s.isFreeShipping && !s.isFastest ? "border-zinc-800" : ""}
                    `}
                    >
                        <div className="flex justify-between items-center">

                            <div>
                                <p className="text-sm text-white font-medium">
                                    {s.name}
                                </p>

                                <p className="text-xs text-zinc-400">
                                    {s.deadline} dias úteis
                                </p>

                                <div className="flex gap-2 mt-1">

                                    {s.isFreeShipping && (
                                        <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded">
                                            👑 Frete grátis
                                        </span>
                                    )}

                                    {s.isFastest && (
                                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                                            ⚡ Mais rápido
                                        </span>
                                    )}

                                    {s.isCheapest && !s.isFreeShipping && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                                            💰 Mais barato
                                        </span>
                                    )}

                                </div>
                            </div>

                            <span className="text-white font-semibold">
                                {s.price === 0 ? "Grátis" : `R$ ${s.price.toFixed(2)}`}
                            </span>

                        </div>
                    </div>
                ))}

            </div>
        )
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8">

            {/* ESQUERDA */}
            <div className="space-y-6">

                <div className="space-y-3">

                    {/* 🔥 TIMER TOP (URGÊNCIA MÁXIMA) */}
                    <div
                        className={`
            flex items-center justify-between
            px-4 py-2 rounded-lg border
            text-sm font-medium
            transition-all

            ${color === "green" && "bg-green-500/10 border-green-500/30 text-green-400"}
            ${color === "orange" && "bg-orange-500/10 border-orange-500/30 text-orange-400"}
            ${color === "red" && "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse"}
        `}
                    >
                        <span>
                            🔒 Pedido reservado por tempo limitado
                        </span>

                        <span className="font-bold text-base">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`
            h-full transition-all duration-1000
            ${color === "green" && "bg-green-500"}
            ${color === "orange" && "bg-orange-500"}
            ${color === "red" && "bg-red-500"}
        `}
                            style={{
                                width: `${(timeLeft / (10 * 60)) * 100}%`
                            }}
                        />
                    </div>

                    {/* 👇 TÍTULO */}
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">Finalizar compra</h1>
                        <p className="text-sm text-zinc-400">
                            Preencha seus dados para concluir seu pedido
                        </p>
                    </div>

                </div>

                {/* STEPS */}
                <div className="flex items-center gap-3 text-sm">
                    <Step label="Dados" active={step >= 1} done={step > 1} />
                    <Divider />
                    <Step label="Entrega" active={step >= 2} done={step > 2} />
                    <Divider />
                    <Step label="Pagamento" active={step >= 3} />
                </div>

                {/* DADOS */}
                <Card>
                    <SectionTitle title="Seus dados" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <Input
                            value={user.name}
                            onChange={(e: any) =>
                                setUser({ ...user, name: e.target.value })
                            }
                            placeholder="Nome completo"
                        />

                        <Input
                            value={user.email}
                            onChange={(e: any) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            placeholder="Email"
                        />

                        <Input
                            value={user.phone}
                            onChange={(e: any) =>
                                setUser({ ...user, phone: e.target.value })
                            }
                            placeholder="Telefone"
                        />

                        <Input
                            value={user.cpf}
                            onChange={(e: any) =>
                                setUser({ ...user, cpf: e.target.value })
                            }
                            placeholder="CPF"
                        />

                    </div>

                    {step === 1 && (
                        <PrimaryButton onClick={() => setStep(2)}>
                            Continuar para entrega
                        </PrimaryButton>
                    )}
                </Card>

                <Card>
                    <SectionTitle title="Endereço de entrega" />

                    {/* CEP */}
                    <div className="space-y-2">
                        <Input
                            placeholder="CEP"
                            value={address.cep}
                            onChange={(e: any) => {
                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .replace(/^(\d{5})(\d)/, "$1-$2")

                                handleCep(value)
                            }}
                        />

                        {loadingCep && (
                            <p className="text-xs text-zinc-400 animate-pulse">
                                Buscando endereço...
                            </p>
                        )}
                    </div>

                    {/* RUA */}
                    <Input
                        placeholder="Rua"
                        value={address.street}
                        onChange={(e: any) => {
                            const updated = {
                                ...address,
                                street: e.target.value
                            }
                            setAddress(updated)
                            setAddressGlobal(updated)
                        }}
                    />

                    {/* NÚMERO (DESTAQUE) */}
                    <Input
                        placeholder="Número"
                        value={address.number}
                        onChange={(e: any) => {
                            const updated = {
                                ...address,
                                number: e.target.value
                            }
                            setAddress(updated)
                            setAddressGlobal(updated)
                        }}
                        className="border-[#d4af37] focus:border-[#d4af37]"
                    />

                    {/* LINHA DUPLA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Cidade"
                            value={address.city}
                            onChange={(e: any) => {
                                const updated = {
                                    ...address,
                                    city: e.target.value
                                }
                                setAddress(updated)
                                setAddressGlobal(updated)
                            }}
                        />
                        <Input
                            placeholder="Estado"
                            value={address.state}
                            onChange={(e: any) => {
                                const updated = {
                                    ...address,
                                    state: e.target.value
                                }
                                setAddress(updated)
                                setAddressGlobal(updated)
                            }}
                        />
                    </div>

                    <Input
                        placeholder="Complemento (opcional)"
                        value={address.complement}
                        onChange={(e: any) => {
                            const updated = {
                                ...address,
                                complement: e.target.value
                            }
                            setAddress(updated)
                            setAddressGlobal(updated)
                        }}
                    />

                    <div className="min-h-[280px] transition-all duration-300">
                        {shipping ? (
                            // ✅ FRETE SELECIONADO
                            <div className="p-3 md:p-4 rounded-lg border border-[#d4af37] flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium">
                                        🚚 {shipping.name}
                                    </p>
                                    <p className="text-xs text-zinc-400">
                                        {shipping.deadline} dias úteis
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-semibold text-[#d4af37]">
                                        {shipping.price === 0
                                            ? "Grátis"
                                            : `R$ ${Number(shipping.price).toFixed(2)}`}
                                    </p>

                                    <button
                                        onClick={() => useCart.getState().setShipping(null)}
                                        className="text-xs text-zinc-500 hover:text-white mt-1"
                                    >
                                        alterar
                                    </button>
                                </div>
                            </div>

                        ) : (
                            // 🚀 LISTA INTELIGENTE (CURADA)
                            <ShippingSelector cep={address.cep} items={items} />
                        )}
                    </div>
                    {step === 2 && (
                        <PrimaryButton
                            onClick={() => setStep(3)}
                            disabled={!shipping}
                        >
                            Continuar para pagamento
                        </PrimaryButton>
                    )}
                    {!shipping && (
                        <p className="text-xs text-red-400">
                            Selecione o frete para continuar
                        </p>
                    )}
                </Card>
                {/* PAGAMENTO */}
                {step >= 3 && (
                    <Card>
                        <SectionTitle title="Pagamento" />

                        <PrimaryButton
                            onClick={handlePix}
                            disabled={loading || !user.email || !user.cpf || !user.name}
                        >
                            {loading ? "Gerando PIX..." : "Pagar com PIX"}
                        </PrimaryButton>

                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}

                        {/* QR CODE */}
                        {pixData?.qr_code_base64 && (
                            <div className="bg-white rounded-lg p-4 text-center">
                                <img
                                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                                    className="mx-auto w-44"
                                />

                                <p className="text-xs text-black mt-2">
                                    Escaneie para pagar
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-zinc-400">
                            {getInstallmentLimit(items, safeTotal) > 1
                                ? `Parcele em até ${getInstallmentLimit(items, safeTotal)}x sem juros`
                                : "Pagamento à vista"}
                        </p>

                        {(!user.email || !user.cpf || !user.name) && (
                            <p className="text-xs text-red-400">
                                Preencha seus dados para liberar o pagamento
                            </p>
                        )}

                        <div className="mt-4">
                            <CardPayment
                                initialization={{
                                    amount: safeTotal,
                                    payer: {
                                        email: user.email,
                                        identification: {
                                            type: "CPF",
                                            number: user.cpf
                                        }
                                    }
                                }}
                                customization={{
                                    paymentMethods: {
                                        minInstallments: 1,
                                        maxInstallments: maxInstallments
                                    }
                                }}
                                onSubmit={async (data) => {
                                    try {
                                        if (!user.email || !user.cpf || !user.name) {
                                            setError("Preencha seus dados antes de pagar")
                                            return
                                        }

                                        setLoading(true)
                                        setError("")

                                        // 🔥 1. cria pedido
                                        const id = await createOrder("credit_card")

                                        const res = await fetch("/api/payment", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                order_id: id, // 🔥 ESSENCIAL
                                                token: data.token,
                                                payment_method_id: data.payment_method_id,
                                                installments: data.installments,
                                                issuer_id: data.issuer_id || undefined,
                                                email: user.email,
                                                cpf: user.cpf,
                                                amount: safeTotal
                                            })
                                        })

                                        const result = await res.json()

                                        if (!res.ok) {
                                            throw new Error(result.error || "Erro no pagamento")
                                        }

                                        if (result.status === "approved") {
                                            router.push(`/success?order_id=${id}`)
                                        } else if (result.status === "pending") {
                                            alert("Pagamento pendente ⏳")
                                        } else {
                                            throw new Error("Pagamento recusado")
                                        }

                                    } catch (err: any) {
                                        setError(err.message)
                                    } finally {
                                        setLoading(false)
                                    }
                                }}
                            />
                            {loading && (
                                <p className="text-xs text-zinc-400">
                                    Processando pagamento...
                                </p>
                            )}
                        </div>
                    </Card>
                )}

                {/* CUPOM */}
                <Card>
                    <p className="text-sm mb-3">
                        💬 Tem um cupom de desconto?
                    </p>

                    <div className="flex gap-2">
                        <Input placeholder="Digite seu cupom" />
                        <button className="btn-secondary">Aplicar</button>
                    </div>
                </Card>

            </div>

            {/* DIREITA */}
            <div className="space-y-6 lg:sticky lg:top-20">

                <Card>
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                            <img src={item.image} className="w-14 h-14 rounded-lg bg-white" />

                            <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-zinc-400">
                                    {item.size}ml • x{item.quantity}
                                </p>
                            </div>

                            <span className="text-[#d4af37] font-semibold">
                                R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </Card>

                <Card>
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Frete</span>
                        <span className="text-green-400">
                            {shipping?.price === 0
                                ? "Grátis"
                                : `R$ ${Number(shipping?.price).toFixed(2)}`}
                        </span>
                    </div>

                    <div className="flex justify-between text-lg font-bold border-t border-zinc-800 pt-2">
                        <span>Total</span>
                        <span className="text-[#d4af37]">
                            R$ {total.toFixed(2)}
                        </span>
                    </div>
                </Card>

                {/* BADGES (AGORA CERTO) */}
                <div className="w-full">
                    <img
                        src="/images/badges/badges.png"
                        className="w-full max-w-[420px] mx-auto object-contain"
                    />
                </div>

                <p className="text-[11px] text-zinc-500 text-center">
                    Pagamento seguro via Mercado Pago
                </p>

            </div>

        </div>
    )
}

/* COMPONENTES */

function Card({ children }: any) {
    return <div className="glass p-5 space-y-4">{children}</div>
}

function PrimaryButton({ children, ...props }: any) {
    return (
        <button {...props} className="btn-primary w-full mt-2">
            {children}
        </button>
    )
}

function Step({ label, active, done }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${done ? "bg-green-500 text-black" :
                    active ? "bg-[#d4af37] text-black" :
                        "bg-zinc-800 text-zinc-400"}`}>
                {done ? "✓" : ""}
            </div>
            <span className={active ? "text-white" : "text-zinc-500"}>
                {label}
            </span>
        </div>
    )
}

function Divider() {
    return <div className="w-6 h-[1px] bg-zinc-700" />
}

function SectionTitle({ title }: any) {
    return <h2 className="text-sm text-zinc-400">{title}</h2>
}

function Input(props: any) {
    return <input {...props} className="input-premium w-full" />
}