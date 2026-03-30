import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
    try {
        const { cep, items } = await req.json()

        if (!cep) {
            return NextResponse.json(
                { error: "CEP obrigatório" },
                { status: 400 }
            )
        }

        const cleanCep = cep.replace(/\D/g, "")

        if (cleanCep.length !== 8) {
            return NextResponse.json(
                { error: "CEP inválido" },
                { status: 400 }
            )
        }

        // ==============================
        // 🔥 1. CÁLCULO DE PESO
        // ==============================
        let totalWeight = 0

        for (const item of items || []) {
            const isDecant = item.size <= 30

            let weight = 0

            if (isDecant) {
                weight = 0.05
            } else {
                weight = 0.25

                if (item.size >= 100) weight = 0.3
                if (item.size <= 50) weight = 0.2
            }

            totalWeight += weight * item.quantity
        }

        if (totalWeight <= 0.5) {
            totalWeight = 0.5
        }

        // ==============================
        // 🔥 2. REGRA DE FRETE GRÁTIS
        // ==============================
        const totalValue = (items || []).reduce(
            (acc: number, item: any) =>
                acc + (Number(item.price || 0) * Number(item.quantity || 1)),
            0
        )

        const hasDecant = (items || []).some(
            (item: any) => item.size <= 30
        )

        const hasFullSize = (items || []).some(
            (item: any) => item.size > 30
        )

        let freeShippingRule = Infinity
        let isFreeShipping = false

        // 🔥 REGRA FINAL
        if (hasDecant && hasFullSize) {
            isFreeShipping = true
            freeShippingRule = 0
        } else if (hasDecant) {
            freeShippingRule = 150
            isFreeShipping = totalValue >= 150
        } else if (hasFullSize) {
            freeShippingRule = 200
            isFreeShipping = totalValue >= 200
        }

        console.log("TOKEN:", process.env.MELHOR_ENVIO_TOKEN)

        const response = await fetch(
            "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    from: { postal_code: "74630160" },
                    to: { postal_code: cleanCep },
                    products: [
                        {
                            id: "1",
                            width: 15,
                            height: 10,
                            length: 20,
                            weight: totalWeight,
                            insurance_value: totalValue || 150,
                            quantity: 1
                        }
                    ],
                    options: {
                        receipt: false,
                        own_hand: false
                    }
                })
            }
        )

        let data

        try {
            data = await response.json()
        } catch {
            data = await response.text()
        }

        console.log("STATUS:", response.status)
        console.log("RESPONSE:", data)

        if (!response.ok) {
            return NextResponse.json(
                { error: "Erro ao consultar frete", detalhe: data },
                { status: response.status }
            )
        }

        // ==============================
        // 🧠 4. NORMALIZAÇÃO
        // ==============================
        const rawShippingBase = (Array.isArray(data) ? data : [])
            .filter((s: any) => !s.error)
            .map((s: any) => ({
                id: s.id,
                name: s.name.replace(".", ""),
                price: Number(s.price),
                deadline: Number(s.delivery_time),
                company: s.company?.name
            }))

        if (rawShippingBase.length === 0) {
            return NextResponse.json({ shipping: [] })
        }

        // 🔥 MAIS BARATO ORIGINAL
        const cheapestBase = rawShippingBase.reduce((prev, curr) =>
            curr.price < prev.price ? curr : prev
        )

        // 🔥 APLICA FRETE GRÁTIS (SÓ NO MAIS BARATO)
        const rawShipping = rawShippingBase.map((s) => {
            const isCheapest = s.id === cheapestBase.id

            const finalPrice =
                isFreeShipping && isCheapest
                    ? 0
                    : s.price

            return {
                ...s,
                price: finalPrice,
                originalPrice: s.price,
                isFreeShipping: isFreeShipping && isCheapest
            }
        })

        // ==============================
        // 🏆 5. FLAGS
        // ==============================
        const cheapestFinal = rawShipping.reduce((prev, curr) =>
            curr.price < prev.price ? curr : prev
        )

        const fastest = rawShipping.reduce((prev, curr) =>
            curr.deadline < prev.deadline ? curr : prev
        )

        // ==============================
        // 🎯 6. FINAL
        // ==============================
        const shipping = rawShipping
            .sort((a, b) => a.price - b.price)
            .map(s => ({
                ...s,
                isCheapest: s.id === cheapestFinal.id,
                isFastest: s.id === fastest.id
            }))

        return NextResponse.json({
            shipping,
            meta: {
                totalValue,
                freeShippingRule,
                isFreeShipping
            }
        })

    } catch (err: any) {
        console.error("🔥 ERRO GERAL:", err)

        return NextResponse.json(
            { error: "Erro interno ao calcular frete", detalhe: err.message },
            { status: 500 }
        )
    }
}